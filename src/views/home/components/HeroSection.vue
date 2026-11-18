<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { usePageSection } from '@/composables/usePage'

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
    images: [],
})

const FALLBACK_IMAGE = '/images/home/amazink-hero-home.png'
const SLIDE_MS = 5000

// Gambar dari admin tampil bergantian; bila belum ada, dipakai gambar bawaan.
const images = computed(() => {
    const list = (hero.value.images ?? []).map((item) => item.image).filter(Boolean)
    if (list.length) return list

    return [hero.value.image || FALLBACK_IMAGE]
})

const current = ref(0)
let timer

function stop() {
    clearInterval(timer)
}

function start() {
    stop()
    if (images.value.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    timer = setInterval(() => {
        if (!document.hidden) current.value = (current.value + 1) % images.value.length
    }, SLIDE_MS)
}

watch(images, () => {
    if (current.value >= images.value.length) current.value = 0
    start()
})

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
    <section id="beranda" aria-labelledby="hero-title"
        class="relative isolate flex flex-col overflow-hidden bg-[#0d0d0f] text-white md:min-h-[calc(100svh-96px)] md:flex-row md:items-center">
        <div aria-hidden="true"
            class="pointer-events-none absolute inset-0 -z-10 hidden md:block md:bg-linear-to-r md:from-black/85 md:via-black/55 md:via-40% md:to-transparent md:to-72%">
        </div>

        <div
            class="relative mx-auto w-full max-w-400 px-5 pb-6 pt-6 sm:px-8 sm:pt-9.5 lg:px-[clamp(24px,4vw,68px)] md:py-9.5 lg:py-11">
            <div class="hero-copy relative z-10 min-w-0 md:max-w-[min(48%,40rem)]">
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
        <div class="relative order-2 aspect-[5/4] md:contents">
            <img v-for="(src, index) in images" :key="src + index" :src="src" alt="" aria-hidden="true"
                :fetchpriority="index === 0 ? 'high' : undefined" :loading="index === 0 ? undefined : 'lazy'"
                class="hero-zoom pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center] transition-opacity duration-1000 motion-reduce:transition-none md:-z-20 md:object-right"
                :class="index === current ? 'opacity-100' : 'opacity-0'" />

            <div v-if="images.length > 1" class="absolute bottom-4 left-5 z-10 flex items-center gap-2.5 sm:left-8 md:bottom-6 md:left-auto md:right-8">
                <button v-for="(src, index) in images" :key="src + index" type="button"
                    :aria-label="`Tampilkan gambar ${index + 1}`" :aria-current="index === current ? 'true' : undefined"
                    class="h-1.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                    :class="index === current ? 'w-8 bg-brand-red' : 'w-3 bg-white/50 hover:bg-white/80'"
                    @click="current = index; start()" />
            </div>

            <!-- Pemudar di tepi atas gambar supaya menyatu dengan latar teks (mobile saja) -->
            <div aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#0d0d0f] to-transparent md:hidden">
            </div>
        </div>
    </section>
</template>
<style scoped>
/* Teks naik sedikit sambil memudar masuk berurutan; foto latar turun pelan dari sedikit diperbesar. */
.hero-copy > * {
    animation: hero-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.hero-copy > *:nth-child(2) { animation-delay: 0.1s; }
.hero-copy > *:nth-child(3) { animation-delay: 0.2s; }
.hero-copy > *:nth-child(4) { animation-delay: 0.3s; }
.hero-copy > *:nth-child(5) { animation-delay: 0.4s; }

.hero-zoom {
    animation: hero-zoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes hero-rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
}
@keyframes hero-zoom {
    from { transform: scale(1.08); }
    to { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
    .hero-copy > *,
    .hero-late,
    .hero-zoom {
        animation: none;
    }
}
</style>
