import api from './api'
import useAuthStore from '@/store/authStore'

// Map sort value từ UI sang API params
function mapSort(sort) {
  switch (sort) {
    case 'newest':    return { sort: 'created_at', order: 'DESC' }
    case 'price_asc': return { sort: 'price', order: 'ASC' }
    case 'price_desc':return { sort: 'price', order: 'DESC' }
    case 'rating':    return { sort: 'avg_rating', order: 'DESC' }
    default:          return {}
  }
}

// Helper: lấy category_id từ slug — dùng categoryStore nếu đã loaded
import useCategoryStore from '@/store/categoryStore'

async function getCategoryBySlug(slug) {
  const { tree, loaded } = useCategoryStore.getState()
  if (loaded && Array.isArray(tree)) {
    const all = tree.flatMap(p => [p, ...(p.children ?? [])])
    const found = all.find(c => c.slug === slug)
    if (found) return found
  }
  // fallback: fetch trực tiếp
  const data = await api.get('/categories')
  const list = Array.isArray(data) ? data : (data?.data ?? [])
  const all = list.flatMap(p => [p, ...(p.children ?? [])])
  return all.find(c => c.slug === slug) || null
}

const realProductService = {
  getList: (params = {}) => {
    const { sort, ...rest } = params
    return api.get('/products', { params: { ...rest, ...mapSort(sort) } })
      .then((res) => ({
        items: res?.data ?? [],
        total: res?.pagination?.total ?? 0,
        totalPages: res?.pagination?.totalPages ?? 0,
        page: res?.pagination?.page ?? 1,
      }))
  },

  getDetail: (id) => api.get(`/products/${id}`),

  getByCategory: async (slug, params = {}) => {
    const { sort, pet_type, price_min, price_max, in_stock, page, limit } = params
    const cat = await getCategoryBySlug(slug)
    if (!cat) return { items: [], total: 0, totalPages: 0, page: 1 }

    const res = await api.get('/products', {
      params: {
        category_id: cat.pk_category_id,
        ...(pet_type && { pet_type_id: pet_type }),
        ...(price_min && { price_min }),
        ...(price_max && { price_max }),
        ...(in_stock !== '' && in_stock != null && { in_stock }),
        ...(page && { page }),
        ...(limit && { limit }),
        ...mapSort(sort),
      },
    })
    return {
      items: res?.data ?? [],
      total: res?.pagination?.total ?? 0,
      totalPages: res?.pagination?.totalPages ?? 0,
      page: res?.pagination?.page ?? 1,
    }
  },

  search: (params = {}) => {
    const { sort, pet_type, in_stock, ...rest } = params
    return api.get('/products', {
      params: {
        ...rest,
        ...(pet_type && { pet_type_id: pet_type }),
        ...(in_stock !== '' && in_stock != null && { in_stock }),
        ...mapSort(sort),
      },
    }).then((res) => ({
      items: res?.data ?? [],
      total: res?.pagination?.total ?? 0,
      totalPages: res?.pagination?.totalPages ?? 0,
      page: res?.pagination?.page ?? 1,
    }))
  },

  getRecommendations: ({ product_id, limit = 8 } = {}) => {
    if (product_id) {
      return api.get(`/recommendations/product/${product_id}`)
        .then((items) => ({ items: Array.isArray(items) ? items : [] }))
        .catch(() =>
          // fallback: lấy sản phẩm mới nhất nếu recommendations lỗi
          api.get('/products', { params: { limit, sort: 'created_at', order: 'DESC' } })
            .then((res) => ({ items: res?.data ?? [] }))
            .catch(() => ({ items: [] }))
        )
    }
    // homepage recommendations — chỉ gọi khi có token
    const token = useAuthStore.getState().token
    if (!token) return Promise.resolve({ items: [] })
    return api.get('/recommendations/homepage')
      .then((items) => ({ items: Array.isArray(items) ? items : [] }))
      .catch(() => ({ items: [] }))
  },

  getRepurchasePredictions: () =>
    api.get('/recommendations/repurchase').then((items) => ({ items: Array.isArray(items) ? items : [] })),

  getReviews: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),

  submitReview: (productId, data) =>
    api.post(`/reviews/product/${productId}`, data),

  deleteReview: (reviewId) =>
    api.delete(`/reviews/${reviewId}`),
}

export const productService = realProductService
