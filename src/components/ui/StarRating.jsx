import { Star } from 'lucide-react'

export default function StarRating({ rating = 0, max = 5, size = 16, showValue = false }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300 fill-stone-300'}
        />
      ))}
      {showValue && <span className="text-sm text-stone-500 ml-1">{rating.toFixed(1)}</span>}
    </div>
  )
}
