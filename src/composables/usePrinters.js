import { computed, ref } from 'vue'
import { shopProducts } from '@/data/products'
import { brands as mockBrands, groups as mockGroups } from '@/views/finder/data/printers'
import { USE_MOCK } from '@/services/http'
import { fetchPrinters } from '@/services/printerService'
import { mapProduct } from './useProducts'

// Bentuk satu printer untuk halaman rekomendasi:
// { id, brandId, brandName, model, label, kind, products: [produk siap masuk keranjang], set }
const idOf = (text) => String(text ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')
const titleCase = (text) => (text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '')
// Urutan tinta yang rapi: Black, Cyan, Magenta, Yellow.
const COLOR_ORDER = ['Black', 'Cyan', 'Magenta', 'Yellow', 'CMYK']
const colorRank = (color) => (COLOR_ORDER.includes(color) ? COLOR_ORDER.indexOf(color) : COLOR_ORDER.length)
const natural = (a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' })

const fromApi = (printer) => {
    const products = printer.inks.map(mapProduct).sort((x, y) => colorRank(x.color) - colorRank(y.color))

    return {
        id: String(printer.id),
        brandId: idOf(printer.brand),
        brandName: printer.brand,
        model: printer.model,
        label: printer.series ? `${printer.brand} ${printer.series} Series` : printer.brand,
        kind: titleCase(products[0]?.category) || 'Tinta',
        products,
        set: null,
    }
}

// Mode dummy memakai data lokal agar halaman tetap bisa dicoba tanpa backend.
const fromMock = () =>
    mockGroups.flatMap((group) =>
        group.models.map((model) => ({
            id: `${group.id}-${model}`,
            brandId: group.brand,
            brandName: mockBrands.find((b) => b.id === group.brand)?.name ?? '',
            model,
            label: group.label,
            kind: group.kind,
            products: group.products.map((slug) => shopProducts.find((p) => p.slug === slug)).filter(Boolean),
            set: group.set ? shopProducts.find((p) => p.slug === group.set) ?? null : null,
        }))
    )

// Daftar printer diambil sekali, lalu dipakai bersama oleh halaman Cari Tinta dan pemilih di katalog.
const printers = ref(USE_MOCK ? fromMock() : [])
const loading = ref(!USE_MOCK)
const failed = ref(false)
let requested = false

function load() {
    if (USE_MOCK || requested) return
    requested = true

    fetchPrinters()
        .then((list) => {
            printers.value = list.map(fromApi)
        })
        .catch(() => {
            failed.value = true
            requested = false
        })
        .finally(() => {
            loading.value = false
        })
}

export function usePrinters() {
    load()

    // Daftar merek diturunkan dari data, jadi merek baru dari admin otomatis muncul.
    const brands = computed(() => {
        const seen = new Map()

        for (const item of printers.value) {
            if (!seen.has(item.brandId)) seen.set(item.brandId, { id: item.brandId, name: item.brandName })
        }

        return [...seen.values()].sort((a, b) => natural(a.name, b.name))
    })

    const sorted = computed(() =>
        [...printers.value].sort((a, b) => natural(a.brandName, b.brandName) || natural(a.model, b.model))
    )

    return { printers: sorted, brands, loading, failed }
}
