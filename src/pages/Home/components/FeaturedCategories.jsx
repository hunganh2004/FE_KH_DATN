import { Link } from 'react-router-dom'
import useCategoryStore from '@/store/categoryStore'

const API_HOST = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:3000'

const CAT_VISUALS = {
  'thuc-an':    { image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop', color: 'from-orange-500/60' },
  'do-choi':    { image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop', color: 'from-green-600/60' },
  'phu-kien':   { image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop', color: 'from-pink-600/60' },
  'cham-soc':   { image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&auto=format&fit=crop', color: 'from-blue-600/60' },
  'thoi-trang': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop', color: 'from-purple-600/60' },
  'chuong-nha': { image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&auto=format&fit=crop', color: 'from-yellow-600/60' },
}
const DEFAULT_VISUAL = {
  image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&auto=format&fit=crop',
  color: 'from-stone-600/60',
}

function resolveImage(url) {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${API_HOST}${url.startsWith('/') ? '' : '/'}${url}`
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
        {parents.map((cat) => {
          const visual = CAT_VISUALS[cat.slug] ?? DEFAULT_VISUAL
          const imgSrc = resolveImage(cat.image_url) || visual.image
          return (
            <Link
              key={cat.pk_category_id}
              to={`/category/${cat.slug}`}
              className="relative rounded-xl overflow-hidden aspect-square group"
            >
              <img
                src={imgSrc}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => { e.currentTarget.src = visual.image }}
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${visual.color} to-transparent`} />
              <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs sm:text-sm font-bold drop-shadow-md px-1 leading-tight">
                {cat.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
