import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, LogIn } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { productService } from '@/services/productService'

export default function RecommendedSection({ userId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(!!userId)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    productService
      .getRecommendations({ user_id: userId, context: 'homepage', limit: 8 })
      .then((data) => setProducts(data?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [userId])

  if (!loading && userId && products.length === 0) return null

  return (
    <section className="bg-gradient-to-br from-emerald-50 to-stone-50 border border-emerald-100 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-stone-800">Dành riêng cho bạn</h2>
            <p className="text-xs text-stone-400">Được cá nhân hóa dựa trên lịch sử của bạn</p>
          </div>
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
          ✨ Gợi ý bởi AI
        </span>
      </div>

      {/* Guest CTA */}
      {!userId ? (
        <div className="relative rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50 overflow-hidden">
          {/* Blurred product preview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 blur-sm pointer-events-none select-none opacity-50">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-emerald-100 to-stone-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-stone-200 rounded w-2/3" />
                  <div className="h-4 bg-stone-200 rounded w-full" />
                  <div className="h-4 bg-emerald-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/70 backdrop-blur-[2px]">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Sparkles size={22} className="text-emerald-500" />
            </div>
            <div className="text-center px-4">
              <p className="font-semibold text-stone-800 mb-1">Gợi ý sản phẩm cá nhân hóa</p>
              <p className="text-sm text-stone-500">Đăng nhập để nhận gợi ý sản phẩm phù hợp với thú cưng của bạn.</p>
            </div>
            <Link to="/login" className="btn-primary flex items-center gap-2 px-6">
              <LogIn size={16} /> Đăng nhập ngay
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
          }
        </div>
      )}
    </section>
  )
}
