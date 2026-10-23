<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useCart } from '@/composables/useCart'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'

const route = useRoute()
const router = useRouter()
const { add, qtyInCart } = useCart()


const { products, loading, refreshProducts } = useProducts()
usePolling(refreshProducts, 30000)

const product = computed(() => products.value.find((item) => item.slug === route.params.slug))

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

/* ---------- Keranjang ---------- */
const qty = ref(1)
const added = ref(false)
let addedTimer

const inCart = computed(() => (product.value ? qtyInCart(product.value.slug) : 0))
const room = computed(() => (product.value ? Math.max(0, product.value.stock - inCart.value) : 0))
const canBuy = computed(() => room.value > 0)
const total = computed(() => (product.value ? product.value.price * qty.value : 0))

watch(room, (value) => {
    if (qty.value > value) qty.value = Math.max(1, value)
})

function clampQty(value) {
    return Math.min(Math.max(1, value), Math.max(1, room.value))
}

const changeQty = (step) => {
    qty.value = clampQty(qty.value + step)
}

function onQtyChange(event) {
    const parsed = parseInt(event.target.value, 10)
    qty.value = clampQty(Number.isFinite(parsed) ? parsed : 1)
    event.target.value = qty.value
}

function addToCart() {
    if (!product.value || !canBuy.value) return false

    add(product.value, { qty: qty.value })
    qty.value = 1
    added.value = true
    clearTimeout(addedTimer)
    addedTimer = setTimeout(() => {
        added.value = false
    }, 2400)
    return true
}

function buyNow() {
    if (addToCart()) router.push('/keranjang')
}

/* ---------- Tab, zoom, bagikan ---------- */
const tab = ref('deskripsi')
const zoomOpen = ref(false)
const copied = ref(false)
let copiedTimer

async function copyLink() {
    try {
        await navigator.clipboard.writeText(window.location.href)
        copied.value = true
        clearTimeout(copiedTimer)
        copiedTimer = setTimeout(() => {
            copied.value = false
        }, 2000)
    } catch {
        // Clipboard bisa diblokir browser
    }
}

const waShareUrl = computed(
    () =>
        `https://wa.me/?text=${encodeURIComponent(
            `${product.value?.name ?? ''} - AMAZiNK\n${typeof window !== 'undefined' ? window.location.href : ''}`
        )}`
)

/* ---------- Spesifikasi ---------- */
const swatches = {
    Black: 'bg-black',
    Cyan: 'bg-cyan-400',
    Magenta: 'bg-fuchsia-500',
    Yellow: 'bg-yellow-400',
    CMYK: 'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400',
}

const specs = computed(() => {
    const p = product.value
    if (!p) return []

    return [
        { label: 'Kode produk', value: p.sku },
        { label: 'Kategori', value: p.category },
        p.color && { label: 'Warna', value: p.color, swatch: swatches[p.color] },
        p.volume && { label: 'Ukuran / Isi', value: p.volume },
        { label: 'Merek', value: 'AMAZiNK' },
    ].filter(Boolean)
})

/* ---------- Produk terkait ---------- */
const detailBase = computed(() => route.path.replace(/\/$/, '').replace(/[^/]+$/, ''))

const related = computed(() => {
    if (!product.value) return []

    const others = products.value.filter((item) => item.slug !== product.value.slug)
    const same = others.filter((item) => item.category === product.value.category)
    const rest = others.filter((item) => item.category !== product.value.category)
    return [...same, ...rest].slice(0, 4)
})

/* ---------- Efek samping ---------- */
watch(
    () => route.params.slug,
    () => {
        qty.value = 1
        tab.value = 'deskripsi'
        added.value = false
        zoomOpen.value = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
)

watch(zoomOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

const onKeydown = (event) => {
    if (event.key === 'Escape') zoomOpen.value = false
}

onMounted(() => window.addEventListener('keydown', onKeydown))

onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
    clearTimeout(addedTimer)
    clearTimeout(copiedTimer)
})
</script>

