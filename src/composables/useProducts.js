import { ref } from 'vue'
import { shopProducts } from '@/data/products'
import { USE_MOCK } from '@/services/http'
import { fetchProducts } from '@/services/productService'

const COLORS = ['Black', 'Cyan', 'Magenta', 'Yellow', 'CMYK']

const detectColor = (name) => COLORS.find((color) => new RegExp(`\\b${color}\\b`, 'i').test(name)) ?? ''

const fromApi = (product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    sku: product.sku,
    category: product.category,
    categorySlug: product.category_slug,
    description: `Produk ${product.category} dari AMAZiNK.`,
    longDescription: '',
    image: product.image,
    color: detectColor(product.name),
    volume: '',
    price: product.price,
    stock: 99,
    badge: '',
})

// Daftar produk diambil sekali, lalu dipakai bersama oleh semua halaman.
const products = ref(USE_MOCK ? shopProducts : [])
const loading = ref(!USE_MOCK)
const failed = ref(false)
let requested = false

function load() {
    if (USE_MOCK || requested) return
    requested = true

    fetchProducts()
        .then((list) => {
            products.value = list.map(fromApi)
        })
        .catch(() => {
            failed.value = true
            requested = false
        })
        .finally(() => {
            loading.value = false
        })
}

// Memuat ulang diam-diam: daftar lama tetap tampil bila permintaan gagal.
export async function refreshProducts() {
    if (USE_MOCK) return

    products.value = (await fetchProducts()).map(fromApi)
    failed.value = false
}

export function useProducts() {
    load()

    return { products, loading, failed, refreshProducts }
}
