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

// Mengirim JSON ke backend. Pesan error dari backend dipakai apa adanya agar bisa ditampilkan ke pengguna.
export async function apiPost(path, payload) {
    let response

    try {
        response = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
    } catch {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
    }

    const body = await response.json().catch(() => null)

    if (!response.ok) {
        const detail = Array.isArray(body?.data) ? body.data[0]?.message : ''
        throw new Error(detail || body?.message || 'Gagal mengirim data ke server.')
    }

    return body?.data ?? null
}
