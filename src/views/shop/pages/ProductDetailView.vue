<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

const products = [
    {
        slug: 'amazink-ink-bottle-black',
        name: 'AMAZiNK Ink Bottle Black',
        sku: 'AMZ-INK-BLK-001',
        category: 'Tinta Botol',
        description: 'Tinta hitam untuk kebutuhan cetak harian dengan hasil cetak yang jelas dan konsisten.',
        image: '/images/home/tinta.jpeg',
        color: 'Black',
        volume: '127 ml',
        price: 85000,
        stock: 25,
    },
    {
        slug: 'amazink-ink-bottle-cyan',
        name: 'AMAZiNK Ink Bottle Cyan',
        sku: 'AMZ-INK-CYN-002',
        category: 'Tinta Botol',
        description: 'Tinta cyan untuk kebutuhan cetak berwarna dengan hasil warna yang tajam.',
        image: '/images/home/tinta.jpeg',
        color: 'Cyan',
        volume: '70 ml',
        price: 75000,
        stock: 18,
    },
    {
        slug: 'amazink-ink-bottle-magenta',
        name: 'AMAZiNK Ink Bottle Magenta',
        sku: 'AMZ-INK-MAG-003',
        category: 'Tinta Botol',
        description: 'Tinta magenta untuk melengkapi kebutuhan cetak dokumen dan gambar berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'Magenta',
        volume: '70 ml',
        price: 75000,
        stock: 12,
    },
    {
        slug: 'amazink-ink-cartridge-black',
        name: 'AMAZiNK Ink Cartridge Black',
        sku: 'AMZ-CAR-BLK-004',
        category: 'Cartridge',
        description: 'Cartridge hitam untuk mendukung kebutuhan cetak dokumen sehari-hari.',
        image: '',
        color: 'Black',
        volume: '',
        price: 95000,
        stock: 10,
    },
    {
        slug: 'amazink-laser-toner-black',
        name: 'AMAZiNK Laser Toner Black',
        sku: 'AMZ-TNR-BLK-005',
        category: 'Toner Laser',
        description: 'Toner hitam untuk kebutuhan cetak dokumen dengan hasil yang tegas dan rapi.',
        image: '/images/home/toner.jpeg',
        color: 'Black',
        volume: '',
        price: 125000,
        stock: 8,
    },
    {
        slug: 'amazink-ink-bottle-yellow',
        name: 'AMAZiNK Ink Bottle Yellow',
        sku: 'AMZ-INK-YLW-006',
        category: 'Tinta Botol',
        description: 'Tinta kuning untuk kebutuhan cetak berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'Yellow',
        volume: '70 ml',
        price: 75000,
        stock: 0,
    },
    {
        slug: 'amazink-printing-accessory',
        name: 'AMAZiNK Printing Accessory',
        sku: 'AMZ-ACC-007',
        category: 'Produk Lainnya',
        description: 'Aksesori pendukung untuk membantu kebutuhan cetak sehari-hari.',
        image: '/images/home/aksesori.jpeg',
        color: '',
        volume: '',
        price: 45000,
        stock: 15,
    },
    {
        slug: 'amazink-ink-bottle-set',
        name: 'AMAZiNK Ink Bottle Set',
        sku: 'AMZ-INK-SET-008',
        category: 'Tinta Botol',
        description: 'Paket tinta dengan beberapa pilihan warna untuk kebutuhan cetak berwarna.',
        image: '/images/home/tinta.jpeg',
        color: 'CMYK',
        volume: 'Set',
        price: 250000,
        stock: 6,
    },
]

const product = computed(() =>
    products.find(item => item.slug === route.params.slug)
)

const formatPrice = price =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
</script>

