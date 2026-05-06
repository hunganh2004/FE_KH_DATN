import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { orderService } from '@/services/orderService'
import { formatPrice } from '@/utils/format'
import useCartStore, { calcCart } from '@/store/cartStore'

const PAYMENT_METHODS = [
  { value: 'cod',          label: 'Thanh toán khi nhận hàng (COD)', icon: '💵', available: true },
  { value: 'bank_transfer',label: 'Chuyển khoản ngân hàng',         icon: '🏦', available: false },
  { value: 'momo',         label: 'Ví MoMo',                        icon: '💜', available: false },
  { value: 'vnpay',        label: 'VNPay',                          icon: '🔵', available: false },
]

export default function StepPayment({ method, couponCode, onChange, onBack, onNext }) {
  const [couponInput, setCouponInput] = useState(couponCode || '')
  const [couponStatus, setCouponStatus] = useState(null)
  const [couponInfo, setCouponInfo] = useState(null)
  const [applying, setApplying] = useState(false)

  const { items } = useCartStore()
  const { subtotal } = calcCart(items)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setApplying(true)
    setCouponStatus(null)
    try {
      const res = await orderService.validateCoupon({
        code: couponInput.trim(),
        order_total: subtotal,
      })
      const data = res?.data ?? res
      setCouponStatus('valid')
      setCouponInfo({ code: couponInput.trim(), discount_amount: data?.discount_amount })
      onChange('couponCode', couponInput.trim())
    } catch {
      setCouponStatus('invalid')
      setCouponInfo(null)
      onChange('couponCode', '')
    } finally {
      setApplying(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponInput('')
    setCouponStatus(null)
    setCouponInfo(null)
    onChange('couponCode', '')
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Phương thức thanh toán</h2>
      <div className="space-y-3 mb-6">
        {PAYMENT_METHODS.map((pm) => (
          <button
            key={pm.value}
            onClick={() => pm.available
              ? onChange('paymentMethod', pm.value)
              : alert('Phương thức thanh toán này đang được phát triển, vui lòng chọn phương thức khác.')
            }
            className={clsx(
              'w-full text-left card p-4 border-2 flex items-center gap-3 transition-colors',
              !pm.available && 'opacity-60 cursor-not-allowed',
              pm.available && method === pm.value ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:border-stone-200'
            )}
          >
            <span className="text-2xl">{pm.icon}</span>
            <span className="font-medium text-sm flex-1">{pm.label}</span>
            {!pm.available && (
              <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full shrink-0">Sắp ra mắt</span>
            )}
            {pm.available && method === pm.value && (
              <CheckCircle size={18} className="ml-auto text-emerald-500 shrink-0" />
            )}
          </button>
        ))}
      </div>

      {/* Coupon */}
      <div className="mb-8">
        <label className="text-sm font-medium text-stone-700 block mb-2">Mã giảm giá (tuỳ chọn)</label>

        {couponStatus === 'valid' && couponInfo ? (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
            <CheckCircle size={18} className="text-emerald-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-emerald-700">{couponInfo.code}</p>
              <p className="text-xs text-emerald-600">
                Giảm {formatPrice(couponInfo.discount_amount)}
              </p>
            </div>
            <button onClick={handleRemoveCoupon} className="text-stone-400 hover:text-red-400 shrink-0">
              <XCircle size={18} />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponStatus(null) }}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="Nhập mã giảm giá"
                className={clsx(
                  'input-base',
                  couponStatus === 'invalid' && 'border-red-400 focus:ring-red-400'
                )}
              />
              {couponStatus === 'invalid' && (
                <p className="text-xs text-red-500 mt-1">Mã không hợp lệ hoặc đã hết hạn.</p>
              )}
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={applying || !couponInput.trim()}
              className="btn-outline shrink-0 disabled:opacity-50"
            >
              {applying ? '...' : 'Áp dụng'}
            </button>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="btn-outline flex-1 py-3">Quay lại</button>
        <button onClick={onNext} className="btn-primary flex-1 py-3">Tiếp tục</button>
      </div>
    </div>
  )
}
