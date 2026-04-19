import { X } from 'lucide-react'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'trending', label: 'Bán chạy' },
]

const PET_TYPE_NAMES = { '1': 'Chó', '2': 'Mèo', '3': 'Cá', '4': 'Chim', '5': 'Thỏ' }

const PRICE_LABELS = {
  '0-100000': 'Dưới 100.000đ',
  '100000-300000': '100k - 300k',
  '300000-500000': '300k - 500k',
  '500000-99999999': 'Trên 500.000đ',
}

export default function SortBar({ sort, total, onSortChange, petType, priceMin, priceMax, onFilterRemove }) {
  const priceKey = priceMin && priceMax ? `${priceMin}-${priceMax}` : null
  const priceLabel = priceKey ? PRICE_LABELS[priceKey] : null

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-500">{total} sản phẩm</p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500 hidden sm:block">Sắp xếp:</span>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-sm border border-stone-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter tags */}
      {onFilterRemove && (petType || priceLabel) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-stone-400">Đang lọc:</span>
          {petType && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
              {PET_TYPE_NAMES[petType] || petType}
              <button onClick={() => onFilterRemove('pet_type')} className="hover:text-emerald-900">
                <X size={11} />
              </button>
            </span>
          )}
          {priceLabel && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-full">
              {priceLabel}
              <button onClick={() => onFilterRemove('price')} className="hover:text-emerald-900">
                <X size={11} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
