<script setup>
import { computed, ref, watch } from 'vue'

import ShopHero from '../components/ShopHero.vue'
import ProductCategories from '../components/ProductCategories.vue'
import ProductCard from '../components/ProductCard.vue'

const categories = [
    { name: 'Semua Produk', slug: 'all' },
    { name: 'Tinta Botol', slug: 'tinta-botol' },
    { name: 'Cartridge', slug: 'cartridge' },
    { name: 'Toner Laser', slug: 'toner-laser' },
    { name: 'Produk Lainnya', slug: 'lainnya' },
]

// Data dummy — nantinya bisa diganti dengan data API.
const products = [
    {
        id: 1,
        slug: 'amazink-ink-bottle-black',
        name: 'AMAZiNK Ink Bottle Black',
        sku: 'AMZ-INK-BLK-001',
        category: 'Tinta Botol',
        categorySlug: 'tinta-botol',
        description: 'Tinta hitam untuk kebutuhan cetak harian.',
        image: '/images/home/tinta.jpeg',
        color: 'Black',
        volume: '127 ml',
        price: 85000,
        stock: 25,
        badge: 'Pilihan',
    },
    {
        id: 2,
        slug: 'amazink-ink-bottle-cyan',
        name: 'AMAZiNK Ink Bottle Cyan',
        sku: 'AMZ-INK-CYN-002',
        category: 'Tinta Botol',
        categorySlug: 'tinta-botol',
        description: 'Tinta cyan untuk kebutuhan cetak berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'Cyan',
        volume: '70 ml',
        price: 75000,
        stock: 18,
        badge: '',
    },
    {
        id: 3,
        slug: 'amazink-ink-bottle-magenta',
        name: 'AMAZiNK Ink Bottle Magenta',
        sku: 'AMZ-INK-MAG-003',
        category: 'Tinta Botol',
        categorySlug: 'tinta-botol',
        description: 'Tinta magenta untuk cetak berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'Magenta',
        volume: '70 ml',
        price: 75000,
        stock: 12,
        badge: '',
    },
    {
        id: 4,
        slug: 'amazink-ink-cartridge-black',
        name: 'AMAZiNK Ink Cartridge Black',
        sku: 'AMZ-CAR-BLK-004',
        category: 'Cartridge',
        categorySlug: 'cartridge',
        description: 'Cartridge hitam untuk printer inkjet.',
        image: '',
        color: 'Black',
        volume: '',
        price: 95000,
        stock: 10,
        badge: 'Produk Baru',
    },
    {
        id: 5,
        slug: 'amazink-laser-toner-black',
        name: 'AMAZiNK Laser Toner Black',
        sku: 'AMZ-TNR-BLK-005',
        category: 'Toner Laser',
        categorySlug: 'toner-laser',
        description: 'Toner hitam untuk kebutuhan cetak dokumen.',
        image: '/images/home/toner.jpeg',
        color: 'Black',
        volume: '',
        price: 125000,
        stock: 8,
        badge: '',
    },
    {
        id: 6,
        slug: 'amazink-ink-bottle-yellow',
        name: 'AMAZiNK Ink Bottle Yellow',
        sku: 'AMZ-INK-YLW-006',
        category: 'Tinta Botol',
        categorySlug: 'tinta-botol',
        description: 'Tinta kuning untuk kebutuhan cetak berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'Yellow',
        volume: '70 ml',
        price: 75000,
        stock: 0,
        badge: '',
    },
    {
        id: 7,
        slug: 'amazink-printing-accessory',
        name: 'AMAZiNK Printing Accessory',
        sku: 'AMZ-ACC-007',
        category: 'Produk Lainnya',
        categorySlug: 'lainnya',
        description: 'Aksesori pendukung kebutuhan cetak.',
        image: '/images/home/aksesori.jpeg',
        color: '',
        volume: '',
        price: 45000,
        stock: 15,
        badge: '',
    },
    {
        id: 8,
        slug: 'amazink-ink-bottle-set',
        name: 'AMAZiNK Ink Bottle Set',
        sku: 'AMZ-INK-SET-008',
        category: 'Tinta Botol',
        categorySlug: 'tinta-botol',
        description: 'Paket tinta dengan beberapa pilihan warna.',
        image: '/images/home/tinta.jpeg',
        color: 'CMYK',
        volume: 'Set',
        price: 250000,
        stock: 6,
        badge: 'Paket',
    },
]

