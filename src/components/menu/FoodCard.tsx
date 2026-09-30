import { Heart, Plus, Eye, Star, Flame, Leaf, Clock } from 'lucide-react'
import type { MenuItem } from '@/types'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/utils/format'

interface FoodCardProps {
  item: MenuItem
  onQuickView: (item: MenuItem) => void
}

export default function FoodCard({ item, onQuickView }: FoodCardProps) {
  const { addItem, favorites, toggleFavorite } = useCart()
  const isFav = favorites.includes(item.id)

  const handleAdd = () => {
    addItem(item, 1)
  }

  return (
    <div className="card group hover:shadow-elevated hover:-translate-y-1 relative">
      {/* Image */}
    <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.nameAr}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {item.discountPercentage && (
            <span className="badge bg-error-500 text-white shadow-soft">
              -{item.discountPercentage}%
            </span>
          )}
          {item.isNew && (
            <span className="badge bg-accent-500 text-white shadow-soft">جديد</span>
          )}
          {item.isSpicy && (
            <span className="badge bg-error-50 text-error-600 shadow-soft">
              <Flame className="w-3 h-3" /> حار
            </span>
          )}
          {item.isVegetarian && (
            <span className="badge bg-success-50 text-success-600 shadow-soft">
              <Leaf className="w-3 h-3" /> نباتي
            </span>
          )}
        </div>

        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(item.id)}
          className="absolute top-3 left-3 w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="المفضلة"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'fill-error-500 text-error-500' : 'text-secondary-700'}`}
          />
        </button>

        {/* Quick View */}
        <button
          onClick={() => onQuickView(item)}
          className="absolute bottom-3 left-3 w-9 h-9 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
          aria-label="عرض سريع"
        >
          <Eye className="w-4 h-4 text-secondary-800" />
        </button>

        {/* Unavailable overlay */}
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">غير متوفر</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-base text-secondary-900 leading-tight">{item.nameAr}</h3>
          {item.popular && (
            <span className="badge bg-accent-50 text-accent-700 shrink-0">
              <Star className="w-3 h-3 fill-accent-500 text-accent-500" /> شائع
            </span>
          )}
        </div>

        <p className="text-sm text-muted line-clamp-2 leading-relaxed">{item.description}</p>

        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {item.preparationTime} د
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-accent-400 text-accent-400" /> {item.rating}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-primary-600">{formatPrice(item.price)}</span>
            {item.oldPrice && (
              <span className="text-sm text-muted line-through">{formatPrice(item.oldPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            disabled={!item.available}
            className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center hover:bg-primary-600 active:scale-90 transition-all shadow-soft disabled:opacity-40"
            aria-label="أضف للسلة"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
