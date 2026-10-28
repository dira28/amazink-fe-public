<script setup>
import { computed, ref, unref } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const DEFAULT_IMAGE = '/images/home/hero-home-removebg.png'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('catalog', 'hero', {
    eyebrow: 'AMAZiNK · Product Catalogue',
    title: 'PRINTING\n[[REIMAGINED]]',
    description: 'Tinta, toner, dan kebutuhan cetak untuk setiap ide',
    button_label: 'Jelajahi Katalog',
    image: '',
})

// Foto admin dulu, lalu gambar bawaan. Kalau dua-duanya gagal, latar polos gelap.
const adminFailed = ref(false)
const defaultFailed = ref(false)

const adminImage = computed(() => unref(hero)?.image || '')

const imageSrc = computed(() => {
    if (adminImage.value && !adminFailed.value) return adminImage.value
    return defaultFailed.value ? '' : DEFAULT_IMAGE
})

function onImageError() {
    if (adminImage.value && !adminFailed.value) adminFailed.value = true
    else defaultFailed.value = true
}
</script>

<template>
    <section class="relative isolate overflow-hidden bg-gray-950" aria-labelledby="shop-hero-title">
        <img v-if="imageSrc" :key="imageSrc" :src="imageSrc" alt="" aria-hidden="true" fetchpriority="high"
            class="absolute inset-0 -z-20 h-full w-full object-cover object-center" @error="onImageError" />

        <!-- Lapisan gelap: pekat di atas (tempat teks), terang di bawah supaya foto terlihat -->
        <div class="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/40 to-black/10" aria-hidden="true">
        </div>

        <div
            class="mx-auto flex min-h-[clamp(520px,calc(100svh-72px),880px)] max-w-7xl flex-col items-center justify-start px-5 pb-16 pt-[clamp(56px,13vh,150px)] text-center sm:px-8">
            <p class="m-0 text-[10px] font-semibold uppercase tracking-[0.24em] sm:text-xs"
                style="color: rgba(255, 255, 255, 0.85)">
                {{ hero.eyebrow }}
            </p>

            <h1 id="shop-hero-title"
                class="mx-auto mt-3 max-w-5xl text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
                style="color: #fff">
                <AccentText :text="hero.title" />
            </h1>

            <p class="mx-auto mb-0 mt-4 max-w-xl text-sm leading-7 sm:text-base"
                style="color: rgba(255, 255, 255, 0.88)">
                {{ hero.description }}
            </p>

            <a href="#daftar-produk"
                class="mt-7 inline-flex min-h-12 items-center justify-center gap-3 bg-brand-red px-8 text-sm font-semibold no-underline transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                style="color: #fff">
                {{ hero.button_label }}
                <span aria-hidden="true">→</span>
            </a>
        </div>
    </section>
</template>