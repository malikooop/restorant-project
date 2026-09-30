export interface MenuCategory {
  id: string
  name: string
  nameAr: string
  slug: string
  icon: string
  image: string
  order: number
}

export interface MenuItemOption {
  id: string
  name: string
  price: number
}

export interface MenuItemVariant {
  id: string
  name: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  nameAr: string
  description: string
  image: string
  gallery: string[]
  price: number
  oldPrice?: number
  discountPercentage?: number
  categoryId: string
  ingredients: string[]
  allergens: string[]
  tags: string[]
  preparationTime: number
  available: boolean
  featured: boolean
  popular: boolean
  isNew: boolean
  isVegetarian: boolean
  isSpicy: boolean
  rating: number
  options?: MenuItemOption[]
  variants?: MenuItemVariant[]
}

export interface CartItem {
  item: MenuItem
  quantity: number
  selectedVariant?: MenuItemVariant
  selectedOptions: MenuItemOption[]
  notes?: string
  unitPrice: number
}

export type OrderType = 'delivery' | 'pickup'
export type OrderStatus = 'pending' | 'preparing' | 'delivering' | 'completed' | 'cancelled'
export type PaymentMethod = 'cash' | 'online'

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  total: number
  orderType: OrderType
  paymentMethod: PaymentMethod
  status: OrderStatus
  customerName: string
  customerPhone: string
  address: string
  notes?: string
  createdAt: string
  estimatedTime: string
}

export interface Promotion {
  id: string
  title: string
  description: string
  image: string
  badge: string
  isActive: boolean
}
