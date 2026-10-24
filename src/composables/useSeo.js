import { onBeforeUnmount, watchEffect } from 'vue'

const SITE_NAME = 'AMAZiNK'
const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')
const DEFAULT_TITLE = 'AMAZiNK | Tinta, Toner, dan Printer'
const DEFAULT_DESCRIPTION =
    'AMAZiNK menyediakan tinta, toner, dan kebutuhan printer untuk rumah dan kantor. Cari tinta sesuai tipe printermu dan pesan online.'
const DEFAULT_IMAGE = '/og-default.jpg'

export const absoluteUrl = (value = '/') => (/^https?:\/\//.test(value) ? value : `${SITE_URL}${value}`)

const trim = (text, max = 160) => (text.length > max ? `${text.slice(0, max - 1).trim()}…` : text)

function setMeta(attr, key, content) {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`)

    if (!content) {
        el?.remove()
        return
    }

    if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
    }

    el.setAttribute('content', content)
}

function setCanonical(href) {
    let el = document.head.querySelector('link[rel="canonical"]')

    if (!href) {
        el?.remove()
        return
    }

    if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', 'canonical')
        document.head.appendChild(el)
    }

    el.setAttribute('href', href)
}

export function applySeo({ title, description, image, path = '/', type = 'website', noindex = false } = {}) {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE
    const desc = trim(description || DEFAULT_DESCRIPTION)
    const url = SITE_URL ? `${SITE_URL}${path}` : ''

    document.title = fullTitle
    setMeta('name', 'description', desc)
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonical(noindex ? '' : url)

    setMeta('property', 'og:title', fullTitle)
    setMeta('property', 'og:description', desc)
    setMeta('property', 'og:type', type)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', absoluteUrl(image || DEFAULT_IMAGE))
    setMeta('name', 'twitter:card', 'summary_large_image')
}

// For pages whose data loads at runtime (product detail, news detail)
export function useSeo(getOptions) {
    watchEffect(() => applySeo(getOptions()))
}

export function useJsonLd(key, getData) {
    const id = `ld-${key}`

    watchEffect(() => {
        document.getElementById(id)?.remove()

        const data = getData()
        if (!data) return

        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.id = id
        script.textContent = JSON.stringify(data)
        document.head.appendChild(script)
    })

    onBeforeUnmount(() => document.getElementById(id)?.remove())
}