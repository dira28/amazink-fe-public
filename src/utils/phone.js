// Nomor telepon disimpan dalam format internasional tanpa spasi (+6281234567890) dan
// ditampilkan sebagai (+62) 8123-4567-8901. Kode negara dipilih terpisah dari nomornya.

export const COUNTRIES = [
    { code: '+62', name: 'Indonesia' },
    { code: '+60', name: 'Malaysia' },
    { code: '+65', name: 'Singapura' },
    { code: '+673', name: 'Brunei' },
    { code: '+66', name: 'Thailand' },
    { code: '+63', name: 'Filipina' },
    { code: '+61', name: 'Australia' },
    { code: '+81', name: 'Jepang' },
    { code: '+82', name: 'Korea Selatan' },
    { code: '+86', name: 'Tiongkok' },
    { code: '+91', name: 'India' },
    { code: '+966', name: 'Arab Saudi' },
    { code: '+971', name: 'Uni Emirat Arab' },
    { code: '+44', name: 'Inggris' },
    { code: '+1', name: 'Amerika Serikat / Kanada' },
]

export const DEFAULT_COUNTRY = '+62'

const MAX_DIGITS = 12
const INDONESIA = /^8\d{8,11}$/

// Menyisakan angka nomor nasional. Untuk Indonesia, awalan 0 atau 62 yang ikut terketik atau tertempel dibuang.
export function cleanNational(raw, country) {
    let digits = String(raw ?? '').replace(/\D/g, '')

    if (country === '+62') {
        if (digits.startsWith('62') && digits[2] === '8') digits = digits.slice(2)
        else if (digits.startsWith('0')) digits = digits.slice(1)
    } else {
        digits = digits.replace(/^0+/, '')
    }

    return digits.slice(0, MAX_DIGITS)
}

// 8xxx-xxxx-xxxx: dikelompokkan empat angka.
export const formatNational = (digits) => (digits ? digits.match(/.{1,4}/g).join('-') : '')

export const toE164 = (country, digits) => (digits ? `${country}${digits}` : '')

// Pesan kesalahan, atau string kosong bila nomor valid.
export function phoneError(country, digits) {
    if (!digits) return 'Nomor telepon wajib diisi'

    if (country === '+62') {
        return INDONESIA.test(digits) ? '' : 'Nomor Indonesia harus berawalan 8 dan terdiri dari 9 sampai 12 digit'
    }

    return digits.length >= 6 ? '' : 'Nomor telepon terlalu pendek'
}

// Memecah nomor tersimpan menjadi kode negara dan nomor nasional. Nomor lama (08xxxxxxxxxx) dianggap nomor Indonesia.
export function parsePhone(value) {
    const text = String(value ?? '').replace(/[^\d+]/g, '')

    if (!text) return { country: DEFAULT_COUNTRY, national: '' }

    if (text.startsWith('+')) {
        const country = [...COUNTRIES]
            .sort((a, b) => b.code.length - a.code.length)
            .find((item) => text.startsWith(item.code))

        return country
            ? { country: country.code, national: cleanNational(text.slice(country.code.length), country.code) }
            : { country: DEFAULT_COUNTRY, national: cleanNational(text.slice(1), DEFAULT_COUNTRY) }
    }

    return { country: DEFAULT_COUNTRY, national: cleanNational(text, DEFAULT_COUNTRY) }
}

export function formatPhone(value) {
    const { country, national } = parsePhone(value)

    return national ? `(${country}) ${formatNational(national)}` : ''
}

export function validatePhoneValue(value) {
    const { country, national } = parsePhone(value)

    return phoneError(country, national)
}
