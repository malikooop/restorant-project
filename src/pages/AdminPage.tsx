import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, ClipboardList, Settings, ArrowLeft, Plus, Edit2, Trash2, X, Search, TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react'
import { menuItems, categories } from '@/data/menu'
import { restaurantConfig } from '@/config/restaurant'
import { formatPrice } from '@/utils/format'
import type { MenuItem, Order, OrderStatus } from '@/types'

type Tab = 'dashboard' | 'menu' | 'orders' | 'settings'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [orders] = useState<Order[]>([
    {
      id: 'order-1', orderNumber: 'WJ48291', items: [], subtotal: 1450, deliveryFee: 200, total: 1650,
      orderType: 'delivery', paymentMethod: 'cash', status: 'pending',
      customerName: 'أحمد بن علي', customerPhone: '0655123456', address: 'حي النصر، شارع 5',
      createdAt: new Date(Date.now() - 10 * 60000).toISOString(), estimatedTime: '30-45',
    },
    {
      id: 'order-2', orderNumber: 'WJ48292', items: [], subtotal: 800, deliveryFee: 0, total: 800,
      orderType: 'pickup', paymentMethod: 'cash', status: 'preparing',
      customerName: 'سارة محمد', customerPhone: '0661234567', address: '',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(), estimatedTime: '20',
    },
    {
      id: 'order-3', orderNumber: 'WJ48290', items: [], subtotal: 2200, deliveryFee: 0, total: 2200,
      orderType: 'delivery', paymentMethod: 'cash', status: 'completed',
      customerName: 'يوسف قاسم', customerPhone: '0770123456', address: 'حي السلام',
      createdAt: new Date(Date.now() - 120 * 60000).toISOString(), estimatedTime: '30-45',
    },
  ])

  const stats = [
    { icon: ShoppingBag, label: 'طلبات اليوم', value: '24', color: 'primary' },
    { icon: DollarSign, label: 'مبيعات اليوم', value: formatPrice(34500), color: 'success' },
    { icon: TrendingUp, label: 'متوسط الطلب', value: formatPrice(1437), color: 'accent' },
    { icon: Clock, label: 'وقت التحضير', value: '14 دقيقة', color: 'secondary' },
  ]

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'لوحة المعلومات', icon: LayoutDashboard },
    { id: 'menu', label: 'إدارة القائمة', icon: UtensilsCrossed },
    { id: 'orders', label: 'الطلبات', icon: ClipboardList },
    { id: 'settings', label: 'الإعدادات', icon: Settings },
  ]

  const statusLabels: Record<OrderStatus, string> = {
    pending: 'قيد الانتظار',
    preparing: 'قيد التحضير',
    delivering: 'قيد التوصيل',
    completed: 'مكتمل',
    cancelled: 'ملغى',
  }
  const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-warning-100 text-warning-700',
    preparing: 'bg-accent-100 text-accent-700',
    delivering: 'bg-primary-100 text-primary-700',
    completed: 'bg-success-100 text-success-700',
    cancelled: 'bg-error-100 text-error-700',
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-page py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display font-bold text-2xl lg:text-3xl">لوحة التحكم</h1>
            <p className="text-muted text-sm mt-1">إدارة {restaurantConfig.name}</p>
          </div>
          <Link to="/" className="btn-ghost text-sm">
            <ArrowLeft className="w-4 h-4" /> العودة للموقع
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 border-b border-secondary-100 pb-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                tab === item.id ? 'bg-primary-500 text-white shadow-soft' : 'bg-surface text-secondary-700 hover:bg-secondary-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Dashboard */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <div key={i} className="card p-5">
                  <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-3`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-500`} />
                  </div>
                  <p className="text-muted text-sm">{stat.label}</p>
                  <p className="font-display font-bold text-2xl mt-1">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg mb-4">أحدث الطلبات</h2>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-xl">
                    <div>
                      <span className="font-bold text-sm">{order.orderNumber}</span>
                      <p className="text-xs text-muted mt-0.5">{order.customerName} • {order.customerPhone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary-600 text-sm">{formatPrice(order.total)}</span>
                      <span className={`badge text-xs ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top items */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg mb-4">الأكثر مبيعاً</h2>
              <div className="space-y-3">
                {menuItems.filter((i) => i.popular).slice(0, 5).map((item, i) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <span className="text-muted font-bold text-sm w-6">{i + 1}</span>
                    <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.nameAr}</p>
                      <p className="text-xs text-muted">{formatPrice(item.price)}</p>
                    </div>
                    <span className="text-sm font-bold text-success-600">{Math.floor(Math.random() * 50 + 20)} طلب</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Menu Management */}
        {tab === 'menu' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg">إدارة الأطباق ({menuItems.length})</h2>
              <button onClick={() => setShowAddForm(true)} className="btn-primary btn-sm">
                <Plus className="w-4 h-4" /> إضافة طبق
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="card p-4 flex gap-3">
                  <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-sm truncate">{item.nameAr}</h3>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingItem(item)} className="p-1.5 rounded-lg hover:bg-secondary-50">
                          <Edit2 className="w-3.5 h-3.5 text-secondary-600" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error-50">
                          <Trash2 className="w-3.5 h-3.5 text-error-500" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-1">{categories.find((c) => c.id === item.categoryId)?.nameAr}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary-600 text-sm">{formatPrice(item.price)}</span>
                      <div className="flex gap-1">
                        {item.available ? (
                          <span className="badge bg-success-50 text-success-600 text-[10px]">متاح</span>
                        ) : (
                          <span className="badge bg-error-50 text-error-500 text-[10px]">غير متاح</span>
                        )}
                        {item.featured && <span className="badge bg-primary-50 text-primary-600 text-[10px]">مميز</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(editingItem || showAddForm) && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => { setEditingItem(null); setShowAddForm(false) }} />
                <div className="relative bg-surface rounded-2xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-xl">{editingItem ? 'تعديل الطبق' : 'إضافة طبق جديد'}</h2>
                    <button onClick={() => { setEditingItem(null); setShowAddForm(false) }} className="p-2 rounded-xl hover:bg-secondary-50">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">الاسم بالعربية</label>
                      <input type="text" defaultValue={editingItem?.nameAr || ''} placeholder="اسم الطبق" className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">الاسم بالإنجليزية</label>
                      <input type="text" defaultValue={editingItem?.name || ''} placeholder="Dish name" className="input" dir="ltr" style={{ textAlign: 'right' }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">الوصف</label>
                      <textarea defaultValue={editingItem?.description || ''} placeholder="وصف الطبق" className="input resize-none" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">السعر (دج)</label>
                        <input type="number" defaultValue={editingItem?.price || ''} placeholder="0" className="input" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">السعر القديم (اختياري)</label>
                        <input type="number" defaultValue={editingItem?.oldPrice || ''} placeholder="0" className="input" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">الفئة</label>
                      <select defaultValue={editingItem?.categoryId || ''} className="input">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.nameAr}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">رابط الصورة</label>
                      <input type="text" defaultValue={editingItem?.image || ''} placeholder="https://..." className="input" dir="ltr" style={{ textAlign: 'right' }} />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={editingItem?.available ?? true} className="w-4 h-4 rounded" />
                        متاح
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={editingItem?.featured ?? false} className="w-4 h-4 rounded" />
                        مميز
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={editingItem?.popular ?? false} className="w-4 h-4 rounded" />
                        شائع
                      </label>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" defaultChecked={editingItem?.isNew ?? false} className="w-4 h-4 rounded" />
                        جديد
                      </label>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <button onClick={() => { setEditingItem(null); setShowAddForm(false) }} className="btn-primary flex-1">
                        حفظ
                      </button>
                      <button onClick={() => { setEditingItem(null); setShowAddForm(false) }} className="btn-outline">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders */}
        {tab === 'orders' && (
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg mb-4">الطلبات ({orders.length})</h2>
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border border-secondary-100 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{order.orderNumber}</span>
                        <span className={`badge text-xs ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                      </div>
                      <p className="text-sm text-muted mt-1">
                        {order.customerName} • <span dir="ltr">{order.customerPhone}</span>
                      </p>
                      {order.address && <p className="text-sm text-muted">{order.address}</p>}
                      <p className="text-xs text-muted mt-1">
                        {new Date(order.createdAt).toLocaleString('ar-DZ')}
                      </p>
                    </div>
                    <div className="text-left shrink-0">
                      <p className="font-bold text-primary-600">{formatPrice(order.total)}</p>
                      <p className="text-xs text-muted">{order.orderType === 'delivery' ? 'توصيل' : 'استلام'}</p>
                      <p className="text-xs text-muted">{order.paymentMethod === 'cash' ? 'نقدي' : 'أونلاين'}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-3 border-t border-secondary-50">
                    <button className="btn-sm btn-primary">تأكيد</button>
                    <button className="btn-sm btn-outline">تفاصيل</button>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (
                      <button className="btn-sm btn-ghost text-error-500 hover:bg-error-50">إلغاء</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings */}
        {tab === 'settings' && (
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-display font-bold text-lg mb-4">معلومات المطعم</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">اسم المطعم</label>
                  <input type="text" defaultValue={restaurantConfig.name} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الاسم اللاتيني</label>
                  <input type="text" defaultValue={restaurantConfig.nameLatin} className="input" dir="ltr" style={{ textAlign: 'right' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الهاتف</label>
                  <input type="text" defaultValue={restaurantConfig.phone} className="input" dir="ltr" style={{ textAlign: 'right' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">واتساب</label>
                  <input type="text" defaultValue={restaurantConfig.whatsapp} className="input" dir="ltr" style={{ textAlign: 'right' }} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">العنوان</label>
                  <input type="text" defaultValue={restaurantConfig.address} className="input" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">شريط الإعلان</label>
                  <input type="text" defaultValue={restaurantConfig.announcement} className="input" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-bold text-lg mb-4">إعدادات التوصيل</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">رسوم التوصيل (دج)</label>
                  <input type="number" defaultValue={restaurantConfig.delivery.baseFee} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">حد التوصيل المجاني</label>
                  <input type="number" defaultValue={restaurantConfig.delivery.freeDeliveryThreshold} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الحد الأدنى للطلب</label>
                  <input type="number" defaultValue={restaurantConfig.delivery.minOrder} className="input" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="font-display font-bold text-lg mb-4">الألوان</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">اللون الأساسي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue={restaurantConfig.primaryColor} className="w-12 h-10 rounded-lg border border-secondary-200" />
                    <input type="text" defaultValue={restaurantConfig.primaryColor} className="input flex-1" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">اللون الثانوي</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue={restaurantConfig.secondaryColor} className="w-12 h-10 rounded-lg border border-secondary-200" />
                    <input type="text" defaultValue={restaurantConfig.secondaryColor} className="input flex-1" dir="ltr" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">لون التمييز</label>
                  <div className="flex items-center gap-2">
                    <input type="color" defaultValue={restaurantConfig.accentColor} className="w-12 h-10 rounded-lg border border-secondary-200" />
                    <input type="text" defaultValue={restaurantConfig.accentColor} className="input flex-1" dir="ltr" />
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary">حفظ التغييرات</button>
          </div>
        )}
      </div>
    </div>
  )
}
