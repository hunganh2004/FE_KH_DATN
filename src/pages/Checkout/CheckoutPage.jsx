import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import StepAddress from './components/StepAddress'
import StepPayment from './components/StepPayment'
import StepConfirm from './components/StepConfirm'
import useCartStore from '@/store/cartStore'
import { orderService } from '@/services/orderService'

const STEPS = ['Địa chỉ giao hàng', 'Thanh toán', 'Xác nhận']

export default function CheckoutPage() {
  const [step, setStep] = useState(0)
  const [orderData, setOrderData] = useState({ address: null, paymentMethod: 'cod', couponCode: '' })
  const [loading, setLoading] = useState(false)
  const { items, clearCart } = useCartStore()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const result = await orderService.create({
        address_id: orderData.address.pk_address_id,
        payment_method: orderData.paymentMethod,
        coupon_code: orderData.couponCode || undefined,
        items: items.map(i => ({
          product_id: i.product.pk_product_id,
          variant_id: i.variant?.pk_variant_id || null,
          quantity: i.quantity,
        })),
      })
      clearCart()
      if (result.payment_url) {
        window.location.href = result.payment_url
      } else {
        navigate(`/order/result?order_id=${result.order_id}`)
      }
    } catch (err) {
      alert(err?.message || 'Đặt hàng thất bại, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i < step ? 'bg-green-500 text-white' : i === step ? 'bg-emerald-500 text-white' : 'bg-stone-200 text-stone-400'
              }`}>
                {i < step ? <Check size={16} /> : i + 1}
              </div>
              <span className={`text-xs mt-1 ${i === step ? 'text-emerald-600 font-medium' : 'text-stone-400'}`}>{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${i < step ? 'bg-green-400' : 'bg-stone-200'}`} />
            )}
          </div>
        ))}
      </div>

      {step === 0 && (
        <StepAddress
          selected={orderData.address}
          onSelect={(addr) => setOrderData(d => ({ ...d, address: addr }))}
          onNext={() => setStep(1)}
        />
      )}
      {step === 1 && (
        <StepPayment
          method={orderData.paymentMethod}
          couponCode={orderData.couponCode}
          onChange={(key, val) => setOrderData(d => ({ ...d, [key]: val }))}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <StepConfirm
          orderData={orderData}
          items={items}
          loading={loading}
          onBack={() => setStep(1)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
