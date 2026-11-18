<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'
import { scrollToSection } from '@/utils/scrollToSection'

const hero = usePageSection('about-us', 'hero', {
    badge: 'About Us',
    eyebrow: 'Solusi Consumable Printer',
    title: 'Beyond\n[[Expectation.]]',
    description: 'Menghadirkan solusi tinta dan consumable printer berkualitas untuk hasil cetak yang maksimal, efisien, dan lebih terjangkau.',
    primary_button_label: 'Jelajahi Produk',
    primary_button_link: '/#produk',
    secondary_button_label: 'Kenali AMAZiNK',
    images: [],
})

const FALLBACK_IMAGE =
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=2200&q=85'
const SLIDE_MS = 5000

// Gambar dari admin tampil bergantian; bila belum ada, dipakai gambar bawaan.
const images = computed(() => {
    const list = hero.value.images.map((item) => item.image).filter(Boolean)
    return list.length ? list : [FALLBACK_IMAGE]
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
    <section class="px-3 pt-3 sm:px-5 sm:pt-5">
        <div class="relative isolate mx-auto flex min-h-105 max-w-360
                   items-end overflow-hidden rounded-2xl bg-gray-950
                   sm:min-h-125 sm:rounded-3xl lg:min-h-145">
            <img v-for="(src, index) in images" :key="src + index" :src="src" alt="" aria-hidden="true"
                class="hero-zoom absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none"
                :class="index === current ? 'opacity-100' : 'opacity-0'" />

            <div class="absolute inset-0 -z-10
                       bg-gradient-to-r from-black/85 via-black/55
                       to-black/20"></div>

            <div class="absolute inset-0 -z-10
                       bg-gradient-to-t from-black/55
                       via-transparent to-black/10"></div>

            <div class="hero-fade absolute left-6 right-6 top-6 flex items-center
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

            <div class="hero-copy w-full max-w-4xl px-6 pb-10 pt-28
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

                    <a href="#cerita-amazink" @click="scrollToSection" class="inline-flex min-h-11 items-center gap-2
                               text-sm font-medium text-white
                               transition-colors hover:text-red-300">
                        {{ hero.secondary_button_label }}
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M7 17 17 7M7 7h10v10" />
                        </svg>
                    </a>
                </div>

                <div v-if="images.length > 1" class="mt-10 flex items-center gap-3">
                    <button v-for="(src, index) in images" :key="src + index" type="button"
                        :aria-label="`Tampilkan gambar ${index + 1}`" :aria-current="index === current ? 'true' : undefined"
                        class="h-1.5 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                        :class="index === current ? 'w-8 bg-brand-red' : 'w-3 bg-white/40 hover:bg-white/70'"
                        @click="current = index; start()" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Teks naik sedikit sambil memudar masuk berurutan; foto latar turun pelan dari sedikit diperbesar. */
.hero-copy > * {
    animation: hero-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.hero-copy > *:nth-child(1) { animation-delay: 0.1s; }
.hero-copy > *:nth-child(2) { animation-delay: 0.2s; }
.hero-copy > *:nth-child(3) { animation-delay: 0.3s; }
.hero-copy > *:nth-child(4) { animation-delay: 0.4s; }
.hero-copy > *:nth-child(5) { animation-delay: 0.5s; }
.hero-fade {
    animation: hero-fade 0.9s ease-out backwards;
}
.hero-zoom {
    animation: hero-zoom 2.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

@keyframes hero-rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
}
@keyframes hero-fade {
    from { opacity: 0; }
    to { opacity: 1; }
}
@keyframes hero-zoom {
    from { transform: scale(1.08); }
    to { transform: scale(1); }
}

@media (prefers-reduced-motion: reduce) {
    .hero-copy > *,
    .hero-fade,
    .hero-zoom {
        animation: none;
    }
}
</style>
