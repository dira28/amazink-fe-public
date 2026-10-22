<script setup>
import { computed } from 'vue'
import AccentText from '@/components/base/AccentText.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { usePageSection } from '@/composables/usePage'

const defaults = {
    eyebrow: 'Produk Kami',
    title: 'Solusi lengkap untuk setiap kebutuhan cetak.',
    description:
        'Dari tinta, toner, hingga printer, temukan kebutuhan cetakmu dalam satu tempat bersama AMAZiNK.',
    button_label: 'Lihat Semua Produk',
    button_link: '/#produk',
    items: [
        { id: 'category-1', name: 'Tinta Printer', description: 'Berbagai merek & seri', image: '/images/home/tinta.jpeg', tag: 'INK' },
        { id: 'category-2', name: 'Toner Printer', description: 'Kualitas cetak maksimal', image: '/images/home/toner.jpeg', tag: 'TONER' },
        { id: 'category-3', name: 'Printer', description: 'Untuk kebutuhan kerja & rumah', image: '/images/home/printer.jpeg', tag: 'PRINTER' },
        { id: 'category-4', name: 'Aksesori', description: 'Dukung performa printermu', image: '/images/home/aksesori.jpeg', tag: 'ACCESSORIES' },
    ],
}

const section = usePageSection('home', 'categories', defaults)

// Gambar yang dikosongkan di admin memakai gambar bawaan pada urutan yang sama.
const categories = computed(() =>
    section.value.items.map((item, index) => ({ ...item, image: item.image || defaults.items[index]?.image || '' })),
)
</script>

<template>
    <section id="kategori-produk" aria-labelledby="category-title"
        class="bg-white px-5 py-11 text-[#171a20] sm:px-[clamp(20px,3vw,40px)] sm:py-16">
        <div
            class="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-7 sm:gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12">
            <!-- Intro -->
            <div class="min-w-0 max-w-[650px] lg:max-w-[520px]">
                <div class="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#e91d2d]">
                    <span class="block h-0.5 w-7 shrink-0 bg-[#e91d2d]" />
                    {{ section.eyebrow }}
                </div>

                <h2 id="category-title"
                    class="mt-4 text-[30px] font-bold leading-[1.15] tracking-[-0.045em] text-[#20232a] sm:text-[clamp(28px,3vw,40px)]">
                    <AccentText :text="section.title" />
                </h2>

                <p class="mt-4 text-sm leading-[1.8] text-gray-500">
                    {{ section.description }}
                </p>

                <div class="mt-7">
                    <BaseButton :to="section.button_link">{{ section.button_label }}</BaseButton>
                </div>
            </div>

            <!-- Grid kategori -->
            <div class="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <a v-for="category in categories" :key="category.name" href="/#produk"
                    class="group block min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-[#f8f8f8] no-underline transition duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-[0_12px_28px_rgb(0_0_0/0.06)] motion-reduce:transition-none motion-reduce:hover:transform-none">
                    <div
                        class="relative flex h-40 items-center justify-center overflow-hidden bg-[#f5f5f5] sm:h-[170px]">
                        <span
                            class="absolute left-3 top-3 z-10 rounded-full border border-gray-200 bg-white/90 px-2.5 py-[5px] text-[9px] font-semibold tracking-[0.08em] text-gray-500">
                            {{ category.tag }}
                        </span>

                        <img :src="category.image" :alt="category.name" loading="lazy"
                            class="block h-full w-full object-contain p-5 transition-transform duration-[400ms] group-hover:scale-105 motion-reduce:transition-none" />
                    </div>

                    <div class="flex items-center justify-between gap-3 p-4">
                        <div>
                            <h3 class="text-sm font-semibold text-gray-900">{{ category.name }}</h3>
                            <p class="mt-1 text-xs text-gray-500">{{ category.description }}</p>
                        </div>

                        <span aria-hidden="true"
                            class="shrink-0 text-xl text-gray-500 transition duration-300 group-hover:translate-x-1 group-hover:text-[#e91d2d] motion-reduce:transition-none">
                            →
                        </span>
                    </div>
                </a>
            </div>
        </div>
    </section>
</template>