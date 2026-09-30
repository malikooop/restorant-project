import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu as MenuIcon, X, Phone, MapPin, Clock } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { restaurantConfig } from '@/config/restaurant'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { itemCount, setIsOpen } = useCart()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'الرئيسية' },
    { to: '/menu', label: 'القائمة' },
    { to: '/promotions', label: 'العروض' },
    { to: '/about', label: 'من نحن' },
    { to: '/contact', label: 'اتصل بنا' },
  ]

  return (
    <>
      {/* Announcement Bar */}
      {restaurantConfig.announcementActive && (
        <div className="bg-secondary-900 text-white text-center py-2 px-4 text-sm font-medium">
          <p className="truncate">{restaurantConfig.announcement}</p>
        </div>
      )}

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-surface/95 backdrop-blur-md shadow-card' : 'bg-surface'
        }`}
      >
        <div className="container-page">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary-500 flex items-center justify-center shadow-soft">
                <span className="text-white font-display font-bold text-lg lg:text-xl">و</span>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl lg:text-2xl text-secondary-900">{restaurantConfig.name}</span>
                <span className="block text-[10px] text-muted -mt-1 tracking-wider">{restaurantConfig.nameLatin.toUpperCase()}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      active ? 'text-primary-600 bg-primary-50' : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              <Link
                to="/menu"
                className="hidden sm:inline-flex btn-primary btn-sm"
              >
                اطلب الآن
              </Link>

              <button
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 rounded-xl hover:bg-secondary-50 transition-colors"
                aria-label="السلة"
              >
                <ShoppingBag className="w-5 h-5 text-secondary-800" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -left-1 bg-primary-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-subtle">
                    {itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-secondary-50 transition-colors"
                aria-label="القائمة"
              >
                <MenuIcon className="w-5 h-5 text-secondary-800" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-surface shadow-elevated animate-slide-in-right overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-secondary-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">و</span>
                </div>
                <span className="font-display font-bold text-xl text-secondary-900">{restaurantConfig.name}</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-xl hover:bg-secondary-50">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="p-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const active = location.pathname === link.to
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                      active ? 'text-primary-600 bg-primary-50' : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
              <Link to="/menu" className="btn-primary mt-3 w-full">
                اطلب الآن
              </Link>
            </nav>

            <div className="p-4 border-t border-secondary-100 space-y-3">
              <a href={`tel:${restaurantConfig.phone}`} className="flex items-center gap-3 text-sm text-secondary-700">
                <Phone className="w-4 h-4 text-primary-500" />
                <span dir="ltr">{restaurantConfig.phone}</span>
              </a>
              <div className="flex items-center gap-3 text-sm text-secondary-700">
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>{restaurantConfig.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary-700">
                <Clock className="w-4 h-4 text-primary-500" />
                <span>مفتوح يومياً 11:00 - 23:00</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
