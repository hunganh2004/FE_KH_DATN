import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'

const ICONS = {
  success: <CheckCircle size={18} className="text-emerald-500 shrink-0" />,
  error:   <XCircle size={18} className="text-red-500 shrink-0" />,
  info:    <Info size={18} className="text-blue-500 shrink-0" />,
}

export function Toast({ id, type = 'success', message, onRemove }) {
  useEffect(() => {
    const t = setTimeout(() => onRemove(id), 3000)
    return () => clearTimeout(t)
  }, [id, onRemove])

  return (
    <div className={clsx(
      'flex items-center gap-3 bg-white border rounded-xl shadow-lg px-4 py-3 min-w-[260px] max-w-sm',
      'animate-in slide-in-from-right-4 duration-200',
      type === 'success' && 'border-emerald-200',
      type === 'error'   && 'border-red-200',
      type === 'info'    && 'border-blue-200',
    )}>
      {ICONS[type]}
      <p className="text-sm text-stone-700 flex-1">{message}</p>
      <button onClick={() => onRemove(id)} className="text-stone-300 hover:text-stone-500 shrink-0">
        <X size={14} />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  )
}
