import { computed, ref } from 'vue'
import { fetchPage } from '@/services/pageService'

// Satu halaman hanya diambil sekali, lalu dipakai bersama oleh semua komponen.
const pages = new Map()

function loadPage(slug) {
    if (!pages.has(slug)) {
        const state = ref(null)
        pages.set(slug, state)

        fetchPage(slug)
            .then((page) => {
                state.value = page
            })
            .catch(() => {
                // Gagal memuat: komponen tetap memakai teks bawaan.
            })
    }

    return pages.get(slug)
}

// Isi dari API menimpa teks bawaan. Teks kosong tetap memakai bawaan;
// daftar (array) memakai daftar dari API apa adanya.
function mergeSection(defaults, data) {
    if (!data) return defaults

    const result = { ...defaults }

    for (const key of Object.keys(defaults)) {
        const value = data[key]

        if (Array.isArray(defaults[key])) {
            if (Array.isArray(value)) result[key] = value
        } else if (typeof value === 'string' && value.trim()) {
            result[key] = value
        }
    }

    return result
}

export function usePageSection(slug, key, defaults) {
    const page = loadPage(slug)

    return computed(() => mergeSection(defaults, page.value?.sections?.[key]))
}
