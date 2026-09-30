import { restaurantConfig } from '@/config/restaurant'

export function formatPrice(price: number): string {
  return `${price.toLocaleString('fr-DZ')} ${restaurantConfig.currencySymbol}`
}

export function calculateDiscount(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round(((oldPrice - price) / oldPrice) * 100)
}
