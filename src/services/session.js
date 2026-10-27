import { reactive } from 'vue'

// Sesi pelanggan: token akses (singkat) dan refresh token (panjang) untuk memperbaruinya tanpa login ulang.
// Disimpan di localStorage agar bertahan antar tab; salinan reaktif di memori dipakai tampilan.
const SESSION_KEY = 'amazink_session'

function readStored() {
    try {
        return JSON.parse(localStorage.getItem(SESSION_KEY))
    } catch {
        return null
    }
}

// Sesi tanpa refresh token yang tokennya sudah kedaluwarsa tidak dapat dipulihkan, jadi dibuang saat dibuka.
// Bila ada refresh token, sesi dipertahankan: token akses diperbarui otomatis pada permintaan berikutnya.
function usable(session) {
    if (!session?.token) return null
    if (session.refreshToken) return session

    return session.expiresAt > Date.now() ? session : null
}

export const sessionState = reactive({ session: usable(readStored()) })

export function setSession(session) {
    sessionState.session = session

    try {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        else localStorage.removeItem(SESSION_KEY)
    } catch {
        // Penyimpanan browser bisa diblokir; sesi tetap berlaku selama halaman terbuka.
    }
}

export const getSession = () => sessionState.session

// Tab lain bisa memperbarui sesi lebih dulu; ambil versi terbaru dari penyimpanan bersama.
export function syncFromStorage() {
    const stored = usable(readStored())

    if (stored && stored.token !== sessionState.session?.token) sessionState.session = stored
    if (!stored && sessionState.session) sessionState.session = null

    return sessionState.session
}
