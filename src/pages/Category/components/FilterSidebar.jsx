const PET_TYPES = [
  { id: '1', name: 'Chó' },
  { id: '2', name: 'Mèo' },
  { id: '3', name: 'Cá' },
  { id: '4', name: 'Chim' },
  { id: '5', name: 'Thỏ' },
]

const PRICE_RANGES = [
  { label: 'Dưới 100.000đ',       min: '0',      max: '100000' },
  { label: '100.000 - 300.000đ',  min: '100000', max: '300000' },
  { label: '300.000 - 500.000đ',  min: '300000', max: '500000' },
  { label: 'Trên 500.000đ',       min: '500000', max: '99999999' },
]

export default function FilterSidebar({ petType, priceMin, priceMax, onChange, onPriceChange, onReset }) {
  const isRangeActive = (range) => range.min === priceMin && range.max === priceMax

  const handlePetType = (id) => {
    onChange('pet_type', petType === id ? '' : id)
  }

  const handlePriceRange = (range) => {
    if (isRangeActive(range)) {
      onPriceChange('', '')
    } else {
      onPriceChange(range.min, range.max)
    }
  }

  const handleReset = () => {
    if (onReset) onReset()
  }

  const hasFilter = petType || priceMin || priceMax

  return (
    <div className="space-y-6">
      {/* Pet type */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Loại thú cưng</h3>
        <div className="space-y-1">
          {PET_TYPES.map((pt) => {
            const active = petType === pt.id
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => handlePetType(pt.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{pt.name}</span>
                {active && <span className="ml-auto text-emerald-500 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Khoảng giá</h3>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => {
            const active = isRangeActive(range)
            return (
              <button
                key={range.label}
                type="button"
                onClick={() => handlePriceRange(range)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-emerald-100 text-emerald-700 font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span>{range.label}</span>
                {active && <span className="text-emerald-500 text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Reset */}
      {hasFilter && (
        <button
          type="button"
          onClick={handleReset}
          className="w-full text-xs text-center text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 py-1.5 rounded-lg transition-colors"
        >
          Xoá tất cả bộ lọc
        </button>
      )}
    </div>
  )
}
