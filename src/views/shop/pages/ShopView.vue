<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import ShopHero from '../components/ShopHero.vue'
import ProductCategories from '../components/ProductCategories.vue'
import ProductCard from '../components/ProductCard.vue'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'
import PrinterFinderMini from '../components/PrinterFinderMini.vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const list = usePageSection('catalog', 'list', {
    eyebrow: 'Katalog AMAZiNK',
    title: 'Temukan kebutuhan cetakmu',
    search_placeholder: 'Cari nama produk atau kode...',
})

const help = usePageSection('catalog', 'help', {
    eyebrow: 'BUTUH BANTUAN?',
    title: 'Bingung memilih tinta\nuntuk printermu?',
    description: 'Pilih seri printer, kami tunjukkan tinta yang cocok.',
    button_label: 'Buka halaman lengkap',
    button_link: '/cari-tinta',
})

const { products, loading, failed, refreshProducts } = useProducts()

// Harga dan gambar bisa berubah setelah sinkronisasi di admin, jadi daftar dimuat ulang berkala.
usePolling(refreshProducts, 30000)

// Kategori mengikuti produk yang ada.
const categories = computed(() => {
    const seen = new Map()
    for (const product of products.value) seen.set(product.categorySlug, product.category)

    return [
        { name: 'Semua Produk', slug: 'all' },
        ...[...seen].map(([slug, name]) => ({ name, slug })),
    ]
})


const route = useRoute()
const activeCategory = ref(String(route.query.kategori || 'all'))
const searchQuery = ref('')
const activeColor = ref('all')
const showAllProducts = ref(false)

const initialProductCount = 8

const colorOptions = [
    { label: 'Semua warna', value: 'all' },
    { label: 'Black', value: 'Black' },
    { label: 'Cyan', value: 'Cyan' },
    { label: 'Magenta', value: 'Magenta' },
    { label: 'Yellow', value: 'Yellow' },
    { label: 'CMYK', value: 'CMYK' },
]

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const filteredProducts = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return products.value.filter((product) => {
        const matchesCategory =
            activeCategory.value === 'all' ||
            product.categorySlug === activeCategory.value

        const matchesColor =
            activeColor.value === 'all' ||
            product.color === activeColor.value

        const matchesSearch =
            !query ||
            product.name.toLowerCase().includes(query) ||
            product.sku.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)

        return matchesCategory && matchesColor && matchesSearch
    })
})

const visibleProducts = computed(() =>
    showAllProducts.value
        ? filteredProducts.value
        : filteredProducts.value.slice(0, initialProductCount)
)

const hasActiveFilters = computed(() =>
    activeCategory.value !== 'all' ||
    activeColor.value !== 'all' ||
    searchQuery.value.trim() !== ''
)

const resetFilters = () => {
    activeCategory.value = 'all'
    activeColor.value = 'all'
    searchQuery.value = ''
    showAllProducts.value = false
}

// Alamat dengan kategori yang tidak ada (misalnya dari tautan lama) kembali menampilkan semua produk.
watch(categories, (list) => {
    if (products.value.length && !list.some((category) => category.slug === activeCategory.value)) {
        activeCategory.value = 'all'
    }
}, { immediate: true })

watch(
    [activeCategory, activeColor, searchQuery],
    () => {
        showAllProducts.value = false
    }
)
</script>

