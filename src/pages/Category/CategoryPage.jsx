import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Pagination from '@/components/ui/Pagination'
import FilterSidebar from './components/FilterSidebar'
import SortBar from './components/SortBar'
import { productService } from '@/services/productService'

const CATEGORY_NAMES = {
  'thuc-an':         'Thức ăn',
  'thuc-an-cho-cho': 'Thức ăn cho chó',
  'thuc-an-cho-meo': 'Thức ăn cho mèo',
  'phu-kien':        'Phụ kiện',
  'vong-co-day-dat': 'Vòng cổ & Dây dắt',
  'bat-mang-an':     'Bát & Máng ăn',
  'tui-ba-lo':       'Túi & Ba lô',
  'do-choi':         'Đồ chơi',
  'cham-soc':        'Vệ sinh & Chăm sóc',
  'thoi-trang':      'Thời trang',
  'chuong-nha':      'Chuồng & Nhà',
}

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const page = Number(searchParams.get('page') || 1)
  const sort = searchParams.get('sort') || 'newest'
  const petType = searchParams.get('pet_type') || ''
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''

  useEffect(() => {
    setLoading(true)
    productService
      .getByCategory(slug, { page, sort, pet_type: petType, price_min: priceMin, price_max: priceMax, limit: 20 })
      .then((data) => {
        setProducts(data?.items || [])
        setMeta({ total: data?.total || 0, totalPages: data?.totalPages || 1 })
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug, page, sort, petType, priceMin, priceMax])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value); else next.delete(key)
    next.delete('page')
    setSearchParams(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-stone-800">
          {CATEGORY_NAMES[slug] || slug.replace(/-/g, ' ')}
        </h1>
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
              <FilterSidebar petType={petType} priceMin={priceMin} priceMax={priceMax} onChange={updateParam} />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <SortBar sort={sort} total={meta.total} onSortChange={(v) => updateParam('sort', v)} />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {loading
              ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
              : products.length > 0
                ? products.map((p) => <ProductCard key={p.pk_product_id} product={p} />)
                : <p className="col-span-full text-center text-stone-400 py-16">Không tìm thấy sản phẩm nào.</p>
            }
          </div>
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={(p) => updateParam('page', p)}
          />
        </div>
      </div>
    </div>
  )
}