const activeCategory = ref('all')
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

    return products.filter((product) => {
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
        <section id="daftar-produk" class="scroll-mt-[72px] sm:scroll-mt-[88px]">
            <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
                <!-- Heading -->
                <header class="mb-8 text-center">
                    <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                        Katalog AMAZiNK
                    </p>
                    <h2
                        class="mt-2.5 text-[clamp(26px,3vw,36px)] font-semibold leading-[1.2] tracking-[-0.045em] text-[#171717]">
                        Temukan kebutuhan cetakmu
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

                        <svg class="pointer-events-none absolute left-4 h-[18px] w-[18px] shrink-0 text-[#858585]"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>

                        <input v-model="searchQuery" type="search" placeholder="Cari nama produk atau kode..."
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
                    class="mt-3.5 flex min-h-[42px] items-center justify-between gap-3 border-b border-[#e7e5e4] sm:mt-[18px] sm:min-h-[46px]">
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
                    class="mt-3.5 grid grid-cols-2 items-stretch gap-3 sm:mt-5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-[18px]">
                    <ProductCard v-for="product in visibleProducts" :key="product.id" :product="{
                        ...product,
                        priceLabel: formatPrice(product.price),
                    }" />
                </div>

                <!-- Empty state -->
                <div v-else
                    class="flex min-h-[260px] flex-col items-center justify-center px-3 py-12 text-center sm:min-h-[300px] sm:px-5">
                    <div class="grid h-[54px] w-[54px] place-items-center rounded-full border border-[#e7e5e4] bg-[#f7f7f5] text-[#737373]"
                        aria-hidden="true">
                        <svg class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-4-4" />
                        </svg>
                    </div>

                    <h3 class="mt-5 text-lg font-semibold tracking-[-0.025em] text-[#171717]">
                        Produk tidak ditemukan
                    </h3>

                    <p class="mt-2 max-w-[320px] text-[13px] leading-[1.8] text-[#737373]">
                        Coba kata kunci, kategori, atau warna lainnya.
                    </p>

                    <button type="button"
                        class="mt-[22px] min-h-[42px] cursor-pointer rounded-full border-0 bg-[#171717] px-5 text-xs font-semibold text-white transition-colors hover:bg-brand-red"
                        @click="resetFilters">
                        Tampilkan semua produk
                    </button>
                </div>

                <!-- Show more -->
                <div v-if="filteredProducts.length > initialProductCount" class="mt-7 flex justify-center sm:mt-9">
                    <button type="button" :aria-expanded="showAllProducts"
                        class="inline-flex min-h-[43px] w-full max-w-[300px] cursor-pointer items-center justify-center gap-3 rounded-full border border-[#d6d3d1] bg-white px-[22px] text-xs font-semibold text-[#292524] transition-colors hover:border-[#171717] hover:bg-[#171717] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-red sm:min-h-11 sm:w-auto"
                        @click="showAllProducts = !showAllProducts">
                        {{ showAllProducts ? 'Tampilkan lebih sedikit' : 'Lihat semua produk' }}

                        <svg class="h-[15px] w-[15px] transition-transform duration-200"
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

        <!-- Promo -->
        <section class="px-5 py-9 sm:px-6 sm:py-16" aria-labelledby="shop-promo-title">
            <div
                class="mx-auto flex max-w-[1180px] flex-col items-start gap-6 border-y border-[#e7e5e4] py-[30px] sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-10">
                <div class="max-w-[650px]">
                    <span class="mb-3.5 inline-block text-[11px] font-bold tracking-[0.14em] text-brand-red">
                        BUTUH BANTUAN?
                    </span>

                    <h2 id="shop-promo-title"
                        class="m-0 max-w-[580px] text-[30px] font-semibold leading-[1.15] tracking-[-0.045em] text-[#171717] sm:text-[clamp(28px,3.5vw,42px)]">
                        Bingung memilih tinta<br />
                        untuk printermu?
                    </h2>

                    <p class="mt-3 max-w-[460px] text-[13px] leading-[1.8] text-[#737373] sm:mt-4 sm:text-sm">
                        Kami bantu temukan tinta yang tepat untuk kebutuhan cetakmu.
                    </p>
                </div>

                <RouterLink to="/#pilih"
                    class="inline-flex min-h-[46px] w-full shrink-0 items-center justify-center gap-[18px] rounded-full bg-[#171717] px-5 text-[13px] font-semibold text-white no-underline transition-all duration-200 hover:gap-6 hover:bg-brand-red motion-reduce:transition-none sm:min-h-12 sm:w-auto">
                    Cari tinta
                    <svg class="h-[18px] w-[18px] shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </RouterLink>
            </div>
        </section>
    </div>
</template>
