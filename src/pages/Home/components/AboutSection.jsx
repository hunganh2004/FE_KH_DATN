import { Link } from 'react-router-dom'
import { Truck, RefreshCw, ShieldCheck, Headphones } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Miễn phí vận chuyển',
    desc: 'Đơn hàng từ 300.000đ',
  },
  {
    icon: RefreshCw,
    title: 'Đổi trả dễ dàng',
    desc: 'Trong vòng 7 ngày',
  },
  {
    icon: ShieldCheck,
    title: 'Hàng chính hãng',
    desc: '100% sản phẩm có nguồn gốc',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    desc: 'Tư vấn miễn phí mọi lúc',
  },
]

export default function AboutSection() {
  return (
    <section className="border-t border-stone-100 bg-white mt-4">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{title}</p>
                <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 rounded-2xl bg-emerald-500 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-lg">Chưa biết mua gì?</p>
            <p className="text-emerald-100 text-sm">Khám phá hàng trăm sản phẩm dành riêng cho thú cưng của bạn.</p>
          </div>
          <Link
            to="/search"
            className="shrink-0 px-6 py-2.5 bg-white text-emerald-600 font-bold rounded-full hover:bg-emerald-50 transition-colors text-sm"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>
    </section>
  )
}
