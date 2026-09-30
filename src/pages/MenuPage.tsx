import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, X, Star, Clock, Flame, Leaf } from 'lucide-react'
import { menuItems, categories } from '@/data/menu'
import type { MenuItem } from '@/types'
import FoodCard from '@/components/menu/FoodCard'
import QuickView from '@/components/menu/QuickView'

type SortOption = 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [onlyVeg, setOnlyVeg] = useState(false)
  const [onlySpicy, setOnlySpicy] = useState(false)
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [quickViewItem, setQuickViewItem] = useState<MenuItem | null>(null)

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) {
      const found = categories.find((c) => c.slug === cat)
      if (found) setActiveCategory(found.id)
    }
  }, [searchParams])

  const handleCategoryClick = (catId: string) => {
    setActiveCategory(catId)
    setSearchParams(catId === 'all' ? {} : { category: categories.find((c) => c.id === catId)?.slug || '' })
  }

  const filtered = useMemo(() => {
    let result = [...menuItems]

    if (activeCategory !== 'all') {
      result = result.filter((i) => i.categoryId === activeCategory)
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (i) => i.nameAr.includes(q) || i.name.toLowerCase().includes(q) || i.description.includes(q),
      )
    }

    if (onlyVeg) result = result.filter((i) => i.isVegetarian)
    if (onlySpicy) result = result.filter((i) => i.isSpicy)
    if (onlyOffers) result = result.filter((i) => i.discountPercentage && i.discountPercentage > 0)

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
    }

    return result
  }, [activeCategory, search, sortBy, onlyVeg, onlySpicy, onlyOffers])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-secondary-900 text-white py-12 lg:py-16">
        <div className="container-page">
          <h1 className="font-display font-bold text-4xl lg:text-5xl">قائمة الطعام</h1>
          <p className="text-secondary-300 mt-3 text-lg">اكتشف أشهى الأطباق المحضّرة بعناية</p>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث عن طبق..."
              className="input pr-12"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary-700">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input w-auto cursor-pointer"
            >
              <option value="popular">الأكثر شعبية</option>
              <option value="price-asc">السعر: من الأقل</option>
              <option value="price-desc">السعر: من الأعلى</option>
              <option value="rating">الأعلى تقييماً</option>
              <option value="newest">الأحدث</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn btn-sm border-2 ${showFilters ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-secondary-200'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> تصفية
            </button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-6 animate-slide-up">
            <button
              onClick={() => setOnlyVeg(!onlyVeg)}
              className={`badge px-3 py-2 text-sm border-2 transition-all ${onlyVeg ? 'border-success-500 bg-success-50 text-success-700' : 'border-secondary-200 text-secondary-700'}`}
            >
              <Leaf className="w-4 h-4" /> نباتي
            </button>
            <button
              onClick={() => setOnlySpicy(!onlySpicy)}
              className={`badge px-3 py-2 text-sm border-2 transition-all ${onlySpicy ? 'border-error-500 bg-error-50 text-error-600' : 'border-secondary-200 text-secondary-700'}`}
            >
              <Flame className="w-4 h-4" /> حار
            </button>
            <button
              onClick={() => setOnlyOffers(!onlyOffers)}
              className={`badge px-3 py-2 text-sm border-2 transition-all ${onlyOffers ? 'border-accent-500 bg-accent-50 text-accent-700' : 'border-secondary-200 text-secondary-700'}`}
            >
              <Star className="w-4 h-4" /> عروض
            </button>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
          <button
            onClick={() => handleCategoryClick('all')}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              activeCategory === 'all' ? 'bg-primary-500 text-white shadow-soft' : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
            }`}
          >
            الكل
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat.id ? 'bg-primary-500 text-white shadow-soft' : 'bg-secondary-50 text-secondary-700 hover:bg-secondary-100'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.nameAr}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted mb-4">{filtered.length} طبق متاح</p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-20 h-20 rounded-full bg-secondary-50 flex items-center justify-center">
              <Search className="w-10 h-10 text-secondary-300" />
            </div>
            <p className="text-secondary-500 font-medium">لا توجد نتائج</p>
            <p className="text-muted text-sm">جرّب كلمات بحث أو فئات أخرى</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((item) => (
              <FoodCard key={item.id} item={item} onQuickView={setQuickViewItem} />
            ))}
          </div>
        )}
      </div>

      <QuickView item={quickViewItem} onClose={() => setQuickViewItem(null)} />
    </div>
  )
}
