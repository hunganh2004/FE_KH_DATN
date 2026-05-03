import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import SkeletonCard from '@/components/ui/SkeletonCard'
import Pagination from '@/components/ui/Pagination'
import Breadcrumb from '@/components/ui/Breadcrumb'
import FilterSidebar from './components/FilterSidebar'
import SortBar from './components/SortBar'
import { productService } from '@/services/productService'
import useCategoryStore from '@/store/categoryStore'

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState({ total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [showFilter, setShowFilter] = useState(false)

  const tree = useCategoryStore((s) => s.tree)
  const allCats = Array.isArray(tree) ? tree.flatMap(p => [p, ...(p.children ?? [])]) : []
  const currentCat = allCats.find(c => c.slug === slug)
  const parentCat = currentCat?.fk_parent_id
    ? allCats.find(c => c.pk_category_id === currentCat.fk_parent_id)
    : null
  const catName = currentCat?.name || slug.replace(/-/g, ' ')

  const page = Number(searchParams.get('page') || 1)
  const sort = searchParams.get('sort') || 'newest'
  const petType = searchParams.get('pet_type') || ''
  const priceMin = searchParams.get('price_min') || ''
  const priceMax = searchParams.get('price_max') || ''
  const inStock = searchParams.get('in_stock') || ''
  const subCategory = searchParams.get('sub_category') || ''

  // Danh mục con của category hiện tại (nếu là cha)
  const subCategories = currentCat ? (currentCat.children ?? []) : []
  // Nếu đang lọc theo sub_category, dùng slug đó thay slug hiện tại
  const effectiveSlug = subCategory || slug

  useEffect(() => {
    setLoading(true)
    productService
      .getByCategory(effectiveSlug, { page, sort, pet_type: petType, price_min: priceMin, price_max: priceMax, in_stock: inStock, limit: 20 })
      .then((data) => {
        setProducts(data?.items || [])
        setMeta({ total: data?.total || 0, totalPages: data?.totalPages || 1 })
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [slug, page, sort, petType, priceMin, priceMax, inStock, subCategory])

  const resetFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.delete('pet_type')
      next.delete('price_min')
      next.delete('price_max')
      next.delete('in_stock')
      next.delete('sub_category')
      next.delete('page')
      return next
    })
  }

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

  const breadcrumbItems = [
    { label: 'Trang chủ', to: '/' },
    ...(parentCat ? [{ label: parentCat.name, to: `/category/${parentCat.slug}` }] : []),
    { label: catName },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb items={breadcrumbItems} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-stone-800">
          {catName}
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
            inStock={inStock}
            subCategory={subCategory}
            subCategories={subCategories}
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
              <FilterSidebar petType={petType} priceMin={priceMin} priceMax={priceMax} inStock={inStock} subCategory={subCategory} subCategories={subCategories} onChange={updateParam} onPriceChange={updatePrice} onReset={resetFilters} />
            </div>
          </div>
        )}

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <SortBar
            sort={sort}
            total={meta.total}
            onSortChange={(v) => updateParam('sort', v)}
            petType={petType}
            priceMin={priceMin}
            priceMax={priceMax}
            inStock={inStock}
            subCategory={subCategory}
            onFilterRemove={(key) => {
              if (key === 'price') { updateParam('price_min', ''); updateParam('price_max', '') }
              else updateParam(key, '')
            }}
          />
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
