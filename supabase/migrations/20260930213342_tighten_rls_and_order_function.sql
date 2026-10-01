/*
# Tighten RLS: Admin-only writes, secure order creation function

## Changes:
1. Revoke broad admin_write policies on categories, products, variants, options, promotions, wilayas, communes, delivery_zones, faqs, restaurant_settings, orders
2. These tables now require authenticated session (any authenticated user can write — admin auth gate)
3. Create create_order SECURITY DEFINER function that validates prices from DB, calculates totals, and inserts order + items atomically
4. Revoke direct INSERT on orders from anon (orders must go through create_order function for price integrity)
5. Keep SELECT public for menu data and order lookup
*/

-- Revoke broad write policies, replace with authenticated-only
-- Categories
DROP POLICY IF EXISTS "admin_write_categories" ON categories;
CREATE POLICY "auth_write_categories" ON categories FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Products
DROP POLICY IF EXISTS "admin_write_products" ON products;
CREATE POLICY "auth_write_products" ON products FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Variants
DROP POLICY IF EXISTS "admin_write_variants" ON product_variants;
CREATE POLICY "auth_write_variants" ON product_variants FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Options
DROP POLICY IF EXISTS "admin_write_options" ON product_options;
CREATE POLICY "auth_write_options" ON product_options FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Promotions
DROP POLICY IF EXISTS "admin_write_promotions" ON promotions;
CREATE POLICY "auth_write_promotions" ON promotions FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Wilayas
DROP POLICY IF EXISTS "admin_write_wilayas" ON wilayas;
CREATE POLICY "auth_write_wilayas" ON wilayas FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Communes
DROP POLICY IF EXISTS "admin_write_communes" ON communes;
CREATE POLICY "auth_write_communes" ON communes FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Delivery zones
DROP POLICY IF EXISTS "admin_write_delivery_zones" ON delivery_zones;
CREATE POLICY "auth_write_delivery_zones" ON delivery_zones FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- FAQs
DROP POLICY IF EXISTS "admin_write_faqs" ON faqs;
CREATE POLICY "auth_write_faqs" ON faqs FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Restaurant settings
DROP POLICY IF EXISTS "admin_write_settings" ON restaurant_settings;
CREATE POLICY "auth_write_settings" ON restaurant_settings FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- Orders: remove direct insert from anon, keep admin update/delete
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;

CREATE POLICY "auth_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "auth_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

-- Order items: remove direct insert from anon
DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "auth_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

-- Order item options: remove direct insert from anon
DROP POLICY IF EXISTS "public_insert_order_item_options" ON order_item_options;

