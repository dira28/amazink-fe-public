<script setup>
import AccentText from '@/components/base/AccentText.vue'
import { usePageSection } from '@/composables/usePage'

const opportunity = usePageSection('reseller', 'opportunity', {
    eyebrow: 'Peluang bisnis',
    title: 'Peluang consumable printer di Indonesia.',
    stats: [
        { id: 'stat-1', value: '2007', label: 'Sejak tahun' },
        { id: 'stat-2', value: 'Rp1,2 T', label: 'Market consumable printer 2015 (IDC)' },
        { id: 'stat-3', value: '48.529', label: 'Unit printer laser baru terjual per bulan, 2015' },
        { id: 'stat-4', value: 'Rp33 M+', label: 'Rata-rata nilai penjualan printer laser per bulan' },
    ],
    opportunities: [
        { id: 'opportunity-1', text: 'Pelanggan membeli berulang, bukan sekali transaksi.' },
        { id: 'opportunity-2', text: 'Segmen pasar luas: individu, UKM, korporasi, hingga pemerintahan.' },
        { id: 'opportunity-3', text: 'Semua yang mencetak butuh consumable untuk printernya.' },
    ],
    benefits_title: 'Keuntungan bergabung',
    benefits: [
        { id: 'benefit-1', text: 'Varian produk banyak dan lengkap' },
        { id: 'benefit-2', text: 'Proteksi area dan proteksi harga minimal agar profit channel terjaga' },
        { id: 'benefit-3', text: 'Margin keuntungan menarik di setiap produk' },
        { id: 'benefit-4', text: 'Harga bersaing, tetap berorientasi pada kualitas' },
        { id: 'benefit-5', text: 'Bebas memilih produk sesuai potensi penjualan di wilayahmu' },
    ],
})
</script>

<template>
    <section class="bg-[#111] px-5 py-14 text-[#f7f7f5] sm:px-8 sm:py-20">
        <div class="mx-auto max-w-7xl">
            <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">{{ opportunity.eyebrow }}</p>
            <h2 class="mt-2.5 max-w-2xl text-[clamp(26px,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.045em]">
                <AccentText :text="opportunity.title" />
            </h2>

            <dl class="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                <div v-for="stat in opportunity.stats" :key="stat.id" class="rounded-2xl bg-[#1c1c1c] p-5">
                    <dt class="order-2 mt-2 text-xs leading-5 text-[#929292]">{{ stat.label }}</dt>
                    <dd class="m-0 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{{ stat.value }}</dd>
                </div>
            </dl>

            <div class="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
                <ul class="space-y-3">
                    <li v-for="item in opportunity.opportunities" :key="item.id" class="flex gap-3 text-sm leading-6 text-[#c2c2c2]">
                        <span class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" />
                        {{ item.text }}
                    </li>
                </ul>

                <div class="rounded-[22px] bg-[#f4f3ee] p-6 text-[#111] sm:p-7">
                    <h3 class="text-base font-semibold">{{ opportunity.benefits_title }}</h3>
                    <ul class="mt-4 space-y-3">
                        <li v-for="item in opportunity.benefits" :key="item.id" class="flex gap-3 text-sm leading-6">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                                stroke-linecap="round" stroke-linejoin="round"
                                class="mt-1 h-4 w-4 shrink-0 text-brand-red" aria-hidden="true">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                            {{ item.text }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
</template>