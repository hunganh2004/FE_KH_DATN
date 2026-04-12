import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <p className="text-7xl mb-4">🐾</p>
      <h1 className="text-4xl font-bold text-stone-300 mb-2">404</h1>
      <p className="text-stone-500 mb-6">Trang bạn tìm không tồn tại.</p>
      <Link to="/" className="btn-primary">Về trang chủ</Link>
    </div>
  )
}