<template>
    <div class="min-h-screen overflow-clip bg-white text-[#171717] antialiased">
        <!-- Hero -->
        <ShopHero />

        <!-- Catalog -->
        <section id="daftar-produk" class="scroll-mt-18 sm:scroll-mt-22">
            <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
                <!-- Heading -->
                <header class="mb-8 text-center">
                    <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                        {{ list.eyebrow }}
                    </p>
                    <h2
                        class="mt-2.5 text-[clamp(26px,3vw,36px)] font-semibold leading-[1.2] tracking-[-0.045em] text-[#171717]">
                        <AccentText :text="list.title" />
                    </h2>
                </header>

                <!-- Categories -->
                <div class="mb-5 min-w-0 max-w-full sm:mb-6">
                    <ProductCategories :categories="categories" :active-category="activeCategory"
                        @select="activeCategory = $event" />
                </div>

                <!-- Search and color filter -->
                <div
                    class="mt-5 flex flex-col gap-1 rounded-3xl bg-white p-1.5 shadow-[0_2px_14px_rgba(0,0,0,0.05)] ring-1 ring-black/5 sm:mt-6 sm:flex-row sm:items-center sm:rounded-full">
                    <label
                        class="relative flex h-12 min-w-0 flex-1 items-center rounded-full transition-colors focus-within:bg-[#f7f7f5]">
                        <span class="sr-only">Cari produk</span>

                        <svg class="pointer-events-none absolute left-4 h-4.5 w-4.5 shrink-0 text-[#858585]"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input v-model="searchQuery" type="search" :placeholder="list.search_placeholder"
                            autocomplete="off"
                            class="block h-full w-full min-w-0 rounded-full border-0 bg-transparent pl-11 pr-11 text-sm text-[#171717] outline-none placeholder:text-[#a3a3a3] [&::-webkit-search-cancel-button]:hidden" />

                        <button v-if="searchQuery" type="button" aria-label="Hapus pencarian"
                            class="absolute right-2.5 grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-xl text-[#777] transition-colors hover:bg-gray-200/70"
                            @click="searchQuery = ''">
                            ×
                        </button>
                    </label>

                    <div class="hidden h-6 w-px bg-gray-200 sm:block" aria-hidden="true" />

                    <label class="relative block sm:w-56">
                        <span class="sr-only">Warna</span>

                        <select v-model="activeColor"
                            class="h-12 w-full cursor-pointer appearance-none rounded-full border-0 bg-transparent pl-4 pr-10 text-sm text-[#292524] outline-none transition-colors hover:bg-[#f7f7f5] focus:bg-[#f7f7f5]">
                            <option v-for="color in colorOptions" :key="color.value" :value="color.value">
                                {{ color.value === 'all' ? 'Semua warna' : `Warna: ${color.label}` }}
                            </option>
                        </select>

                        <svg class="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </label>
                </div>

                <!-- Results bar -->
                <div
                    class="mt-3.5 flex min-h-10.5 items-center justify-between gap-3 border-b border-[#e7e5e4] sm:mt-4.5 sm:min-h-11.5">
                    <p class="m-0 text-[11px] text-[#737373] sm:text-xs">
                        <span class="font-semibold text-[#171717]">{{ filteredProducts.length }}</span>
                        produk ditemukan
                    </p>

                    <button v-if="hasActiveFilters" type="button"
                        class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-0 bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-brand-red transition-colors hover:bg-red-100 sm:text-xs"
                        @click="resetFilters">
                        Reset filter
                        <span aria-hidden="true">↺</span>
                    </button>
                </div>

                <!-- Products -->
                <div v-if="filteredProducts.length"
                    class="mt-3.5 grid grid-cols-2 items-stretch gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-4.5">
                    <ProductCard v-for="product in visibleProducts" :key="product.id" :product="{
                        ...product,
                        priceLabel: formatPrice(product.price),
                    }" />
                </div>

                <!-- Empty state -->
                <div v-else
                    class="flex min-h-65 flex-col items-center justify-center px-3 py-12 text-center sm:min-h-75 sm:px-5">
                    <div class="grid h-13.5 w-13.5 place-items-center rounded-full border border-[#e7e5e4] bg-[#f7f7f5] text-[#737373]"
                        aria-hidden="true">
                        <svg class="h-5.5 w-5.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>
                    </div>

                    <h3 class="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#171717]">
                        {{ loading ? 'Memuat produk...' : failed ? 'Produk gagal dimuat' : products.length ? 'Produk tidak ditemukan' : 'Belum ada produk' }}
                    </h3>

                    <p v-if="failed" class="mt-2 max-w-80 text-[13px] leading-[1.8] text-[#737373]">
                        Periksa koneksi lalu muat ulang halaman.
                    </p>
                    <p v-else-if="products.length" class="mt-2 max-w-80 text-[13px] leading-[1.8] text-[#737373]">
                        Coba kata kunci, kategori, atau warna lainnya.
                    </p>

                    <button v-if="products.length" type="button"
                        class="mt-5.5 min-h-10.5 cursor-pointer rounded-full border-0 bg-[#171717] px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-red"
                        @click="resetFilters">
                        Tampilkan semua produk
                    </button>
                </div>

                <!-- Show more -->
                <div v-if="filteredProducts.length > initialProductCount" class="mt-7 flex justify-center sm:mt-9">
                    <button type="button" :aria-expanded="showAllProducts"
                        class="inline-flex min-h-10.75 w-full max-w-75 cursor-pointer items-center justify-center gap-3 rounded-full border border-[#d6d3d1] bg-white px-5.5 text-xs font-semibold text-[#292524] transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-red sm:min-h-11 sm:w-auto"
                        @click="showAllProducts = !showAllProducts">
                        {{ showAllProducts ? 'Tampilkan lebih sedikit' : 'Lihat semua produk' }}

                        <svg class="h-3.75 w-3.75 transition-transform duration-200"
                            :class="{ 'rotate-180': showAllProducts }" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
                            aria-hidden="true">
                            <path d="M12 5v14" />
                            <path d="m5 12 7 7 7-7" />
                        </svg>
                    </button>
                </div>
            </div>
        </section>

        <!-- Pemilih printer -->
        <section id="cari-tinta" class="scroll-mt-[72px] px-5 py-9 sm:scroll-mt-[88px] sm:px-6 sm:py-16"
            aria-labelledby="shop-promo-title">
            <div class="mx-auto max-w-295 border-y border-[#e7e5e4] py-7.5 sm:py-10">
                <div class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end sm:gap-8">
                    <div class="max-w-162.5">
                        <span class="mb-3.5 inline-block text-[11px] font-bold tracking-[0.14em] text-brand-red">
                            {{ help.eyebrow }}
                        </span>

                        <h2 id="shop-promo-title"
                            class="m-0 max-w-145 text-[30px] font-semibold leading-[1.15] tracking-[-0.045em] text-[#171717] sm:text-[clamp(28px,3.5vw,42px)]">
                            <AccentText :text="help.title" />
                        </h2>

                        <p class="mt-3 max-w-115 text-[13px] leading-[1.8] text-[#737373] sm:mt-4 sm:text-sm">
                            {{ help.description }}
                        </p>
                    </div>

                    <RouterLink :to="help.button_link"
                        class="inline-flex min-h-11.5 w-full shrink-0 items-center justify-center gap-4.5 rounded-full bg-[#171717] px-6 text-[13px] font-semibold text-white no-underline transition-all duration-200 hover:gap-6 hover:bg-brand-red motion-reduce:transition-none sm:min-h-12 sm:w-auto">
                        {{ help.button_label }}
                        <svg class="h-4.5 w-4.5 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                            <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </RouterLink>
                </div>

                <PrinterFinderMini class="mt-8" />
            </div>
        </section>
    </div>
</template>