<template>
    <main class="min-h-screen bg-[#fafaf9] text-gray-950">
        <!-- Breadcrumb -->
        <div class="border-b border-gray-200/70 bg-white">
            <div class="mx-auto max-w-7xl px-5 py-4 sm:px-8">
                <nav class="flex flex-wrap items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
                    <RouterLink to="/" class="transition-colors hover:text-brand-red">
                        Beranda
                    </RouterLink>

                    <span class="text-gray-300">/</span>

                    <RouterLink to="/catalog-produk#daftar-produk" class="transition-colors hover:text-brand-red">
                        Katalog Produk
                    </RouterLink>

                    <span class="text-gray-300">/</span>

                    <span class="max-w-[220px] truncate font-medium text-gray-800">
                        {{ product?.name || 'Produk tidak ditemukan' }}
                    </span>
                </nav>
            </div>
        </div>

        <!-- Product Detail -->
        <section v-if="product" class="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
            <div class="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-16">

                <!-- Product Image -->
                <div class="min-w-0">
                    <div
                        class="group relative flex aspect-square max-h-[680px] items-center justify-center overflow-hidden rounded-3xl border border-gray-200/70 bg-white p-8 sm:p-12 lg:p-14">
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

                            <p class="mt-4 text-sm font-medium text-gray-600">
                                Gambar belum tersedia
                            </p>
                            <p class="mt-1 text-xs text-gray-400">
                                {{ product.name }}
                            </p>
                        </div>

                        <span
                            class="absolute left-5 top-5 rounded-full border border-gray-200 bg-white/90 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-600 shadow-sm backdrop-blur sm:left-6 sm:top-6">
                            {{ product.category }}
                        </span>

                        <span v-if="product.stock === 0"
                            class="absolute right-5 top-5 rounded-full bg-red-50 px-3.5 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-700 sm:right-6 sm:top-6">
                            Stok habis
                        </span>
                    </div>

                    <div class="mt-4 flex items-center justify-between gap-3 px-1">
                        <p class="text-xs text-gray-400">
                            Kode produk
                            <span class="ml-1 font-medium text-gray-600">
                                {{ product.sku }}
                            </span>
                        </p>

                        <span class="flex shrink-0 items-center gap-1.5 text-xs text-gray-500">
                            <span class="h-2 w-2 rounded-full"
                                :class="product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'" />
                            {{ product.stock > 0 ? 'Tersedia' : 'Tidak tersedia' }}
                        </span>
                    </div>
                </div>

                <!-- Product Information -->
                <div class="min-w-0 lg:pt-3">
                    <p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
                        {{ product.category }}
                    </p>

                    <h1
                        class="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-950 sm:text-4xl lg:text-[42px]">
                        {{ product.name }}
                    </h1>

                    <p class="mt-4 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                        {{ product.description }}
                    </p>

                    <!-- Price -->
                    <div class="mt-7 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                        <p class="text-xs font-medium text-gray-500">
                            Harga produk
                        </p>

                        <div class="mt-2 flex flex-wrap items-baseline gap-2">
                            <p class="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                                {{ formatPrice(product.price) }}
                            </p>
                        </div>

                        <p class="mt-2 text-xs text-gray-400">
                            Hubungi tim kami untuk informasi pemesanan
                        </p>
                    </div>

                    <!-- Availability -->
                    <div class="mt-5 flex items-start gap-3 rounded-2xl border border-gray-200/80 bg-white p-4">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            :class="product.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M20 7 10 17l-5-5" />
                                <path d="M21 12a9 9 0 1 1-5.7-8.4" />
                            </svg>
                        </div>

                        <div class="min-w-0">
                            <p class="text-sm font-semibold text-gray-900">
                                {{ product.stock > 0 ? 'Produk tersedia' : 'Stok sedang kosong' }}
                            </p>
                            <p class="mt-1 text-xs leading-5 text-gray-500">
                                {{ product.stock > 0
                                    ? `${product.stock} unit tersedia saat ini`
                                    : 'Silakan hubungi tim kami untuk informasi ketersediaan berikutnya'
                                }}
                            </p>
                        </div>
                    </div>

                    <!-- Specifications -->
                    <div class="mt-8">
                        <div class="mb-3 flex items-center justify-between">
                            <h2 class="text-sm font-bold text-gray-900">
                                Informasi produk
                            </h2>
                            <span class="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                                Spesifikasi
                            </span>
                        </div>

                        <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            <div
                                class="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-5">
                                <span class="text-sm text-gray-500">Kode produk</span>
                                <span class="text-right text-sm font-semibold text-gray-900">
                                    {{ product.sku }}
                                </span>
                            </div>

                            <div
                                class="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-5">
                                <span class="text-sm text-gray-500">Kategori</span>
                                <span class="text-right text-sm font-semibold text-gray-900">
                                    {{ product.category }}
                                </span>
                            </div>

                            <div v-if="product.color"
                                class="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 sm:px-5">
                                <span class="text-sm text-gray-500">Warna</span>
                                <span class="flex items-center gap-2 text-right text-sm font-semibold text-gray-900">
                                    <span class="h-3 w-3 rounded-full border border-black/10" :class="{
                                        'bg-black': product.color === 'Black',
                                        'bg-cyan-400': product.color === 'Cyan',
                                        'bg-fuchsia-500': product.color === 'Magenta',
                                        'bg-yellow-400': product.color === 'Yellow',
                                        'bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-yellow-400': product.color === 'CMYK',
                                    }" />
                                    {{ product.color }}
                                </span>
                            </div>

                            <div v-if="product.volume"
                                class="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
                                <span class="text-sm text-gray-500">Ukuran / Isi</span>
                                <span class="text-right text-sm font-semibold text-gray-900">
                                    {{ product.volume }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Actions -->
                    <!-- Actions -->
                    <div class="mt-7">
                        <RouterLink to="/catalog-produk#daftar-produk"
                            class="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white no-underline shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-100 active:translate-y-0 active:bg-red-800">
                            <svg class="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M19 12H5" />
                                <path d="m12 19-7-7 7-7" />
                            </svg>

                            Kembali ke katalog
                        </RouterLink>
                    </div>
                    <div class="mt-5 flex items-start gap-2.5 text-xs leading-6 text-gray-400">
                        <svg class="mt-1 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 11v5" />
                            <path d="M12 8h.01" />
                        </svg>

                        <p>
                            Pastikan produk sesuai dengan tipe printer yang digunakan.
                            Hubungi tim AMAZiNK jika membutuhkan bantuan memilih produk.
                        </p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Product Not Found -->
        <section v-else
            class="mx-auto flex min-h-[65vh] max-w-7xl flex-col items-center justify-center px-5 py-16 text-center">
            <div class="flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-gray-400">
                <svg class="h-9 w-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
                    stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="7" />
                    <path d="m20 20-4-4" />
                    <path d="M8.5 11h5" />
                </svg>
            </div>

            <p class="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
                Katalog AMAZiNK
            </p>

            <h1 class="mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                Produk tidak ditemukan
            </h1>

            <p class="mt-3 max-w-md text-sm leading-7 text-gray-500">
                Produk mungkin sudah tidak tersedia atau alamat halaman tidak valid.
                Silakan kembali ke katalog untuk melihat produk lainnya.
            </p>

            <RouterLink to="/catalog-produk#daftar-produk"
                class="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-100">
                Kembali ke katalog
                <span aria-hidden="true">→</span>
            </RouterLink>
        </section>
    </main>
</template>
