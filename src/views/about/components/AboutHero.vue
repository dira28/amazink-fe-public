<script setup>
import BaseButton from '@/components/base/BaseButton.vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('about-us', 'hero', {
    badge: 'About Us',
    eyebrow: 'Solusi Consumable Printer',
    title: 'Beyond\n[[Expectation.]]',
    description: 'Menghadirkan solusi tinta dan consumable printer berkualitas untuk hasil cetak yang maksimal, efisien, dan lebih terjangkau.',
    primary_button_label: 'Jelajahi Produk',
    primary_button_link: '/#produk',
    secondary_button_label: 'Kenali AMAZiNK',
    image: '',
})
</script>

<template>
    <section class="px-3 pt-3 sm:px-5 sm:pt-5">
        <div class="relative isolate mx-auto flex min-h-105 max-w-360
                   items-end overflow-hidden rounded-2xl bg-gray-950
                   sm:min-h-125 sm:rounded-3xl lg:min-h-145">
            <!-- Background image -->
            <img :src="hero.image || 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85'"
                alt="" aria-hidden="true" class="absolute inset-0 -z-20 h-full w-full object-cover" />

            <!-- Overlay -->
            <div class="absolute inset-0 -z-10
                       bg-gradient-to-r from-black/85 via-black/55
                       to-black/20"></div>

            <div class="absolute inset-0 -z-10
                       bg-gradient-to-t from-black/55
                       via-transparent to-black/10"></div>

            <!-- Header kecil dalam banner -->
            <div class="absolute left-6 right-6 top-6 flex items-center
                       justify-between sm:left-9 sm:right-9 sm:top-8">
                <RouterLink to="/" class="text-lg font-black tracking-[-0.06em] text-white"
                    aria-label="Amazink Beranda">
                    AMAZ<span class="text-brand-red">I</span>NK
                </RouterLink>

                <span class="rounded-full border border-white/25
                           bg-white/10 px-3 py-1.5 text-[10px]
                           font-medium uppercase tracking-[0.18em]
                           text-white/90 backdrop-blur-md sm:text-xs">
                    {{ hero.badge }}
                </span>
            </div>

            <!-- Hero content -->
            <div class="w-full max-w-4xl px-6 pb-10 pt-28
                       sm:px-10 sm:pb-14 lg:px-16 lg:pb-16">
                <div class="mb-5 flex items-center gap-3">
                    <span class="h-0.5 w-8 bg-brand-red"></span>
                    <p class="text-xs font-semibold uppercase
                               tracking-[0.22em] text-white/80 sm:text-sm">
                        {{ hero.eyebrow }}
                    </p>
                </div>

                <h1 class="max-w-3xl text-4xl font-semibold
                           leading-[1.08] tracking-[-0.045em] text-white
                           sm:text-6xl lg:text-7xl">
                    <AccentText :text="hero.title" />
                </h1>

                <p class="mt-6 max-w-xl text-sm leading-7
                           text-white/75 sm:text-base sm:leading-8">
                    {{ hero.description }}
                </p>

                <div class="mt-8 flex flex-wrap items-center gap-4">
                    <BaseButton :to="hero.primary_button_link">
                        {{ hero.primary_button_label }}
                    </BaseButton>

                    <a href="#cerita-amazink" class="inline-flex min-h-11 items-center gap-2
                               text-sm font-medium text-white
                               transition-colors hover:text-red-300">
                        {{ hero.secondary_button_label }}
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                    </a>
                </div>

                <div class="mt-10 flex items-center gap-3">
                    <span class="h-1.5 w-8 rounded-full bg-brand-red"></span>
                    <span class="h-1.5 w-3 rounded-full bg-white/40"></span>
                    <span class="h-1.5 w-3 rounded-full bg-white/40"></span>
                </div>
            </div>
        </div>
    </section>
</template>