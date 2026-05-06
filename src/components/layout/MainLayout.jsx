import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ToastContainer } from '@/components/ui/Toast'
import useToastStore from '@/store/toastStore'
import useAuthStore from '@/store/authStore'
import useWishlistStore from '@/store/wishlistStore'
import useCartStore from '@/store/cartStore'

export default function MainLayout() {
  const { toasts, remove } = useToastStore()
  const { user } = useAuthStore()
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)
  const fetchCart = useCartStore((s) => s.fetchCart)

  useEffect(() => {
    if (user) {
      fetchCart()
      fetchWishlist()
    }
  }, [user])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onRemove={remove} />
    </div>
  )
}
