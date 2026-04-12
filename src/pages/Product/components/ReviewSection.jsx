import { useState, useEffect } from 'react'
import StarRating from '@/components/ui/StarRating'
import { formatDateTime } from '@/utils/format'
import { mockReviewService } from '@/mocks/mockApi'

export default function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockReviewService.getByProduct(productId)
      .then((data) => setReviews(data?.items || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [productId])

  if (loading) return null

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">Đánh giá sản phẩm</h2>
      {reviews.length === 0 ? (
        <p className="text-stone-400 text-sm">Chưa có đánh giá nào.</p>
      ) : (
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
                  <p className="text-xs font-medium text-stone-500 mb-1">{reply.user?.full_name}</p>
                  <p className="text-sm text-stone-600">{reply.comment}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
