import { useNavigate, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import useCategoryStore from '@/store/categoryStore'

const PET_ICONS = { 'Chó': '🐶', 'Mèo': '🐱', 'Cá': '🐟', 'Chim': '🐦', 'Thỏ': '🐰' }

export default function PetTypeFilter() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const activePetType = Number(searchParams.get('pet_type') || 0)
  const petTypes = useCategoryStore((s) => s.petTypes)

  const all = [{ pk_pet_type_id: 0, name: 'Tất cả', icon_url: '🐾' }, ...petTypes]

  const handleSelect = (pet) => {
    navigate(pet.pk_pet_type_id === 0 ? '/search' : `/search?pet_type=${pet.pk_pet_type_id}`)
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-700 mb-4">Tìm theo loại thú cưng</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {all.map((pet) => (
          <button
            key={pet.pk_pet_type_id}
            onClick={() => handleSelect(pet)}
            className={clsx(
              'flex flex-col items-center gap-1.5 px-5 py-3 rounded-xl border-2 transition-all shrink-0',
              activePetType === pet.pk_pet_type_id
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:bg-emerald-50/50'
            )}
          >
            <span className="text-2xl">{pet.icon_url || PET_ICONS[pet.name] || '🐾'}</span>
            <span className="text-xs font-medium">{pet.name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
