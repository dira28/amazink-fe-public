import { apiPost } from './http'

// Login memakai CAPTCHA Turnstile; backend menolak permintaan tanpa token yang valid.
export async function loginRequest({ email, password, captchaToken }) {
    const data = await apiPost('/auth/login', { email, password, captcha_token: captchaToken })

    return {
        token: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: Date.now() + data.expires_in * 1000,
        user: { id: data.user.id, name: data.user.full_name, email: data.user.email, role: data.user.role },
    }
}

// Mencabut sesi di server (refresh token tidak berlaku lagi). Gagal pun tidak masalah: sesi di browser tetap dihapus.
export const logoutRequest = (refreshToken) =>
    refreshToken ? apiPost('/auth/logout', { refresh_token: refreshToken }).catch(() => {}) : Promise.resolve()

// Mendaftar lalu backend mengirim kode OTP ke email; akun baru aktif setelah OTP diverifikasi.
export const registerRequest = ({ name, email, password }) =>
    apiPost('/auth/register', { full_name: name, email, password })

export const verifyEmailRequest = ({ email, code }) => apiPost('/auth/verify-email', { email, code })

// Lupa kata sandi: kode 6 digit dikirim ke email (jawabannya sama untuk email terdaftar maupun tidak),
// lalu kode dan kata sandi baru dikirim untuk mengganti kata sandi. Permintaan kode memakai CAPTCHA.
export const requestPasswordResetRequest = ({ email, captchaToken }) =>
    apiPost('/auth/forgot-password', { email, captcha_token: captchaToken })

export const resetPasswordRequest = ({ email, code, password }) =>
    apiPost('/auth/reset-password', { email, code, new_password: password })
