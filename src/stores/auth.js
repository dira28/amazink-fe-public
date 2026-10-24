import { computed, reactive } from 'vue'
import {
    loginRequest,
    registerRequest,
    requestPasswordResetRequest,
    resetPasswordRequest,
    verifyEmailRequest,
} from '@/services/authService'

const SESSION_KEY = 'amazink_session'
const PHONES_KEY = 'amazink_phones'

const read = (key, fallback) => {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback
    } catch {
        return fallback
    }
}

// Sesi yang tokennya sudah kedaluwarsa dibuang saat aplikasi dibuka.
const loadSession = () => {
    const session = read(SESSION_KEY, null)
    return session && session.expiresAt > Date.now() ? session : null
}

const state = reactive({ session: loadSession(), phones: read(PHONES_KEY, {}) })

function saveSession(session) {
    state.session = session
    try {
        if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        else localStorage.removeItem(SESSION_KEY)
    } catch {
        // Penyimpanan browser bisa diblokir; sesi tetap berlaku selama halaman terbuka.
    }
}

// Backend belum menyimpan nomor WhatsApp, jadi nomor hanya disimpan di browser ini per akun.
const currentUser = computed(() => {
    const session = state.session

    if (!session) return null
    if (session.expiresAt <= Date.now()) return null

    return { ...session.user, phone: state.phones[session.user.id] ?? '' }
})

export function useAuth() {
    return {
        user: currentUser,
        token: computed(() => state.session?.token ?? null),
        isLoggedIn: computed(() => !!currentUser.value),

        async login(payload) {
            saveSession(await loginRequest(payload))
        },
        // Mendaftar tidak langsung masuk: pengguna harus memverifikasi OTP lalu login.
        register: registerRequest,
        verifyEmail: verifyEmailRequest,
        requestPasswordReset: requestPasswordResetRequest,
        resetPassword: resetPasswordRequest,
        updatePhone(phone) {
            state.phones = { ...state.phones, [state.session.user.id]: phone }

            try {
                localStorage.setItem(PHONES_KEY, JSON.stringify(state.phones))
            } catch {
                // Diabaikan; nomor hanya hilang saat halaman ditutup.
            }
        },
        logout() {
            saveSession(null)
        },
    }
}

export const safeRedirect = (value) =>
    typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/akun'
