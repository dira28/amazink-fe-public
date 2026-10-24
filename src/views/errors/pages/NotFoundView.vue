<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useSeo } from '@/composables/useSeo'

const route = useRoute()
const router = useRouter()

useSeo(() => ({
    title: 'Halaman tidak ditemukan',
    description: 'Halaman yang kamu cari tidak ada atau sudah dipindahkan.',
    path: route.path,
    noindex: true,
}))

// Tombol kembali hanya muncul kalau ada halaman sebelumnya di dalam website ini
const canGoBack = !!window.history.state?.back

const goBack = () => router.back()

const shortcuts = [
    { label: 'Catalog Produk', to: '/catalog-produk' },
    { label: 'Cari Tinta', to: '/cari-tinta' },
    { label: 'Galeri', to: '/galeri' },
    { label: 'News', to: '/news' },
]
</script>

<template>
    <main
        class="relative grid min-h-[calc(100vh-72px)] place-items-center overflow-hidden bg-[#f7f7f5] px-5 py-16 text-[#171717]">
        <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl">
        </div>
        <div class="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl">
        </div>

        <div class="relative w-full max-w-lg text-center">
            <p class="m-0 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Error 404</p>

            <p class="m-0 mt-3 select-none text-[clamp(96px,22vw,168px)] font-black leading-none tracking-[-0.07em]"
                aria-hidden="true">
                4<span class="text-brand-red">0</span>4
            </p>

            <h1 class="mt-4 text-[clamp(24px,4vw,32px)] font-semibold leading-tight tracking-[-0.04em]">
                Halaman tidak ditemukan
            </h1>

            <p class="mx-auto mb-0 mt-3 max-w-sm text-sm leading-7 text-[#737373]">
                Alamat yang kamu buka tidak ada atau sudah dipindahkan. Periksa lagi alamatnya, atau lanjut dari
                halaman di bawah.
            </p>

            <p class="mx-auto mb-0 mt-4 max-w-full break-all rounded-full bg-white px-4 py-2 text-xs text-[#737373] ring-1 ring-black/5"
                style="width: fit-content">
                {{ route.fullPath }}
            </p>

            <div class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <RouterLink to="/"
                    class="inline-flex min-h-12 items-center justify-center rounded-full bg-[#171717] px-7 text-[13px] font-semibold no-underline transition-colors hover:bg-brand-red"
                    style="color: #fff">
                    Kembali ke beranda
                </RouterLink>

                <button v-if="canGoBack" type="button"
                    class="inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full border-0 bg-white px-7 ring-1 ring-black/10 transition-colors hover:ring-brand-red/40"
                    style="color: #374151; font-size: 13px; font-weight: 600" @click="goBack">
                    Halaman sebelumnya
                </button>
            </div>

            <div class="mt-10 border-t border-black/10 pt-6">
                <p class="m-0 text-xs font-medium text-[#737373]">Atau kunjungi</p>
                <ul class="m-0 mt-3 flex list-none flex-wrap justify-center gap-2 p-0">
                    <li v-for="item in shortcuts" :key="item.to">
                        <RouterLink :to="item.to"
                            class="inline-flex h-9 items-center rounded-full bg-white px-4 text-[13px] font-medium text-gray-700 no-underline ring-1 ring-black/5 transition-colors hover:text-brand-red hover:ring-brand-red/30">
                            {{ item.label }}
                        </RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </main>
</template>