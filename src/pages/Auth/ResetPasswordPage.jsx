import { useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { authService } from '@/services/authService'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const navigate = useNavigate()

  const [form, setForm] = useState({ new_password: '', confirm: '' })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    if (!token) { setError('Link không hợp lệ hoặc đã hết hạn.'); return }
    setLoading(true)
    setError('')
    try {
      await authService.resetPassword({ token, new_password: form.new_password })
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err?.message || 'Link không hợp lệ hoặc đã hết hạn.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6">
          <ArrowLeft size={15} /> Quay lại đăng nhập
        </Link>

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px]">🐕</div>
            <span className="text-xl font-bold tracking-tight text-emerald-500">PetShop</span>
          </Link>
          <h1 className="text-xl font-bold text-stone-800 mt-4">Đặt lại mật khẩu</h1>
        </div>

        <div className="card p-8">
          {done ? (
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
              <h2 className="font-semibold text-stone-800 mb-2">Đặt lại thành công!</h2>
              <p className="text-sm text-stone-500 mb-6">
                Mật khẩu đã được cập nhật. Đang chuyển về trang đăng nhập...
              </p>
              <Link to="/login" className="btn-primary w-full block text-center py-2.5">
                Đăng nhập ngay
              </Link>
            </div>
          ) : (
            <>
              {!token && (
                <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg mb-4">
                  Link không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu lại.
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={form.new_password}
                    onChange={(e) => setForm(f => ({ ...f, new_password: e.target.value }))}
                    className="input-base"
                    placeholder="Tối thiểu 6 ký tự"
                    disabled={!token}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    required
                    value={form.confirm}
                    onChange={(e) => { setForm(f => ({ ...f, confirm: e.target.value })); setError('') }}
                    className="input-base"
                    placeholder="••••••••"
                    disabled={!token}
                  />
                </div>
                {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <button type="submit" disabled={loading || !token} className="btn-primary w-full py-3">
                  {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
