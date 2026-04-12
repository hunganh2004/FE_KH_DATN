import { useEffect, useState } from 'react'
import { MapPin, Plus, Trash2, Pencil } from 'lucide-react'
import AccountSidebar from './components/AccountSidebar'
import AddressFormModal from '@/components/ui/AddressFormModal'
import { mockUserService } from '@/mocks/mockApi'

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    mockUserService.getAddresses().then((data) => setAddresses(data || [])).finally(() => setLoading(false))
  }, [])

  const handleSave = (newAddr) => {
    if (newAddr.is_default === 1) {
      setAddresses(a => [newAddr, ...a.map(addr => ({ ...addr, is_default: 0 }))])
    } else {
      setAddresses(a => [...a, newAddr])
    }
  }

  const setDefault = (id) => {
    mockUserService.setDefaultAddress(id).then(() => {
      setAddresses(a => a.map(addr => ({ ...addr, is_default: addr.pk_address_id === id ? 1 : 0 })))
    }).catch(() => {})
  }

  const remove = (id) => {
    if (!confirm('Bạn có chắc muốn xoá địa chỉ này?')) return
    mockUserService.deleteAddress(id).then(() => {
      setAddresses(a => a.filter(addr => addr.pk_address_id !== id))
    }).catch(() => {})
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {showModal && <AddressFormModal onClose={() => setShowModal(false)} onSave={handleSave} />}

      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold">Địa chỉ giao hàng</h1>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2 text-sm py-2">
              <Plus size={16} /> Thêm địa chỉ
            </button>
          </div>

          {loading ? (
            <p className="text-stone-400">Đang tải...</p>
          ) : addresses.length === 0 ? (
            <div className="text-center py-12">
              <MapPin size={40} className="mx-auto text-stone-200 mb-3" />
              <p className="text-stone-400 mb-4">Chưa có địa chỉ nào.</p>
              <button onClick={() => setShowModal(true)} className="btn-primary text-sm">Thêm địa chỉ đầu tiên</button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <div key={addr.pk_address_id} className="card p-4 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm">{addr.receiver} · {addr.phone}</p>
                      <p className="text-sm text-stone-500">{addr.street}, {addr.commune}, {addr.province}</p>
                      {addr.is_default === 1 && (
                        <span className="text-xs text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded mt-1 inline-block">Mặc định</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {addr.is_default !== 1 && (
                      <button onClick={() => setDefault(addr.pk_address_id)} className="text-xs text-emerald-600 hover:underline">
                        Đặt mặc định
                      </button>
                    )}
                    <button onClick={() => remove(addr.pk_address_id)} className="text-stone-300 hover:text-red-400 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
