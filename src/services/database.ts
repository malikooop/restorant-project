import { supabase } from '@/lib/supabase'

export interface DbCategory {
  id: string
  name: string
  name_ar: string
  slug: string
  icon: string
  image: string
  sort_order: number
  is_active: boolean
}

export interface DbVariant {
  id: string
  product_id: string
  name: string
  price: number
  sort_order: number
}

export interface DbOption {
  id: string
  product_id: string
  name: string
  price: number
  sort_order: number
}

export interface DbProduct {
  id: string
  name: string
  name_ar: string
  description: string
  image: string
  gallery: string[]
  price: number
  old_price: number | null
  category_id: string
  ingredients: string[]
  allergens: string[]
  tags: string[]
  preparation_time: number
  available: boolean
  featured: boolean
  popular: boolean
  is_new: boolean
  is_vegetarian: boolean
  is_spicy: boolean
  rating: number
  sort_order: number
  variants?: DbVariant[]
  options?: DbOption[]
}

export interface DbPromotion {
  id: string
  title: string
  description: string
  image: string
  badge: string
  discount_type: 'fixed' | 'percentage' | 'free_delivery'
  discount_value: number
  promo_code: string | null
  min_order: number
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
}

export interface DbWilaya {
  id: string
  code: number
  name: string
  name_ar: string
}

export interface DbCommune {
  id: string
  wilaya_id: string
  name: string
  name_ar: string
}

export interface DbDeliveryZone {
  id: string
  wilaya_id: string
  delivery_fee: number
  estimated_time: string
  min_order: number
  free_delivery_threshold: number
  is_enabled: boolean
}

export interface DbOrder {
  id: string
  order_number: string
  status: 'new' | 'contacted' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
  order_type: 'delivery' | 'pickup'
  payment_method: 'cash' | 'online'
  customer_name: string
  customer_phone: string
  wilaya_id: string | null
  commune_id: string | null
  address: string
  notes: string
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  estimated_time: string
  promo_code: string | null
  created_at: string
  updated_at: string
}

export interface DbOrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_name: string
  product_image: string
  variant_id: string | null
  variant_name: string
  quantity: number
  unit_price: number
  total_price: number
  notes: string
}

export interface DbOrderItemOption {
  id: string
  order_item_id: string
  option_name: string
  option_price: number
}

export interface DbSettings {
  id: number
  name: string
  name_latin: string
  tagline: string
  description: string
  logo: string
  favicon: string
  phone: string
  whatsapp: string
  address: string
  address_lat: number
  address_lng: number
  currency: string
  currency_symbol: string
  announcement: string
  announcement_active: boolean
  hero_headline: string
  hero_subheadline: string
  hero_description: string
  hero_primary_cta: string
  hero_secondary_cta: string
  primary_color: string
  secondary_color: string
  accent_color: string
  facebook: string
  instagram: string
  tiktok: string
  status_mode: 'auto' | 'open' | 'closed'
  opening_hours: { day: string; hours: string; open: boolean }[]
}

// ============ CATEGORIES ============
export async function fetchCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')
  if (error) throw error
  return data || []
}

export async function fetchAllCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data || []
}

export async function createCategory(cat: Partial<DbCategory>): Promise<DbCategory> {
  const { data, error } = await supabase.from('categories').insert(cat).select().single()
  if (error) throw error
  return data
}

