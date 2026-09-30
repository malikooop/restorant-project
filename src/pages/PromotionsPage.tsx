import { Link } from 'react-router-dom'
import { Tag, ArrowLeft } from 'lucide-react'
import { promotions, menuItems } from '@/data/menu'
import { formatPrice } from '@/utils/format'

export default function PromotionsPage() {
  const itemsWithDiscount = menuItems.filter((i) => i.discountPercentage && i.discountPercentage > 0)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-12 lg:py-16">
        <div className="container-page">
          <span className="text-primary-400 font-semibold text-sm">وفّر أكثر</span>
          <h1 className="font-display font-bold text-4xl lg:text-5xl mt-2">العروض والتخفيضات</h1>
          <p className="text-secondary-300 mt-3 text-lg">اكتشف أفضل عروضنا ووفّر على طلبك</p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* Combo Promotions */}
        <h2 className="font-display font-bold text-2xl mb-6">عروض الوجبات</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {promotions.map((promo) => (
            <div key={promo.id} className="card group hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-3 right-3 badge bg-accent-500 text-white">{promo.badge}</span>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-display font-bold text-lg">{promo.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{promo.description}</p>
                </div>
              </div>
              <div className="p-4">
                <Link to="/menu" className="btn-primary btn-sm w-full">
                  اطلب الآن <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Discounted Items */}
        <h2 className="font-display font-bold text-2xl mb-6">عناصر بأسعار مخفضة</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {itemsWithDiscount.map((item) => (
            <div key={item.id} className="card group hover:shadow-elevated transition-all hover:-translate-y-1">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <span className="absolute top-3 right-3 badge bg-error-500 text-white shadow-soft">
                  <Tag className="w-3 h-3" /> -{item.discountPercentage}%
                </span>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-display font-bold text-base">{item.nameAr}</h3>
                <p className="text-sm text-muted line-clamp-2">{item.description}</p>
                <div className="flex items-baseline gap-2">
                  <span className="font-display font-bold text-lg text-primary-600">{formatPrice(item.price)}</span>
                  <span className="text-sm text-muted line-through">{formatPrice(item.oldPrice!)}</span>
                </div>
                <Link to="/menu" className="btn-primary btn-sm w-full">
                  أضف للسلة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
