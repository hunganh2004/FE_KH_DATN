import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import AccountSidebar from './components/AccountSidebar'
import useAuthStore from '@/store/authStore'
import { authService } from '@/services/authService'
import { resolveImage } from '@/utils/image'
import api from '@/services/api'

export default function AccountPage() {
  const { user, updateUser } = useAuthStore()
  const [form, setForm] = useState({ full_name: user?.full_name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Ảnh tối đa 5MB.'); return }

    setUploadingAvatar(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await api.post('/upload?folder=avatars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const url = res?.url ?? res?.data?.url
      if (!url) throw new Error('Upload thất bại')

      await authService.updateProfile({ avatar_url: url })
      const profile = await authService.getProfile()
      updateUser(profile?.data ?? profile)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err?.message || 'Upload ảnh thất bại.')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await authService.updateProfile(form)
      const profile = await authService.getProfile()
      updateUser(profile?.data ?? profile)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err?.message || 'Cập nhật thất bại.')
    } finally {
      setSaving(false)
    }
  }

  const avatarSrc = resolveImage(user?.avatar_url)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">Thông tin cá nhân</h1>
          <div className="card p-6">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-stone-200" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl font-bold border-2 border-stone-200">
                    {user?.full_name?.[0] || '?'}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow transition-colors"
                >
                  {uploadingAvatar
                    ? <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <Camera size={14} />
                  }
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-stone-700">{user?.full_name}</p>
                <p className="text-xs text-stone-400 mt-0.5">JPG, PNG, WebP — tối đa 5MB</p>
              </div>
            </div>

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
              {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
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
