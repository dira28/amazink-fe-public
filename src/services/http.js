import { getSession, setSession, syncFromStorage } from './session'

const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

// Data dummy dipakai selama VITE_USE_MOCK bukan "false" atau alamat API belum diisi.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false' || !BASE_URL

const NETWORK_ERROR = 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.'

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
        throw new Error(NETWORK_ERROR)
    }

    const body = await response.json().catch(() => null)

    if (!response.ok) {
        const detail = Array.isArray(body?.data) ? body.data[0]?.message : ''
        throw new Error(detail || body?.message || 'Gagal mengirim data ke server.')
    }

    return body?.data ?? null
}

// --- Permintaan yang memerlukan login ---

// Beberapa permintaan bisa kedaluwarsa bersamaan; semuanya menunggu satu pembaruan yang sama,
// karena refresh token hanya berlaku sekali pakai.
let refreshing = null

async function requestRefresh(refreshToken) {
    let response

    try {
        response = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        })
    } catch {
        throw new Error(NETWORK_ERROR)
    }

    const body = await response.json().catch(() => null)

    return response.ok ? body?.data : null
}

// Mengembalikan true bila token akses berhasil diperbarui; false bila sesi memang sudah berakhir.
async function refreshSession(usedToken) {
    // Tab lain mungkin sudah memperbarui token; pakai hasilnya dan jangan memutar refresh token lagi.
    const latest = syncFromStorage()

    if (!latest) return false
    if (latest.token !== usedToken) return true
    if (!latest.refreshToken) return false

    refreshing ??= requestRefresh(latest.refreshToken)
        .then((data) => {
            if (data) {
                setSession({
                    ...latest,
                    token: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresAt: Date.now() + data.expires_in * 1000,
                })

                return true
            }

            // Ditolak: bisa jadi tab lain baru saja memutar token yang sama. Cek penyimpanan sebelum menyerah.
            return syncFromStorage()?.token !== usedToken
        })
        .finally(() => {
            refreshing = null
        })

    return refreshing
}

function endSession() {
    setSession(null)
    window.location.assign(`/masuk?redirect=${encodeURIComponent(window.location.pathname)}`)

    return new Error('Sesi telah berakhir. Silakan masuk kembali.')
}

// Token akses yang hampir habis diperbarui lebih dulu, supaya permintaan tidak perlu gagal dulu.
const EXPIRY_MARGIN_MS = 30_000

async function authedFetch(path, options = {}) {
    const send = (token) =>
        fetch(`${BASE_URL}${path}`, {
            ...options,
            headers: { ...(options.headers ?? {}), ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        })

    let session = syncFromStorage() ?? getSession()

    if (session?.refreshToken && session.expiresAt - Date.now() < EXPIRY_MARGIN_MS) {
        try {
            await refreshSession(session.token)
        } catch {
            // Jaringan bermasalah: coba saja dengan token yang ada, hasilnya ditangani di bawah.
        }

        session = getSession()
    }

    let response

    try {
        response = await send(session?.token)

        if (response.status === 401 && session?.refreshToken) {
            if (await refreshSession(session.token)) response = await send(getSession()?.token)
        }
    } catch (error) {
        throw error.message === NETWORK_ERROR ? error : new Error(NETWORK_ERROR)
    }

    // Sesi benar-benar berakhir: bersihkan lalu minta masuk lagi.
    if (response.status === 401) throw endSession()

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
