import { Link } from 'react-router-dom'
import { Truck, Leaf, ShieldCheck, Clock, Heart, Users, Award, ArrowLeft } from 'lucide-react'
import { restaurantConfig } from '@/config/restaurant'

export default function AboutPage() {
  const values = [
    { icon: Leaf, title: 'مكونات طازجة', desc: 'نختار أجود المكونات الطازجة يومياً من مصادر موثوقة' },
    { icon: Clock, title: 'سرعة في التحضير', desc: 'نحضّر طلبك في وقت قياسي دون التنازل عن الجودة' },
    { icon: ShieldCheck, title: 'جودة مضمونة', desc: 'نلتزم بأعلى معايير النظافة والجودة في كل خطوة' },
    { icon: Heart, title: 'شغف وحب', desc: 'كل طبق نحضّره يحمل لمسة من شغفنا وحبنا للطعام' },
  ]

  const stats = [
    { value: '+5000', label: 'عميل سعيد' },
    { value: '+50', label: 'طبق متنوع' },
    { value: '4.9', label: 'تقييم العملاء' },
    { value: '30د', label: 'متوسط التوصيل' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-secondary-900 text-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.pexels.com/photos/5779787/pexels-photo-5779787.jpeg?auto=compress&cs=tinysrgb&h=900&w=1600" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-l from-secondary-900 to-secondary-900/60" />
        </div>
        <div className="relative container-page text-center">
          <span className="text-primary-400 font-semibold text-sm">قصتنا</span>
          <h1 className="font-display font-bold text-4xl lg:text-5xl mt-2 max-w-2xl mx-auto leading-tight">
            نحضّر الطعام بحب، ونوصله بسرعة
          </h1>
          <p className="text-secondary-300 mt-4 text-lg max-w-xl mx-auto">
            رحلتنا بدأت من شغف بسيط: تقديم طعام لذيذ وسريع بجودة عالية لكل جزائري
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container-page py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary-500 font-semibold text-sm">من نحن</span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl leading-tight">
              {restaurantConfig.name} — نكهة جزائرية أصيلة
            </h2>
            <div className="space-y-4 text-secondary-700 leading-relaxed">
              <p>
                بدأت قصة {restaurantConfig.name} من حلم بسيط: أن يكون لدينا مطعم يقدم ألذ الوجبات السريعة
                في الجزائر بجودة عالمية ونكهة محلية. اليوم، نفخر بأننا أصبحنا الوجهة المفضلة لآلاف العائلات
                الجزائرية.
              </p>
              <p>
                نختار مكوناتنا بعناية فائقة، نتعامل مع موردين موثوقين، ونحرص على أن تكون كل مكونة طازجة.
                فريقنا من الطهاة المحترفين يحضّر كل طبق بحب وشغف، من البرغر الشهي إلى البيتزا الإيطالية الأصيلة.
              </p>
              <p>
                نؤمن أن الطعام الجيد يجمع الناس، ولذلك نسعى دائماً لتقديم تجربة طعام متكاملة: من سهولة الطلب
                أونلاين، إلى سرعة التوصيل، إلى جودة الطعام التي تستحقها.
              </p>
            </div>
            <Link to="/menu" className="btn-primary">
              اكتشف قائمتنا <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.pexels.com/photos/16547110/pexels-photo-16547110.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="مطبخ" className="rounded-2xl shadow-card aspect-[3/4] object-cover" />
            <img src="https://images.pexels.com/photos/5488053/pexels-photo-5488053.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="طعام" className="rounded-2xl shadow-card aspect-[3/4] object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-primary-500 text-white py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <p className="font-display font-black text-4xl lg:text-5xl">{stat.value}</p>
                <p className="text-white/80 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="container-page py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-primary-500 font-semibold text-sm">قيمنا</span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl mt-2">ما يميزنا</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <div key={i} className="card p-6 text-center hover:shadow-elevated transition-shadow">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="font-display font-bold text-lg mb-2">{value.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-page pb-16">
        <div className="bg-secondary-900 rounded-3xl p-8 lg:p-12 text-center text-white">
          <Users className="w-12 h-12 text-primary-400 mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl mb-3">انضم لعائلتنا</h2>
          <p className="text-secondary-300 max-w-xl mx-auto mb-6">جرب {restaurantConfig.name} اليوم واكتشف لماذا يختارنا آلاف العملاء</p>
          <Link to="/menu" className="btn-primary btn-lg">
            اطلب الآن <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
