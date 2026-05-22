import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle, RefreshCw } from 'lucide-react'
import { paymentService } from '@/services/paymentService'

const ERROR_MESSAGES = {
  '24': 'Giao dịch bị hủy bởi người dùng.',
  '51': 'Tài khoản không đủ số dư.',
  '65': 'Tài khoản vượt quá hạn mức giao dịch trong ngày.',
  '75': 'Ngân hàng thanh toán đang bảo trì.',
  'invalid_signature': 'Chữ ký giao dịch không hợp lệ.',
}

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('order_id')
  const code = searchParams.get('code')
  const reason = searchParams.get('reason')
  const [retrying, setRetrying] = useState(false)

  const errorMsg = ERROR_MESSAGES[reason] || ERROR_MESSAGES[code] || 'Thanh toán không thành công. Vui lòng thử lại.'

  const handleRetry = async () => {
    if (!orderId) return
    setRetrying(true)
    try {
      const res = await paymentService.createVnpayUrl(Number(orderId))
      const payUrl = res?.data?.pay_url ?? res?.pay_url
      if (payUrl) window.location.href = payUrl
    } catch (err) {
      alert(err?.message || 'Không thể tạo link thanh toán. Vui lòng thử lại sau.')
    } finally {
      setRetrying(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <XCircle size={72} className="mx-auto text-red-400 mb-4" />
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Thanh toán thất bại</h1>
      <p className="text-stone-500 mb-2">{errorMsg}</p>
      {orderId && (
        <p className="text-sm text-stone-400 mb-6">
          Đơn hàng #{orderId} vẫn được giữ. Bạn có thể thử thanh toán lại.
        </p>
      )}
      <div className="flex gap-3 justify-center flex-wrap">
        {orderId && (
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw size={16} className={retrying ? 'animate-spin' : ''} />
            {retrying ? 'Đang xử lý...' : 'Thanh toán lại'}
          </button>
        )}
        {orderId && <Link to={`/order/${orderId}`} className="btn-outline">Xem đơn hàng</Link>}
        <Link to="/" className="btn-outline">Về trang chủ</Link>
      </div>
    </div>
  )
}
