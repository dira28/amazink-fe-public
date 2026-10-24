import { USE_MOCK, apiGet } from './http'

// Mengambil isi halaman dari backend. Mengembalikan null saat mode dummy.
export async function fetchPage(slug) {
    if (USE_MOCK) return null

    return apiGet(`/public/pages/${slug}`)
}