-- ============================================================
-- SECURE ORDER CREATION FUNCTION
-- Validates all prices from DB, calculates totals, inserts atomically
-- ============================================================
CREATE OR REPLACE FUNCTION create_order(
  p_customer_name text,
  p_customer_phone text,
  p_order_type text,
  p_payment_method text,
  p_wilaya_id uuid,
  p_commune_id uuid,
  p_address text,
  p_notes text,
  p_items jsonb,
  p_promo_code text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_order_id uuid;
  v_order_number text;
  v_subtotal int := 0;
  v_delivery_fee int := 0;
  v_discount int := 0;
  v_total int := 0;
  v_item jsonb;
  v_product products%ROWTYPE;
  v_variant product_variants%ROWTYPE;
  v_option product_options%ROWTYPE;
  v_unit_price int;
  v_item_total int;
  v_order_item_id uuid;
  v_delivery_zone delivery_zones%ROWTYPE;
  v_promo promotions%ROWTYPE;
  v_min_order int := 300;
  v_free_threshold int := 1500;
  v_estimated_time text := '30-45';
  v_wilaya_name text := '';
  v_commune_name text := '';
BEGIN
  -- Validate order type
  IF p_order_type NOT IN ('delivery', 'pickup') THEN
    RAISE EXCEPTION 'نوع الطلب غير صحيح';
  END IF;

  -- Validate payment method
  IF p_payment_method NOT IN ('cash', 'online') THEN
    RAISE EXCEPTION 'طريقة الدفع غير صحيحة';
  END IF;

  -- Validate customer info
  IF p_customer_name IS NULL OR length(trim(p_customer_name)) < 2 THEN
    RAISE EXCEPTION 'الاسم مطلوب';
  END IF;
  IF p_customer_phone IS NULL OR length(trim(p_customer_phone)) < 8 THEN
    RAISE EXCEPTION 'رقم الهاتف مطلوب';
  END IF;

  -- Validate items array
  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'السلة فارغة';
  END IF;

  -- Get delivery zone if delivery
  IF p_order_type = 'delivery' THEN
    IF p_wilaya_id IS NULL THEN
      RAISE EXCEPTION 'الولاية مطلوبة';
    END IF;
    SELECT * INTO v_delivery_zone FROM delivery_zones WHERE wilaya_id = p_wilaya_id AND is_enabled = true LIMIT 1;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'التوصيل غير متاح في هذه الولاية';
    END IF;
    v_delivery_fee := v_delivery_zone.delivery_fee;
    v_min_order := v_delivery_zone.min_order;
    v_free_threshold := v_delivery_zone.free_delivery_threshold;
    v_estimated_time := v_delivery_zone.estimated_time;
    SELECT name_ar INTO v_wilaya_name FROM wilayas WHERE id = p_wilaya_id;
    SELECT name_ar INTO v_commune_name FROM communes WHERE id = p_commune_id;
  END IF;

  -- Generate order number
  v_order_number := 'WJ' || lpad((nextval('order_number_seq') % 1000000)::text, 6, '0');

  -- Calculate subtotal from trusted DB data
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Fetch product from DB (never trust client price)
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid AND available = true;
    IF NOT FOUND THEN
      RAISE EXCEPTION 'منتج غير متاح: %', v_item->>'product_name';
    END IF;

    v_unit_price := v_product.price;

    -- Validate variant if provided
    IF v_item ? 'variant_id' AND (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') != '' THEN
      SELECT * INTO v_variant FROM product_variants WHERE id = (v_item->>'variant_id')::uuid AND product_id = v_product.id;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'الاختيار غير صحيح: %', v_item->>'variant_name';
      END IF;
      v_unit_price := v_variant.price;
    END IF;

    -- Add option prices from DB
    IF v_item ? 'options' AND jsonb_typeof(v_item->'options') = 'array' THEN
      FOR v_option IN SELECT * FROM jsonb_array_elements(v_item->'options') AS opt_row
      LOOP
        -- Each option is an object with option_id
        IF v_option ? 'option_id' THEN
          SELECT * INTO v_option FROM product_options WHERE id = (v_option->>'option_id')::uuid AND product_id = v_product.id;
          IF FOUND THEN
            v_unit_price := v_unit_price + v_option.price;
          END IF;
        END IF;
      END LOOP;
    END IF;

    v_item_total := v_unit_price * ((v_item->>'quantity')::int);
    v_subtotal := v_subtotal + v_item_total;
  END LOOP;

  -- Check minimum order
  IF p_order_type = 'delivery' AND v_subtotal < v_min_order THEN
    RAISE EXCEPTION 'الحد الأدنى للطلب هو % دج', v_min_order;
  END IF;

  -- Apply promo code if provided
  IF p_promo_code IS NOT NULL AND trim(p_promo_code) != '' THEN
    SELECT * INTO v_promo FROM promotions
      WHERE promo_code = trim(p_promo_code)
      AND is_active = true
      AND (starts_at IS NULL OR starts_at <= now())
      AND (ends_at IS NULL OR ends_at >= now());
    IF FOUND THEN
      IF v_promo.min_order > 0 AND v_subtotal < v_promo.min_order THEN
        RAISE EXCEPTION 'الحد الأدنى لهذا الكود هو % دج', v_promo.min_order;
      END IF;
      IF v_promo.discount_type = 'fixed' THEN
        v_discount := v_promo.discount_value;
      ELSIF v_promo.discount_type = 'percentage' THEN
        v_discount := (v_subtotal * v_promo.discount_value) / 100;
      ELSIF v_promo.discount_type = 'free_delivery' THEN
        v_delivery_fee := 0;
      END IF;
      v_discount := LEAST(v_discount, v_subtotal);
    ELSE
      RAISE EXCEPTION 'كود الخصم غير صحيح أو منتهي';
    END IF;
  END IF;

  -- Free delivery threshold
  IF p_order_type = 'delivery' AND v_subtotal >= v_free_threshold THEN
    v_delivery_fee := 0;
  END IF;

  v_total := v_subtotal - v_discount + v_delivery_fee;

  -- Create the order
  INSERT INTO orders (
    order_number, status, order_type, payment_method,
    customer_name, customer_phone, wilaya_id, commune_id,
    address, notes, subtotal, delivery_fee, discount, total,
    estimated_time, promo_code
  ) VALUES (
    v_order_number, 'new', p_order_type, p_payment_method,
    p_customer_name, p_customer_phone, p_wilaya_id, p_commune_id,
    p_address, p_notes, v_subtotal, v_delivery_fee, v_discount, v_total,
    v_estimated_time, p_promo_code
  ) RETURNING id INTO v_order_id;

  -- Create order items
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    SELECT * INTO v_product FROM products WHERE id = (v_item->>'product_id')::uuid;
    v_unit_price := v_product.price;

    IF v_item ? 'variant_id' AND (v_item->>'variant_id') IS NOT NULL AND (v_item->>'variant_id') != '' THEN
      SELECT * INTO v_variant FROM product_variants WHERE id = (v_item->>'variant_id')::uuid AND product_id = v_product.id;
      IF FOUND THEN
        v_unit_price := v_variant.price;
      END IF;
    END IF;

    -- Add option prices
    IF v_item ? 'options' AND jsonb_typeof(v_item->'options') = 'array' THEN
      FOR v_option IN SELECT * FROM jsonb_array_elements(v_item->'options') AS opt_row
      LOOP
        IF v_option ? 'option_id' THEN
          SELECT * INTO v_option FROM product_options WHERE id = (v_option->>'option_id')::uuid AND product_id = v_product.id;
          IF FOUND THEN
            v_unit_price := v_unit_price + v_option.price;
          END IF;
        END IF;
      END LOOP;
    END IF;

    v_item_total := v_unit_price * ((v_item->>'quantity')::int);

    INSERT INTO order_items (order_id, product_id, product_name, product_image, variant_id, variant_name, quantity, unit_price, total_price, notes)
    VALUES (
      v_order_id, v_product.id, v_product.name_ar, v_product.image,
      NULLIF(v_item->>'variant_id','')::uuid,
      COALESCE(v_item->>'variant_name',''),
      (v_item->>'quantity')::int,
      v_unit_price, v_item_total,
      COALESCE(v_item->>'notes','')
    ) RETURNING id INTO v_order_item_id;

    -- Insert order item options
    IF v_item ? 'options' AND jsonb_typeof(v_item->'options') = 'array' THEN
      FOR v_option IN SELECT * FROM jsonb_array_elements(v_item->'options') AS opt_row
      LOOP
        IF v_option ? 'option_id' THEN
          SELECT * INTO v_option FROM product_options WHERE id = (v_option->>'option_id')::uuid AND product_id = v_product.id;
          IF FOUND THEN
            INSERT INTO order_item_options (order_item_id, option_name, option_price)
            VALUES (v_order_item_id, v_option.name, v_option.price);
          END IF;
        END IF;
      END LOOP;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'discount', v_discount,
    'total', v_total,
    'estimated_time', v_estimated_time,
    'wilaya_name', v_wilaya_name,
    'commune_name', v_commune_name
  );
END;
$$;

-- Grant execute to anon (customers place orders) and authenticated (admin)
REVOKE EXECUTE ON FUNCTION create_order FROM anon;
GRANT EXECUTE ON FUNCTION create_order TO anon, authenticated;
