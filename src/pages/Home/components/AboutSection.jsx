import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="bg-emerald-50 py-16 mt-4">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=800&auto=format&fit=crop"
            alt="Về PetShop"
            referrerPolicy="no-referrer"
            className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/3]"
          />
          <div className="absolute -bottom-4 -right-4 w-40 h-40 bg-emerald-200 rounded-3xl -z-0 hidden md:block" />
        </div>

        {/* Content */}
        <div className="space-y-5">
          <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">Về chúng tôi</span>
          <h2 className="text-3xl md:text-4xl font-bold text-stone-800 leading-tight">
            Hơn cả một cửa hàng, chúng tôi là gia đình
          </h2>
          <p className="text-stone-600 leading-relaxed">
            PetShop ra đời từ tình yêu vô bờ bến dành cho thú cưng. Chúng tôi hiểu rằng mỗi chú chó, mỗi chú mèo đều là một thành viên quan trọng trong gia đình bạn.
          </p>
          <p className="text-stone-600 leading-relaxed">
            Với hơn 10 năm kinh nghiệm, chúng tôi tự hào cung cấp những sản phẩm được tuyển chọn kỹ lưỡng, an toàn và chất lượng nhất để giúp thú cưng của bạn luôn khỏe mạnh và hạnh phúc.
          </p>

          <div className="flex gap-8 pt-2">
            <div>
              <p className="text-2xl font-bold text-emerald-600">5.000+</p>
              <p className="text-sm text-stone-500">Khách hàng tin tưởng</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">38+</p>
              <p className="text-sm text-stone-500">Sản phẩm đa dạng</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">10+</p>
              <p className="text-sm text-stone-500">Năm kinh nghiệm</p>
            </div>
          </div>

          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stone-800 hover:bg-stone-900 text-white font-bold rounded-full transition-all text-sm"
          >
            Khám phá sản phẩm <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  )
}
