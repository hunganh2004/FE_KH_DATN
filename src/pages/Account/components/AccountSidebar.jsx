import { NavLink, useNavigate } from 'react-router-dom'
import { User, MapPin, ShoppingBag, Heart, Lock, Bell, LogOut } from 'lucide-react'
import useAuthStore from '@/store/authStore'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/account', label: 'Thông tin cá nhân', icon: User, end: true },
  { to: '/account/orders', label: 'Lịch sử đơn hàng', icon: ShoppingBag },
  { to: '/account/addresses', label: 'Địa chỉ giao hàng', icon: MapPin },
  { to: '/account/wishlist', label: 'Danh sách yêu thích', icon: Heart },
  { to: '/account/notifications', label: 'Thông báo', icon: Bell },
  { to: '/account/password', label: 'Đổi mật khẩu', icon: Lock },
]

export default function AccountSidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <aside className="w-full md:w-56 shrink-0">
      {/* User info */}
      <div className="flex items-center gap-3 mb-6 p-4 card">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
          {user?.full_name?.[0] || '?'}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{user?.full_name}</p>
          <p className="text-xs text-stone-400 truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive ? 'bg-emerald-50 text-emerald-600 font-medium' : 'text-stone-600 hover:bg-stone-100'
            )}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={17} />
          Đăng xuất
        </button>
      </nav>
    </aside>
  )
}
