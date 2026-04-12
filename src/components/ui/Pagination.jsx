import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  const pages = []
  const delta = 2
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
      >
        <ChevronLeft size={16} />
      </button>

      {pages[0] > 1 && (
        <>
          <PageBtn page={1} current={currentPage} onClick={onPageChange} />
          {pages[0] > 2 && <span className="px-2 text-stone-400">...</span>}
        </>
      )}

      {pages.map(p => (
        <PageBtn key={p} page={p} current={currentPage} onClick={onPageChange} />
      ))}

      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && <span className="px-2 text-stone-400">...</span>}
          <PageBtn page={totalPages} current={currentPage} onClick={onPageChange} />
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-stone-200 disabled:opacity-40 hover:bg-stone-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

function PageBtn({ page, current, onClick }) {
  return (
    <button
      onClick={() => onClick(page)}
      className={clsx(
        'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
        page === current
          ? 'bg-emerald-500 text-white'
          : 'border border-stone-200 hover:bg-stone-50 text-stone-700'
      )}
    >
      {page}
    </button>
  )
}
