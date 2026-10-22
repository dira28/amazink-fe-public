const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

// Data dummy dipakai selama VITE_USE_MOCK bukan "false" atau alamat API belum diisi.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' || !BASE_URL

// Respons backend berbentuk { success, message, data }; yang dikembalikan hanya `data`.
export async function apiGet(path) {
    const response = await fetch(`${BASE_URL}${path}`)
    const body = await response.json().catch(() => null)

    if (!response.ok) throw new Error(body?.message || 'Gagal memuat data dari server.')

    return body?.data ?? null
}
