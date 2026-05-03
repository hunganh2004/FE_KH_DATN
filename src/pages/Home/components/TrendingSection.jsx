import { useEffect, useState } from 'react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import { productService } from '@/services/productService'

export default function TrendingSection() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productService
      .getList({ sort: 'created_at', order: 'DESC', limit: 8 })
      .then((res) => setProducts(res?.items ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">🆕 Sản phẩm mới nhất</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
        }
      </div>
    </section>
  )
}
