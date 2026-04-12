import { useState } from 'react'
import { X } from 'lucide-react'

const PROVINCES = [
  'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng',
  'Bình Dương', 'Đồng Nai', 'An Giang', 'Khánh Hoà', 'Lâm Đồng',
]

const EMPTY = { receiver: '', phone: '', province: '', commune: '', street: '', is_default: 0 }

export default function AddressFormModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => {
    setForm(f => ({ ...f, [key]: e.target.value }))
    setErrors(err => ({ ...err, [key]: '' }))
  }

  const validate = () => {
    const e = {}
    if (!form.receiver.trim()) e.receiver = 'Vui lòng nhập tên người nhận.'
    if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại.'
    else if (!/^0\d{9}$/.test(form.phone.trim())) e.phone = 'Số điện thoại không hợp lệ.'
    if (!form.province) e.province = 'Vui lòng chọn tỉnh/thành phố.'
    if (!form.commune.trim()) e.commune = 'Vui lòng nhập phường/xã.'
    if (!form.street.trim()) e.street = 'Vui lòng nhập địa chỉ chi tiết.'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    await new Promise(r => setTimeout(r, 400)) // mock delay
    onSave({
      pk_address_id: Date.now(),
      fk_user_id: 1,
      ...form,
      receiver: form.receiver.trim(),
      phone: form.phone.trim(),
      commune: form.commune.trim(),
      street: form.street.trim(),
    })
    setSaving(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Thêm địa chỉ mới</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Tên người nhận *</label>
              <input value={form.receiver} onChange={set('receiver')} className="input-base" placeholder="Nguyễn Văn A" />
              {errors.receiver && <p className="text-xs text-red-500 mt-1">{errors.receiver}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 block mb-1">Số điện thoại *</label>
              <input value={form.phone} onChange={set('phone')} className="input-base" placeholder="0901234567" />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Tỉnh / Thành phố *</label>
            <select value={form.province} onChange={set('province')} className="input-base">
              <option value="">-- Chọn tỉnh/thành phố --</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.province && <p className="text-xs text-red-500 mt-1">{errors.province}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Phường / Xã *</label>
            <input value={form.commune} onChange={set('commune')} className="input-base" placeholder="Phường Bến Nghé, Quận 1" />
            {errors.commune && <p className="text-xs text-red-500 mt-1">{errors.commune}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-stone-700 block mb-1">Địa chỉ chi tiết *</label>
            <input value={form.street} onChange={set('street')} className="input-base" placeholder="Số nhà, tên đường..." />
            {errors.street && <p className="text-xs text-red-500 mt-1">{errors.street}</p>}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_default === 1}
              onChange={(e) => setForm(f => ({ ...f, is_default: e.target.checked ? 1 : 0 }))}
              className="accent-emerald-500 w-4 h-4"
            />
            <span className="text-sm text-stone-600">Đặt làm địa chỉ mặc định</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-outline flex-1">Huỷ</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Đang lưu...' : 'Lưu địa chỉ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
