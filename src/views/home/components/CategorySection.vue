<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AccentText from '@/components/base/AccentText.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { usePageSection } from '@/composables/usePage'
import { useProducts } from '@/composables/useProducts'

const defaults = {
    eyebrow: 'Produk Kami',
    title: 'Solusi lengkap untuk setiap kebutuhan cetak.',
    description:
        'Dari tinta, toner, hingga printer, temukan kebutuhan cetak Anda dalam satu tempat bersama AMAZiNK.',
    button_label: 'Lihat Semua Produk',
    button_link: '/catalog-produk',
}

const section = usePageSection('home', 'categories', defaults)

const { products } = useProducts()

// Nama kategori dari ASIS berupa huruf besar semua ("TINTA"); ditampilkan sebagai "Tinta".
const prettify = (name) =>
    name === name.toUpperCase() ? name.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase()) : name

const categories = computed(() => {
    const groups = new Map()

    for (const product of products.value) {
        const group = groups.get(product.categorySlug) ?? { slug: product.categorySlug, name: product.category, count: 0, image: '', cover: '' }

        group.count += 1
        // Sampul dari admin dipakai bila ada; selain itu gambar produk pertama di kategori itu yang punya gambar.
        group.cover ||= product.categoryImage
        group.image ||= product.image
        groups.set(product.categorySlug, group)
    }

    return [...groups.values()].map((group) => ({
        ...group,
        image: group.cover || group.image,
        name: prettify(group.name),
        tag: `${group.count} PRODUK`,
        description: `Lihat semua ${prettify(group.name).toLowerCase()}`,
        to: { path: '/catalog-produk', query: { kategori: group.slug }, hash: '#daftar-produk' },
    }))
})

// Bagian muncul (naik sambil memudar masuk) saat pertama kali terlihat di layar.
const sectionRef = ref(null)
const shown = ref(false)
let observer

onMounted(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !sectionRef.value || !('IntersectionObserver' in window)) {
        shown.value = true
        return
    }

    observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) return
            shown.value = true
            observer.disconnect()
        },
        { threshold: 0.2 },
    )
    observer.observe(sectionRef.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
    <section id="kategori-produk" ref="sectionRef" aria-labelledby="category-title" :class="{ shown }"
        class="bg-white px-5 py-12 text-[#171a20] sm:px-[clamp(20px,3vw,40px)] sm:py-16">
        <div
            class="mx-auto grid w-full max-w-340 grid-cols-1 items-center gap-8 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] xl:gap-12">
            <div class="reveal-copy min-w-0 max-w-162.5 xl:max-w-110">
                <span
                    class="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-red">
                    <span class="h-1.5 w-1.5 rounded-full bg-brand-red" />
                    {{ section.eyebrow }}
                </span>

                <h2 id="category-title"
                    class="mt-5 text-[30px] font-bold leading-[1.1] tracking-[-0.05em] text-[#14161b] sm:text-[clamp(30px,3.4vw,46px)]">
                    <AccentText :text="section.title" />
                </h2>

                <p class="mt-4 border-l-2 border-gray-200 pl-4 text-sm leading-[1.85] text-gray-500">
                    {{ section.description }}
                </p>

                <div class="mt-7">
                    <BaseButton :to="section.button_link">{{ section.button_label }}</BaseButton>
                </div>
            </div>

            <div v-if="categories.length"
                class="-mx-5 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 pt-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0 md:pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <RouterLink v-for="(category, index) in categories" :key="category.slug" :to="category.to"
                    :style="{ animationDelay: `${0.25 + index * 0.09}s` }"
                    class="reveal-card group flex min-w-0 shrink-0 basis-[62%] snap-start flex-col rounded-3xl border border-black/5 bg-[#f4f3ee] p-2 text-[#111] no-underline transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgb(0_0_0/0.14)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:basis-[40%] md:basis-[calc((100%-2.25rem)/4)] md:max-w-[17rem]">
                    <div
                        class="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-[18px] bg-white">
                        <span
                            class="absolute left-2 top-2 z-10 rounded-full bg-[#f4f3ee] px-2 py-1 text-[8px] font-semibold tracking-[0.08em] text-brand-red">
                            {{ category.tag }}
                        </span>

                        <span aria-hidden="true"
                            class="absolute right-3 top-2.5 z-10 text-[10px] font-semibold tabular-nums tracking-[0.1em] text-gray-300">
                            {{ String(index + 1).padStart(2, '0') }}
                        </span>

                        <img v-if="category.image" :src="category.image" :alt="category.name" loading="lazy"
                            class="block h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />

                        <div v-else class="grid h-full w-full place-items-center bg-[#f1f0ec]" role="img"
                            :aria-label="`Gambar ${category.name} belum tersedia`">
                            <svg class="h-14 w-14 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="16" rx="2.5" />
                                <circle cx="8.5" cy="9.5" r="1.6" />
                                <path d="m21 16-5.2-5.2a1 1 0 0 0-1.4 0L6 19" />
                            </svg>
                        </div>
                    </div>

                    <div class="flex flex-1 items-end justify-between gap-2 px-1.5 pb-1 pt-3.5">
                        <div class="min-w-0">
                            <h3 class="m-0 text-sm font-semibold leading-snug tracking-[-0.01em] text-[#111]">
                                {{ category.name }}
                            </h3>
                            <p class="mb-0 mt-1 line-clamp-2 text-[11px] leading-4 text-[#737373]">
                                {{ category.description }}
                            </p>
                        </div>

                        <span aria-hidden="true"
                            class="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#111] text-white transition duration-300 group-hover:bg-brand-red motion-reduce:transition-none">
                            <svg viewBox="0 0 20 20" fill="none"
                                class="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-45 motion-reduce:transition-none">
                                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </div>
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Sebelum terlihat, isi disembunyikan; begitu bagian masuk layar, teks lalu kartu naik berurutan. */
.reveal-copy > *,
.reveal-card {
    opacity: 0;
}
.shown .reveal-copy > *,
.shown .reveal-card {
    opacity: 1;
    animation: category-rise 0.8s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.shown .reveal-copy > *:nth-child(2) { animation-delay: 0.08s; }
.shown .reveal-copy > *:nth-child(3) { animation-delay: 0.16s; }
.shown .reveal-copy > *:nth-child(4) { animation-delay: 0.24s; }

@keyframes category-rise {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
    .reveal-copy > *,
    .reveal-card {
        opacity: 1;
    }
    .shown .reveal-copy > *,
    .shown .reveal-card {
        animation: none;
    }
}
</style>
