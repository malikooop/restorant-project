import { Routes, Route } from 'react-router-dom'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/cart/CartDrawer'
import HomePage from '@/pages/HomePage'
import MenuPage from '@/pages/MenuPage'
import PromotionsPage from '@/pages/PromotionsPage'
import AboutPage from '@/pages/AboutPage'
import ContactPage from '@/pages/ContactPage'
import CheckoutPage from '@/pages/CheckoutPage'
import AdminPage from '@/pages/AdminPage'

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/promotions" element={<PromotionsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  )
}

export default App
