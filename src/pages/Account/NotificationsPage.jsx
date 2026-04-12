import { useEffect, useState } from 'react'
import { Package, RefreshCw, Tag, Bell } from 'lucide-react'
import AccountSidebar from './components/AccountSidebar'
import { formatDateTime } from '@/utils/format'
import { mockUserService } from '@/mocks/mockApi'
import clsx from 'clsx'

const TYPE_CONFIG = {
  order_update:        { icon: Package,    color: 'text-blue-500',   bg: 'bg-blue-50' },
  repurchase_reminder: { icon: RefreshCw,  color: 'text-green-500',  bg: 'bg-green-50' },
  promotion:           { icon: Tag,        color: 'text-orange-500', bg: 'bg-orange-50' },
  system:              { icon: Bell,       color: 'text-stone-500',   bg: 'bg-stone-50' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    mockUserService.getNotifications().then((data) => setNotifications(data?.items || [])).finally(() => setLoading(false))
  }, [])

  const markRead = (id) => {
    mockUserService.markNotificationRead(id).catch(() => {})
    setNotifications(n => n.map(item => item.pk_notif_id === id ? { ...item, is_read: 1 } : item))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">Thông báo</h1>
          {loading ? (
            <p className="text-stone-400">Đang tải...</p>
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
                    onClick={() => markRead(notif.pk_notif_id)}
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
