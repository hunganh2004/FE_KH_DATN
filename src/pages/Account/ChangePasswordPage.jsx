import { useState } from 'react'
import AccountSidebar from './components/AccountSidebar'
import { authService } from '@/services/authService'

export default function ChangePasswordPage() {
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.new_password !== form.confirm) { setError('Mật khẩu xác nhận không khớp.'); return }
    setLoading(true)
    try {
      await authService.changePassword({ old_password: form.old_password, new_password: form.new_password })
      setSuccess(true)
      setForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err) {
      setError(err?.message || 'Đổi mật khẩu thất bại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">Đổi mật khẩu</h1>
          <div className="card p-6 max-w-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Mật khẩu hiện tại</label>
                <input type="password" required value={form.old_password} onChange={set('old_password')} className="input-base" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Mật khẩu mới</label>
                <input type="password" required minLength={6} value={form.new_password} onChange={set('new_password')} className="input-base" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" required value={form.confirm} onChange={set('confirm')} className="input-base" />
              </div>
              {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
              {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Đổi mật khẩu thành công!</p>}
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
