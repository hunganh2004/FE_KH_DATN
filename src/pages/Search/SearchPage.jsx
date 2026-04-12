import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Pagination from '@/components/ui/Pagination'
import SortBar from '@/pages/Category/components/SortBar'
import { productService } from '@/services/productService'

const PET_TYPE_NAMES = {
  '1': 'Chó', '2': 'Mèo', '3': 'Cá', '4': 'Chim', '5': 'Thỏ',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)

  const q = searchParams.get('q') || ''
  const petType = searchParams.get('pet_type') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    setLoading(true)
    productService.search({ q, pet_type: petType, sort, page, limit: 20 })
      .then((data) => {
        setProducts(data?.items || [])
        setMeta({ total: data?.total || 0, totalPages: data?.totalPages || 1 })
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [q, petType, sort, page])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  const getTitle = () => {
    if (q) return `Kết quả tìm kiếm: "${q}"`
    if (petType) return `Sản phẩm dành cho ${PET_TYPE_NAMES[petType] || 'thú cưng'}`
    return 'Tất cả sản phẩm'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl font-bold text-stone-800">{getTitle()}</h1>
        {petType && (
          <span className="text-2xl">{['🐶','🐱','🐟','🐦','🐰'][Number(petType) - 1]}</span>
        )}
      </div>

      <SortBar sort={sort} total={meta.total} onSortChange={(v) => updateParam('sort', v)} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
            ? products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
            : !loading && <p className="col-span-full text-center text-stone-400 py-16">Không tìm thấy sản phẩm nào.</p>
        }
      </div>

      <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={(p) => updateParam('page', p)} />
    </div>
  )
}
