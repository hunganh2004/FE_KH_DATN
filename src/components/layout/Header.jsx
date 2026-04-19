import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, NavLink } from 'react-router-dom'
import { ShoppingCart, Search, User, Bell, Menu, X, Heart, ChevronDown, Star } from 'lucide-react'
import useCartStore, { calcCart } from '@/store/cartStore'
import useAuthStore from '@/store/authStore'
import useWishlistStore from '@/store/wishlistStore'
import useToastStore from '@/store/toastStore'
import { mockUserService } from '@/mocks/mockApi'
import { mockProducts, mockCategories } from '@/mocks/data'

// Danh mục cha (không có fk_parent_id)
const parentCats = mockCategories.filter(c => !c.fk_parent_id).sort((a, b) => a.sort_order - b.sort_order)
// Map danh mục con theo parent
const childMap = mockCategories
  .filter(c => c.fk_parent_id)
  .reduce((acc, c) => { (acc[c.fk_parent_id] ??= []).push(c); return acc }, {})

const CAT_ICONS = {
  'thuc-an': '🍖', 'phu-kien': '🎀', 'do-choi': '🎾',
  'cham-soc': '🛁', 'thoi-trang': '👗', 'chuong-nha': '🏠',
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const { items: cartItems } = useCartStore()
  const { itemCount } = calcCart(cartItems)
  const { user, logout } = useAuthStore()
  const { count: wishlistCount } = useWishlistStore()
  const { add: toast } = useToastStore()

  // Autocomplete — tìm trong mockProducts
  const suggestions = searchQuery.trim().length >= 1
    ? mockProducts
        .filter(p =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : []

  useEffect(() => {
    if (!user) { setUnreadCount(0); return }
    mockUserService.getNotifications()
      .then(data => setUnreadCount((data?.items || []).filter(n => n.is_read === 0).length))
      .catch(() => {})
  }, [user])

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const handleSelectSuggestion = (product) => {
    navigate(`/product/${product.slug}`)
    setSearchQuery('')
    setShowSuggestions(false)
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center gap-4 h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px] shrink-0">🐕</div>
            <span className="text-xl font-bold tracking-tight text-emerald-500 hidden sm:block">PetShop</span>
          </Link>

          {/* Search bar — desktop */}
          <div ref={searchRef} className="flex-1 max-w-xl hidden md:block relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true) }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                  className="input-base pr-10"
                />
                {searchQuery ? (
                  <button type="button" onClick={() => { setSearchQuery(''); setShowSuggestions(false) }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                    <X size={16} />
                  </button>
                ) : (
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-emerald-500">
                    <Search size={18} />
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 rounded-xl shadow-xl z-50 overflow-hidden">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-4 pt-3 pb-1">Gợi ý</p>
                {suggestions.map(p => (
                  <button
                    key={p.pk_product_id}
                    onMouseDown={() => handleSelectSuggestion(p)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-emerald-50 transition-colors text-left group"
                  >
                    <img
                      src={p.primary_image}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate group-hover:text-emerald-600">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-emerald-600">
                          {((p.sale_price ?? p.price) / 1000).toFixed(0)}k₫
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] text-amber-500">
                          <Star size={10} fill="currentColor" />
                          {p.avg_rating}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
                <button
                  onMouseDown={handleSearch}
                  className="w-full text-center text-xs font-bold text-emerald-600 hover:bg-emerald-50 py-2.5 border-t border-stone-100 transition-colors"
                >
                  Xem tất cả kết quả
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 ml-auto">
            {user ? (
              <>
                <Link to="/account/notifications" className="relative p-2 text-stone-600 hover:text-emerald-500 rounded-full hover:bg-stone-100">
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link to="/account/wishlist" className="relative p-2 text-stone-600 hover:text-emerald-500 rounded-full hover:bg-stone-100 hidden sm:flex">
                  <Heart size={22} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] min-w-[16px] h-4 rounded-full flex items-center justify-center font-bold px-0.5">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link to="/account" className="flex items-center gap-1.5 px-2 py-1 rounded-full hover:bg-stone-100 text-stone-600 hover:text-emerald-500">
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" />
                    : <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold">{user.full_name?.[0]}</div>
                  }
                  <span className="text-sm font-medium hidden sm:block">{user.full_name?.split(' ').pop()}</span>
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-1.5 px-4">Đăng nhập</Link>
            )}

            <Link to="/cart" className="relative p-2 text-stone-600 hover:text-emerald-500 rounded-full hover:bg-stone-100">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            <button className="p-2 text-stone-600 md:hidden rounded-full hover:bg-stone-100" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="input-base pr-10"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Nav bar — Mega Menu */}
      <nav className="border-t border-stone-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center h-10 gap-0.5">
            <li>
              <NavLink to="/" end className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-stone-600 hover:text-emerald-600 hover:bg-stone-50'}`
              }>Trang chủ</NavLink>
            </li>
            <li>
              <NavLink to="/search" className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isActive ? 'text-emerald-600 bg-emerald-50' : 'text-stone-600 hover:text-emerald-600 hover:bg-stone-50'}`
              }>Tất cả sản phẩm</NavLink>
            </li>

            <li className="w-px h-4 bg-stone-200 mx-1 shrink-0" />

            {/* Nút Danh mục — Mega Menu */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-stone-50 rounded-lg transition-colors">
                <span>Danh mục</span>
                <ChevronDown size={14} className="text-stone-400 group-hover:text-emerald-500 group-hover:rotate-180 transition-transform duration-200" />
              </button>

              {/* Mega Menu Panel */}
              <div className="absolute top-full left-0 mt-0.5 w-[640px] bg-white border border-stone-100 rounded-2xl shadow-2xl py-5 px-6
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-150 translate-y-1 group-hover:translate-y-0 z-50">
                <div className="grid grid-cols-3 gap-x-6 gap-y-1">
                  {parentCats.map((cat) => {
                    const children = childMap[cat.pk_category_id] || []
                    const icon = CAT_ICONS[cat.slug] || '📦'
                    return (
                      <div key={cat.slug}>
                        {/* Category cha */}
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-emerald-50 group/cat transition-colors"
                        >
                          <span className="text-lg leading-none">{icon}</span>
                          <div>
                            <p className="text-sm font-semibold text-stone-800 group-hover/cat:text-emerald-600 transition-colors leading-tight">
                              {cat.name}
                            </p>
                            <p className="text-[11px] text-stone-400">{cat.product_count} sản phẩm</p>
                          </div>
                        </Link>
                        {/* Category con */}
                        {children.length > 0 && (
                          <ul className="ml-9 mb-3 space-y-0.5">
                            {children.map(child => (
                              <li key={child.slug}>
                                <Link
                                  to={`/category/${child.slug}`}
                                  className="flex items-center justify-between text-xs text-stone-500 hover:text-emerald-600 py-1 px-2 rounded-md hover:bg-emerald-50 transition-colors"
                                >
                                  <span>{child.name}</span>
                                  <span className="text-stone-300">{child.product_count}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Footer của mega menu */}
                <div className="border-t border-stone-100 mt-3 pt-3">
                  <Link
                    to="/search"
                    className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 py-2 rounded-lg transition-colors"
                  >
                    Xem tất cả sản phẩm →
                  </Link>
                </div>
              </div>
            </li>

            <li className="w-px h-4 bg-stone-200 mx-1 shrink-0" />

            {/* Loại thú cưng dropdown */}
            <li className="relative group">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-emerald-600 hover:bg-stone-50 rounded-lg transition-colors">
                <span>Loại thú cưng</span>
                <ChevronDown size={14} className="text-stone-400 group-hover:text-emerald-500 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              <div className="absolute top-full left-0 mt-0.5 min-w-[160px] bg-white border border-stone-100 rounded-xl shadow-xl py-1.5
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              transition-all duration-150 translate-y-1 group-hover:translate-y-0 z-50">
                {[
                  { id: 1, name: 'Chó', icon: '🐶' },
                  { id: 2, name: 'Mèo', icon: '🐱' },
                  { id: 3, name: 'Cá', icon: '🐟' },
                  { id: 4, name: 'Chim', icon: '🐦' },
                  { id: 5, name: 'Thỏ', icon: '🐰' },
                ].map((pet) => (
                  <Link
                    key={pet.id}
                    to={`/search?pet_type=${pet.id}`}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                  >
                    <span>{pet.icon}</span>
                    <span>{pet.name}</span>
                  </Link>
                ))}
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1 max-h-[70vh] overflow-y-auto">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
            🏠 Trang chủ
          </Link>
          <Link to="/search" onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
            🔍 Tất cả sản phẩm
          </Link>
          <div className="border-t border-stone-100 my-2" />
          {parentCats.map((cat) => {
            const children = childMap[cat.pk_category_id] || []
            const icon = CAT_ICONS[cat.slug] || '📦'
            return (
              <div key={cat.slug}>
                <Link to={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
                  <span>{icon}</span>{cat.name}
                </Link>
                {children.map(child => (
                  <Link key={child.slug} to={`/category/${child.slug}`} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 pl-9 pr-3 py-2 text-sm text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
                    └ {child.name}
                  </Link>
                ))}
              </div>
            )
          })}
          <div className="border-t border-stone-100 my-2" />
          <p className="px-3 py-1 text-xs font-semibold text-stone-400 uppercase tracking-wider">Loại thú cưng</p>
          {[
            { id: 1, name: 'Chó', icon: '🐶' },
            { id: 2, name: 'Mèo', icon: '🐱' },
            { id: 3, name: 'Cá', icon: '🐟' },
            { id: 4, name: 'Chim', icon: '🐦' },
            { id: 5, name: 'Thỏ', icon: '🐰' },
          ].map((pet) => (
            <Link key={pet.id} to={`/search?pet_type=${pet.id}`} onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg">
              <span>{pet.icon}</span>{pet.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
