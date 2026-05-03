import { useState } from 'react'
import { resolveImage } from '@/utils/image'
import ProductImage from '@/components/ui/ProductImage'

export default function ImageGallery({ images = [] }) {
  const [selected, setSelected] = useState(0)
  const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-stone-100 rounded-xl flex items-center justify-center text-stone-300 text-6xl">
        🐾
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square rounded-xl overflow-hidden bg-stone-50 border border-stone-100">
        <ProductImage
          src={resolveImage(sorted[selected]?.image_url)}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-300"
          wrapClass="w-full h-full"
        />
      </div>
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.pk_image_id ?? i}
              onClick={() => setSelected(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                selected === i ? 'border-emerald-500' : 'border-stone-200'
              }`}
            >
              <ProductImage
                src={resolveImage(img.image_url)}
                alt=""
                className="w-full h-full object-cover"
                wrapClass="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
