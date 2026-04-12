import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '@/services/authService'
import useAuthStore from '@/store/authStore'

export default function RegisterPage() {
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    setLoading(true)
    try {
      const data = await authService.register({ full_name: form.full_name, email: form.email, password: form.password })
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err) {
      setError(err?.message || 'Đăng ký thất bại, vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px]">
              🐕
            </div>
            <span className="text-xl font-bold tracking-tight text-emerald-500">PetShop</span>
          </Link>
          <h1 className="text-xl font-bold text-stone-800 mt-4">Tạo tài khoản</h1>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Họ và tên</label>
              <input type="text" required value={form.full_name} onChange={set('full_name')} className="input-base" placeholder="Nguyễn Văn A" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Email</label>
              <input type="email" required value={form.email} onChange={set('email')} className="input-base" placeholder="email@example.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Mật khẩu</label>
              <input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input-base" placeholder="Tối thiểu 6 ký tự" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Xác nhận mật khẩu</label>
              <input type="password" required value={form.confirm} onChange={set('confirm')} className="input-base" placeholder="••••••••" />
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-6">
            Đã có tài khoản?{' '}
            <Link to="/login" className="text-emerald-600 font-medium hover:underline">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
