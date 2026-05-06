import api from './api'

// Session ID dùng để nhóm các hành vi trong cùng một phiên
const SESSION_ID = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

/**
 * Ghi log hành vi người dùng — fire-and-forget, không throw lỗi
 * @param {object} params
 * @param {number} [params.product_id]
 * @param {'view_product'|'add_to_cart'|'search'|'add_to_wishlist'|'remove_from_wishlist'} params.action
 * @param {string} [params.search_query]
 * @param {number} [params.duration_sec]
 */
export function logBehavior({ product_id, action, search_query, duration_sec } = {}) {
  api.post('/behavior', {
    session_id: SESSION_ID,
    product_id: product_id ?? null,
    action,
    search_query: search_query ?? null,
    duration_sec: duration_sec ?? null,
  }).catch(() => {}) // silent — không ảnh hưởng UX
}
