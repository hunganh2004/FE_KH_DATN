import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=1400&auto=format&fit=crop',
    title: 'Yêu thương thú cưng theo cách riêng',
    subtitle: 'Phụ kiện và đồ dùng chất lượng nhất cho những người bạn bốn chân của bạn.',
    cta: { label: 'Khám phá ngay', to: '/category/phu-kien' },
  },
  {
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=1400&auto=format&fit=crop',
    title: 'Chăm sóc sức khỏe toàn diện',
    subtitle: 'Thức ăn dinh dưỡng cao cấp giúp thú cưng luôn khỏe mạnh và tràn đầy năng lượng.',
    cta: { label: 'Xem thức ăn', to: '/category/thuc-an' },
  },
  {
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1400&auto=format&fit=crop',
    title: 'Phụ kiện thời trang sành điệu',
    subtitle: 'Làm mới phong cách cho thú cưng với những bộ sưu tập mới nhất tại PetShop.',
    cta: { label: 'Xem thời trang', to: '/category/thoi-trang' },
  },
]

export default function HeroBanner() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const prev = () => setCurrent(c => (c - 1 + SLIDES.length) % SLIDES.length)
  const next = () => setCurrent(c => (c + 1) % SLIDES.length)

  return (
    <div className="relative h-[420px] md:h-[580px] overflow-hidden bg-stone-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={SLIDES[current].image}
            alt={SLIDES[current].title}
            className="w-full h-full object-cover opacity-55"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-3xl">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight"
              >
                {SLIDES[current].title}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="text-base md:text-xl text-stone-200 mb-8 max-w-xl mx-auto"
              >
                {SLIDES[current].subtitle}
              </motion.p>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  to={SLIDES[current].cta.to}
                  className="inline-block px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition-all hover:scale-105 shadow-xl"
                >
                  {SLIDES[current].cta.label}
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full transition-all z-10"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white rounded-full transition-all z-10"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
