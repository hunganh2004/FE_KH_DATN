import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Pagination from '@/components/ui/Pagination'
import SortBar from '@/pages/Category/components/SortBar'
import FilterSidebar from '@/pages/Category/components/FilterSidebar'
import { productService } from '@/services/productService'

const PET_TYPE_NAMES = {
  '1': 'Chó', '2': 'Mèo', '3': 'Cá', '4': 'Chim', '5': 'Thỏ',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  const q = searchParams.get('q') || ''
  const petType = searchParams.get('pet_type') || ''
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''
  const sort = searchParams.get('sort') || 'newest'
  const page = Number(searchParams.get('page') || 1)

  useEffect(() => {
    setLoading(true)
    productService.search({ q, pet_type: petType, sort, page, price_min: priceMin, price_max: priceMax, limit: 20 })
      .then((data) => {
        setProducts(data?.items || [])
        setMeta({ total: data?.total || 0, totalPages: data?.totalPages || 1 })
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [q, petType, priceMin, priceMax, sort, page])

  const updateParam = (key, value) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value) next.set(key, value); else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  const updatePrice = (min, max) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (min) next.set('price_min', min); else next.delete('price_min')
      if (max) next.set('price_max', max); else next.delete('price_max')
      next.delete('page')
      return next
    })
  }

  const resetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('pet_type')
      next.delete('price_min')
      next.delete('price_max')
      next.delete('page')
      return next
    })
  }

  const getTitle = () => {
    if (q) return `Kết quả tìm kiếm: "${q}"`
    if (petType) return `Sản phẩm dành cho ${PET_TYPE_NAMES[petType] || 'thú cưng'}`
    return 'Tất cả sản phẩm'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-stone-800">{getTitle()}</h1>
          {petType && (
            <span className="text-2xl">{['🐶','🐱','🐟','🐦','🐰'][Number(petType) - 1]}</span>
          )}
        </div>
        <button
          className="flex items-center gap-2 text-sm text-stone-600 border border-stone-200 px-3 py-1.5 rounded-lg md:hidden"
          onClick={() => setShowFilter(true)}
        >
          <SlidersHorizontal size={16} /> Lọc
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - desktop */}
        <aside className="w-56 shrink-0 hidden md:block">
          <FilterSidebar
            petType={petType}
            priceMin={priceMin}
            priceMax={priceMax}
            onChange={updateParam}
            onPriceChange={updatePrice}
            onReset={resetFilters}
          />
        </aside>

        {/* Mobile filter drawer */}
        {showFilter && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilter(false)} />
            <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold">Bộ lọc</span>
                <button onClick={() => setShowFilter(false)}><X size={20} /></button>
              </div>
              <FilterSidebar petType={petType} priceMin={priceMin} priceMax={priceMax} onChange={updateParam} onPriceChange={updatePrice} onReset={resetFilters} />
            </div>
          </div>
        )}

        {/* Products */}
        <div className="flex-1 min-w-0">
          <SortBar
            sort={sort}
            total={meta.total}
            onSortChange={(v) => updateParam('sort', v)}
            petType={petType}
            priceMin={priceMin}
            priceMax={priceMax}
            onFilterRemove={(key) => {
              if (key === 'price') { updateParam('price_min', ''); updateParam('price_max', '') }
              else updateParam(key, '')
            }}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {loading
              ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
              : products.length > 0
                ? products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
                : !loading && <p className="col-span-full text-center text-stone-400 py-16">Không tìm thấy sản phẩm nào.</p>
            }
          </div>
          <Pagination currentPage={page} totalPages={meta.totalPages} onPageChange={(p) => updateParam('page', p)} />
        </div>
      </div>
    </div>
  )
}
