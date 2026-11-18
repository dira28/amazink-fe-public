const HEADER_OFFSET = 88

// Gulir halus ke bagian di halaman yang sama, lalu bagian tujuan muncul naik sedikit sambil memudar masuk.
// Dipakai pada tautan "#id" biasa agar tidak melompat; tautan tanpa target tetap berjalan normal.
export function scrollToSection(event) {
    const id = event.currentTarget.getAttribute('href')?.slice(1)
    const target = id ? document.getElementById(id) : null
    if (!target) return

    event.preventDefault()

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' })
    history.replaceState(null, '', `#${id}`)
    if (reduced) return

    target.animate(
        [
            { opacity: 0.35, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'none' },
        ],
        { duration: 700, delay: 150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
    )
}
