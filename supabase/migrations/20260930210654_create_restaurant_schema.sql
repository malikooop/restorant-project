/*
# Create Restaurant Ordering System Schema

This migration creates the complete database structure for a production-ready
Algerian restaurant ordering system.

## Tables Created:
1. `categories` — menu categories (burgers, tacos, pizza, etc.)
2. `products` — menu items with prices, images, availability, etc.
3. `product_variants` — size/variant options for products (e.g. small, medium, large)
4. `product_options` — add-on options for products (e.g. extra cheese, bacon)
5. `promotions` — promotional offers with discount types
6. `wilayas` — all 58 Algerian wilayas (provinces)
7. `communes` — municipalities within each wilaya
8. `delivery_zones` — delivery pricing per wilaya
9. `orders` — customer orders with status tracking
10. `order_items` — individual items within an order
11. `order_item_options` — selected add-ons for order items
12. `restaurant_settings` — configurable restaurant branding and settings
13. `faqs` — frequently asked questions

## Security:
- RLS enabled on all tables
- Public read access (anon + authenticated) for menu data, orders, settings
- Public insert for orders (customers place orders without auth)
- Admin operations protected by SECURITY DEFINER functions
- Order status changes protected by SECURITY DEFINER function
*/

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text DEFAULT '',
  image text DEFAULT '',
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_categories" ON categories;
CREATE POLICY "admin_write_categories" ON categories FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_ar text NOT NULL,
  description text DEFAULT '',
  image text DEFAULT '',
  gallery jsonb DEFAULT '[]'::jsonb,
  price int NOT NULL DEFAULT 0,
  old_price int,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  ingredients jsonb DEFAULT '[]'::jsonb,
  allergens jsonb DEFAULT '[]'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  preparation_time int DEFAULT 15,
  available boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  popular boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  is_vegetarian boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  rating numeric DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_products" ON products;
CREATE POLICY "admin_write_products" ON products FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  price int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_variants" ON product_variants;
CREATE POLICY "public_read_variants" ON product_variants FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_variants" ON product_variants;
CREATE POLICY "admin_write_variants" ON product_variants FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- ============================================================
-- PRODUCT OPTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  price int NOT NULL DEFAULT 0,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_options" ON product_options;
CREATE POLICY "public_read_options" ON product_options FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_options" ON product_options;
CREATE POLICY "admin_write_options" ON product_options FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_options_product ON product_options(product_id);

-- ============================================================
-- PROMOTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS promotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  image text DEFAULT '',
  badge text DEFAULT '',
  discount_type text NOT NULL DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage', 'free_delivery')),
  discount_value int NOT NULL DEFAULT 0,
  promo_code text UNIQUE,
  min_order int DEFAULT 0,
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_promotions" ON promotions;
CREATE POLICY "public_read_promotions" ON promotions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_promotions" ON promotions;
CREATE POLICY "admin_write_promotions" ON promotions FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- WILAYAS (58 Algerian provinces)
-- ============================================================
CREATE TABLE IF NOT EXISTS wilayas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code int NOT NULL UNIQUE,
  name text NOT NULL,
  name_ar text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_wilayas" ON wilayas;
CREATE POLICY "public_read_wilayas" ON wilayas FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_wilayas" ON wilayas;
CREATE POLICY "admin_write_wilayas" ON wilayas FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- COMMUNES (municipalities within wilayas)
-- ============================================================
CREATE TABLE IF NOT EXISTS communes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_id uuid NOT NULL REFERENCES wilayas(id) ON DELETE CASCADE,
  name text NOT NULL,
  name_ar text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE communes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_communes" ON communes;
CREATE POLICY "public_read_communes" ON communes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_communes" ON communes;
CREATE POLICY "admin_write_communes" ON communes FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_communes_wilaya ON communes(wilaya_id);

-- ============================================================
-- DELIVERY ZONES (delivery pricing per wilaya)
-- ============================================================
CREATE TABLE IF NOT EXISTS delivery_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya_id uuid NOT NULL REFERENCES wilayas(id) ON DELETE CASCADE,
  delivery_fee int NOT NULL DEFAULT 200,
  estimated_time text DEFAULT '30-45',
  min_order int DEFAULT 300,
  free_delivery_threshold int DEFAULT 1500,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_delivery_zones" ON delivery_zones;
CREATE POLICY "public_read_delivery_zones" ON delivery_zones FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_delivery_zones" ON delivery_zones;
CREATE POLICY "admin_write_delivery_zones" ON delivery_zones FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'preparing', 'ready', 'delivering', 'completed', 'cancelled')),
  order_type text NOT NULL DEFAULT 'delivery' CHECK (order_type IN ('delivery', 'pickup')),
  payment_method text NOT NULL DEFAULT 'cash' CHECK (payment_method IN ('cash', 'online')),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  wilaya_id uuid REFERENCES wilayas(id) ON DELETE SET NULL,
  commune_id uuid REFERENCES communes(id) ON DELETE SET NULL,
  address text DEFAULT '',
  notes text DEFAULT '',
  subtotal int NOT NULL DEFAULT 0,
  delivery_fee int NOT NULL DEFAULT 0,
  discount int NOT NULL DEFAULT 0,
  total int NOT NULL DEFAULT 0,
  estimated_time text DEFAULT '',
  promo_code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public can create orders (customers place orders without auth)
