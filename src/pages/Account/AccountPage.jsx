import { useState } from 'react'
import AccountSidebar from './components/AccountSidebar'
import useAuthStore from '@/store/authStore'
import { authService } from '@/services/authService'

export default function AccountPage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const updated = await authService.updateProfile(form)
      updateUser(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {}
    finally { setSaving(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">Thông tin cá nhân</h1>
          <div className="card p-6">
            <form onSubmit={handleSave} className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Họ và tên</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className="input-base"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Email</label>
                <input type="email" value={user?.email} disabled className="input-base bg-stone-50 text-stone-400" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 block mb-1">Số điện thoại</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="input-base"
                  placeholder="0xxxxxxxxx"
                />
              </div>
              {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">Cập nhật thành công!</p>}
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
