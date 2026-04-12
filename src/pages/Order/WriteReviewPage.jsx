import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Star, ArrowLeft } from 'lucide-react'
import { mockOrderService, mockReviewService } from '@/mocks/mockApi'

export default function WriteReviewPage() {
  const { orderId, productId } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    mockOrderService.getDetail(orderId).then(order => {
      const item = order.items?.find(i => String(i.fk_product_id || i.pk_order_item_id) === productId)
        || order.items?.[0]
      setProduct(item)
    }).catch(() => {})
  }, [orderId, productId])

  const LABELS = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Vui lòng chọn số sao đánh giá.'); return }
    if (comment.trim().length < 10) { setError('Nhận xét phải có ít nhất 10 ký tự.'); return }
    setError('')
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 600))
    setSubmitting(false)
    setDone(true)
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Cảm ơn bạn đã đánh giá!</h2>
        <p className="text-stone-500 mb-6">Đánh giá của bạn giúp ích rất nhiều cho người mua khác.</p>
        <div className="flex gap-3 justify-center">
          <Link to={`/order/${orderId}`} className="btn-outline text-sm">Xem đơn hàng</Link>
          <Link to="/" className="btn-primary text-sm">Tiếp tục mua sắm</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link to={`/order/${orderId}`} className="flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-600 mb-6">
        <ArrowLeft size={16} /> Quay lại đơn hàng
      </Link>

      <h1 className="text-xl font-bold mb-6">Viết đánh giá sản phẩm</h1>

      {product && (
        <div className="card p-4 flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-lg bg-stone-100 shrink-0 flex items-center justify-center text-2xl">🐾</div>
          <p className="text-sm font-medium text-stone-800 line-clamp-2">{product.product_name}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Star rating */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-3">Đánh giá của bạn *</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => { setRating(star); setError('') }}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={36}
                  className={
                    star <= (hovered || rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-stone-300 fill-stone-300'
                  }
                />
              </button>
            ))}
            {(hovered || rating) > 0 && (
              <span className="text-sm font-medium text-stone-600 ml-2">
                {LABELS[hovered || rating]}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="text-sm font-medium text-stone-700 block mb-2">Nhận xét của bạn *</label>
          <textarea
            value={comment}
            onChange={(e) => { setComment(e.target.value); setError('') }}
            rows={4}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            className="input-base resize-none"
          />
          <p className="text-xs text-stone-400 mt-1 text-right">{comment.length} ký tự</p>
        </div>

        {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
          {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
        </button>
      </form>
    </div>
  )
}
