import { Link, useNavigate } from 'react-router-dom'
import { Heart, ShoppingCart } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import useCartStore from '@/store/cartStore'
import useWishlistStore from '@/store/wishlistStore'
import useAuthStore from '@/store/authStore'
import useToastStore from '@/store/toastStore'
import clsx from 'clsx'

export default function ProductCard({ product, className }) {
  const { slug, name, price, sale_price, is_consumable, brand, stock } = product
  const image = product.primary_image || product.images?.[0]?.image_url || '/placeholder-product.png'
  const effectivePrice = sale_price ?? price
  const discountPercent = sale_price ? Math.round((1 - sale_price / price) * 100) : 0

  const { addItem } = useCartStore()
  const { isWishlisted, toggle } = useWishlistStore()
  const { user } = useAuthStore()
  const { add: toast } = useToastStore()
  const navigate = useNavigate()
  const wishlisted = isWishlisted(product.pk_product_id)

  const handleAddToCart = (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    addItem(product, null, 1)
    toast(`Đã thêm "${name}" vào giỏ hàng`)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    toggle(product)
    toast(wishlisted ? `Đã bỏ khỏi yêu thích` : `Đã thêm "${name}" vào yêu thích`, wishlisted ? 'info' : 'success')
  }

  return (
    <div className={clsx('card group hover:shadow-md transition-shadow duration-200 overflow-hidden', className)}>
      {/* Image */}
      <Link to={`/product/${slug}`} className="block relative overflow-hidden aspect-square bg-stone-50">
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {discountPercent > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          )}
          {is_consumable === 1 && (
            <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">Tiêu hao</span>
          )}
          {stock === 0 && (
            <span className="bg-stone-500 text-white text-xs px-1.5 py-0.5 rounded">Hết hàng</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          className={clsx(
            'absolute top-2 right-2 p-1.5 bg-white rounded-full shadow transition-all',
            'opacity-0 group-hover:opacity-100',
            wishlisted ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
          )}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
        >
          <Heart size={16} className={wishlisted ? 'fill-red-500' : ''} />
        </button>
      </Link>

      {/* Info */}
      <div className="p-3">
        {brand && <p className="text-xs text-stone-400 mb-0.5">{brand}</p>}
        <Link to={`/product/${slug}`}>
          <h3 className="text-sm font-medium text-stone-800 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
            {name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-emerald-600">{formatPrice(effectivePrice)}</span>
            {sale_price && (
              <span className="text-xs text-stone-400 line-through ml-1">{formatPrice(price)}</span>
            )}
          </div>
          <button
            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-colors disabled:opacity-40"
            disabled={stock === 0}
            aria-label="Thêm vào giỏ hàng"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
