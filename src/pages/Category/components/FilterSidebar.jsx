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

export default function FilterSidebar({ petType, priceMin, priceMax, onChange }) {
  const isRangeActive = (range) =>
    range.min === priceMin && range.max === priceMax

  const handlePriceRange = (range) => {
    if (isRangeActive(range)) {
      // bỏ chọn — xoá cả 2 cùng lúc bằng cách set params trực tiếp
      onChange('price_min', '')
      onChange('price_max', '')
    } else {
      onChange('price_min', range.min)
      onChange('price_max', range.max)
    }
  }

  const hasFilter = petType || priceMin || priceMax

  return (
    <div className="space-y-6">
      {/* Pet type */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Loại thú cưng</h3>
        <div className="space-y-2">
          {PET_TYPES.map((pt) => (
            <label key={pt.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="pet_type"
                value={pt.id}
                checked={petType === pt.id}
                onChange={() => onChange('pet_type', petType === pt.id ? '' : pt.id)}
                className="accent-emerald-500"
              />
              <span className="text-sm text-stone-600 group-hover:text-stone-800">{pt.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-sm text-stone-700 mb-3">Khoảng giá</h3>
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => handlePriceRange(range)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                isRangeActive(range)
                  ? 'bg-emerald-100 text-emerald-700 font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {hasFilter && (
        <button
          type="button"
          onClick={() => {
            onChange('pet_type', '')
            onChange('price_min', '')
            onChange('price_max', '')
          }}
          className="text-xs text-red-500 hover:text-red-600 hover:underline"
        >
          Xoá bộ lọc
        </button>
      )}
    </div>
  )
}
