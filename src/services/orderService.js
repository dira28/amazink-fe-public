import { apiGetAuth, apiGetBlobUrl, apiPostAuth, apiPostFileAuth } from './http'

// Pesanan milik pengguna yang sedang masuk. Bukti transfer bersifat pribadi, jadi dibuka lewat permintaan berotentikasi.
export const createOrderRequest = (payload) => apiPostAuth('/orders', payload)

export const fetchOrders = () => apiGetAuth('/orders')

export const fetchOrder = (code) => apiGetAuth(`/orders/${encodeURIComponent(code)}`)

export const uploadProofRequest = (code, file) => apiPostFileAuth(`/orders/${encodeURIComponent(code)}/proof`, file)

export const cancelOrderRequest = (code) => apiPostAuth(`/orders/${encodeURIComponent(code)}/cancel`)

export const fetchProofUrl = (code) => apiGetBlobUrl(`/orders/${encodeURIComponent(code)}/proof`)
