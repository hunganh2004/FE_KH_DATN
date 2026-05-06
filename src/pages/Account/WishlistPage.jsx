import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import AccountSidebar from './components/AccountSidebar'
import ProductCard from '@/components/ui/ProductCard'
import useWishlistStore from '@/store/wishlistStore'
import { formatPrice } from '@/utils/format'

export default function WishlistPage() {
  const { items, remove } = useWishlistStore()

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <AccountSidebar />
        <div className="flex-1">
          <h1 className="text-xl font-bold mb-6">
            Danh sách yêu thích
            {items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-stone-400">({items.length} sản phẩm)</span>
            )}
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-16">
              <Heart size={48} className="mx-auto text-stone-200 mb-3" />
              <p className="text-stone-400 mb-4">Chưa có sản phẩm yêu thích nào.</p>
              <Link to="/" className="btn-primary text-sm">Khám phá sản phẩm</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((item) => {
                const product = item.product ?? item
                return product?.pk_product_id
                  ? <ProductCard key={product.pk_product_id} product={product} />
                  : null
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
