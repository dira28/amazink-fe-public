<script setup>
import { computed } from 'vue'
import { usePageSection } from '@/composables/usePage'
import RentalHeading from './RentalHeading.vue'

const pair = (id, problem_title, problem_text, solution_title, solution_text) => ({
    id: `problem-${id}`,
    problem_title,
    problem_text,
    solution_title,
    solution_text,
})

const content = usePageSection('sewa-printer', 'problems', {
    eyebrow: 'Masalah dan solusi',
    title: 'Masih repot urus printer kantor?',
    accent: 'Kami selesaikan.',
    description: 'Masalah printer yang sering menghambat pekerjaan, dan bagaimana sewa printer AMAZiNK menyelesaikannya.',
    button_label: 'Hitung biaya sewa',
    items: [
        pair(1, 'Printer rusak saat deadline', 'Pekerjaan berhenti, tim menunggu teknisi entah kapan.', 'Servis ditanggung', 'Printer bermasalah ditangani tim AMAZiNK tanpa biaya tambahan.'),
        pair(2, 'Tinta habis mendadak', 'Harus beli tinta terpisah, biaya terus bertambah.', 'Tinta atau toner termasuk', 'Persediaan dikirim berkala sehingga tidak perlu repot menstok.'),
        pair(3, 'Modal besar beli printer', 'Anggaran tersedot di depan untuk aset yang terus menyusut.', 'Tanpa biaya beli di awal', 'Pakai printer sesuai kebutuhan tanpa menyiapkan modal besar.'),
        pair(4, 'Biaya servis tak terduga', 'Sparepart dan servis dadakan bikin anggaran sulit diprediksi.', 'Satu tagihan pasti', 'Biaya bulanan tetap, mudah dianggarkan setiap bulan.'),
        pair(5, 'Tim sibuk urus printer', 'Waktu admin dan IT habis untuk troubleshooting.', 'Tim AMAZiNK yang mengurus', 'Urusan printer kami kelola, tim kamu fokus ke bisnis.'),
    ],
})

// Pasangan yang kedua sisinya kosong diabaikan.
const pairs = computed(() =>
    content.value.items
        .filter((item) => item.problem_title?.trim() || item.solution_title?.trim())
        .map((item) => ({
            id: item.id,
            problem: { title: item.problem_title, text: item.problem_text },
            solution: { title: item.solution_title, text: item.solution_text },
        }))
)
</script>

<template>
    <section aria-labelledby="rental-problems" class="mx-auto max-w-6xl px-5 sm:px-8">
        <RentalHeading id="rental-problems" center :eyebrow="content.eyebrow" :title="content.title" :accent="content.accent"
            :description="content.description" />

        <div class="mt-10">
            <div
                class="hidden gap-4 px-1 pb-3 text-[11px] font-bold uppercase tracking-[0.16em] md:grid md:grid-cols-[1fr_44px_1fr]">
                <span class="text-brand-red">Masalah</span>
                <span aria-hidden="true" />
                <span class="text-[#14161b]">Solusi AMAZiNK</span>
            </div>

            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                <li v-for="(pair, index) in pairs" :key="pair.id || index"
                    class="grid items-stretch gap-2 md:grid-cols-[1fr_44px_1fr] md:gap-4">
                    <div class="flex items-start gap-3.5 rounded-2xl bg-red-50/70 p-4 ring-1 ring-red-100">
                        <span
                            class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-100 text-brand-red">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.4" stroke-linecap="round" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </span>
                        <div>
                            <h3
                                class="m-0 text-[14px] font-semibold text-[#14161b] line-through decoration-brand-red decoration-2">
                                {{ pair.problem.title }}
                            </h3>
                            <p class="mb-0 mt-1 text-[13px] leading-6 text-[#737373]">{{ pair.problem.text }}</p>
                        </div>
                    </div>

                    <span aria-hidden="true" class="grid place-items-center">
                        <span
                            class="grid h-9 w-9 place-items-center rounded-full bg-brand-red text-white shadow-[0_8px_18px_-4px_rgba(225,29,46,0.55)]">
                            <svg class="h-4 w-4 rotate-90 md:rotate-0" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </span>

                    <!-- Solusi dibuat gelap dan lebih besar supaya jadi titik fokus, kontras dengan kartu masalah yang pucat -->
                    <div
                        class="relative flex items-start gap-3.5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#1c1c1c] to-[#0d0d0d] p-4 shadow-[0_18px_36px_-22px_rgba(0,0,0,0.6)] md:p-5">
                        <div aria-hidden="true"
                            class="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-brand-red/30 blur-2xl" />
                        <span class="relative mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-red">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                        </span>
                        <div class="relative">
                            <h3 class="m-0 text-[15px] font-semibold text-white">{{ pair.solution.title }}</h3>
                            <p class="mb-0 mt-1 text-[13px] leading-6 text-white/65">{{ pair.solution.text }}</p>
                        </div>
                    </div>
                </li>
            </ul>

            <div class="mt-8 flex justify-center">
                <a href="#hitung-biaya"
                    class="inline-flex h-12 items-center gap-2 rounded-full bg-[#111] px-7 no-underline transition-colors hover:bg-brand-red"
                    style="color: #fff; font-size: 14px; font-weight: 600">
                    {{ content.button_label }}
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </a>
            </div>
        </div>
    </section>
</template>