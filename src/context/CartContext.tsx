import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { CartItem, MenuItem, MenuItemVariant, MenuItemOption } from '@/types'
import { restaurantConfig } from '@/config/restaurant'

interface CartContextValue {
  items: CartItem[]
  addItem: (item: MenuItem, quantity: number, variant?: MenuItemVariant, options?: MenuItemOption[], notes?: string) => void
  removeItem: (index: number) => void
  updateQuantity: (index: number, quantity: number) => void
  clearCart: () => void
  subtotal: number
  deliveryFee: number
  total: number
  itemCount: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  favorites: string[]
  toggleFavorite: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('wajba-cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isOpen, setIsOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('wajba-favorites')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('wajba-cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('wajba-favorites', JSON.stringify(favorites))
  }, [favorites])

  const addItem = useCallback(
    (item: MenuItem, quantity: number, variant?: MenuItemVariant, options: MenuItemOption[] = [], notes?: string) => {
      const unitPrice = (variant?.price ?? item.price) + options.reduce((sum, o) => sum + o.price, 0)
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (ci) =>
            ci.item.id === item.id &&
            ci.selectedVariant?.id === variant?.id &&
            ci.selectedOptions.length === options.length &&
            ci.selectedOptions.every((o, i) => o.id === options[i]?.id) &&
            ci.notes === notes,
        )
        if (existingIndex >= 0) {
          const updated = [...prev]
          updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity }
          return updated
        }
        return [...prev, { item, quantity, selectedVariant: variant, selectedOptions: options, notes, unitPrice }]
      })
      setIsOpen(true)
    },
    [],
  )

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((_, i) => i !== index))
      return
    }
    setItems((prev) => prev.map((ci, i) => (i === index ? { ...ci, quantity } : ci)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }, [])

  const subtotal = items.reduce((sum, ci) => sum + ci.unitPrice * ci.quantity, 0)
  const deliveryFee = subtotal >= restaurantConfig.delivery.freeDeliveryThreshold || subtotal === 0 ? 0 : restaurantConfig.delivery.baseFee
  const total = subtotal + deliveryFee
  const itemCount = items.reduce((sum, ci) => sum + ci.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        isOpen,
        setIsOpen,
        favorites,
        toggleFavorite,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