export async function updateCategory(id: string, updates: Partial<DbCategory>): Promise<DbCategory> {
  const { data, error } = await supabase.from('categories').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ============ PRODUCTS ============
export async function fetchProducts(): Promise<DbProduct[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      options:product_options(*)
    `)
    .order('sort_order')
  if (error) throw error
  return (data || []).map((p: Record<string, unknown>) => ({
    ...p,
    gallery: Array.isArray(p.gallery) ? p.gallery : [],
    ingredients: Array.isArray(p.ingredients) ? p.ingredients : [],
    allergens: Array.isArray(p.allergens) ? p.allergens : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    variants: (p.variants as DbVariant[] || []).sort((a, b) => a.sort_order - b.sort_order),
    options: (p.options as DbOption[] || []).sort((a, b) => a.sort_order - b.sort_order),
  })) as DbProduct[]
}

export async function createProduct(product: Record<string, unknown>): Promise<DbProduct> {
  const { data, error } = await supabase.from('products').insert(product).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, updates: Record<string, unknown>): Promise<DbProduct> {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ============ VARIANTS ============
export async function createVariant(variant: Record<string, unknown>): Promise<DbVariant> {
  const { data, error } = await supabase.from('product_variants').insert(variant).select().single()
  if (error) throw error
  return data
}

export async function deleteVariant(id: string): Promise<void> {
  const { error } = await supabase.from('product_variants').delete().eq('id', id)
  if (error) throw error
}

// ============ OPTIONS ============
export async function createOption(option: Record<string, unknown>): Promise<DbOption> {
  const { data, error } = await supabase.from('product_options').insert(option).select().single()
  if (error) throw error
  return data
}

export async function deleteOption(id: string): Promise<void> {
  const { error } = await supabase.from('product_options').delete().eq('id', id)
  if (error) throw error
}

// ============ PROMOTIONS ============
export async function fetchPromotions(): Promise<DbPromotion[]> {
  const { data, error } = await supabase
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchAllPromotions(): Promise<DbPromotion[]> {
  const { data, error } = await supabase.from('promotions').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createPromotion(promo: Record<string, unknown>): Promise<DbPromotion> {
  const { data, error } = await supabase.from('promotions').insert(promo).select().single()
  if (error) throw error
  return data
}

export async function updatePromotion(id: string, updates: Record<string, unknown>): Promise<DbPromotion> {
  const { data, error } = await supabase.from('promotions').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deletePromotion(id: string): Promise<void> {
  const { error } = await supabase.from('promotions').delete().eq('id', id)
  if (error) throw error
}

// ============ WILAYAS / COMMUNES / DELIVERY ============
export async function fetchWilayas(): Promise<DbWilaya[]> {
  const { data, error } = await supabase.from('wilayas').select('*').order('code')
  if (error) throw error
  return data || []
}

export async function fetchCommunes(wilayaId: string): Promise<DbCommune[]> {
  const { data, error } = await supabase.from('communes').select('*').eq('wilaya_id', wilayaId).order('name_ar')
  if (error) throw error
  return data || []
}

export async function fetchDeliveryZone(wilayaId: string): Promise<DbDeliveryZone | null> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*')
    .eq('wilaya_id', wilayaId)
    .eq('is_enabled', true)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function fetchAllDeliveryZones(): Promise<(DbDeliveryZone & { wilaya: DbWilaya })[]> {
  const { data, error } = await supabase
    .from('delivery_zones')
    .select('*, wilaya:wilayas(*)')
    .order('wilaya_id')
  if (error) throw error
  return data || []
}

export async function updateDeliveryZone(id: string, updates: Partial<DbDeliveryZone>): Promise<void> {
  const { error } = await supabase.from('delivery_zones').update(updates).eq('id', id)
  if (error) throw error
}

// ============ ORDERS ============
export async function fetchOrders(): Promise<DbOrder[]> {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function fetchOrderItems(orderId: string): Promise<DbOrderItem[]> {
  const { data, error } = await supabase.from('order_items').select('*').eq('order_id', orderId)
  if (error) throw error
  return data || []
}

export async function fetchOrderItemOptions(orderItemId: string): Promise<DbOrderItemOption[]> {
  const { data, error } = await supabase.from('order_item_options').select('*').eq('order_item_id', orderItemId)
  if (error) throw error
  return data || []
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const { error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId)
  if (error) throw error
}

export async function createOrderRpc(params: {
  customer_name: string
  customer_phone: string
  order_type: string
  payment_method: string
  wilaya_id: string | null
  commune_id: string | null
  address: string
  notes: string
  items: Array<Record<string, unknown>>
  promo_code?: string | null
}): Promise<{
  id: string
  order_number: string
  subtotal: number
  delivery_fee: number
  discount: number
  total: number
  estimated_time: string
  wilaya_name: string
  commune_name: string
}> {
  const { data, error } = await supabase.rpc('create_order', params)
  if (error) throw error
  return data
}

// ============ SETTINGS ============
export async function fetchSettings(): Promise<DbSettings | null> {
  const { data, error } = await supabase.from('restaurant_settings').select('*').eq('id', 1).maybeSingle()
  if (error) throw error
  return data
}

export async function updateSettings(updates: Partial<DbSettings>): Promise<DbSettings> {
  const { data, error } = await supabase.from('restaurant_settings').update(updates).eq('id', 1).select().single()
  if (error) throw error
  return data
}

// ============ FAQS ============
export async function fetchFaqs(): Promise<{ id: string; question: string; answer: string; sort_order: number }[]> {
  const { data, error } = await supabase.from('faqs').select('*').eq('is_active', true).order('sort_order')
  if (error) throw error
  return data || []
}

export async function createFaq(faq: { question: string; answer: string; sort_order: number }): Promise<void> {
  const { error } = await supabase.from('faqs').insert(faq)
  if (error) throw error
}

export async function updateFaq(id: string, updates: Record<string, unknown>): Promise<void> {
  const { error } = await supabase.from('faqs').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteFaq(id: string): Promise<void> {
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw error
}
