import { computed, reactive } from 'vue'
import {
    loginRequest,
    logoutRequest,
    registerRequest,
    requestPasswordResetRequest,
    resetPasswordRequest,
    verifyEmailRequest,
} from '@/services/authService'
import { sessionState, setSession } from '@/services/session'

const PHONES_KEY = 'amazink_phones'

const read = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback
    } catch {
        return fallback
    }
}

const state = reactive({ phones: read(PHONES_KEY, {}) })

// Backend belum menyimpan nomor WhatsApp, jadi nomor hanya disimpan di browser ini per akun.
// Token akses yang sudah habis tidak membuat pengguna keluar: selama masih ada refresh token, sesi diperbarui
// otomatis pada permintaan berikutnya (lihat services/http.js).
const currentUser = computed(() => {
    const session = sessionState.session

    if (!session) return null

    return { ...session.user, phone: state.phones[session.user.id] || session.user.phone || '' }
})

export function useAuth() {
    return {
        user: currentUser,
        token: computed(() => sessionState.session?.token ?? null),
        isLoggedIn: computed(() => !!currentUser.value),

        async login(payload) {
            setSession(await loginRequest(payload))
        },
        // Mendaftar tidak langsung masuk: pengguna harus memverifikasi OTP lalu login.
        register: registerRequest,
        verifyEmail: verifyEmailRequest,
        requestPasswordReset: requestPasswordResetRequest,
        resetPassword: resetPasswordRequest,
        updatePhone(phone) {
            state.phones = { ...state.phones, [sessionState.session.user.id]: phone }

            try {
                localStorage.setItem(PHONES_KEY, JSON.stringify(state.phones))
            } catch {
                // Diabaikan; nomor hanya hilang saat halaman ditutup.
            }
        },
        logout() {
            // Sesi di server dicabut tanpa menunggu; sesi di browser langsung dihapus.
            logoutRequest(sessionState.session?.refreshToken)
            setSession(null)
        },
    }
}

export const safeRedirect = (value) =>
    typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/akun'
