import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import clsx from 'clsx'
import { mockCouponService } from '@/mocks/mockApi'
import { formatPrice } from '@/utils/format'

const PAYMENT_METHODS = [
  { value: 'cod', label: 'Thanh toán khi nhận hàng (COD)', icon: '💵' },
  { value: 'bank_transfer', label: 'Chuyển khoản ngân hàng', icon: '🏦' },
  { value: 'momo', label: 'Ví MoMo', icon: '💜' },
  { value: 'vnpay', label: 'VNPay', icon: '🔵' },
]

export default function StepPayment({ method, couponCode, onChange, onBack, onNext }) {
  const [couponInput, setCouponInput] = useState(couponCode || '')
  const [couponStatus, setCouponStatus] = useState(null) // null | 'valid' | 'invalid'
  const [couponInfo, setCouponInfo] = useState(null)
  const [applying, setApplying] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setApplying(true)
    setCouponStatus(null)
    try {
      const result = await mockCouponService.validate(couponInput.trim())
      setCouponStatus('valid')
      setCouponInfo(result)
      onChange('couponCode', couponInput.trim())
    } catch (err) {
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
            onClick={() => onChange('paymentMethod', pm.value)}
            className={clsx(
              'w-full text-left card p-4 border-2 flex items-center gap-3 transition-colors',
              method === pm.value ? 'border-emerald-500 bg-emerald-50' : 'border-transparent hover:border-stone-200'
            )}
          >
            <span className="text-2xl">{pm.icon}</span>
            <span className="font-medium text-sm">{pm.label}</span>
            {method === pm.value && (
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
              <p className="text-xs text-emerald-600">{couponInfo.description}</p>
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
