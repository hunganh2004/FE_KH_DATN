import { useEffect, useState } from 'react'
import { Package, RefreshCw, Tag, Bell, CheckCheck } from 'lucide-react'
import AccountSidebar from './components/AccountSidebar'
import { formatDateTime } from '@/utils/format'
import { notificationService } from '@/services/notificationService'
import useNotificationStore from '@/store/notificationStore'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

const TYPE_CONFIG = {
  order_update:        { icon: Package,   color: 'text-blue-500',   bg: 'bg-blue-50' },
  repurchase_reminder: { icon: RefreshCw, color: 'text-green-500',  bg: 'bg-green-50' },
  promotion:           { icon: Tag,       color: 'text-orange-500', bg: 'bg-orange-50' },
  system:              { icon: Bell,      color: 'text-stone-500',  bg: 'bg-stone-50' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const decrement = useNotificationStore((s) => s.decrement)
  const resetCount = useNotificationStore((s) => s.reset)
  const navigate = useNavigate()

  useEffect(() => {
    notificationService.getAll()
      .then((res) => {
        const items = Array.isArray(res) ? res : (res?.data ?? [])
        setNotifications(items)
        // Cập nhật badge ngay khi vào trang
        useNotificationStore.getState().fetchUnreadCount()
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const markRead = (notif) => {
    if (notif.is_read === 0) {
      notificationService.markRead(notif.pk_notif_id).catch(() => {})
      setNotifications(n => n.map(item =>
        item.pk_notif_id === notif.pk_notif_id ? { ...item, is_read: 1 } : item
      ))
      decrement(1)
    }
    // Navigate theo loại thông báo
    if (notif.type === 'order_update' && notif.ref_id) {
      navigate(`/order/${notif.ref_id}`)
    }
  }

  const markAllRead = () => {
    notificationService.markAllRead().catch(() => {})
    setNotifications(n => n.map(item => ({ ...item, is_read: 1 })))
    resetCount()
  }

  const unreadCount = notifications.filter(n => n.is_read === 0).length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">
              Thông báo
              {unreadCount > 0 && (
                <span className="ml-2 text-sm font-normal text-stone-400">({unreadCount} chưa đọc)</span>
              )}
            </h1>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1.5 text-sm text-emerald-600 hover:underline">
                <CheckCheck size={15} /> Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-4 flex gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-lg bg-stone-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-stone-200 rounded w-1/2" />
                    <div className="h-3 bg-stone-200 rounded w-3/4" />
                    <div className="h-3 bg-stone-200 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <p className="text-stone-400 text-center py-12">Không có thông báo nào.</p>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => {
                const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system
                const Icon = cfg.icon
                return (
                  <button
                    key={notif.pk_notif_id}
                    onClick={() => markRead(notif)}
                    className={clsx(
                      'w-full text-left card p-4 flex items-start gap-3 transition-colors hover:shadow-md',
                      notif.is_read === 0 ? 'border-l-4 border-emerald-400' : ''
                    )}
                  >
                    <div className={`p-2 rounded-lg ${cfg.bg} shrink-0`}>
                      <Icon size={18} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${notif.is_read === 0 ? 'text-stone-900' : 'text-stone-600'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      <p className="text-xs text-stone-400 mt-1">{formatDateTime(notif.created_at)}</p>
                    </div>
                    {notif.is_read === 0 && <div className="w-2 h-2 bg-emerald-500 rounded-full mt-1.5 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