<template>
    <main class="min-h-screen bg-[#fafaf9] text-gray-950">
        <!-- Breadcrumb -->
        <div class="border-b border-gray-200/70 bg-white">
            <div class="mx-auto max-w-7xl px-5 py-4 sm:px-8">
                <nav class="flex flex-wrap items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
                    <RouterLink to="/" class="transition-colors hover:text-brand-red">Beranda</RouterLink>
                    <span class="text-gray-300">/</span>
                    <RouterLink to="/catalog-produk#daftar-produk" class="transition-colors hover:text-brand-red">
                        Katalog Produk
                    </RouterLink>
                    <span class="text-gray-300">/</span>
                    <span class="max-w-55 truncate font-medium text-gray-800">
                        {{ product?.name || (loading ? 'Memuat produk...' : 'Produk tidak ditemukan') }}
                    </span>
                </nav>
            </div>
        </div>

        <!-- Detail Produk -->
        <section v-if="product" class="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
            <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
                <!-- Gambar -->
                <div class="min-w-0">
                    <div
                        class="group relative flex aspect-square max-h-160 items-center justify-center overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-8 sm:p-12">
                        <div
                            class="pointer-events-none absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100/70" />

                        <img v-if="product.image" :src="product.image" :alt="product.name" fetchpriority="high"
                            class="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.04]" />

                        <div v-else class="relative flex flex-col items-center text-center">
                            <div
                                class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.5" aria-hidden="true">
                                    <rect x="3" y="4" width="18" height="16" rx="2" />
                                    <circle cx="8.5" cy="9" r="1.5" />
                                    <path d="m21 15-5-5L5 20" />
                                </svg>
                            </div>
                            <p class="mt-4 text-sm font-medium text-gray-600">Gambar belum tersedia</p>
                        </div>

                        <span
                            class="absolute left-5 top-5 rounded-full border border-gray-200 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600 shadow-sm backdrop-blur sm:left-6 sm:top-6">
                            {{ product.category }}
                        </span>

                        <button v-if="product.image" type="button" aria-label="Perbesar gambar"
                            class="absolute right-5 top-5 grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-gray-200 bg-white/90 text-gray-600 shadow-sm backdrop-blur transition-colors hover:text-brand-red sm:right-6 sm:top-6"
                            @click="zoomOpen = true">
                            <svg class="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
                            </svg>
                        </button>

                        <span v-if="product.stock === 0"
                            class="absolute bottom-5 left-5 rounded-full bg-red-50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-700 sm:bottom-6 sm:left-6">
                            Stok habis
                        </span>
                    </div>

                    <p class="mb-0 mt-4 px-1 text-xs text-gray-400">
                        Kode produk
                        <span class="ml-1 font-medium text-gray-600">{{ product.sku }}</span>
                    </p>
                </div>

                <!-- Informasi -->
                <div class="min-w-0 lg:pt-2">
                    <p class="m-0 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
                        {{ product.category }}
                    </p>

                    <h1
                        class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-[40px]">
                        {{ product.name }}
                    </h1>

                    <p class="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                        {{ product.description }}
                    </p>

                    <!-- Kartu beli -->
                    <div class="mt-6 max-w-md rounded-2xl border border-gray-200 bg-white p-4">
                        <div class="flex items-center justify-between gap-3">
                            <p class="m-0 text-2xl font-bold tracking-tight text-gray-950">
                                {{ formatPrice(product.price) }}
                            </p>

                            <span
                                class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                                :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'">
                                <span class="h-1.5 w-1.5 rounded-full"
                                    :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'" />
                                {{ product.stock > 0 ? 'Stok tersedia' : 'Stok habis' }}
                            </span>
                        </div>

                        <div class="mt-3 flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                            <div class="inline-flex h-9 items-center overflow-hidden rounded-lg border border-gray-200 bg-white"
                                :class="{ 'opacity-50': !canBuy }">
                                <button type="button" aria-label="Kurangi jumlah" :disabled="!canBuy || qty <= 1"
                                    class="grid h-full w-9 cursor-pointer place-items-center border-0 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                    @click="changeQty(-1)">
                                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" aria-hidden="true">
                                        <path d="M5 12h14" />
                                    </svg>
                                </button>

                                <input :value="qty" type="text" inputmode="numeric" aria-label="Jumlah produk"
                                    :disabled="!canBuy"
                                    class="h-full w-10 border-0 bg-transparent text-center text-[13px] font-semibold text-gray-900 outline-none"
                                    @change="onQtyChange" />

                                <button type="button" aria-label="Tambah jumlah" :disabled="!canBuy || qty >= room"
                                    class="grid h-full w-9 cursor-pointer place-items-center border-0 bg-transparent text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
                                    @click="changeQty(1)">
                                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" aria-hidden="true">
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </button>
                            </div>

                            <p v-if="canBuy" class="m-0 text-right text-[13px] text-gray-500">
                                Total
                                <span class="ml-1 text-base font-bold tracking-tight text-gray-950">{{
                                    formatPrice(total) }}</span>
                            </p>
                        </div>

                        <div class="mt-3 grid grid-cols-2 gap-2">
                            <button type="button" :disabled="!canBuy"
                                class="inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 border-gray-900 bg-white px-3 transition duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:opacity-60"
                                :class="added ? '!border-emerald-600 !bg-emerald-600' : ''" :style="{
                                    color: added ? '#ffffff' : canBuy ? '#171717' : '#9ca3af',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }" @click="addToCart">
                                <svg v-if="!added" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                                    aria-hidden="true">
                                    <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
                                    <circle cx="10" cy="20" r="1" />
                                    <circle cx="18" cy="20" r="1" />
                                </svg>
                                <svg v-else class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                    <path d="m5 12 5 5L20 7" />
                                </svg>
                                {{ added ? 'Ditambahkan' : 'Keranjang' }}
                            </button>

                            <button type="button" :disabled="!canBuy"
                                class="inline-flex h-11 cursor-pointer items-center justify-center rounded-lg border-0 bg-brand-red px-3 transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200"
                                :style="{ color: canBuy ? '#ffffff' : '#9ca3af', fontSize: '13px', fontWeight: 600 }"
                                @click="buyNow">
                                Beli Sekarang
                            </button>
                        </div>

                        <p class="mb-0 mt-3 min-h-4 text-[11.5px] leading-4 text-gray-500" aria-live="polite">
                            <template v-if="added">
                                Produk masuk ke keranjang.
                                <RouterLink to="/keranjang"
                                    class="font-semibold text-brand-red no-underline hover:underline">
                                    Lihat keranjang
                                </RouterLink>
                            </template>
                            <template v-else-if="product.stock === 0">
                                Stok sedang kosong. Hubungi tim kami untuk informasi ketersediaan berikutnya.
                            </template>
                            <template v-else-if="!canBuy">
                                Seluruh stok produk ini sudah ada di keranjangmu.
                                <RouterLink to="/keranjang"
                                    class="font-semibold text-brand-red no-underline hover:underline">
                                    Lihat keranjang
                                </RouterLink>
                            </template>
                            <template v-else>
                                {{ room }} unit tersedia<template v-if="inCart"> · {{ inCart }} sudah di
                                    keranjang</template>
                            </template>
                        </p>
                    </div>

                    <!-- Bagikan -->
                    <div class="mt-4 flex flex-wrap items-center gap-2">
                        <span class="mr-1 text-xs font-medium text-gray-500">Bagikan</span>

                        <button type="button"
                            class="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 transition-colors hover:border-brand-red/40"
                            style="color: #374151; font-size: 12px; font-weight: 600" @click="copyLink">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
                                <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
                            </svg>
                            {{ copied ? 'Tautan disalin' : 'Salin tautan' }}
                        </button>

                        <!-- Hanya tampil di HP -->
                        <a :href="waShareUrl" target="_blank" rel="noopener noreferrer"
                            class="inline-flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 no-underline transition-colors hover:border-brand-red/40 sm:hidden"
                            style="color: #374151; font-size: 12px; font-weight: 600">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
                            </svg>
                            Kirim via WhatsApp
                        </a>
                    </div>

                    <div class="mt-6 flex items-start gap-2.5 text-xs leading-6 text-gray-400">
                        <svg class="mt-1 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 11v5" />
                            <path d="M12 8h.01" />
                        </svg>
                        <p class="m-0">
                            Pastikan produk sesuai dengan tipe printer yang digunakan. Hubungi tim AMAZiNK jika
                            membutuhkan bantuan memilih produk.
                        </p>
                    </div>
                </div>
            </div>

            <!-- Tab -->
            <div class="mt-10 overflow-hidden rounded-3xl border border-gray-200/70 bg-white sm:mt-14">
                <div class="flex gap-1 border-b border-gray-100 px-3 sm:px-6" role="tablist">
                    <button
                        v-for="item in [{ id: 'deskripsi', label: 'Deskripsi' }, { id: 'spesifikasi', label: 'Spesifikasi' }]"
                        :key="item.id" type="button" role="tab" :aria-selected="tab === item.id"
                        class="-mb-px cursor-pointer border-0 border-b-2 bg-transparent px-4 py-4 transition-colors"
                        :class="tab === item.id ? 'border-brand-red' : 'border-transparent hover:border-gray-200'"
                        :style="{
                            color: tab === item.id ? '#171717' : '#6b7280',
                            fontSize: '14px',
                            fontWeight: 600,
                        }" @click="tab = item.id">
                        {{ item.label }}
                    </button>
                </div>

                <div class="p-5 sm:p-8" role="tabpanel">
                    <div v-if="tab === 'deskripsi'" class="max-w-3xl">
                        <p class="m-0 text-sm leading-8 text-gray-600 sm:text-[15px]">
                            {{ product.longDescription || product.description }}
                        </p>
                    </div>

                    <dl v-else class="m-0 max-w-2xl divide-y divide-gray-100">
                        <div v-for="row in specs" :key="row.label"
                            class="flex items-center justify-between gap-4 py-3.5">
                            <dt class="text-sm text-gray-500">{{ row.label }}</dt>
                            <dd class="m-0 flex items-center gap-2 text-right text-sm font-semibold text-gray-900">
                                <span v-if="row.swatch" class="h-3 w-3 rounded-full border border-black/10"
                                    :class="row.swatch" />
                                {{ row.value }}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <!-- Produk terkait -->
            <div class="mt-12 sm:mt-16">
                <div class="mb-5 flex items-end justify-between gap-4">
                    <h2 class="m-0 text-xl font-bold tracking-tight sm:text-2xl">Produk lainnya</h2>
                    <RouterLink to="/catalog-produk#daftar-produk"
                        class="text-[13px] font-semibold text-brand-red no-underline hover:underline">
                        Lihat semua
                    </RouterLink>
                </div>

                <div class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
                    <RouterLink v-for="item in related" :key="item.slug" :to="`${detailBase}${item.slug}`"
                        class="group block overflow-hidden rounded-2xl border border-gray-200/70 bg-white text-inherit no-underline transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.1)]">
                        <span
                            class="relative flex aspect-square items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100/70 p-5">
                            <img v-if="item.image" :src="item.image" :alt="item.name" loading="lazy"
                                class="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                            <svg v-else class="h-9 w-9 text-gray-300" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <circle cx="8.5" cy="9" r="1.5" />
                                <path d="m21 15-5-5L5 20" />
                            </svg>

                            <span v-if="item.stock === 0"
                                class="absolute left-3 top-3 rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-red-700">
                                Habis
                            </span>
                        </span>

                        <span class="block p-4">
                            <span class="block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                                {{ item.category }}
                            </span>
                            <span class="mt-1 line-clamp-2 block text-[13px] font-semibold leading-5 text-gray-900">
                                {{ item.name }}
                            </span>
                            <span class="mt-2 block text-sm font-bold text-gray-950">
                                {{ formatPrice(item.price) }}
                            </span>
                        </span>
                    </RouterLink>
                </div>
            </div>
        </section>

        <!-- Produk tidak ditemukan -->
        <section v-else-if="!loading"
            class="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
                <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                    <path d="M8.5 11h5" />
                </svg>
            </div>

            <p class="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">Katalog AMAZiNK</p>

            <h1 class="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">Produk tidak ditemukan</h1>

            <p class="mt-3 max-w-md text-sm leading-7 text-gray-500">
                Produk mungkin sudah tidak tersedia atau alamat halaman tidak valid. Silakan kembali ke katalog
                untuk melihat produk lainnya.
            </p>

            <RouterLink to="/catalog-produk#daftar-produk"
                class="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white no-underline transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100">
                Kembali ke katalog
                <span aria-hidden="true">→</span>
            </RouterLink>
        </section>

        <!-- Zoom gambar -->
        <Teleport to="body">
            <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="zoomOpen && product?.image"
                    class="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm sm:p-10"
                    role="dialog" aria-modal="true" :aria-label="product.name" @click.self="zoomOpen = false">
                    <button type="button" aria-label="Tutup"
                        class="absolute right-4 top-4 grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
                        @click="zoomOpen = false">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" class="h-5 w-5" aria-hidden="true">
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>

                    <img :src="product.image" :alt="product.name"
                        class="max-h-full max-w-full rounded-2xl bg-white object-contain p-6 shadow-2xl" />
                </div>
            </Transition>
        </Teleport>
    </main>
</template>