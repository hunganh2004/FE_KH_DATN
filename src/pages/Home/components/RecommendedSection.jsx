import { useEffect, useState } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { productService } from '@/services/productService'

export default function RecommendedSection({ userId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService
      .getRecommendations({ user_id: userId, context: 'homepage', limit: 8 })
      .then((data) => setProducts(data?.items || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [userId])

  if (!loading && products.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-stone-700">
          ✨ Dành riêng cho bạn
        </h2>
        <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">Gợi ý bởi AI</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
        }
      </div>
    </section>
  )
}
