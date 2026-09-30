import { useState } from 'react'
import { Phone, MapPin, Clock, Mail, Send, MessageCircle, Check } from 'lucide-react'
import { restaurantConfig } from '@/config/restaurant'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setName('')
      setPhone('')
      setMessage('')
    }, 3000)
  }

  const contactCards = [
    { icon: Phone, title: 'اتصل بنا', value: restaurantConfig.phone, href: `tel:${restaurantConfig.phone}`, dir: 'ltr' },
    { icon: MessageCircle, title: 'واتساب', value: 'راسلنا على واتساب', href: `https://wa.me/${restaurantConfig.whatsapp}` },
    { icon: Mail, title: 'البريد', value: 'contact@wajba.dz', href: 'mailto:contact@wajba.dz' },
    { icon: MapPin, title: 'العنوان', value: restaurantConfig.address, href: `https://maps.google.com/?q=${restaurantConfig.addressLat},${restaurantConfig.addressLng}` },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-12 lg:py-16">
        <div className="container-page">
          <span className="text-primary-400 font-semibold text-sm">تواصل معنا</span>
          <h1 className="font-display font-bold text-4xl lg:text-5xl mt-2">نحن هنا لخدمتك</h1>
          <p className="text-secondary-300 mt-3 text-lg">هل لديك سؤال أو اقتراح؟ يسعدنا سماعك</p>
        </div>
      </div>

      <div className="container-page py-8 lg:py-12">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contactCards.map((card, i) => (
            <a
              key={i}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="card p-6 hover:shadow-elevated transition-all hover:-translate-y-1 text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-3">
                <card.icon className="w-7 h-7 text-primary-500" />
              </div>
              <h3 className="font-bold text-sm mb-1">{card.title}</h3>
              <p className="text-sm text-muted" dir={card.dir || 'rtl'}>{card.value}</p>
            </a>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card p-6 lg:p-8">
            <h2 className="font-display font-bold text-2xl mb-6">أرسل لنا رسالة</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="w-20 h-20 rounded-full bg-success-100 flex items-center justify-center animate-scale-in">
                  <Check className="w-10 h-10 text-success-600" />
                </div>
                <h3 className="font-bold text-lg">تم إرسال رسالتك!</h3>
                <p className="text-muted text-sm">سنتواصل معك في أقرب وقت</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">الاسم</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="اسمك" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">رقم الهاتف</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="06 12 34 56 78" className="input" dir="ltr" style={{ textAlign: 'right' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">الرسالة</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required placeholder="اكتب رسالتك هنا..." className="input resize-none" rows={5} />
                </div>
                <button type="submit" className="btn-primary w-full">
                  <Send className="w-4 h-4" /> إرسال
                </button>
              </form>
            )}
          </div>

          {/* Map & Hours */}
          <div className="space-y-6">
            {/* Map */}
            <div className="card overflow-hidden">
              <div className="aspect-video bg-secondary-100 relative">
                <iframe
                  src={`https://maps.google.com/maps?q=${restaurantConfig.addressLat},${restaurantConfig.addressLng}&z=15&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  title="موقع المطعم"
                />
              </div>
              <div className="p-4 flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-500 shrink-0" />
                <span className="text-sm text-secondary-700">{restaurantConfig.address}</span>
              </div>
            </div>

            {/* Hours */}
            <div className="card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary-500" />
                <h3 className="font-display font-bold text-lg">أوقات العمل</h3>
              </div>
              <ul className="space-y-2">
                {restaurantConfig.openingHours.map((entry) => (
                  <li key={entry.day} className="flex items-center justify-between text-sm py-2 border-b border-secondary-50 last:border-0">
                    <span className="text-secondary-700 font-medium">{entry.day}</span>
                    <span className={entry.open ? 'text-secondary-900' : 'text-error-500'}>
                      {entry.open ? entry.hours : 'مغلق'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
