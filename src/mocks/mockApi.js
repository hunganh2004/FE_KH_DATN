// Mock API - giả lập response từ server với delay nhỏ
import {
  mockProducts, mockCategories, mockUser, mockAddresses,
  mockOrders, mockNotifications, mockWishlist,
  mockRepurchasePredictions, mockReviews,
} from './data'

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms))

function paginate(items, page = 1, limit = 20) {
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const start = (page - 1) * limit
  return { items: items.slice(start, start + limit), total, totalPages, page }
}

// ── Auth ──────────────────────────────────────────────────────
export const mockAuthService = {
  login: async ({ email, password }) => {
    await delay()
    if (email === mockUser.email && password === '123456') {
      return { user: mockUser, token: 'mock-jwt-token-abc123' }
    }
    throw { message: 'Email hoặc mật khẩu không đúng.' }
  },

  register: async ({ full_name, email, password }) => {
    await delay()
    if (email === mockUser.email) throw { message: 'Email đã được sử dụng.' }
    const newUser = { ...mockUser, pk_user_id: 99, full_name, email }
    return { user: newUser, token: 'mock-jwt-token-new' }
  },

  getProfile: async () => { await delay(200); return mockUser },

  updateProfile: async (data) => {
    await delay()
    return { ...mockUser, ...data }
  },

  changePassword: async ({ old_password }) => {
    await delay()
    if (old_password !== '123456') throw { message: 'Mật khẩu hiện tại không đúng.' }
    return { success: true }
  },
}

// ── Products ──────────────────────────────────────────────────
export const mockProductService = {
  getList: async ({ sort = 'newest', limit = 20, page = 1, pet_type } = {}) => {
    await delay()
    let items = [...mockProducts]
    if (pet_type) items = items.filter(p => p.pet_types.includes(Number(pet_type)))
    if (sort === 'price_asc') items.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
    else if (sort === 'price_desc') items.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
    else if (sort === 'trending') items.sort((a, b) => b.review_count - a.review_count)
    else items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    return paginate(items, page, limit)
  },

  getDetail: async (slug) => {
    await delay()
    const product = mockProducts.find(p => p.slug === slug)
    if (!product) throw { message: 'Không tìm thấy sản phẩm.' }
    return product
  },

  getByCategory: async (slug, { sort = 'newest', page = 1, limit = 20, pet_type, price_min, price_max } = {}) => {
    await delay()
    const cat = mockCategories.find(c => c.slug === slug)
    // Bao gồm cả danh mục con nếu là danh mục cha
    const catIds = cat
      ? [cat.pk_category_id, ...mockCategories.filter(c => c.fk_parent_id === cat.pk_category_id).map(c => c.pk_category_id)]
      : []
    let items = catIds.length > 0
      ? mockProducts.filter(p => catIds.includes(p.fk_category_id))
      : mockProducts
    if (pet_type) items = items.filter(p => p.pet_types.includes(Number(pet_type)))
    if (price_min) items = items.filter(p => (p.sale_price ?? p.price) >= Number(price_min))
    if (price_max) items = items.filter(p => (p.sale_price ?? p.price) <= Number(price_max))
    if (sort === 'price_asc') items.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
    else if (sort === 'price_desc') items.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
    else if (sort === 'trending') items.sort((a, b) => b.review_count - a.review_count)
    return paginate(items, page, limit)
  },

  search: async ({ q = '', pet_type, sort = 'newest', page = 1, limit = 20, price_min, price_max } = {}) => {
    await delay()
    let items = [...mockProducts]
    if (q) {
      const kw = q.toLowerCase()
      items = items.filter(p =>
        p.name.toLowerCase().includes(kw) ||
        p.brand?.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw)
      )
    }
    if (pet_type) items = items.filter(p => p.pet_types.includes(Number(pet_type)))
    if (price_min) items = items.filter(p => (p.sale_price ?? p.price) >= Number(price_min))
    if (price_max) items = items.filter(p => (p.sale_price ?? p.price) <= Number(price_max))
    if (sort === 'price_asc') items.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price))
    else if (sort === 'price_desc') items.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price))
    return paginate(items, page, limit)
  },

  getRecommendations: async ({ product_id, limit = 8 } = {}) => {
    await delay(600)
    // Gợi ý: loại trừ sản phẩm hiện tại, lấy ngẫu nhiên
    let items = mockProducts.filter(p => p.pk_product_id !== Number(product_id))
    items = items.sort(() => Math.random() - 0.5).slice(0, limit)
    return { items }
  },
}

