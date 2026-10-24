// Isi berita dari admin berupa HTML. Sebelum ditampilkan dengan v-html, buang elemen dan atribut
// yang bisa menjalankan skrip, sehingga hanya format teks dasar yang lolos.
const ALLOWED_TAGS = new Set([
    'P', 'BR', 'H1', 'H2', 'H3', 'H4', 'STRONG', 'B', 'EM', 'I', 'U', 'S', 'A', 'UL', 'OL', 'LI',
    'BLOCKQUOTE', 'IMG', 'SPAN', 'DIV', 'HR', 'PRE', 'CODE', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD',
])
const ALLOWED_ATTRS = { A: ['href', 'title'], IMG: ['src', 'alt', 'title'] }
const SAFE_URL = /^(https?:|mailto:|tel:|\/|#)/i

export function sanitizeHtml(html) {
    const doc = new DOMParser().parseFromString(String(html ?? ''), 'text/html')

    const clean = (node) => {
        for (const child of [...node.childNodes]) {
            if (child.nodeType === Node.TEXT_NODE) {
                // Editor sering menyimpan spasi biasa sebagai spasi tak terputus, sehingga kalimat tidak bisa turun baris.
                child.textContent = child.textContent.replace(/ /g, ' ')
                continue
            }

            if (child.nodeType !== Node.ELEMENT_NODE || !ALLOWED_TAGS.has(child.tagName)) {
                // Elemen tak dikenal dibuang; teks di dalamnya tetap dipertahankan kecuali skrip/gaya.
                if (child.nodeType === Node.ELEMENT_NODE && !['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED'].includes(child.tagName)) {
                    clean(child)
                    child.replaceWith(...child.childNodes)
                } else {
                    child.remove()
                }
                continue
            }

            const allowed = ALLOWED_ATTRS[child.tagName] ?? []
            for (const attr of [...child.attributes]) {
                const keep = allowed.includes(attr.name) && (!['href', 'src'].includes(attr.name) || SAFE_URL.test(attr.value.trim()))
                if (!keep) child.removeAttribute(attr.name)
            }

            if (child.tagName === 'A') {
                child.setAttribute('rel', 'noopener noreferrer')
                if (/^https?:/i.test(child.getAttribute('href') ?? '')) child.setAttribute('target', '_blank')
            }

            // Gambar yang alamatnya dibuang (tidak aman) tidak ditampilkan sama sekali.
            if (child.tagName === 'IMG' && !child.getAttribute('src')) {
                child.remove()
                continue
            }

            clean(child)
        }
    }

    clean(doc.body)
    return doc.body.innerHTML
}
