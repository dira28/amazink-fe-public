// Nomor WhatsApp bawaan website, dipakai bila nomor dari admin kosong atau tidak valid.
export const WA_PHONE = '6282226667233'

// Nomor dari admin (mis. 0812 3456 7890 atau +62 812-3456-7890) menjadi angka berawalan 62 untuk tautan wa.me.
export const waDigits = (phone) => {
    const digits = String(phone ?? '').replace(/\D/g, '')

    if (digits.length < 8) return WA_PHONE

    return digits.startsWith('0') ? `62${digits.slice(1)}` : digits
}

export const waLinkTo = (phone, message = '') =>
    `https://wa.me/${waDigits(phone)}${message ? `?text=${encodeURIComponent(message)}` : ''}`

export const waLink = (message = '') => waLinkTo(WA_PHONE, message)
