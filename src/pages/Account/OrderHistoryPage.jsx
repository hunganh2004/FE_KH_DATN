import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from './components/AccountSidebar'
import { formatPrice, formatDateTime } from '@/utils/format'
import { orderService } from '@/services/orderService'
import Pagination from '@/components/ui/Pagination'

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
const LIMIT = 5

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    setLoading(true)
    const params = { page, limit: LIMIT }
    if (activeTab !== 'all') params.status = activeTab

    orderService.getHistory(params)
      .then((data) => {
        setOrders(data?.items || [])
        setTotalPages(data?.totalPages || 1)
        setTotal(data?.total || 0)
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [activeTab, page])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPage(1)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Lịch sử đơn hàng</h1>
            {total > 0 && <span className="text-sm text-stone-400">{total} đơn hàng</span>}
          </div>

          {/* Status tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  activeTab === tab
                    ? 'bg-emerald-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {STATUS_CONFIG[tab].label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: LIMIT }).map((_, i) => (
                <div key={i} className="card p-4 animate-pulse h-24 bg-stone-100" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-400 mb-4">Không có đơn hàng nào.</p>
              <Link to="/" className="btn-primary text-sm">Mua sắm ngay</Link>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {orders.map((order) => {
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

                      <div className="text-xs text-stone-500 mb-3 line-clamp-1">
                        {order.items?.map(i => i.product_name).join(', ')}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="font-bold text-emerald-600">{formatPrice(order.total)}</p>
                        <Link
                          to={`/order/${order.pk_order_id}`}
                          className="text-xs border border-stone-200 text-stone-600 px-3 py-1.5 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
