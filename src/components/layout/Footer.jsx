import { Link, useNavigate } from 'react-router-dom'
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react'
import useAuthStore from '@/store/authStore'

const SOCIAL_LINKS = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'Youtube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
]

export default function Footer() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const handleAccountLink = (path) => (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    navigate(path)
  }
  return (
    <footer className="bg-stone-800 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px] shrink-0">
              🐕
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-400">PetShop</span>
          </div>
          <p className="text-sm leading-relaxed mb-4">
            Cửa hàng phụ kiện thú cưng uy tín, chất lượng cao dành cho chó, mèo và nhiều loài thú cưng khác.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-full bg-stone-700 hover:bg-emerald-500 flex items-center justify-center transition-colors"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {/* Danh mục */}
        <div>
          <h4 className="font-semibold text-white mb-3">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/thuc-an" className="hover:text-white transition-colors">Thức ăn</Link></li>
            <li><Link to="/category/do-choi" className="hover:text-white transition-colors">Đồ chơi</Link></li>
            <li><Link to="/category/phu-kien" className="hover:text-white transition-colors">Phụ kiện</Link></li>
            <li><Link to="/category/cham-soc" className="hover:text-white transition-colors">Chăm sóc</Link></li>
            <li><Link to="/category/thoi-trang" className="hover:text-white transition-colors">Thời trang</Link></li>
            <li><Link to="/category/chuong-nha" className="hover:text-white transition-colors">Chuồng & Nhà</Link></li>
          </ul>
        </div>

        {/* Tài khoản */}
        <div>
          <h4 className="font-semibold text-white mb-3">Tài khoản</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/account" onClick={handleAccountLink('/account')} className="hover:text-white transition-colors cursor-pointer">Thông tin cá nhân</a></li>
            <li><a href="/account/orders" onClick={handleAccountLink('/account/orders')} className="hover:text-white transition-colors cursor-pointer">Lịch sử đơn hàng</a></li>
            <li><a href="/account/wishlist" onClick={handleAccountLink('/account/wishlist')} className="hover:text-white transition-colors cursor-pointer">Danh sách yêu thích</a></li>
            <li><a href="/account/addresses" onClick={handleAccountLink('/account/addresses')} className="hover:text-white transition-colors cursor-pointer">Sổ địa chỉ</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h4 className="font-semibold text-white mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm mb-4">
            <li className="flex items-center gap-2">📞 <span>1800 xxxx</span></li>
            <li className="flex items-center gap-2">✉️ <span>support@petshop.vn</span></li>
            <li className="flex items-center gap-2">🕐 <span>8:00 - 22:00 hàng ngày</span></li>
          </ul>
          {/* Payment badges */}
          <h4 className="font-semibold text-white mb-2 text-sm">Thanh toán</h4>
          <div className="flex flex-wrap gap-1.5">
            {['💳 Visa', '🏦 ATM', '📱 MoMo', '⚡ VNPay'].map(method => (
              <span key={method} className="text-xs bg-stone-700 px-2 py-1 rounded text-stone-300">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-700 py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500">
          <span>© 2026 PetShop. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-stone-300 transition-colors">Chính sách bảo mật</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-stone-300 transition-colors">Chính sách đổi trả</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
