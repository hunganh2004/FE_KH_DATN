import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { ToastContainer } from '@/components/ui/Toast'
import useToastStore from '@/store/toastStore'

export default function MainLayout() {
  const { toasts, remove } = useToastStore()
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
