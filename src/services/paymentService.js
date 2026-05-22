import api from './api'

export const paymentService = {
  // Tạo URL thanh toán VNPay — gọi sau khi đã có order_id
  createVnpayUrl: (order_id) =>
    api.post('/payments/vnpay/create', { order_id }),
}
