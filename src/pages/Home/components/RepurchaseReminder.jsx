import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RefreshCw } from 'lucide-react'
import { formatPrice } from '@/utils/format'
import { mockUserService } from '@/mocks/mockApi'

export default function RepurchaseReminder({ userId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    mockUserService.getRepurchasePredictions()
      .then((data) => setItems(data?.items || []))
      .catch(() => {})
  }, [userId])

  if (items.length === 0) return null

  return (
    <section className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <RefreshCw size={18} className="text-blue-500" />
        <h2 className="font-semibold text-blue-700">Đã đến lúc mua lại chưa?</h2>
        <span className="text-xs text-blue-400 bg-blue-100 px-2 py-0.5 rounded-full ml-auto">Nhắc nhở AI</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {items.map(({ product, predicted_date }) => (
          <Link
            key={product.pk_product_id}
            to={`/product/${product.slug}`}
            className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm shrink-0 hover:shadow-md transition-shadow min-w-[220px]"
          >
            <img
              src={product.primary_image || '/placeholder-product.png'}
              alt={product.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-stone-800 line-clamp-1">{product.name}</p>
              <p className="text-xs text-emerald-600 font-semibold">{formatPrice(product.sale_price ?? product.price)}</p>
              <p className="text-xs text-stone-400">Dự kiến cần: {predicted_date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
