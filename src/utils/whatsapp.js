export const WA_PHONE = '6282226667233'

export const waLink = (message = '') =>
    `https://wa.me/${WA_PHONE}${message ? `?text=${encodeURIComponent(message)}` : ''}`