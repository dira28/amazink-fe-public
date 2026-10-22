import { apiGet } from './http'

// Produk dari kategori yang aktif di admin.
export const fetchProducts = () => apiGet('/public/products')
