import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ShoppingCart, Heart, RefreshCw } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { formatPrice } from '@/utils/format'
import { productService } from '@/services/productService'
import useCartStore from '@/store/cartStore'
import useAuthStore from '@/store/authStore'
import useWishlistStore from '@/store/wishlistStore'
import useToastStore from '@/store/toastStore'
import useCategoryStore from '@/store/categoryStore'
import clsx from 'clsx'
import ReviewSection from './components/ReviewSection'
import ImageGallery from './components/ImageGallery'
import ProductSpecs from './components/ProductSpecs'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [recommendations, setRecommendations] = useState([])
  const [recLoading, setRecLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewStats, setReviewStats] = useState({ avg: 0, count: 0 })
  const { addItem } = useCartStore()
  const { user } = useAuthStore()
  const { isWishlisted, toggle: toggleWishlist } = useWishlistStore()
  const { add: toast } = useToastStore()
  const navigate = useNavigate()

  // Lấy danh mục từ store để build breadcrumb
  const tree = useCategoryStore((s) => s.tree)
  const allCats = Array.isArray(tree) ? tree.flatMap(p => [p, ...(p.children ?? [])]) : []
  const catById = Object.fromEntries(allCats.map(c => [c.pk_category_id, c]))

  useEffect(() => {
    setLoading(true)
    setError(null)
    productService.getDetail(id)
      .then((data) => {
        const product = data?.pk_product_id ? data : data?.data ?? data
        setProduct(product)
        setSelectedVariant(product?.variants?.[0] || null)
      })
      .catch((err) => setError(err?.message || 'Không thể tải sản phẩm'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!product) return
    setRecLoading(true)
    productService
      .getRecommendations({ user_id: user?.pk_user_id, product_id: product.pk_product_id, limit: 6 })
      .then((data) => setRecommendations(data?.items || []))
      .catch(() => {})
      .finally(() => setRecLoading(false))
  }, [product, user])

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        {/* Image gallery skeleton */}
        <div className="space-y-3">
          <div className="aspect-square bg-stone-200 rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 bg-stone-200 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Info skeleton */}
        <div className="space-y-4">
          <div className="h-3 bg-stone-200 rounded w-1/4" />
          <div className="h-7 bg-stone-200 rounded w-3/4" />
          <div className="h-7 bg-stone-200 rounded w-1/2" />
          <div className="h-5 bg-stone-200 rounded w-1/3" />
          <div className="h-10 bg-stone-200 rounded w-1/2" />
          <div className="flex gap-2 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-stone-200 rounded-lg" />
            ))}
          </div>
          <div className="flex gap-2 pt-4">
            <div className="h-12 bg-stone-200 rounded-lg flex-1" />
            <div className="h-12 w-12 bg-stone-200 rounded-lg" />
          </div>
        </div>
      </div>
      {/* Description skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-2">
          <div className="h-5 bg-stone-200 rounded w-1/4 mb-3" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 bg-stone-200 rounded" style={{ width: `${85 - i * 8}%` }} />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-5 bg-stone-200 rounded w-1/3 mb-3" />
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 bg-stone-200 rounded w-full" />
          ))}
        </div>
      </div>
    </div>
  )
  if (!product) return <div className="max-w-7xl mx-auto px-4 py-10 text-center text-stone-400">{error || 'Không tìm thấy sản phẩm.'}</div>

  const effectivePrice = selectedVariant
    ? (selectedVariant.sale_price ?? selectedVariant.price)
    : (product.sale_price ?? product.price)

  const originalPrice = selectedVariant ? selectedVariant.price : product.price
  const inStock = selectedVariant ? selectedVariant.stock > 0 : product.stock > 0

  const handleAddToCart = () => {
    if (!user) { navigate('/login'); return }
    addItem(product, selectedVariant, quantity)
    toast(`Đã thêm "${product.name}" vào giỏ hàng`)
  }

  const handleWishlist = () => {
    if (!user) { navigate('/login'); return }
    toggleWishlist(product)
    toast(wishlisted ? 'Đã bỏ khỏi yêu thích' : `Đã thêm vào yêu thích`, wishlisted ? 'info' : 'success')
  }

  const wishlisted = product ? isWishlisted(product.pk_product_id) : false

  const cat = catById[product.fk_category_id]
  const parentCat = cat?.fk_parent_id ? catById[cat.fk_parent_id] : null
  const breadcrumbItems = [
    { label: 'Trang chủ', to: '/' },
    ...(parentCat ? [{ label: parentCat.name, to: `/category/${parentCat.slug}` }] : []),
    ...(cat ? [{ label: cat.name, to: `/category/${cat.slug}` }] : []),
    { label: product.name },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      {/* Main product section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <ImageGallery images={product.images} />

        <div>
          {product.brand && <p className="text-sm text-stone-400 mb-1">{product.brand}</p>}
          <h1 className="text-2xl font-bold text-stone-800 mb-2">{product.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={reviewStats.avg || product.avg_rating || 0} showValue />
            <span className="text-sm text-stone-400">({reviewStats.count || product.review_count || 0} đánh giá)</span>
            {product.is_consumable === 1 && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Sản phẩm tiêu hao</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-5">
            <span className="text-3xl font-bold text-emerald-600">{formatPrice(effectivePrice)}</span>
            {effectivePrice < originalPrice && (
              <span className="text-lg text-stone-400 line-through">{formatPrice(originalPrice)}</span>
            )}
          </div>

          {/* Variants */}
          {product.variants?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-stone-700 mb-2">Phân loại:</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.pk_variant_id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.stock === 0}
                    className={`px-3 py-1.5 rounded-lg border text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.pk_variant_id === v.pk_variant_id
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                        : 'border-stone-200 hover:border-emerald-300'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <p className="text-sm font-medium text-stone-700">Số lượng:</p>
            <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-stone-50 text-stone-600"
              >−</button>
              <span className="px-4 py-2 text-sm font-medium min-w-[40px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-stone-50 text-stone-600"
              >+</button>
            </div>
            <span className="text-sm text-stone-400">
              {inStock ? `Còn hàng` : 'Hết hàng'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              className="btn-primary flex items-center gap-2 flex-1 justify-center py-3"
            >
              <ShoppingCart size={18} />
              Thêm vào giỏ hàng
            </button>
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
              className={clsx(
                'btn-outline p-3 transition-colors',
                wishlisted && 'border-red-400 text-red-500 hover:bg-red-50'
              )}
            >
              <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Mô tả sản phẩm</h2>
          <div className="text-sm text-stone-600 leading-relaxed whitespace-pre-line card p-5">
            {product.description}
          </div>
        </div>
        {product.specs?.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Thông số kỹ thuật</h2>
            <ProductSpecs specs={product.specs} />
          </div>
        )}
      </div>

      {/* Reviews */}
      <ReviewSection
        productId={product.pk_product_id}
        onStatsLoad={setReviewStats}
        productAvgRating={product.avg_rating}
        productReviewCount={product.review_count}
      />

      {/* Recommendations */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Sản phẩm liên quan</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {recLoading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : recommendations.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
          }
        </div>
      </section>
    </div>
  )
}
