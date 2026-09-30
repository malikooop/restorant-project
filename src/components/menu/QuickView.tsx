import { useState } from 'react'
import { X, Plus, Minus, Clock, Star, Flame, Leaf, Check, ShoppingBag } from 'lucide-react'
import type { MenuItem, MenuItemOption, MenuItemVariant } from '@/types'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'

interface QuickViewProps {
  item: MenuItem | null
  onClose: () => void
}

export default function QuickView({ item, onClose }: QuickViewProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedVariant, setSelectedVariant] = useState<MenuItemVariant | undefined>(item?.variants?.[0])
  const [selectedOptions, setSelectedOptions] = useState<MenuItemOption[]>([])
  const [notes, setNotes] = useState('')

  if (!item) return null

  const unitPrice = (selectedVariant?.price ?? item.price) + selectedOptions.reduce((sum, o) => sum + o.price, 0)
  const totalPrice = unitPrice * quantity

  const toggleOption = (option: MenuItemOption) => {
    setSelectedOptions((prev) =>
      prev.find((o) => o.id === option.id) ? prev.filter((o) => o.id !== option.id) : [...prev, option],
    )
  }

  const handleAdd = () => {
    addItem(item, quantity, selectedVariant, selectedOptions, notes.trim() || undefined)
    onClose()
    setQuantity(1)
    setSelectedOptions([])
    setNotes('')
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-surface rounded-2xl shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
        <button onClick={onClose} className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform">
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square md:aspect-auto md:h-full overflow-hidden md:rounded-r-2xl">
            <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 flex flex-col gap-1.5">
              {item.discountPercentage && (
                <span className="badge bg-error-500 text-white">-{item.discountPercentage}%</span>
              )}
              {item.isNew && <span className="badge bg-accent-500 text-white">جديد</span>}
              {item.isSpicy && (
                <span className="badge bg-error-50 text-error-600"><Flame className="w-3 h-3" /> حار</span>
              )}
              {item.isVegetarian && (
                <span className="badge bg-success-50 text-success-600"><Leaf className="w-3 h-3" /> نباتي</span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            <div>
              <h2 className="font-display font-bold text-2xl text-secondary-900">{item.nameAr}</h2>
              <p className="text-sm text-muted mt-1">{item.name}</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted">
                <Clock className="w-4 h-4 text-primary-500" /> {item.preparationTime} دقيقة
              </span>
              <span className="flex items-center gap-1 text-muted">
                <Star className="w-4 h-4 fill-accent-400 text-accent-400" /> {item.rating}
              </span>
            </div>

            <p className="text-sm text-secondary-700 leading-relaxed">{item.description}</p>

            {/* Ingredients */}
            {item.ingredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">المكونات</h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing) => (
                    <span key={ing} className="badge bg-secondary-50 text-secondary-700">{ing}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Allergens */}
            {item.allergens.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">مسببات الحساسية</h3>
                <div className="flex flex-wrap gap-1.5">
                  {item.allergens.map((alg) => (
                    <span key={alg} className="badge bg-warning-50 text-warning-700">{alg}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Variants */}
            {item.variants && item.variants.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">الاختيارات</h3>
                <div className="grid grid-cols-3 gap-2">
                  {item.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      {variant.name}
                      <span className="block text-xs text-muted mt-0.5">{formatPrice(variant.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Options */}
            {item.options && item.options.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2">إضافات</h3>
                <div className="space-y-2">
                  {item.options.map((option) => {
                    const checked = selectedOptions.find((o) => o.id === option.id)
                    return (
                      <button
                        key={option.id}
                        onClick={() => toggleOption(option)}
                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border-2 transition-all text-right"
                        style={{ borderColor: checked ? '#E8521E' : '#E5E7EB', background: checked ? '#FFF4ED' : 'transparent' }}
                      >
                        <span className="flex items-center gap-2 text-sm">
                          <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${checked ? 'bg-primary-500 border-primary-500' : 'border-secondary-300'}`}>
                            {checked && <Check className="w-3 h-3 text-white" />}
                          </span>
                          {option.name}
                        </span>
                        <span className="text-sm font-semibold text-primary-600">
                          {option.price > 0 ? `+${formatPrice(option.price)}` : 'مجاني'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <h3 className="font-semibold text-sm mb-2">ملاحظات</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات خاصة بطلبك..."
                className="input text-sm resize-none"
                rows={2}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 bg-secondary-50 rounded-xl p-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:bg-secondary-100">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold w-8 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:bg-secondary-100">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAdd} disabled={!item.available} className="btn-primary flex-1">
                <ShoppingBag className="w-4 h-4" />
                {formatPrice(totalPrice)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
