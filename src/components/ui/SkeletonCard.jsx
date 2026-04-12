export default function SkeletonCard() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-stone-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-full" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-5 bg-stone-200 rounded w-1/2 mt-2" />
      </div>
    </div>
  )
}
