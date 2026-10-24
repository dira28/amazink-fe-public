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

// --- Permintaan yang memerlukan login (token dari sesi di browser) ---

const SESSION_KEY = 'amazink_session'

function sessionToken() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY))?.token ?? null
    } catch {
        return null
    }
}

async function authedFetch(path, options = {}) {
    const headers = { ...(options.headers ?? {}) }
    const token = sessionToken()

    if (token) headers.Authorization = `Bearer ${token}`

    let response

    try {
        response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
    } catch {
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.')
    }

    // Sesi berakhir: bersihkan sesi lalu minta masuk lagi.
    if (response.status === 401) {
        try {
            localStorage.removeItem(SESSION_KEY)
        } catch {
            // Penyimpanan browser bisa diblokir.
        }

        window.location.assign(`/masuk?redirect=${encodeURIComponent(window.location.pathname)}`)
        throw new Error('Sesi telah berakhir. Silakan masuk kembali.')
    }

    return response
}

async function readBody(response, fallback) {
    const body = await response.json().catch(() => null)

    if (!response.ok) {
        const detail = Array.isArray(body?.data) ? body.data[0]?.message : ''
        throw new Error(detail || body?.message || fallback)
    }

    return body?.data ?? null
}

export async function apiGetAuth(path) {
    return readBody(await authedFetch(path), 'Gagal memuat data dari server.')
}

export async function apiPostAuth(path, payload) {
    const response = await authedFetch(path, {
        method: 'POST',
        headers: payload === undefined ? {} : { 'Content-Type': 'application/json' },
        body: payload === undefined ? undefined : JSON.stringify(payload),
    })

    return readBody(response, 'Gagal mengirim data ke server.')
}

export async function apiPostFileAuth(path, file) {
    const form = new FormData()
    form.append('file', file)

    return readBody(await authedFetch(path, { method: 'POST', body: form }), 'Gagal mengirim berkas ke server.')
}

// Berkas pribadi (misalnya bukti transfer) dibuka lewat permintaan berotentikasi, hasilnya berupa alamat sementara.
export async function apiGetBlobUrl(path) {
    const response = await authedFetch(path)

    if (!response.ok) throw new Error('Berkas tidak dapat dimuat.')

    return URL.createObjectURL(await response.blob())
}
