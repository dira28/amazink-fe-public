<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink } from 'vue-router'
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'
import { useProducts } from '@/composables/useProducts'

const section = usePageSection('home', 'collection', {
    title: 'Collection',
    button_label: 'Go to catalog',
    button_link: '/catalog-produk#daftar-produk',
})

// Produk yang sama dengan katalog. Yang sudah punya gambar ditampilkan lebih dulu.
const { products: catalog } = useProducts()

const MAX_PRODUCTS = 8

const products = computed(() => {
    const withImage = catalog.value.filter((product) => product.image)
    const withoutImage = catalog.value.filter((product) => !product.image)

    return [...withImage, ...withoutImage].slice(0, MAX_PRODUCTS)
})

const productsPerSlide = 4
const slideCount = computed(() => Math.max(1, Math.ceil(products.value.length / productsPerSlide)))
const currentSlide = ref(0)

let autoSlide = null

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const slideProducts = (slide) =>
    products.value.slice((slide - 1) * productsPerSlide, slide * productsPerSlide)

function goToSlide(index) {
    currentSlide.value = index
}

function nextSlide() {
    currentSlide.value = (currentSlide.value + 1) % slideCount.value
}

// Daftar produk bisa berubah setelah data dari API tiba.
watch(slideCount, (count) => {
    if (currentSlide.value >= count) currentSlide.value = 0
})

function startAutoSlide() {
    stopAutoSlide()
    autoSlide = setInterval(nextSlide, 4000)
}

function stopAutoSlide() {
    if (autoSlide) {
        clearInterval(autoSlide)
        autoSlide = null
    }
}

onMounted(startAutoSlide)
onUnmounted(stopAutoSlide)
</script>

<template>
    <section v-if="products.length"
        class="w-full overflow-hidden bg-[#111] px-4.5 pb-7.5 pt-8.5 text-[#f7f7f5] sm:px-6 sm:pb-9 sm:pt-10.5 lg:pb-11 lg:pt-13">
        <div class="mx-auto w-full max-w-320">
            <!-- Header -->
            <header class="mb-5 flex items-end justify-between gap-3 sm:mb-6 sm:gap-6">
                <h2 class="m-0 text-[38px] font-semibold leading-none tracking-[-0.06em] sm:text-5xl lg:text-6xl">
                    <AccentText :text="section.title" /><span class="text-brand-red"></span>
                </h2>

                <RouterLink :to="section.button_link"
                    class="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-[#f4f3ee] px-4 py-2.5 text-[11px] font-semibold text-[#111] no-underline transition duration-200 hover:bg-white hover:shadow-[0_8px_20px_rgba(0,0,0,0.3)] sm:gap-3 sm:px-6 sm:py-3 sm:text-[13px]">
                    <span>{{ section.button_label }}</span>
                    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true"
                        class="h-3.75 w-3.75 transition-transform group-hover:translate-x-1 sm:h-4.5 sm:w-4.5">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </RouterLink>
            </header>

            <!-- Carousel -->
            <div class="w-full overflow-hidden" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
                <div class="flex items-stretch transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform motion-reduce:transition-none"
                    :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                    <div v-for="slide in slideCount" :key="slide"
                        class="grid min-w-0 flex-[0_0_100%] grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-7 lg:grid-cols-4 lg:gap-5">
                        <RouterLink v-for="product in slideProducts(slide)" :key="product.id"
                            :to="{ name: 'product-detail', params: { slug: product.slug } }"
                            class="group flex min-w-0 flex-col rounded-2xl bg-[#f4f3ee] p-2 text-[#111] no-underline transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:rounded-[22px] sm:p-3">
                            <!-- Image -->
                            <div
                                class="relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-white sm:rounded-2xl">
                                <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy"
                                    class="block h-full w-full object-contain p-2.5 transition-transform duration-500 group-hover:scale-105 sm:p-4.5" />

                                <div v-else
                                    class="flex h-full min-h-37.5 w-full flex-col items-center justify-center gap-2 bg-[#ebeae5] text-[#111]">
                                    <span class="text-lg font-bold tracking-[0.12em]">AMAZiNK</span>
                                    <small class="text-[10px] text-[#777]">Image coming soon</small>
                                </div>

                                <span aria-hidden="true"
                                    class="absolute bottom-2 right-2 grid h-6.75 w-6.75 place-items-center rounded-full bg-[#111] text-[15px] text-white transition duration-200 sm:bottom-3.5 sm:right-3.5 sm:h-8.5 sm:w-8.5 sm:text-lg lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                                    ↗
                                </span>
                            </div>

                            <!-- Info -->
                            <div class="px-1 pb-1 pt-3 sm:px-1.5 sm:pt-4">
                                <span
                                    class="mb-1.5 block text-[8px] font-semibold uppercase tracking-[0.08em] text-brand-red sm:mb-2 sm:text-[9px] sm:tracking-[0.13em]">
                                    {{ product.category }}
                                </span>

                                <h3
                                    class="m-0 break-words text-[13px] font-semibold leading-normal text-[#111] sm:text-[15px]">
                                    {{ product.name }}
                                </h3>

                                <p class="mb-0 mt-2 text-xs font-bold text-[#111] sm:text-[15px]">
                                    {{ formatPrice(product.price) }}
                                </p>
                            </div>
                        </RouterLink>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="mt-5.5 flex items-center justify-between sm:mt-6.5">
                <div class="flex items-center gap-2" aria-label="Pilih halaman produk">
                    <button v-for="(_, index) in slideCount" :key="index" type="button"
                        class="h-1.75 cursor-pointer rounded-full border-0 p-0 transition-all duration-300"
                        :class="currentSlide === index ? 'w-6.5 bg-brand-red' : 'w-1.75 bg-[#555]'"
                        :aria-label="`Slide ${index + 1}`" :aria-current="currentSlide === index ? 'true' : undefined"
                        @click="goToSlide(index)" />
                </div>

                <span class="text-[11px] tracking-[0.08em] tabular-nums text-[#f7f7f5]">
                    {{ String(currentSlide + 1).padStart(2, '0') }}
                    <span class="mx-1.25 text-[#666]">/</span>
                    {{ String(slideCount).padStart(2, '0') }}
                </span>
            </div>
        </div>
    </section>
</template>