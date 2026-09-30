import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Truck, Leaf, ShoppingBag, ShieldCheck, Star, ArrowLeft, Clock, MapPin, Phone, ChevronLeft } from 'lucide-react'
import { menuItems, categories, promotions } from '@/data/menu'
import type { MenuItem } from '@/types'
import { restaurantConfig } from '@/config/restaurant'
import FoodCard from '@/components/menu/FoodCard'
import QuickView from '@/components/menu/QuickView'

export default function HomePage() {
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null)

  const featured = menuItems.filter((i) => i.featured).slice(0, 8)
  const popular = menuItems.filter((i) => i.popular).slice(0, 4)

  const trustItems = [
    { icon: Truck, title: 'توصيل سريع', desc: 'في 30-45 دقيقة' },
    { icon: Leaf, title: 'مكونات طازجة', desc: 'يومياً وبجودة عالية' },
    { icon: ShoppingBag, title: 'طلب سهل', desc: 'بضغطة زر واحدة' },
    { icon: ShieldCheck, title: 'خدمة موثوقة', desc: 'رضاك أولويتنا' },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary-900">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/5779781/pexels-photo-5779781.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600"
            alt="مطبخ"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-secondary-900 via-secondary-900/80 to-secondary-900/40" />
        </div>

        <div className="relative container-page py-16 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className="text-white space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-success-400 animate-pulse" />
                {restaurantConfig.status === 'open' ? 'مفتوح الآن' : 'مغلق'}
              </div>

              <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance">
                {restaurantConfig.hero.headline}
              </h1>

              <p className="text-lg lg:text-xl text-secondary-300 leading-relaxed max-w-lg">
                {restaurantConfig.hero.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/menu" className="btn-primary btn-lg group">
                  {restaurantConfig.hero.primaryCta}
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <Link to="/menu" className="btn btn-lg bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20">
                  {restaurantConfig.hero.secondaryCta}
                </Link>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent-400 text-accent-400" />
                  ))}
                </div>
                <span className="text-secondary-300 text-sm">تقييم عملائنا 4.9/5</span>
              </div>
            </div>

            {/* Floating cards */}
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute top-0 right-0 w-64 animate-float">
                <div className="card p-0 overflow-hidden">
                  <img src={featured[0]?.image} alt="" className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm">{featured[0]?.nameAr}</h3>
                    <p className="text-primary-600 font-bold text-sm mt-1">{featured[0]?.price} دج</p>
                  </div>
                </div>
              </div>
              <div className="absolute top-40 left-0 w-64 animate-float" style={{ animationDelay: '1s' }}>
                <div className="card p-0 overflow-hidden">
                  <img src={featured[1]?.image} alt="" className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm">{featured[1]?.nameAr}</h3>
                    <p className="text-primary-600 font-bold text-sm mt-1">{featured[1]?.price} دج</p>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 right-12 w-64 animate-float" style={{ animationDelay: '2s' }}>
                <div className="card p-0 overflow-hidden">
                  <img src={featured[2]?.image} alt="" className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <h3 className="font-bold text-sm">{featured[2]?.nameAr}</h3>
                    <p className="text-primary-600 font-bold text-sm mt-1">{featured[2]?.price} دج</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="relative">
          <svg className="w-full h-12 lg:h-20" viewBox="0 0 1440 100" preserveAspectRatio="none">
            <path d="M0,100 L1440,100 L1440,20 Q720,0 0,20 Z" fill="#FAFAF8" />
          </svg>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="container-page -mt-4 lg:-mt-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {trustItems.map((trust, i) => (
            <div key={i} className="card p-5 flex items-center gap-4 hover:shadow-elevated transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
                <trust.icon className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm">{trust.title}</h3>
                <p className="text-xs text-muted">{trust.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-page py-16">
        <div className="text-center mb-10">
          <span className="text-primary-500 font-semibold text-sm">تصفح حسب الفئة</span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl mt-2">أصنافنا</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-3 lg:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/menu?category=${cat.slug}`}
              className="group flex flex-col items-center gap-2"
            >
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-card group-hover:shadow-elevated transition-all group-hover:-translate-y-1">
                <img src={cat.image} alt={cat.nameAr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span className="absolute bottom-2 left-0 right-0 text-center text-white font-bold text-sm">{cat.nameAr}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="bg-surface py-16">
        <div className="container-page">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-primary-500 font-semibold text-sm">الأكثر طلباً</span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl mt-2">أطباق مميزة</h2>
            </div>
            <Link to="/menu" className="btn-ghost text-primary-600 hover:bg-primary-50 hidden sm:inline-flex">
              عرض الكل <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featured.map((item) => (
              <FoodCard key={item.id} item={item} onQuickView={setQuickViewItem} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="container-page py-16">
        <div className="text-center mb-10">
          <span className="text-primary-500 font-semibold text-sm">وفّر أكثر</span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl mt-2">عروض خاصة</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {promotions.map((promo) => (
            <div key={promo.id} className="card group hover:shadow-elevated transition-all hover:-translate-y-1 cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute top-3 right-3 badge bg-accent-500 text-white">{promo.badge}</span>
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-display font-bold text-lg">{promo.title}</h3>
                  <p className="text-sm text-white/80 mt-1">{promo.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="bg-secondary-900 text-white py-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/13971183/pexels-photo-13971183.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                alt="مطبخنا"
                className="rounded-2xl shadow-elevated w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 bg-primary-500 text-white p-6 rounded-2xl shadow-elevated hidden sm:block">
                <p className="font-display font-bold text-3xl">+5000</p>
                <p className="text-sm text-white/80">عميل سعيد</p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-primary-400 font-semibold text-sm">من نحن</span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl leading-tight">
                شغفنا هو تقديم أفضل طعم
              </h2>
              <p className="text-secondary-300 leading-relaxed text-lg">
                في {restaurantConfig.name}، نؤمن أن الطعام الجيد يجمع الناس. نختار أجود المكونات الطازجة
                ونحضّرها بحب وشغف لنقدم لك تجربة طعام لا تُنسى. من البرغر إلى البيتزا، من المشاوي إلى الحلويات -
                كل طبق يحكي قصة.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">توصيل في 30-45 دقيقة</span>
                </div>
                <div className="flex items-center gap-3">
                  <Leaf className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">مكونات طازجة يومياً</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">جودة مضمونة 100%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary-400" />
                  <span className="text-sm">توصيل لجميع الأحياء</span>
                </div>
              </div>
              <Link to="/about" className="btn-primary">
                تعرف علينا أكثر <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Items */}
      <section className="container-page py-16">
        <div className="text-center mb-10">
          <span className="text-primary-500 font-semibold text-sm">يحبها عملاؤنا</span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl mt-2">الأكثر شعبية</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popular.map((item) => (
            <FoodCard key={item.id} item={item} onQuickView={setQuickViewItem} />
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container-page pb-16">
        <div className="bg-gradient-to-l from-primary-500 to-primary-600 rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="https://images.pexels.com/photos/16750771/pexels-photo-16750771.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="font-display font-bold text-3xl lg:text-4xl">جائع الآن؟</h2>
              <p className="text-white/90 text-lg">اطلب أونلاين الآن ووصلك ساخن في 30 دقيقة</p>
              <Link to="/menu" className="btn btn-lg bg-white text-primary-600 hover:bg-white/90 shadow-soft">
                اطلب الآن <ArrowLeft className="w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-3">
              <a href={`tel:${restaurantConfig.phone}`} className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5" />
                <div>
                  <p className="text-sm text-white/70">اتصل بنا</p>
                  <p className="font-bold" dir="ltr">{restaurantConfig.phone}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4">
                <MapPin className="w-5 h-5" />
                <div>
                  <p className="text-sm text-white/70">عنواننا</p>
                  <p className="font-bold">{restaurantConfig.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuickView item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </div>
  )
}
