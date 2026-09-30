import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock, Facebook, Instagram, Mail } from 'lucide-react'
import { restaurantConfig } from '@/config/restaurant'

export default function Footer() {
  return (
    <footer className="bg-secondary-900 text-white mt-20">
      <div className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">و</span>
              </div>
              <div>
                <span className="font-display font-bold text-2xl">{restaurantConfig.name}</span>
                <span className="block text-[10px] text-secondary-400 -mt-1 tracking-wider">{restaurantConfig.nameLatin.toUpperCase()}</span>
              </div>
            </div>
            <p className="text-secondary-400 text-sm leading-relaxed">{restaurantConfig.description}</p>
            <div className="flex gap-3">
              <a href={restaurantConfig.social.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={restaurantConfig.social.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`mailto:contact@wajba.dz`} className="w-10 h-10 rounded-xl bg-white/10 hover:bg-primary-500 flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'الرئيسية' },
                { to: '/menu', label: 'القائمة' },
                { to: '/promotions', label: 'العروض' },
                { to: '/about', label: 'من نحن' },
                { to: '/contact', label: 'اتصل بنا' },
                { to: '/admin', label: 'لوحة التحكم' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-secondary-400 hover:text-primary-400 transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">تواصل معنا</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-secondary-400 text-sm">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>{restaurantConfig.address}</span>
              </li>
              <li>
                <a href={`tel:${restaurantConfig.phone}`} className="flex items-center gap-3 text-secondary-400 hover:text-primary-400 transition-colors text-sm">
                  <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                  <span dir="ltr">{restaurantConfig.phone}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-secondary-400 text-sm">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>مفتوح يومياً من 11:00 إلى 23:00</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">أوقات العمل</h3>
            <ul className="space-y-2">
              {restaurantConfig.openingHours.map((entry) => (
                <li key={entry.day} className="flex items-center justify-between text-sm">
                  <span className="text-secondary-400">{entry.day}</span>
                  <span className={entry.open ? 'text-white' : 'text-error-400'}>
                    {entry.open ? entry.hours : 'مغلق'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-secondary-400 text-sm">
            © {new Date().getFullYear()} {restaurantConfig.name}. جميع الحقوق محفوظة.
          </p>
          <p className="text-secondary-500 text-xs">
            صُنع بحب في الجزائر 🇩🇿
          </p>
        </div>
      </div>
    </footer>
  )
}
