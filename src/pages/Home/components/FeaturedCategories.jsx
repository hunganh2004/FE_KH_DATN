import { Link } from 'react-router-dom'
import useCategoryStore from '@/store/categoryStore'

const API_HOST = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'

const CAT_VISUALS = {
  'thuc-an':    { bg: 'bg-orange-100',  text: 'text-orange-700',  icon: '🍖', image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop', overlay: 'from-orange-500/70' },
  'do-choi':    { bg: 'bg-green-100',   text: 'text-green-700',   icon: '🎾', image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop',  overlay: 'from-green-600/70' },
  'phu-kien':   { bg: 'bg-pink-100',    text: 'text-pink-700',    icon: '🎀', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop',  overlay: 'from-pink-600/70' },
  'cham-soc':   { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: '🛁', image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&auto=format&fit=crop',  overlay: 'from-blue-600/70' },
  'thoi-trang': { bg: 'bg-purple-100',  text: 'text-purple-700',  icon: '👗', image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop',  overlay: 'from-purple-600/70' },
  'chuong-nha': { bg: 'bg-yellow-100',  text: 'text-yellow-700',  icon: '🏠', image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&auto=format&fit=crop',    overlay: 'from-yellow-600/70' },
}

const FALLBACK_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '📦', overlay: 'from-emerald-600/70' },
  { bg: 'bg-rose-100',    text: 'text-rose-700',    icon: '🐾', overlay: 'from-rose-600/70' },
  { bg: 'bg-cyan-100',    text: 'text-cyan-700',    icon: '✨', overlay: 'from-cyan-600/70' },
  { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: '⭐', overlay: 'from-amber-600/70' },
]

function resolveImage(url) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return `${API_HOST}${url}`
}

export default function FeaturedCategories() {
  const tree = useCategoryStore((s) => s.tree)
  const loaded = useCategoryStore((s) => s.loaded)
  const parents = Array.isArray(tree) ? tree : []

  if (!loaded) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-stone-700 mb-4">Danh mục nổi bật</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden aspect-square bg-stone-200 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Danh mục nổi bật</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {parents.map((cat, idx) => {
          const visual = CAT_VISUALS[cat.slug] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
          const imgSrc = resolveImage(cat.image_url)

          return (
            <Link
              key={cat.pk_category_id}
              to={`/category/${cat.slug}`}
              className="relative rounded-xl overflow-hidden aspect-square group"
            >
              {imgSrc ? (
                /* Có ảnh: hiển thị ảnh + gradient overlay */
                <>
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Khi ảnh lỗi: ẩn img, hiện nền màu bên dưới
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  {/* Nền màu dự phòng khi ảnh lỗi */}
                  <div className={`hidden absolute inset-0 ${visual.bg} flex items-center justify-center`}>
                    <span className="text-4xl">{visual.icon}</span>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-t ${visual.overlay} to-transparent`} />
                </>
              ) : (
                /* Không có ảnh: nền màu + icon + hover effect */
                <div className={`w-full h-full ${visual.bg} flex flex-col items-center justify-center gap-2 group-hover:brightness-95 transition-all`}>
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{visual.icon}</span>
                </div>
              )}

              <span className={`absolute bottom-2 left-0 right-0 text-center text-xs sm:text-sm font-bold px-1 leading-tight drop-shadow-sm
                ${imgSrc ? 'text-white drop-shadow-md' : visual.text}`}>
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
