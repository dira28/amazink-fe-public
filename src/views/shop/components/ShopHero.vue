<script setup>
import { computed, ref, unref } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const DEFAULT_IMAGE = '/images/home/bg-hero.png'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('catalog', 'hero', {
    eyebrow: 'AMAZiNK · Product Catalogue',
    title: 'PRINTING\n[[REIMAGINED]]',
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

        <!-- Lapisan gelap: pekat di atas (tempat teks), terang di tengah supaya foto terlihat -->
        <div class="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/30 to-black/45" aria-hidden="true">
        </div>

        <div
            class="mx-auto flex min-h-[clamp(520px,calc(100svh-72px),880px)] max-w-7xl flex-col items-center justify-between px-5 pb-8 pt-[clamp(56px,13vh,150px)] text-center sm:px-8 sm:pb-10">
            <!-- Teks di atas -->
            <div class="flex flex-col items-center">
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
            </div>

            <!-- Tombol di bawah -->
            <a href="#daftar-produk"
                class="group mt-10 inline-flex h-14 items-center gap-4 rounded-full bg-white py-2 pl-7 pr-2 text-sm font-semibold no-underline shadow-[0_12px_32px_-8px_rgba(0,0,0,0.55)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black motion-reduce:transition-none motion-reduce:hover:transform-none"
                style="color: #171717">
                {{ hero.button_label }}

                <span
                    class="grid h-10 w-10 place-items-center rounded-full bg-[#171717] transition-colors duration-300 group-hover:bg-brand-red"
                    aria-hidden="true">
                    <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                        viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M12 5v14" />
                        <path d="m5 12 7 7 7-7" />
                    </svg>
                </span>
            </a>
        </div>
    </section>
</template>