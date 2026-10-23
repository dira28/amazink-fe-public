<script setup>
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const about = usePageSection('reseller', 'about', {
    eyebrow: 'Tentang AMAZiNK',
    title: 'Fokus di consumable printer sejak 2007',
    paragraphs: [
        {
            id: 'paragraph-1',
            text: 'AMAZiNK adalah produk PT. Amazink Karya Indonesia. Berawal dari tinta printer refill, kini kami punya toner refill, sistem infus printer, photo paper, cartridge toner compatible, dan paper label, dengan layanan purna jual yang prima.',
        },
        {
            id: 'paragraph-2',
            text: 'Kami mengembangkan sistem channel kemitraan yang menduplikasi operasional bisnis kami agar menjangkau lebih banyak pasar di kota-kota besar Indonesia. Siap berkembang bersama kami?',
        },
    ],
    audience_title: 'Apakah Anda?',
    audiences: [
        {
            id: 'audience-1',
            title: 'Pemilik toko komputer & printer',
            text: 'Toko komputer, toko printer, atau servis printer yang mencari produk dan layanan pelengkap.',
        },
        {
            id: 'audience-2',
            title: 'Pemilik toko IT & ATK',
            text: 'Toko perlengkapan IT atau ATK di kota atau kabupaten yang ingin menambah lini produk.',
        },
        {
            id: 'audience-3',
            title: 'Investor di bidang IT',
            text: 'Siapa pun yang ingin berinvestasi di bidang IT untuk tabungan atau masa depan.',
        },
    ],
})
</script>

<template>
    <section class="px-5 py-14 sm:px-8 sm:py-20">
        <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">{{ about.eyebrow }}</p>
                <h2 class="mt-2.5 text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.045em]">
                    <AccentText :text="about.title" />
                </h2>
                <p v-for="(paragraph, index) in about.paragraphs" :key="paragraph.id"
                    class="text-sm leading-[1.9] text-[#737373]" :class="index === 0 ? 'mt-4' : 'mt-3'">
                    {{ paragraph.text }}
                </p>
            </div>

            <div>
                <h3 class="text-base font-semibold">{{ about.audience_title }}</h3>
                <ul class="mt-4 space-y-3">
                    <li v-for="item in about.audiences" :key="item.id"
                        class="flex gap-4 rounded-2xl border border-gray-200 bg-[#f7f7f5] p-5">
                        <span
                            class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-red text-white">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"
                                stroke-linecap="round" stroke-linejoin="round" class="h-3.5 w-3.5" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </span>
                        <div>
                            <p class="m-0 text-sm font-semibold">{{ item.title }}</p>
                            <p class="mt-1 text-[13px] leading-6 text-[#737373]">{{ item.text }}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>