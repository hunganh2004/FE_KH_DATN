import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) { setError('Vui lòng nhập email.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 800)) // mock delay
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-[22px]">🐕</div>
            <span className="text-xl font-bold tracking-tight text-emerald-500">PetShop</span>
          </Link>
          <h1 className="text-xl font-bold text-stone-800 mt-4">Quên mật khẩu</h1>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4" />
              <h2 className="font-semibold text-stone-800 mb-2">Đã gửi email!</h2>
              <p className="text-sm text-stone-500 mb-6">
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến <strong>{email}</strong>. Vui lòng kiểm tra hộp thư.
              </p>
              <Link to="/login" className="btn-primary w-full block text-center py-2.5">
                Quay lại đăng nhập
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-stone-500 mb-5">
                Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết đặt lại mật khẩu cho bạn.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-stone-700 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    className="input-base"
                    placeholder="email@example.com"
                  />
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                  {loading ? 'Đang gửi...' : 'Gửi liên kết đặt lại'}
                </button>
              </form>
              <Link to="/login" className="flex items-center justify-center gap-1 text-sm text-stone-400 hover:text-stone-600 mt-5">
                <ArrowLeft size={14} /> Quay lại đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
