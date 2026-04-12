import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-stone-800 text-stone-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px] shrink-0">
              🐕
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-400">PetShop</span>
          </div>
          <p className="text-sm leading-relaxed">
            Cửa hàng phụ kiện thú cưng uy tín, chất lượng cao dành cho chó, mèo và nhiều loài thú cưng khác.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Danh mục</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/thuc-an" className="hover:text-white transition-colors">Thức ăn</Link></li>
            <li><Link to="/category/do-choi" className="hover:text-white transition-colors">Đồ chơi</Link></li>
            <li><Link to="/category/phu-kien" className="hover:text-white transition-colors">Phụ kiện</Link></li>
            <li><Link to="/category/cham-soc" className="hover:text-white transition-colors">Chăm sóc</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Tài khoản</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account" className="hover:text-white transition-colors">Thông tin cá nhân</Link></li>
            <li><Link to="/account/orders" className="hover:text-white transition-colors">Lịch sử đơn hàng</Link></li>
            <li><Link to="/account/wishlist" className="hover:text-white transition-colors">Danh sách yêu thích</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Hỗ trợ</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">📞 <span>1800 xxxx</span></li>
            <li className="flex items-center gap-2">✉️ <span>support@petshop.vn</span></li>
            <li className="flex items-center gap-2">🕐 <span>8:00 - 22:00 hàng ngày</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-700 text-center text-xs text-stone-500 py-4">
        © 2026 PetShop. All rights reserved.
      </div>
    </footer>
  )
}
