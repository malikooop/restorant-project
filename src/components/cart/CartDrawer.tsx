import { X, Plus, Minus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import { restaurantConfig } from '@/config/restaurant'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, subtotal, deliveryFee, total, itemCount } = useCart()

  if (!isOpen) return null

  const freeDeliveryRemaining = restaurantConfig.delivery.freeDeliveryThreshold - subtotal
  const meetsMinOrder = subtotal >= restaurantConfig.delivery.minOrder

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setIsOpen(false)} />
      <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-surface shadow-elevated flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-secondary-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            <h2 className="font-display font-bold text-lg">سلة الطلبات</h2>
            {itemCount > 0 && (
              <span className="badge bg-primary-50 text-primary-600">{itemCount} منتج</span>
            )}
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl hover:bg-secondary-50 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary-50 flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-secondary-300" />
            </div>
            <p className="text-secondary-500 font-medium">سلتك فارغة</p>
            <p className="text-muted text-sm text-center">أضف بعض الأطباق الشهية وابدأ طلبك</p>
            <button onClick={() => setIsOpen(false)} className="btn-primary btn-sm">
              تصفح القائمة
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {/* Free delivery progress */}
              {freeDeliveryRemaining > 0 && (
                <div className="bg-accent-50 border border-accent-200 rounded-xl p-3 text-sm">
                  <p className="text-accent-800 font-medium">
                    أضف {formatPrice(freeDeliveryRemaining)} للتوصيل المجاني!
                  </p>
                  <div className="mt-2 h-2 bg-accent-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (subtotal / restaurantConfig.delivery.freeDeliveryThreshold) * 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {items.map((ci, index) => (
                <div key={index} className="flex gap-3 bg-secondary-50 rounded-xl p-3 animate-scale-in">
                  <img
                    src={ci.item.image}
                    alt={ci.item.nameAr}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{ci.item.nameAr}</h3>
                    {ci.selectedVariant && (
                      <p className="text-xs text-muted">{ci.selectedVariant.name}</p>
                    )}
                    {ci.selectedOptions.length > 0 && (
                      <p className="text-xs text-muted truncate">
                        + {ci.selectedOptions.map((o) => o.name).join('، ')}
                      </p>
                    )}
                    {ci.notes && (
                      <p className="text-xs text-muted italic truncate">ملاحظة: {ci.notes}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary-600 text-sm">
                        {formatPrice(ci.unitPrice * ci.quantity)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(index, ci.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-surface border border-secondary-200 flex items-center justify-center hover:border-primary-500 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-semibold text-sm w-6 text-center">{ci.quantity}</span>
                        <button
                          onClick={() => updateQuantity(index, ci.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-surface border border-secondary-200 flex items-center justify-center hover:border-primary-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeItem(index)}
                          className="w-7 h-7 rounded-lg bg-error-50 border border-error-200 flex items-center justify-center hover:bg-error-100 transition-colors mr-1"
                        >
                          <Trash2 className="w-3 h-3 text-error-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-secondary-100 p-4 space-y-3 bg-surface">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">المجموع الفرعي</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">رسوم التوصيل</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-success-600">مجاني</span>
                    ) : (
                      formatPrice(deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-secondary-100">
                  <span>المجموع</span>
                  <span className="text-primary-600">{formatPrice(total)}</span>
                </div>
              </div>

              {!meetsMinOrder && (
                <p className="text-xs text-warning-600 bg-warning-50 rounded-lg p-2 text-center">
                  الحد الأدنى للطلب {formatPrice(restaurantConfig.delivery.minOrder)}
                </p>
              )}

              <Link
                to="/checkout"
                onClick={() => setIsOpen(false)}
                className={`btn-primary w-full ${!meetsMinOrder ? 'opacity-50 pointer-events-none' : ''}`}
              >
                إتمام الطلب
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