// ── Orders ────────────────────────────────────────────────────
export const mockOrderService = {
  create: async (data) => {
    await delay(800)
    const newOrder = {
      pk_order_id: 2000 + Math.floor(Math.random() * 1000),
      order_status: 'pending',
      payment_status: 'pending',
      ...data,
    }
    return { order_id: newOrder.pk_order_id }
  },

  getHistory: async () => {
    await delay()
    return { items: mockOrders }
  },

  getDetail: async (id) => {
    await delay()
    const order = mockOrders.find(o => o.pk_order_id === Number(id))
    if (!order) throw { message: 'Không tìm thấy đơn hàng.' }
    return order
  },

  cancel: async (id) => {
    await delay()
    const order = mockOrders.find(o => o.pk_order_id === Number(id))
    if (!order) throw { message: 'Không tìm thấy đơn hàng.' }
    if (order.order_status !== 'pending') throw { message: 'Không thể huỷ đơn hàng ở trạng thái này.' }
    return { success: true }
  },
}

// ── User ──────────────────────────────────────────────────────
export const mockUserService = {
  getAddresses: async () => { await delay(); return mockAddresses },

  setDefaultAddress: async (id) => { await delay(); return { success: true } },

  deleteAddress: async (id) => { await delay(); return { success: true } },

  getWishlist: async () => { await delay(); return { items: mockWishlist } },

  getNotifications: async () => { await delay(); return { items: mockNotifications } },

  markNotificationRead: async (id) => { await delay(100); return { success: true } },

  getRepurchasePredictions: async () => {
    await delay(500)
    return { items: mockRepurchasePredictions }
  },
}

// ── Reviews ───────────────────────────────────────────────────
export const mockReviewService = {
  getByProduct: async (productId) => {
    await delay()
    return { items: mockReviews[productId] || [] }
  },

  submit: async ({ productId, rating, comment }) => {
    await delay(600)
    return { success: true, pk_review_id: Date.now() }
  },
}

// ── Coupons ───────────────────────────────────────────────────
const mockCoupons = [
  {
    pk_coupon_id: 1, code: 'WELCOME10',
    discount_type: 'percent', discount_value: 10,
    min_order: 100000, max_uses: 100, used_count: 45,
    starts_at: '2026-01-01T00:00:00', expires_at: '2026-12-31T23:59:59', is_active: 1,
    description: 'Giảm 10% cho đơn hàng từ 100.000đ',
  },
  {
    pk_coupon_id: 2, code: 'FREESHIP',
    discount_type: 'fixed', discount_value: 30000,
    min_order: 200000, max_uses: 50, used_count: 20,
    starts_at: '2026-01-01T00:00:00', expires_at: '2026-12-31T23:59:59', is_active: 1,
    description: 'Miễn phí vận chuyển (giảm 30.000đ) cho đơn từ 200.000đ',
  },
  {
    pk_coupon_id: 3, code: 'WEEKEND20',
    discount_type: 'percent', discount_value: 20,
    min_order: 300000, max_uses: 30, used_count: 30,
    starts_at: '2026-01-01T00:00:00', expires_at: '2026-04-13T23:59:59', is_active: 1,
    description: 'Giảm 20% cuối tuần (đã hết lượt)',
  },
]

export const mockCouponService = {
  validate: async (code) => {
    await delay(500)
    const coupon = mockCoupons.find(c => c.code === code.toUpperCase())
    if (!coupon) throw { message: 'Mã giảm giá không tồn tại.' }
    if (!coupon.is_active) throw { message: 'Mã giảm giá đã bị vô hiệu hoá.' }
    if (new Date(coupon.expires_at) < new Date()) throw { message: 'Mã giảm giá đã hết hạn.' }
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) throw { message: 'Mã giảm giá đã hết lượt sử dụng.' }
    return coupon
  },
}
