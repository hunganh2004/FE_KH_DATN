import { useState } from 'react'
import { resolveImage } from '@/utils/image'

/**
 * ProductImage — hiển thị ảnh sản phẩm với fallback khi lỗi hoặc không có ảnh.
 * Props:
 *   src       — URL ảnh (tương đối hoặc tuyệt đối)
 *   alt       — alt text
 *   className — class cho thẻ img
 *   wrapClass — class cho wrapper div
 */
export default function ProductImage({ src, alt = '', className = '', wrapClass = '' }) {
  const resolved = resolveImage(src)
  const [errored, setErrored] = useState(false)

  if (!resolved || errored) {
    return (
      <div className={`flex items-center justify-center bg-stone-100 text-stone-300 ${wrapClass}`}>
        <span className="text-4xl select-none">🐾</span>
      </div>
    )
  }

  return (
    <img
      src={resolved}
      alt={alt}
      referrerPolicy="no-referrer"
      className={className}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  )
}
