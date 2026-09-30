import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, MapPin, Phone, User, ShoppingBag, Truck, Store, CreditCard, Banknote } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'
import { restaurantConfig } from '@/config/restaurant'
import type { OrderType, PaymentMethod } from '@/types'

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  const handleValidate = () => {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'الاسم مطلوب'
    if (!phone.trim()) errs.phone = 'الهاتف مطلوب'
    else if (!/^[0-9+\s]{8,}$/.test(phone)) errs.phone = 'رقم هاتف غير صحيح'
    if (orderType === 'delivery' && !address.trim()) errs.address = 'العنوان مطلوب'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!handleValidate()) return
    setSubmitting(true)
    setTimeout(() => {
      const num = `WJ${Math.floor(10000 + Math.random() * 90000)}`
      setOrderNumber(num)
      setSuccess(true)
      clearCart()
      setSubmitting(false)
    }, 1500)
  }

  if (success) {
    return (
      <div className="container-page py-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-success-100 flex items-center justify-center mx-auto animate-scale-in">
            <Check className="w-12 h-12 text-success-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl">تم استلام طلبك!</h1>
            <p className="text-muted mt-2">رقم طلبك: <span className="font-bold text-primary-600">{orderNumber}</span></p>
          </div>
          <p className="text-secondary-700">
            سيتم تحضير طلبك خلال {restaurantConfig.delivery.estimatedTime} دقيقة. سنتصل بك لتأكيد الطلب.
          </p>
          <div className="bg-secondary-50 rounded-2xl p-6 text-right space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted">نوع الطلب</span><span className="font-semibold">{orderType === 'delivery' ? 'توصيل' : 'استلام'}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">الاسم</span><span className="font-semibold">{name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">الهاتف</span><span className="font-semibold" dir="ltr">{phone}</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted">طريقة الدفع</span><span className="font-semibold">{paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'أونلاين'}</span></div>
          </div>
          <Link to="/menu" className="btn-primary">العودة للقائمة</Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-secondary-50 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-secondary-300" />
          </div>
          <h1 className="font-display font-bold text-2xl">سلتك فارغة</h1>
          <p className="text-muted">أضف بعض الأطباق قبل إتمام الطلب</p>
          <Link to="/menu" className="btn-primary">تصفح القائمة</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-page py-8 lg:py-12">
      <Link to="/menu" className="inline-flex items-center gap-2 text-muted hover:text-primary-600 mb-6 text-sm">
        <ArrowRight className="w-4 h-4" /> متابعة التسوق
      </Link>

      <h1 className="font-display font-bold text-3xl lg:text-4xl mb-8">إتمام الطلب</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4">نوع الطلب</h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-xl border-2 text-right transition-all ${orderType === 'delivery' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'}`}
              >
                <Truck className={`w-6 h-6 mb-2 ${orderType === 'delivery' ? 'text-primary-500' : 'text-secondary-400'}`} />
                <h3 className="font-bold">توصيل</h3>
                <p className="text-xs text-muted mt-1">في {restaurantConfig.delivery.estimatedTime} دقيقة</p>
              </button>
              <button
                type="button"
                onClick={() => setOrderType('pickup')}
                className={`p-4 rounded-xl border-2 text-right transition-all ${orderType === 'pickup' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'}`}
              >
                <Store className={`w-6 h-6 mb-2 ${orderType === 'pickup' ? 'text-primary-500' : 'text-secondary-400'}`} />
                <h3 className="font-bold">استلام</h3>
                <p className="text-xs text-muted mt-1">من المطعم مباشرة</p>
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-lg">معلومات التواصل</h2>

            <div>
              <label className="block text-sm font-medium mb-1.5">الاسم الكامل</label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="input pr-12"
                />
              </div>
              {errors.name && <p className="text-error-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="input pr-12"
                  dir="ltr"
                  style={{ textAlign: 'right' }}
                />
              </div>
              {errors.phone && <p className="text-error-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {orderType === 'delivery' && (
              <div>
                <label className="block text-sm font-medium mb-1.5">عنوان التوصيل</label>
                <div className="relative">
                  <MapPin className="absolute right-4 top-4 w-4 h-4 text-muted" />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="الحي، الشارع، رقم المنزل..."
                    className="input pr-12 resize-none"
                    rows={2}
                  />
                </div>
                {errors.address && <p className="text-error-500 text-xs mt-1">{errors.address}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5">ملاحظات (اختياري)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                className="input resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4">طريقة الدفع</h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200 hover:border-secondary-300'}`}
              >
                <Banknote className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-primary-500' : 'text-secondary-400'}`} />
                <div className="flex-1">
                  <h3 className="font-bold">الدفع عند الاستلام</h3>
                  <p className="text-xs text-muted mt-0.5">ادفع نقداً عند وصول طلبك</p>
                </div>
                {paymentMethod === 'cash' && <Check className="w-5 h-5 text-primary-500" />}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('online')}
                disabled={!restaurantConfig.payment.online}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-right ${paymentMethod === 'online' ? 'border-primary-500 bg-primary-50' : 'border-secondary-200'} ${!restaurantConfig.payment.online ? 'opacity-50 cursor-not-allowed' : 'hover:border-secondary-300'}`}
              >
                <CreditCard className={`w-6 h-6 ${paymentMethod === 'online' ? 'text-primary-500' : 'text-secondary-400'}`} />
                <div className="flex-1">
                  <h3 className="font-bold">دفع أونلاين</h3>
                  <p className="text-xs text-muted mt-0.5">{restaurantConfig.payment.online ? 'بطاقة بنكية أو CIB' : 'غير متاح حالياً'}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4">ملخص الطلب</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((ci, i) => (
                <div key={i} className="flex gap-3 text-sm">
                  <img src={ci.item.image} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{ci.item.nameAr}</p>
                    <p className="text-xs text-muted">×{ci.quantity}</p>
                  </div>
                  <span className="font-semibold text-primary-600 whitespace-nowrap">{formatPrice(ci.unitPrice * ci.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-secondary-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted">المجموع الفرعي</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted">رسوم التوصيل</span>
                  <span className="font-semibold">{deliveryFee === 0 ? <span className="text-success-600">مجاني</span> : formatPrice(deliveryFee)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-secondary-100">
                <span>المجموع</span>
                <span className="text-primary-600">{formatPrice(orderType === 'pickup' ? subtotal : total)}</span>
              </div>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full mt-6">
              {submitting ? 'جاري الإرسال...' : 'تأكيد الطلب'}
              {!submitting && <ArrowLeft className="w-4 h-4" />}
            </button>

            <p className="text-xs text-muted text-center mt-3">
              بتأكيد الطلب، أنت توافق على شروط الخدمة
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
