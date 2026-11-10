<script setup>
import RentalHeading from './RentalHeading.vue'

const emit = defineEmits(['apply'])

// CONTOH. Sesuaikan dengan masalah pelanggan dan layanan AMAZiNK yang sebenarnya.
const pairs = [
    {
        problem: { title: 'Printer rusak saat deadline', text: 'Pekerjaan berhenti, tim menunggu teknisi entah kapan.' },
        solution: { title: 'Servis ditanggung', text: 'Printer bermasalah ditangani tim AMAZiNK tanpa biaya tambahan.' },
    },
    {
        problem: { title: 'Tinta habis mendadak', text: 'Harus beli tinta terpisah, biaya terus bertambah.' },
        solution: { title: 'Tinta atau toner termasuk', text: 'Persediaan dikirim berkala sehingga tidak perlu repot menstok.' },
    },
    {
        problem: { title: 'Modal besar beli printer', text: 'Anggaran tersedot di depan untuk aset yang terus menyusut.' },
        solution: { title: 'Tanpa biaya beli di awal', text: 'Pakai printer sesuai kebutuhan tanpa menyiapkan modal besar.' },
    },
    {
        problem: { title: 'Biaya servis tak terduga', text: 'Sparepart dan servis dadakan bikin anggaran sulit diprediksi.' },
        solution: { title: 'Satu tagihan pasti', text: 'Biaya bulanan tetap, mudah dianggarkan setiap bulan.' },
    },
    {
        problem: { title: 'Tim sibuk urus printer', text: 'Waktu admin dan IT habis untuk troubleshooting.' },
        solution: { title: 'Tim AMAZiNK yang mengurus', text: 'Urusan printer kami kelola, tim kamu fokus ke bisnis.' },
    },
]
</script>

<template>
    <section aria-labelledby="rental-problems" class="mx-auto max-w-6xl px-5 sm:px-8">
        <RentalHeading id="rental-problems" center eyebrow="Masalah dan solusi" title="Masih repot urus printer kantor?"
            accent="Kami selesaikan."
            description="Masalah printer yang sering menghambat pekerjaan, dan bagaimana sewa printer AMAZiNK menyelesaikannya." />

        <div class="mt-10">
            <div
                class="hidden gap-4 px-1 pb-3 text-[11px] font-bold uppercase tracking-[0.16em] md:grid md:grid-cols-[1fr_44px_1fr]">
                <span class="text-brand-red">Masalah</span>
                <span aria-hidden="true" />
                <span class="text-[#14161b]">Solusi AMAZiNK</span>
            </div>

            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                <li v-for="pair in pairs" :key="pair.problem.title"
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
                                class="m-0 text-[14px] font-semibold text-[#14161b] line-through decoration-brand-red/40">
                                {{ pair.problem.title }}
                            </h3>
                            <p class="mb-0 mt-1 text-[13px] leading-6 text-[#737373]">{{ pair.problem.text }}</p>
                        </div>
                    </div>

                    <span aria-hidden="true" class="grid place-items-center">
                        <span
                            class="grid h-9 w-9 place-items-center rounded-full bg-[#111] text-white shadow-[0_8px_18px_rgb(0_0_0/0.2)]">
                            <svg class="h-4 w-4 rotate-90 md:rotate-0" viewBox="0 0 20 20" fill="none">
                                <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7"
                                    stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </span>
                    </span>

                    <div class="flex items-start gap-3.5 rounded-2xl bg-white p-4 ring-1 ring-black/10">
                        <span class="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#111]">
                            <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                        </span>
                        <div>
                            <h3 class="m-0 text-[14px] font-semibold text-[#14161b]">{{ pair.solution.title }}</h3>
                            <p class="mb-0 mt-1 text-[13px] leading-6 text-[#737373]">{{ pair.solution.text }}</p>
                        </div>
                    </div>
                </li>
            </ul>

            <div class="mt-8 flex justify-center">
                <button type="button"
                    class="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full border-0 bg-[#111] px-7 transition-colors hover:bg-brand-red"
                    style="color: #fff; font-size: 14px; font-weight: 600" @click="emit('apply', null)">
                    Selesaikan masalah printer saya
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M4 10h12m-5-5 5 5-5 5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>