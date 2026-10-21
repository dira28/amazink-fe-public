<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { resellerRegions } from '../data/resellers'

const AUTO_SLIDE_MS = 5000

const cities = resellerRegions.flatMap((region) =>
    region.cities.map((city) => ({ ...city, region: region.name }))
)

const perSlide = ref(4)
const currentSlide = ref(0)

const slides = computed(() =>
    Array.from({ length: Math.ceil(cities.length / perSlide.value) }, (_, index) =>
        cities.slice(index * perSlide.value, (index + 1) * perSlide.value)
    )
)
const slideCount = computed(() => slides.value.length)

const telHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`

let timer = null
let reducedMotion = false

function goTo(index) {
    currentSlide.value = (index + slideCount.value) % slideCount.value
}

function stop() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

function start() {
    stop()
    if (reducedMotion) return
    timer = setInterval(() => goTo(currentSlide.value + 1), AUTO_SLIDE_MS)
}

function updatePerSlide() {
    const next = window.innerWidth < 640 ? 2 : 4

    if (next !== perSlide.value) {
        perSlide.value = next
        currentSlide.value = 0
    }
}

onMounted(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    updatePerSlide()
    window.addEventListener('resize', updatePerSlide)
    start()
})

onBeforeUnmount(() => {
    stop()
    window.removeEventListener('resize', updatePerSlide)
})
</script>

<template>
    <section id="daftar-reseller" class="scroll-mt-24 bg-[#f7f7f5] px-5 py-14 sm:px-8 sm:py-20">
        <div class="mx-auto max-w-7xl">
            <!-- Header -->
            <header class="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Jaringan kami</p>
                    <h2 class="mt-2.5 text-[clamp(26px,3vw,36px)] font-semibold leading-[1.2] tracking-[-0.045em]">
                        Daftar Reseller AMAZiNK
                    </h2>
                </div>

                <RouterLink :to="{ name: 'reseller-list' }"
                    class="group inline-flex items-center gap-3 rounded-full bg-[#171717] px-5 py-2.5 text-[13px] font-semibold text-white no-underline transition-colors hover:bg-brand-red">
                    Lihat selengkapnya
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"
                        class="h-[18px] w-[18px] transition-transform group-hover:translate-x-1">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </RouterLink>
            </header>

            <!-- Carousel -->
            <div class="mt-8 overflow-hidden" @mouseenter="stop" @mouseleave="start" @focusin="stop" @focusout="start">
                <div class="flex items-stretch transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="(slide, slideIndex) in slides" :key="slideIndex"
                        class="grid min-w-0 flex-[0_0_100%] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
                        :aria-hidden="slideIndex !== currentSlide">
                        <article v-for="city in slide" :key="`${city.region}-${city.name}`"
                            class="flex h-full min-w-0 flex-col rounded-2xl border border-gray-200 bg-white p-5">
                            <span class="text-[10px] font-semibold uppercase tracking-[0.13em] text-brand-red">
                                {{ city.region }}
                            </span>

                            <h3 class="mt-2 text-lg font-semibold tracking-[-0.02em]">{{ city.name }}</h3>

                            <p class="mt-2 line-clamp-3 text-[13px] leading-6 text-gray-600">
                                {{ city.branches[0].address }}
                            </p>

                            <div class="mt-auto pt-4">
                                <template v-if="city.branches[0].phones.length">
                                    <a v-for="phone in city.branches[0].phones" :key="phone" :href="telHref(phone)"
                                        :tabindex="slideIndex === currentSlide ? 0 : -1"
                                        class="block text-[13px] font-semibold leading-6 text-gray-950 no-underline transition-colors hover:text-brand-red">
                                        {{ phone }}
                                    </a>
                                </template>
                                <span v-else class="text-[13px] text-gray-300">-</span>

                                <p v-if="city.branches.length > 1" class="mt-1 text-xs text-gray-400">
                                    +{{ city.branches.length - 1 }} cabang lainnya
                                </p>
                            </div>
                        </article>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-6 flex items-center justify-between gap-4">
                <div class="flex flex-wrap items-center gap-2" aria-label="Pilih halaman reseller">
                    <button v-for="(_, index) in slides" :key="index" type="button"
                        class="h-[7px] cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                        :class="currentSlide === index ? 'w-[26px] bg-brand-red' : 'w-[7px] bg-[#c9c7c0]'"
                        :aria-label="`Slide ${index + 1}`" :aria-current="currentSlide === index ? 'true' : undefined"
                        @click="goTo(index)" />
                </div>

                <div class="flex items-center gap-3">
                    <span class="text-[11px] tabular-nums tracking-[0.08em]">
                        {{ String(currentSlide + 1).padStart(2, '0') }}
                        <span class="mx-1 text-[#a3a3a3]">/</span>
                        {{ String(slideCount).padStart(2, '0') }}
                    </span>

                    <button type="button" aria-label="Sebelumnya"
                        class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-brand-red hover:text-brand-red"
                        @click="goTo(currentSlide - 1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>

                    <button type="button" aria-label="Berikutnya"
                        class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border border-gray-300 bg-white text-gray-700 transition-colors hover:border-brand-red hover:text-brand-red"
                        @click="goTo(currentSlide + 1)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>