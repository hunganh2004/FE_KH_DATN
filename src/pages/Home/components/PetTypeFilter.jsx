import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'

// Dữ liệu từ tbl_pet_types — sẽ fetch từ API
const PET_TYPES = [
  { id: 0, name: 'Tất cả', icon: '🐾' },
  { id: 1, name: 'Chó', icon: '🐶' },
  { id: 2, name: 'Mèo', icon: '🐱' },
  { id: 3, name: 'Cá', icon: '🐟' },
  { id: 4, name: 'Chim', icon: '🐦' },
  { id: 5, name: 'Thỏ', icon: '🐰' },
]

export default function PetTypeFilter() {
  const [selected, setSelected] = useState(0)
  const navigate = useNavigate()

  const handleSelect = (pet) => {
    setSelected(pet.id)
    if (pet.id === 0) {
      navigate('/search')
    } else {
      navigate(`/search?pet_type=${pet.id}`)
    }
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Tìm theo loại thú cưng</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {PET_TYPES.map((pet) => (
          <button
            key={pet.id}
            onClick={() => handleSelect(pet)}
            className={clsx(
              'flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border-2 transition-all shrink-0',
              selected === pet.id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300'
            )}
          >
            <span className="text-2xl">{pet.icon}</span>
            <span className="text-xs font-medium">{pet.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