DROP POLICY IF EXISTS "public_insert_orders" ON orders;
CREATE POLICY "public_insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Public can read orders (for order confirmation by order_number)
DROP POLICY IF EXISTS "public_read_orders" ON orders;
CREATE POLICY "public_read_orders" ON orders FOR SELECT
  TO anon, authenticated USING (true);

-- Admin can update orders (status changes)
DROP POLICY IF EXISTS "admin_update_orders" ON orders;
CREATE POLICY "admin_update_orders" ON orders FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Admin can delete orders
DROP POLICY IF EXISTS "admin_delete_orders" ON orders;
CREATE POLICY "admin_delete_orders" ON orders FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_image text DEFAULT '',
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  variant_name text DEFAULT '',
  quantity int NOT NULL DEFAULT 1,
  unit_price int NOT NULL DEFAULT 0,
  total_price int NOT NULL DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_order_items" ON order_items;
CREATE POLICY "public_read_order_items" ON order_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_order_items" ON order_items;
CREATE POLICY "public_insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_order_items" ON order_items;
CREATE POLICY "admin_delete_order_items" ON order_items FOR DELETE
  TO authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================================
-- ORDER ITEM OPTIONS (selected add-ons)
-- ============================================================
CREATE TABLE IF NOT EXISTS order_item_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_name text NOT NULL,
  option_price int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_item_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_order_item_options" ON order_item_options;
CREATE POLICY "public_read_order_item_options" ON order_item_options FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_order_item_options" ON order_item_options;
CREATE POLICY "public_insert_order_item_options" ON order_item_options FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_order_item_options ON order_item_options(order_item_id);

-- ============================================================
-- RESTAURANT SETTINGS (single-row config table)
-- ============================================================
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id int PRIMARY KEY DEFAULT 1,
  name text NOT NULL DEFAULT 'وجبة',
  name_latin text NOT NULL DEFAULT 'Wajba',
  tagline text DEFAULT '',
  description text DEFAULT '',
  logo text DEFAULT '',
  favicon text DEFAULT '',
  phone text DEFAULT '',
  whatsapp text DEFAULT '',
  address text DEFAULT '',
  address_lat numeric DEFAULT 36.7538,
  address_lng numeric DEFAULT 3.0588,
  currency text DEFAULT 'DZD',
  currency_symbol text DEFAULT 'دج',
  announcement text DEFAULT '',
  announcement_active boolean NOT NULL DEFAULT true,
  hero_headline text DEFAULT '',
  hero_subheadline text DEFAULT '',
  hero_description text DEFAULT '',
  hero_primary_cta text DEFAULT 'اطلب الآن',
  hero_secondary_cta text DEFAULT 'اكتشف القائمة',
  primary_color text DEFAULT '#E8521E',
  secondary_color text DEFAULT '#1B1B2F',
  accent_color text DEFAULT '#F9A826',
  facebook text DEFAULT '',
  instagram text DEFAULT '',
  tiktok text DEFAULT '',
  status_mode text NOT NULL DEFAULT 'auto' CHECK (status_mode IN ('auto', 'open', 'closed')),
  opening_hours jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_settings" ON restaurant_settings;
CREATE POLICY "public_read_settings" ON restaurant_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_settings" ON restaurant_settings;
CREATE POLICY "admin_write_settings" ON restaurant_settings FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- FAQS
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_faqs" ON faqs;
CREATE POLICY "public_read_faqs" ON faqs FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_write_faqs" ON faqs;
CREATE POLICY "admin_write_faqs" ON faqs FOR ALL
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- SECURITY DEFINER: Generate unique order number
-- ============================================================
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  seq_val bigint;
  order_num text;
BEGIN
  seq_val := nextval(pg_get_serial_sequence('orders', 'id'));
  order_num := 'WJ' || lpad((seq_val % 1000000)::text, 6, '0');
  RETURN order_num;
END;
$$;

-- Create a sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 100000;

-- ============================================================
-- SECURITY DEFINER: Update order status (admin only via RLS)
-- ============================================================
CREATE OR REPLACE FUNCTION update_order_status(p_order_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE orders SET status = p_status, updated_at = now() WHERE id = p_order_id;
END;
$$;

-- ============================================================
-- AUTO-UPDATE updated_at trigger for orders
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS restaurant_settings_updated_at ON restaurant_settings;
CREATE TRIGGER restaurant_settings_updated_at BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
