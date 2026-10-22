<script setup>
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('catalog', 'hero', {
    eyebrow: 'AMAZiNK · Product Catalogue',
    title: 'PRINTING\n[[REIMAGINED]]',
    description: 'Tinta, toner, dan kebutuhan cetak untuk setiap ide',
    button_label: 'Jelajahi Katalog',
    image: '',
})
</script>

<template>
    <section class="shop-hero overflow-hidden bg-[#f8f8f6]" aria-labelledby="shop-hero-title">
        <div class="mx-auto max-w-7xl px-5 pt-7 sm:px-8 sm:pt-9 lg:pt-10">

            <!-- Heading -->
            <div class="relative z-10 text-center">
                <p class="text-[10px] font-semibold uppercase
                 tracking-[0.24em] text-brand-red sm:text-xs">
                    {{ hero.eyebrow }}
                </p>

                <h1 id="shop-hero-title" class="mx-auto mt-3 max-w-5xl
                 text-[clamp(2.6rem,6.5vw,5.5rem)]
                 font-black uppercase leading-[0.86]
                 tracking-[-0.065em] text-gray-950">
                    <AccentText :text="hero.title" />
                </h1>

                <p class="mx-auto mt-3 text-sm text-gray-600 sm:text-base">
                    {{ hero.description }}
                </p>
            </div>

            <!-- Product visual -->
            <div class="relative mx-auto mt-1 flex max-w-4xl
               items-center justify-center">
                <img :src="hero.image || '/images/home/hero-home-removebg.png'" alt="Koleksi tinta dan toner AMAZiNK" class="block h-auto max-h-62.5 w-full
                 object-contain object-center
                 sm:max-h-75 lg:max-h-80" fetchpriority="high" />
            </div>

            <!-- CTA -->
            <div class="relative z-10 -mt-1 pb-6 text-center sm:pb-8">
                <a href="#daftar-produk" class="inline-flex min-h-10 items-center justify-center
                 gap-3 bg-brand-red px-6
                 text-sm font-semibold text-white
                 transition-colors hover:bg-red-700
                 focus-visible:outline-none
                 focus-visible:ring-2
                 focus-visible:ring-brand-red
                 focus-visible:ring-offset-2">
                    {{ hero.button_label }}
                    <span aria-hidden="true">→</span>
                </a>
            </div>

        </div>
    </section>
</template>
