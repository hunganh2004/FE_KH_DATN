import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { productService } from '@/services/productService'
import { resolveImage } from '@/utils/image'

export default function RepurchaseReminder({ userId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!userId) return
    productService.getRepurchasePredictions()
      .then((data) => setItems(data?.items ?? []))
      .catch(() => {})
  }, [userId])

  if (!userId || items.length === 0) return null

  return (
    <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={18} className="text-blue-500" />
        <h2 className="font-semibold text-blue-700">Đã đến lúc mua lại chưa?</h2>
        <span className="text-xs text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full ml-auto">Nhắc nhở AI</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => {
          const imgSrc = resolveImage(item.image_url)
          return (
            <Link
              key={item.product_id}
              to={`/product/${item.product_id}`}
              className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm shrink-0 hover:shadow-md transition-shadow min-w-[220px]"
            >
              <div className="w-12 h-12 rounded-lg bg-stone-100 shrink-0 overflow-hidden flex items-center justify-center">
                {imgSrc
                  ? <img src={imgSrc} alt={item.product_name} className="w-full h-full object-cover" />
                  : <span className="text-xl">🐾</span>
                }
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-800 line-clamp-1">{item.product_name}</p>
                <p className="text-xs text-stone-400 mt-0.5">
                  Dự kiến: {new Date(item.predicted_date).toLocaleDateString('vi-VN')}
                </p>
                {item.date_source === 'expiry_date' && (
                  <p className="text-xs text-orange-500 mt-0.5">Sắp hết hạn</p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
