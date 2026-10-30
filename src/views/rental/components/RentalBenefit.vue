<script setup>
import { usePageSection } from '@/composables/usePage'

// Teks bawaan dipakai selama data dari API belum ada atau API tidak bisa dihubungi.
const content = usePageSection('sewa-printer', 'benefits', {
    title: 'Benefit sewa di AMAZiNK',
    image: '',
    items: [
        { id: 'benefit-1', title: 'Tanpa biaya beli di awal', text: 'Pakai printer sesuai kebutuhan tanpa menyiapkan modal besar.' },
        { id: 'benefit-2', title: 'Servis dan perawatan ditanggung', text: 'Printer bermasalah ditangani tim AMAZiNK tanpa biaya tambahan.' },
        { id: 'benefit-3', title: 'Unit pengganti', text: 'Printer rusak diganti supaya pekerjaanmu tidak terhenti.' },
        { id: 'benefit-4', title: 'Tinta atau toner rutin', text: 'Persediaan dikirim berkala sehingga tidak perlu repot menstok.' },
    ],
})
</script>

<template>
    <section aria-labelledby="rental-benefit" class="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 id="rental-benefit" class="m-0 text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
            {{ content.title }}
        </h2>

        <div class="mt-6 grid gap-4 rounded-[32px] bg-white p-4 ring-1 ring-black/5 sm:p-6 md:grid-cols-2">
            <!-- Ukuran panel mengikuti tinggi kartu benefit (di HP rasio 4:3); gambar diletakkan absolut sehingga
                 ukuran aslinya tidak mengubah tata letak, dan dipotong (cover) agar selalu pas. -->
            <div
                class="relative grid aspect-[4/3] min-h-56 place-items-center overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 md:aspect-auto">
                <img v-if="content.image" :src="content.image" alt="Benefit sewa AMAZiNK"
                    class="absolute inset-0 h-full w-full object-cover" />
                <svg v-else class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="9" r="1.5" />
                    <path d="m21 15-5-5L5 20" />
                </svg>
            </div>

            <ul class="m-0 flex list-none flex-col justify-center gap-3 p-0">
                <li v-for="(item, index) in content.items" :key="item.id || index"
                    class="flex items-start gap-3 rounded-2xl bg-[#f7f7f5] p-4">
                    <span class="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-red">
                        <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m5 12 5 5L20 7" />
                        </svg>
                    </span>
                    <div>
                        <h3 class="m-0 text-[14px] font-semibold">{{ item.title }}</h3>
                        <p class="mb-0 mt-1 text-[13px] leading-6 text-[#737373]">{{ item.text }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>
