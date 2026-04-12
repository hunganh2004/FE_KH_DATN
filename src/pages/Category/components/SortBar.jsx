const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'trending', label: 'Bán chạy' },
]

export default function SortBar({ sort, total, onSortChange }) {
  return (
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
  )
}
