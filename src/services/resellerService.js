import { apiGet, apiPost } from './http'

// Mengirim pengajuan reseller. `captcha_token` berasal dari widget Turnstile.
export const submitReseller = (payload) => apiPost('/public/resellers', payload)

export const fetchResellers = () => apiGet('/public/resellers')
