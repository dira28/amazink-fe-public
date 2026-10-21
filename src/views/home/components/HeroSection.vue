<script setup>
import BaseButton from '@/components/base/BaseButton.vue'

const benefits = ['Produk original', 'Pengiriman cepat', 'Harga kompetitif']
</script>

<template>
    <section id="beranda" aria-labelledby="hero-title"
        class="relative isolate flex min-h-[calc(100svh-96px)] items-center overflow-hidden bg-[rgb(216_217_218)] text-[#1d1f24]">
        <div aria-hidden="true"
            class="pointer-events-none absolute -right-[50px] -top-[60px] h-[380px] w-[380px] rounded-full bg-[rgb(255_205_210/0.35)] opacity-65 blur-[100px]" />

        <div
            class="relative mx-auto grid w-full max-w-[1600px] grid-cols-1 items-center gap-3 px-[22px] pb-[30px] pt-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:gap-[18px] sm:px-8 sm:py-[38px] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:gap-7 lg:px-[clamp(24px,4vw,68px)] lg:py-11">
            <!-- Konten kiri -->
            <div class="relative z-10 min-w-0 sm:max-w-[650px]">
                <div
                    class="mb-[18px] inline-flex items-center gap-[9px] rounded-full border border-red-200 bg-white/85 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#e91d2d] sm:mb-5 sm:px-3.5 sm:py-[9px] sm:text-[11px]">
                    <span class="h-2 w-2 rounded-full bg-brand-red" />
                    <span>Print Amazing.</span>
                </div>

                <h1 id="hero-title"
                    class="m-0 max-w-full text-[clamp(35px,9.5vw,46px)] font-bold leading-[1.08] tracking-[-0.055em] text-[#171a20] sm:max-w-[650px] sm:text-[clamp(34px,4.2vw,48px)] lg:text-[clamp(36px,4vw,64px)] lg:leading-[1.06]">
                    Tinta dan toner yang
                    <span class="block text-[#ed1c2e]">pas untuk printer Anda.</span>
                </h1>

                <p
                    class="mt-4 max-w-full text-sm leading-[1.7] text-[#626a76] sm:mt-5 sm:max-w-[490px] sm:text-[15px] sm:leading-[1.8]">
                    Temukan tinta, toner, dan printer yang sesuai kebutuhanmu.
                    Solusi cetak berkualitas untuk rumah maupun bisnis.
                </p>

                <div class="mt-[22px] flex flex-wrap items-center gap-2.5 sm:mt-7 sm:gap-3">
                    <BaseButton to="/#produk">Jelajahi Produk</BaseButton>

                    <RouterLink to="/tentang-kami"
                        class="inline-flex min-h-11 items-center justify-center rounded-full border border-gray-400 bg-[#f8f8f8] px-4 py-[11px] text-[13px] font-semibold text-[#20232a] no-underline transition-colors duration-200 hover:border-[#171a20] hover:bg-[#171a20] hover:text-white sm:min-h-[46px] sm:px-[22px] sm:py-3 sm:text-sm">
                        Tentang Kami
                    </RouterLink>
                </div>

                <div
                    class="mt-[22px] flex flex-wrap gap-x-4 gap-y-2.5 text-[10px] font-medium text-[#626a76] sm:mt-7 sm:gap-x-5 sm:text-[11px]">
                    <span v-for="benefit in benefits" :key="benefit" class="flex items-center gap-2">
                        <svg class="h-4 w-4 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m5 12 4 4L19 6" />
                        </svg>
                        {{ benefit }}
                    </span>
                </div>
            </div>

            <!-- Gambar -->
            <div class="group/visual relative mt-2 flex w-full min-w-0 items-center justify-center sm:mt-0">
                <img src="/images/home/hero-home.png" alt="Produk AMAZiNK berupa tinta, toner, dan printer"
                    fetchpriority="high"
                    class="relative z-10 block h-auto w-full max-w-full object-contain [mask-image:radial-gradient(ellipse_at_center,#000_60%,transparent_100%)] transition-transform duration-500 motion-reduce:transition-none sm:w-[108%] sm:max-w-[850px] lg:w-[112%] lg:group-hover/visual:-translate-y-1" />
            </div>
        </div>
    </section>
</template>