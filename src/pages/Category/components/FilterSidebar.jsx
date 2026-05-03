import useCategoryStore from '@/store/categoryStore'

const PRICE_RANGES = [
  { label: 'Dưới 100.000đ',      min: '0',      max: '100000' },
  { label: '100.000 - 300.000đ', min: '100000', max: '300000' },
  { label: '300.000 - 500.000đ', min: '300000', max: '500000' },
  { label: 'Trên 500.000đ',      min: '500000', max: '99999999' },
]

/**
 * Props:
 *   petType, priceMin, priceMax, inStock, subCategory
 *   onChange(key, value), onPriceChange(min, max), onReset
 *   subCategories — mảng danh mục con (chỉ dùng ở CategoryPage cha)
 */
export default function FilterSidebar({
  petType, priceMin, priceMax, inStock, subCategory,
  onChange, onPriceChange, onReset,
  subCategories = [],
}) {
  const petTypes = useCategoryStore((s) => s.petTypes)
  const isRangeActive = (r) => r.min === priceMin && r.max === priceMax

  const hasFilter = petType || priceMin || priceMax || inStock || subCategory

  return (
    <div className="space-y-6">

      {/* Danh mục con — chỉ hiện khi có */}
      {subCategories.length > 0 && (
        <div>
          <h3 className="font-semibold text-sm text-stone-700 mb-3">Danh mục</h3>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onChange('sub_category', '')}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                !subCategory ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Tất cả
            </button>
            {subCategories.map((cat) => (
              <button
                key={cat.pk_category_id}
                type="button"
                onClick={() => onChange('sub_category', cat.slug === subCategory ? '' : cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                  subCategory === cat.slug
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{cat.name}</span>
                {subCategory === cat.slug && <span className="text-emerald-500 text-xs">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loại thú cưng */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Loại thú cưng</h3>
        <div className="space-y-1">
          {petTypes.map((pt) => {
            const id = String(pt.pk_pet_type_id)
            const active = petType === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange('pet_type', active ? '' : id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  active ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{pt.name}</span>
                {active && <span className="text-emerald-500 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Khoảng giá */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Khoảng giá</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = isRangeActive(range)
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => active ? onPriceChange('', '') : onPriceChange(range.min, range.max)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  active ? 'bg-emerald-100 text-emerald-700 font-medium' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{range.label}</span>
                {active && <span className="text-emerald-500 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tình trạng hàng */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Tình trạng</h3>
        <button
          type="button"
          onClick={() => onChange('in_stock', inStock === 'true' ? '' : 'true')}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
            inStock === 'true'
              ? 'bg-emerald-100 text-emerald-700 font-medium'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Chỉ hiện còn hàng</span>
          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            inStock === 'true' ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'
          }`}>
            {inStock === 'true' && <span className="text-white text-[10px] font-bold">✓</span>}
          </div>
        </button>
      </div>

      {hasFilter && (
        <button
          type="button"
          onClick={onReset}
          className="w-full text-xs text-center text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
        >
          Xoá tất cả bộ lọc
        </button>
      )}
    </div>
  )
}
