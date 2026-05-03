const API_HOST = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'

/**
 * Resolve image URL — xử lý cả đường dẫn tương đối lẫn tuyệt đối.
 * - Tuyệt đối (http/https): giữ nguyên
 * - Tương đối (/uploads/...): prefix API_HOST
 * - null/undefined: trả về null
 */
export function resolveImage(url) {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_HOST}${url.startsWith('/') ? '' : '/'}${url}`
}

/**
 * Lấy ảnh chính từ product object.
 * Ưu tiên: primary_image → images[is_primary=1] → images[0]
 */
export function getPrimaryImage(product) {
  if (!product) return null
  if (product.primary_image) return resolveImage(product.primary_image)
  const primary = product.images?.find((i) => i.is_primary === 1 || i.is_primary === true)
  if (primary) return resolveImage(primary.image_url)
  const first = product.images?.[0]
  return first ? resolveImage(first.image_url) : null
}
