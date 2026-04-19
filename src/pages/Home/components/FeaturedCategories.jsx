import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    name: 'Thức ăn', slug: 'thuc-an',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&auto=format&fit=crop',
    color: 'from-orange-500/60',
  },
  {
    name: 'Đồ chơi', slug: 'do-choi',
    image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&auto=format&fit=crop',
    color: 'from-green-600/60',
  },
  {
    name: 'Phụ kiện', slug: 'phu-kien',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop',
    color: 'from-pink-600/60',
  },
  {
    name: 'Chăm sóc', slug: 'cham-soc',
    image: 'https://images.unsplash.com/photo-1583511655826-05700d52f4d9?w=400&auto=format&fit=crop',
    color: 'from-blue-600/60',
  },
  {
    name: 'Thời trang', slug: 'thoi-trang',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop',
    color: 'from-purple-600/60',
  },
  {
    name: 'Chuồng & Nhà', slug: 'chuong-nha',
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=400&auto=format&fit=crop',
    color: 'from-yellow-600/60',
  },
]

export default function FeaturedCategories() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Danh mục nổi bật</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            to={`/category/${cat.slug}`}
            className="relative rounded-xl overflow-hidden aspect-square group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent`} />
            <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs sm:text-sm font-bold drop-shadow-md px-1 leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
