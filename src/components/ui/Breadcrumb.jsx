import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

/**
 * @param {Array<{ label: string, to?: string }>} items
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb" className="flex items-center gap-1 text-sm text-stone-400 mb-4 flex-wrap">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={13} className="shrink-0" />}
            {isLast || !item.to
              ? <span className="text-stone-600 font-medium truncate max-w-[200px]">{item.label}</span>
              : <Link to={item.to} className="hover:text-emerald-600 transition-colors truncate max-w-[200px]">{item.label}</Link>
            }
          </span>
        )
      })}
    </nav>
  )
}
