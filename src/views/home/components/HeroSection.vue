<script setup>
import AccentText from '@/components/base/AccentText.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const hero = usePageSection('home', 'hero', {
    badge: 'Print Amazing.',
    title: 'Tinta dan toner yang\n[[pas untuk printer Anda.]]',
    description:
        'Temukan tinta, toner, dan printer yang sesuai kebutuhanmu. Solusi cetak berkualitas untuk rumah maupun bisnis.',
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
        class="relative isolate flex min-h-[calc(100svh-96px)] items-center overflow-hidden bg-[rgb(216_217_218)] text-[#1d1f24]">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-12.5 -top-15 h-95 w-95 rounded-full bg-[rgb(255_205_210/0.35)] opacity-65 blur-[100px]" />

        <div
            class="relative mx-auto grid w-full max-w-400 grid-cols-1 items-center gap-3 px-5.5 pb-7.5 pt-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-4.5 sm:px-8 sm:py-9.5 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-7 lg:px-[clamp(24px,4vw,68px)] lg:py-11">
            <!-- Konten kiri -->
            <div class="relative z-10 min-w-0 sm:max-w-162.5">
                <div
                    class="mb-4.5 inline-flex items-center gap-2.25 rounded-full border border-red-200 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e91d2d] sm:mb-5 sm:px-3.5 sm:py-2.25 sm:text-[11px]">
                    <span class="h-2 w-2 rounded-full bg-brand-red" />
                    <span>{{ hero.badge }}</span>
                </div>

                <h1 id="hero-title"
                    class="m-0 max-w-full text-[clamp(35px,9.5vw,46px)] font-bold leading-[1.08] tracking-[-0.055em] text-[#171a20] sm:max-w-162.5 sm:text-[clamp(34px,4.2vw,48px)] lg:text-[clamp(36px,4vw,64px)] lg:leading-[1.06]">
                    <AccentText :text="hero.title" />
                </h1>

                <p
                    class="mt-4 max-w-full text-sm leading-[1.7] text-[#626a76] sm:mt-5 sm:max-w-122.5 sm:text-[15px] sm:leading-[1.8]">
                    {{ hero.description }}
                </p>

                <div class="mt-5.5 flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
                    <BaseButton :to="hero.primary_button_link">{{ hero.primary_button_label }}</BaseButton>

                    <RouterLink :to="hero.secondary_button_link"
                        class="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-400 bg-[#f8f8f8] px-4 py-2.75 text-[13px] font-semibold text-[#20232a] no-underline transition-colors duration-200 hover:border-[#171a20] hover:bg-[#171a20] hover:text-white sm:min-h-11.5 sm:px-5.5 sm:py-3 sm:text-sm">
                        {{ hero.secondary_button_label }}
                    </RouterLink>
                </div>

                <div
                    class="mt-5.5 flex flex-wrap gap-x-4 gap-y-2.5 text-[10px] font-medium text-[#626a76] sm:mt-7 sm:gap-x-5 sm:text-[11px]">
                    <span v-for="benefit in hero.benefits" :key="benefit.id" class="flex items-center gap-2">
                        <svg class="h-4 w-4 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                        </svg>
                        {{ benefit.text }}
                    </span>
                </div>
            </div>

            <!-- Gambar -->
            <div class="group/visual relative mt-2 flex w-full min-w-0 items-center justify-center sm:mt-0">
                <img :src="hero.image || '/images/home/hero-home.png'" alt="Produk AMAZiNK berupa tinta, toner, dan printer"
                    fetchpriority="high"
                    class="relative z-10 block h-auto w-full max-w-full object-contain [mask-image:radial-gradient(ellipse_at_center,#000_60%,transparent_100%)] transition-transform duration-500 motion-reduce:transition-none sm:w-[108%] sm:max-w-212.5 lg:w-[112%] lg:group-hover/visual:-translate-y-1" />
            </div>
        </div>
    </section>
</template>