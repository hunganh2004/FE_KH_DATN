import { useEffect, useState } from 'react'
import { MapPin, Plus } from 'lucide-react'
import { mockUserService } from '@/mocks/mockApi'
import AddressFormModal from '@/components/ui/AddressFormModal'
import clsx from 'clsx'

export default function StepAddress({ selected, onSelect, onNext }) {
  const [addresses, setAddresses] = useState([])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    mockUserService.getAddresses().then((data) => {
      setAddresses(data || [])
      if (!selected && data?.length > 0) {
        onSelect(data.find(a => a.is_default) || data[0])
      }
    }).catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Chọn địa chỉ giao hàng</h2>
      <div className="space-y-3 mb-6">
        {addresses.map((addr) => (
          <button
            key={addr.pk_address_id}
            onClick={() => onSelect(addr)}
            className={clsx(
              'w-full text-left card p-4 border-2 transition-colors',
              selected?.pk_address_id === addr.pk_address_id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-transparent hover:border-stone-200'
            )}
          >
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
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 text-sm text-emerald-600 hover:text-emerald-700 mb-8"
      >
        <Plus size={16} /> Thêm địa chỉ mới
      </button>

      {showModal && (
        <AddressFormModal
          onClose={() => setShowModal(false)}
          onSave={(newAddr) => {
            setAddresses(a => [...a, newAddr])
            onSelect(newAddr)
            setShowModal(false)
          }}
        />
      )}

      <button
        onClick={onNext}
        disabled={!selected}
        className="btn-primary w-full py-3"
      >
        Tiếp tục
      </button>
    </div>
  )
}
