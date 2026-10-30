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
        class="relative isolate flex flex-col overflow-hidden bg-[#0d0d0f] text-white md:min-h-[calc(100svh-96px)] md:flex-row md:items-center">
        <div aria-hidden="true"
            class="pointer-events-none absolute inset-0 -z-10 hidden md:block md:bg-linear-to-r md:from-black/85 md:via-black/55 md:via-40% md:to-transparent md:to-72%">
        </div>

        <!-- Konten teks -->
        <div
            class="relative mx-auto w-full max-w-400 px-5 pb-6 pt-6 sm:px-8 sm:pt-9.5 lg:px-[clamp(24px,4vw,68px)] md:py-9.5 lg:py-11">
            <div class="relative z-10 min-w-0 md:max-w-[min(48%,40rem)]">
                <div
                    class="mb-3.5 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/90 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-[#e91d2d] sm:mb-5 sm:px-3.5 sm:py-2.25 sm:text-[11px]">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-red sm:h-2 sm:w-2" />
                    <span>{{ hero.badge }}</span>
                </div>

                <h1 id="hero-title"
                    class="m-0 max-w-full text-[clamp(25px,7.2vw,32px)] font-bold leading-[1.12] tracking-[-0.05em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.45)] sm:max-w-162.5 sm:text-[clamp(32px,3.8vw,46px)] sm:leading-[1.08] lg:text-[clamp(36px,3.4vw,54px)] lg:leading-[1.06]">
                    <AccentText :text="hero.title" />
                </h1>

                <p
                    class="mt-3 max-w-full text-[13px] leading-[1.65] text-white/80 sm:mt-5 sm:max-w-122.5 sm:text-[15px] sm:leading-[1.8]">
                    {{ hero.description }}
                </p>

                <div class="mt-4 flex flex-wrap items-center gap-2 sm:mt-7 sm:gap-3">
                    <BaseButton :to="hero.primary_button_link">{{ hero.primary_button_label }}</BaseButton>

                    <RouterLink :to="hero.secondary_button_link"
                        class="inline-flex min-h-10 items-center justify-center rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[12px] font-semibold text-white no-underline backdrop-blur-sm transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#171a20] sm:min-h-11.5 sm:px-5.5 sm:py-3 sm:text-sm">
                        {{ hero.secondary_button_label }}
                    </RouterLink>
                </div>

                <div
                    class="mt-4 flex flex-wrap gap-x-3.5 gap-y-2 text-[10px] font-medium text-white/80 sm:mt-7 sm:gap-x-5 sm:text-[11px]">
                    <span v-for="benefit in hero.benefits" :key="benefit.id" class="flex items-center gap-1.5">
                        <svg class="h-3.5 w-3.5 shrink-0 text-brand-red sm:h-4 sm:w-4" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                        </svg>
                        {{ benefit.text }}
                    </span>
                </div>
            </div>
        </div>

        <!-- Gambar: di bawah teks (mobile), jadi latar penuh (layar lebar) -->
        <div class="relative order-2 md:contents">
            <img :src="hero.image || '/images/home/amazink-hero-home.png'" alt="" aria-hidden="true"
                fetchpriority="high"
                class="block aspect-[5/4] w-full object-cover object-[72%_center] md:pointer-events-none md:absolute md:inset-0 md:-z-20 md:aspect-auto md:h-full md:object-right" />

            <!-- Pemudar di tepi atas gambar supaya menyatu dengan latar teks (mobile saja) -->
            <div aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#0d0d0f] to-transparent md:hidden">
            </div>
        </div>
    </section>
</template>