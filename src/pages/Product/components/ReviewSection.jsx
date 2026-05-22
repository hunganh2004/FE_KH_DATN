import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import StarRating from '@/components/ui/StarRating'
import { formatDateTime } from '@/utils/format'
import { productService } from '@/services/productService'
import Pagination from '@/components/ui/Pagination'
import useAuthStore from '@/store/authStore'

const LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']

function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Vui lòng chọn số sao.'); return }
    if (comment.trim().length < 10) { setError('Nhận xét phải có ít nhất 10 ký tự.'); return }
    setError('')
    setSubmitting(true)
    try {
      await productService.submitReview(productId, { rating, comment: comment.trim(), fk_parent_id: null })
      onSuccess()
    } catch (err) {
      const msg = err?.message || ''
      if (msg.includes('403') || err?.status === 403) {
        setError('Bạn cần mua và nhận sản phẩm này trước khi đánh giá.')
      } else {
        setError(msg || 'Gửi đánh giá thất bại, vui lòng thử lại.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-6 space-y-4">
      <p className="text-sm font-semibold text-stone-700">Viết đánh giá của bạn</p>

      {/* Stars */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => { setRating(star); setError('') }}
            className="transition-transform hover:scale-110"
          >
            <Star size={28}
              className={star <= (hovered || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-stone-300 fill-stone-300'}
            />
          </button>
        ))}
        {(hovered || rating) > 0 && (
          <span className="text-sm text-stone-500 ml-1">{LABELS[hovered || rating]}</span>
        )}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => { setComment(e.target.value); setError('') }}
        rows={3}
        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
        className="input-base resize-none"
      />

      {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-400">{comment.length} ký tự</span>
        <button type="submit" disabled={submitting} className="btn-primary text-sm py-1.5 px-4">
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </div>
    </form>
  )
}

export default function ReviewSection({ productId, onStatsLoad, productAvgRating, productReviewCount }) {
  const { user } = useAuthStore()
  const [reviews, setReviews] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [avgRating, setAvgRating] = useState(0)
  const [ratingDist, setRatingDist] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const fetchReviews = (p = page) => {
    if (!productId) return
    setLoading(true)
    productService.getReviews(productId, { limit: 10, page: p })
      .then((data) => {
        const items = data?.data ?? []
        const pagination = data?.pagination
        setReviews(items)
        setTotal(pagination?.total ?? 0)
        setTotalPages(pagination?.totalPages ?? 1)
        if (onStatsLoad && p === 1) {
          const ratings = items.filter(r => r.rating != null).map(r => r.rating)
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
  }

  useEffect(() => { fetchReviews(page) }, [productId, page])

  const handleReviewSuccess = () => {
    setSubmitted(true)
    setPage(1)
    fetchReviews(1)
  }

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

      {/* Form đánh giá */}
      {submitted ? (
        <div className="card p-4 mb-6 text-center text-sm text-emerald-600 bg-emerald-50 border border-emerald-200">
          🎉 Cảm ơn bạn đã đánh giá sản phẩm!
        </div>
      ) : user ? (
        <ReviewForm productId={productId} onSuccess={handleReviewSuccess} />
      ) : (
        <div className="card p-4 mb-6 text-sm text-stone-500 text-center">
          <Link to="/login" className="text-emerald-600 font-medium hover:underline">Đăng nhập</Link> để viết đánh giá
        </div>
      )}

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
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm overflow-hidden">
                      {review.user?.avatar_url
                        ? <img src={review.user.avatar_url} alt={review.user.full_name} className="w-full h-full object-cover" />
                        : (review.user?.full_name?.[0] || '?')
                      }
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
                {review.replies?.map((reply) => {
                  const initial = reply.user?.full_name?.[0]?.toUpperCase() || '?'
                  return (
                    <div key={reply.pk_review_id} className="mt-3 ml-6 pl-3 border-l-2 border-emerald-100">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden bg-emerald-500 text-white">
                          {reply.user?.avatar_url
                            ? <img src={reply.user.avatar_url} alt={reply.user.full_name} className="w-full h-full object-cover" />
                            : initial
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-0.5">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-semibold text-emerald-700">
                                {reply.user?.full_name || 'Ẩn danh'}
                              </p>
                              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full">Shop</span>
                            </div>
                            <span className="text-xs text-stone-400 shrink-0">{formatDateTime(reply.created_at)}</span>
                          </div>
                          <p className="text-sm text-stone-600">{reply.comment}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </section>
  )
}
