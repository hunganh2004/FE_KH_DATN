import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { authService } from '@/services/authService'
import useAuthStore from '@/store/authStore'
import useToastStore from '@/store/toastStore'
import useCartStore from '@/store/cartStore'
import useWishlistStore from '@/store/wishlistStore'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const { add: toast } = useToastStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(form)
      const token = res?.data?.token ?? res?.token
      const user = res?.data?.user ?? res?.user
      if (token && user) {
        setAuth(user, token)
        toast(`Chào mừng trở lại, ${user.full_name}!`, 'success')
        setTimeout(() => navigate(redirect), 100)
      } else {
        setError('Đăng nhập thất bại, vui lòng thử lại.')
      }
    } catch (err) {
      setError(err?.message || 'Email hoặc mật khẩu không đúng.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6">
          <ArrowLeft size={15} /> Về trang chủ
        </Link>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px]">
              🐕
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-500">PetShop</span>
          </Link>
          <h1 className="text-xl font-bold text-stone-800 mt-4">Đăng nhập</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-base"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-stone-700">Mật khẩu</label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline">Quên mật khẩu?</Link>
              </div>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                className="input-base"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="text-emerald-600 font-medium hover:underline">Đăng ký ngay</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
