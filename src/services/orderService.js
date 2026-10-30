import { apiGetAuth, apiPostAuth } from './http'

// Pesanan milik pengguna yang sedang masuk. Transaksi dilanjutkan lewat WhatsApp; di sini hanya pencatatan dan status.
export const createOrderRequest = (payload) => apiPostAuth('/orders', payload)

export const fetchOrders = () => apiGetAuth('/orders')

export const fetchOrder = (code) => apiGetAuth(`/orders/${encodeURIComponent(code)}`)
