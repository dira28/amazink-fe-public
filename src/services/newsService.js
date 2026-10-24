import { apiGet } from './http'

// Daftar berita (terbaru dulu). Isi lengkap hanya ada di detail.
export const fetchNews = () => apiGet('/public/news')

export const fetchNewsPost = (slug) => apiGet(`/public/news/${encodeURIComponent(slug)}`)
