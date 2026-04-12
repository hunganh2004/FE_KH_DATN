import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from './components/AccountSidebar'
import { formatPrice, formatDateTime } from '@/utils/format'
import { orderService } from '@/services/orderService'
import useCartStore from '@/store/cartStore'
import useToastStore from '@/store/toastStore'

const STATUS_CONFIG = {
  all:        { label: 'Tất cả',       color: '' },
  pending:    { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50' },
  confirmed:  { label: 'Đã xác nhận',  color: 'text-blue-600 bg-blue-50' },
  processing: { label: 'Đang xử lý',   color: 'text-blue-600 bg-blue-50' },
  shipping:   { label: 'Đang giao',    color: 'text-purple-600 bg-purple-50' },
  delivered:  { label: 'Đã giao',      color: 'text-emerald-600 bg-emerald-50' },
  cancelled:  { label: 'Đã huỷ',       color: 'text-red-600 bg-red-50' },
}

const TABS = ['all', 'pending', 'processing', 'shipping', 'delivered', 'cancelled']

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const { addItem } = useCartStore()
  const { add: toast } = useToastStore()

  useEffect(() => {
    orderService.getHistory().then((data) => setOrders(data?.items || [])).finally(() => setLoading(false))
  }, [])

  const filtered = activeTab === 'all' ? orders : orders.filter(o => o.order_status === activeTab)

  const handleReorder = (order) => {
    let added = 0
    let outOfStock = 0
    order.items?.forEach(item => {
      // mock: giả sử tất cả còn hàng
      addItem(
        { pk_product_id: item.fk_product_id || item.pk_order_item_id, name: item.product_name, price: item.unit_price, sale_price: null, slug: '#', stock: 10, primary_image: null },
        null,
        item.quantity
      )
      added++
    })
    if (added > 0) toast(`Đã thêm ${added} sản phẩm vào giỏ hàng`)
    if (outOfStock > 0) toast(`${outOfStock} sản phẩm đã hết hàng`, 'error')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h1>

          {/* Status tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {STATUS_CONFIG[tab].label}
                {tab !== 'all' && (
                  <span className="ml-1 opacity-70">
                    ({orders.filter(o => o.order_status === tab).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse h-24 bg-stone-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-400 mb-4">Không có đơn hàng nào.</p>
              <Link to="/" className="btn-primary text-sm">Mua sắm ngay</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((order) => {
                const status = STATUS_CONFIG[order.order_status] || STATUS_CONFIG.pending
                return (
                  <div key={order.pk_order_id} className="card p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-medium text-sm">Đơn #{order.pk_order_id}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{formatDateTime(order.created_at)}</p>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Items preview */}
                    <div className="text-xs text-stone-500 mb-3 line-clamp-1">
                      {order.items?.map(i => i.product_name).join(', ')}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="font-bold text-emerald-600">{formatPrice(order.total)}</p>
                      <div className="flex gap-2">
                        {order.order_status === 'delivered' && (
                          <button
                            onClick={() => handleReorder(order)}
                            className="text-xs border border-emerald-300 text-emerald-600 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors"
                          >
                            Mua lại
                          </button>
                        )}
                        <Link
                          to={`/order/${order.pk_order_id}`}
                          className="text-xs border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
