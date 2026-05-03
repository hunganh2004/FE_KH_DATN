import { useState, useEffect } from 'react'
import StarRating from '@/components/ui/StarRating'
import { formatDateTime } from '@/utils/format'
import { productService } from '@/services/productService'
import Pagination from '@/components/ui/Pagination'

export default function ReviewSection({ productId, onStatsLoad, productAvgRating, productReviewCount }) {
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [avgRating, setAvgRating] = useState(0)
  const [ratingDist, setRatingDist] = useState({}) // { 5: 10, 4: 5, ... }
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!productId) return
    setLoading(true)
    productService.getReviews(productId, { limit: 10, page })
      .then((data) => {
        const items = data?.data ?? []
        const pagination = data?.pagination
        setReviews(items)
        setTotal(pagination?.total ?? 0)
        setTotalPages(pagination?.totalPages ?? 1)
        if (onStatsLoad && page === 1) {
          const ratings = items.filter(r => r.rating != null).map(r => r.rating)
          // Ưu tiên avg_rating từ product object nếu có
          const avg = productAvgRating ?? (ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0)
          const rounded = Math.round(avg * 10) / 10
          setAvgRating(rounded)
          const dist = {}
          ratings.forEach(r => { dist[r] = (dist[r] || 0) + 1 })
          setRatingDist(dist)
          onStatsLoad({ avg: rounded, count: productReviewCount ?? pagination?.total ?? ratings.length })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId, page])

  if (loading) return (
    <section>
      <div className="h-6 bg-stone-200 rounded w-48 mb-4 animate-pulse" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="card p-4 animate-pulse">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-stone-200" />
              <div className="space-y-1">
                <div className="h-3 bg-stone-200 rounded w-24" />
                <div className="h-3 bg-stone-200 rounded w-16" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-stone-200 rounded w-full" />
              <div className="h-3 bg-stone-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">
        Đánh giá sản phẩm {total > 0 && <span className="text-stone-400 font-normal text-base">({total})</span>}
      </h2>
      {reviews.length === 0 ? (
        <p className="text-stone-400 text-sm">Chưa có đánh giá nào.</p>
      ) : (
        <>
          {/* Rating summary */}
          {page === 1 && avgRating > 0 && (
            <div className="flex items-center gap-6 p-4 bg-stone-50 rounded-xl mb-4">
              <div className="text-center shrink-0">
                <p className="text-4xl font-bold text-stone-800">{avgRating}</p>
                <StarRating rating={avgRating} size={14} />
                <p className="text-xs text-stone-400 mt-1">{total} đánh giá</p>
              </div>
              <div className="flex-1 space-y-1">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratingDist[star] || 0
                  const pct = total > 0 ? Math.round((count / reviews.filter(r => r.rating != null).length) * 100) : 0
                  return (
                    <div key={star} className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="w-3 text-right">{star}</span>
                      <span className="text-amber-400">★</span>
                      <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-right">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.pk_review_id} className="card p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                    {review.user?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{review.user?.full_name}</p>
                    <StarRating rating={review.rating} size={12} />
                  </div>
                </div>
                <span className="text-xs text-stone-400">{formatDateTime(review.created_at)}</span>
              </div>
              <p className="text-sm text-stone-700">{review.comment}</p>

              {/* Replies */}
              {review.replies?.map((reply) => (
                <div key={reply.pk_review_id} className="mt-3 ml-6 pl-3 border-l-2 border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-stone-500">{reply.user?.full_name}</p>
                    <span className="text-xs text-stone-400">{formatDateTime(reply.created_at)}</span>
                  </div>
                  <p className="text-sm text-stone-600">{reply.comment}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  )
}
