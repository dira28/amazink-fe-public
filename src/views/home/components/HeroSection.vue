<script setup>
import AccentText from '@/components/base/AccentText.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('home', 'hero', {
    badge: 'Print Amazing.',
    title: 'Tinta dan toner yang\n[[pas untuk printer Anda.]]',
    description:
        'Temukan tinta, toner, dan printer yang sesuai kebutuhan Anda. Solusi cetak berkualitas untuk rumah maupun bisnis.',
    primary_button_label: 'Jelajahi Produk',
    primary_button_link: '/catalog-produk',
    secondary_button_label: 'Tentang Kami',
    secondary_button_link: '/tentang-kami',
    benefits: [
        { id: 'benefit-1', text: 'Produk original' },
        { id: 'benefit-2', text: 'Pengiriman cepat' },
        { id: 'benefit-3', text: 'Harga kompetitif' },
    ],
    image: '',
})
</script>

<template>
    <section id="beranda" aria-labelledby="hero-title"
        class="relative isolate flex min-h-[calc(100svh-96px)] items-center overflow-hidden bg-[#0d0d0f] text-white">
        <!-- Gambar latar di belakang teks -->
        <img :src="hero.image || '/images/home/amazink-hero-home.png'" alt="" aria-hidden="true" fetchpriority="high"
            class="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover object-[78%_center] sm:object-right" />

        <!-- Lapisan gelap: pekat di sisi teks, memudar ke kanan supaya produk tetap terang -->
        <div aria-hidden="true"
            class="pointer-events-none absolute inset-0 -z-10 bg-black/60 sm:bg-transparent sm:bg-linear-to-r sm:from-black/85 sm:via-black/55 sm:via-40% sm:to-transparent sm:to-72%">
        </div>

        <div
            class="relative mx-auto w-full max-w-400 px-5.5 pb-7.5 pt-8 sm:px-8 sm:py-9.5 lg:px-[clamp(24px,4vw,68px)] lg:py-11">
            <!-- Konten kiri -->
            <div class="relative z-10 min-w-0 sm:max-w-[min(48%,40rem)]">
                <div
                    class="mb-4.5 inline-flex items-center gap-2.25 rounded-full border border-red-200 bg-white/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e91d2d] sm:mb-5 sm:px-3.5 sm:py-2.25 sm:text-[11px]">
                    <span class="h-2 w-2 rounded-full bg-brand-red" />
                    <span>{{ hero.badge }}</span>
                </div>

                <h1 id="hero-title"
                    class="m-0 max-w-full text-[clamp(35px,9.5vw,46px)] font-bold leading-[1.08] tracking-[-0.055em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:max-w-162.5 sm:text-[clamp(32px,3.8vw,46px)] lg:text-[clamp(36px,3.4vw,54px)] lg:leading-[1.06]">
                    <AccentText :text="hero.title" />
                </h1>

                <p
                    class="mt-4 max-w-full text-sm leading-[1.7] text-white/80 sm:mt-5 sm:max-w-122.5 sm:text-[15px] sm:leading-[1.8]">
                    {{ hero.description }}
                </p>

                <div class="mt-5.5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
                    <BaseButton :to="hero.primary_button_link">{{ hero.primary_button_label }}</BaseButton>

                    <RouterLink :to="hero.secondary_button_link"
                        class="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-2.75 text-[13px] font-semibold text-white no-underline backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#171a20] sm:min-h-11.5 sm:px-5.5 sm:py-3 sm:text-sm">
                        {{ hero.secondary_button_label }}
                    </RouterLink>
                </div>

                <div
                    class="mt-5.5 flex flex-wrap gap-x-4 gap-y-2.5 text-[10px] font-medium text-white/80 sm:mt-7 sm:gap-x-5 sm:text-[11px]">
                    <span v-for="benefit in hero.benefits" :key="benefit.id" class="flex items-center gap-2">
                        <svg class="h-4 w-4 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                        </svg>
                        {{ benefit.text }}
                    </span>
                </div>
            </div>
        </div>
    </section>
</template>