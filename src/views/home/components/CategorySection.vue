<script setup>
import { computed } from 'vue'
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

// Kartu dibuat dari kategori produk yang aktif (sama dengan katalog), bukan daftar tulisan tangan.
const { products } = useProducts()

// Nama kategori dari ASIS berupa huruf besar semua ("TINTA"); ditampilkan sebagai "Tinta".
const prettify = (name) =>
    name === name.toUpperCase() ? name.toLowerCase().replace(/(^|\s)\S/g, (char) => char.toUpperCase()) : name

const categories = computed(() => {
    const groups = new Map()

    for (const product of products.value) {
        const group = groups.get(product.categorySlug) ?? { slug: product.categorySlug, name: product.category, count: 0, image: '' }

        group.count += 1
        // Gambar kartu diambil dari produk pertama di kategori itu yang punya gambar.
        group.image ||= product.image
        groups.set(product.categorySlug, group)
    }

    return [...groups.values()].map((group) => ({
        ...group,
        name: prettify(group.name),
        tag: `${group.count} PRODUK`,
        description: `Lihat semua ${prettify(group.name).toLowerCase()}`,
        to: { path: '/catalog-produk', query: { kategori: group.slug }, hash: '#daftar-produk' },
    }))
})
</script>

<template>
    <section id="kategori-produk" aria-labelledby="category-title"
        class="bg-white px-5 py-12 text-[#171a20] sm:px-[clamp(20px,3vw,40px)] sm:py-16">
        <div
            class="mx-auto grid w-full max-w-340 grid-cols-1 items-center gap-8 xl:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] xl:gap-12">
            <!-- Intro -->
            <div class="min-w-0 max-w-162.5 xl:max-w-110">
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

            <!-- Kartu kategori: 4 sejajar, tinggi -->
            <div v-if="categories.length"
                class="-mx-5 flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-6 pt-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 md:pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <RouterLink v-for="(category, index) in categories" :key="category.slug" :to="category.to"
                    class="group flex min-w-0 shrink-0 basis-[62%] snap-start flex-col rounded-3xl border border-black/5 bg-[#f4f3ee] p-2 text-[#111] no-underline transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_rgb(0_0_0/0.14)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:basis-[40%] md:basis-auto">
                    <!-- Gambar -->
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

                        <div v-else class="grid h-full w-full place-items-center bg-[#ebeae5]">
                            <span class="text-xs font-bold tracking-[0.12em] text-[#111]">AMAZiNK</span>
                        </div>
                    </div>

                    <!-- Info -->
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