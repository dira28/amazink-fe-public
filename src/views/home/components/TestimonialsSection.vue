<script setup>
import { computed, onMounted, ref } from 'vue'
import { USE_MOCK } from '@/services/http'
import { fetchTestimonials } from '@/services/testimonialService'

// DATA CONTOH: dipakai hanya saat mode mock. Selain itu testimoni diambil dari API.
const mockTestimonials = [
    {
        id: 1,
        name: 'Rina Wulandari',
        role: 'Pemilik toko ATK',
        rating: 5,
        quote: 'Tinta AMAZiNK hasil cetaknya tajam dan tidak cepat habis. Pelanggan toko saya jadi sering pesan ulang.',
    },
    {
        id: 2,
        name: 'Budi Santoso',
        role: 'Pemilik percetakan',
        rating: 5,
        quote: 'Toner compatible-nya awet dan hasilnya rapi. Harganya juga masuk untuk kebutuhan cetak harian.',
    },
    {
        id: 3,
        name: 'Siti Nurhaliza',
        role: 'Admin kantor',
        rating: 4,
        quote: 'Dibantu memilih tinta yang pas untuk printer Epson kami. Responnya cepat dan barang cepat sampai.',
    },
    {
        id: 4,
        name: 'Andi Pratama',
        role: 'Mahasiswa',
        rating: 5,
        quote: 'Pakai untuk cetak skripsi dan hasilnya jelas. Printer juga aman, tidak ada masalah di head.',
    },
    {
        id: 5,
        name: 'Maya Kusuma',
        role: 'Reseller',
        rating: 5,
        quote: 'Jadi reseller AMAZiNK tidak ribet. Stok jelas dan tim selalu siap membantu kalau ada pertanyaan.',
    },
    {
        id: 6,
        name: 'Hendra Wijaya',
        role: 'Pemilik kafe',
        rating: 5,
        quote: 'Cetak menu dan label kemasan jadi lebih hemat. Warnanya tajam dan konsisten dari awal sampai akhir.',
    },
]

const testimonials = ref(USE_MOCK ? mockTestimonials : [])

onMounted(async () => {
    if (USE_MOCK) return

    try {
        testimonials.value = await fetchTestimonials()
    } catch {
        // Gagal memuat: bagian ini disembunyikan.
    }
})

const average = computed(() => {
    if (!testimonials.value.length) return '0.0'

    const sum = testimonials.value.reduce((total, item) => total + item.rating, 0)
    return (sum / testimonials.value.length).toFixed(1)
})

const initial = (name) => name.trim().charAt(0).toUpperCase()
</script>

<template>
    <section v-if="testimonials.length" class="bg-[#f7f7f5] py-14 text-[#171717] sm:py-20"
        aria-labelledby="testimoni-title">
        <div class="mx-auto max-w-7xl px-5 sm:px-8">
            <header class="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Testimoni</p>
                    <h2 id="testimoni-title"
                        class="mt-2.5 text-[clamp(28px,4vw,42px)] font-semibold leading-[1.1] tracking-[-0.04em]">
                        Kata mereka tentang AMAZiNK
                    </h2>
                    <p class="mt-3 max-w-xl text-[13px] leading-[1.8] text-[#737373] sm:text-sm">
                        Pengalaman pelanggan yang sudah memakai tinta dan toner kami untuk kebutuhan cetak
                        sehari-hari.
                    </p>
                </div>

                <div class="flex shrink-0 items-center gap-3 rounded-2xl bg-white px-5 py-3 ring-1 ring-black/5">
                    <span class="text-3xl font-bold tracking-tight">{{ average }}</span>
                    <span>
                        <span class="flex gap-0.5" aria-hidden="true">
                            <svg v-for="n in 5" :key="n" class="h-4 w-4" viewBox="0 0 24 24"
                                :fill="n <= Math.round(average) ? '#f59e0b' : '#e5e7eb'">
                                <path
                                    d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
                            </svg>
                        </span>
                        <span class="mt-0.5 block text-[11px] text-[#737373]">
                            dari {{ testimonials.length }} ulasan
                        </span>
                    </span>
                </div>
            </header>

            <!-- Mobile: geser menyamping. Desktop: grid -->
            <ul
                class="-mx-5 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-3 [scrollbar-width:none] sm:mx-0 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
                <li v-for="item in testimonials" :key="item.id"
                    class="flex w-[82%] shrink-0 snap-center list-none flex-col rounded-3xl bg-white p-6 ring-1 ring-black/5 transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgba(0,0,0,0.08)] motion-reduce:transition-none motion-reduce:hover:transform-none sm:w-auto">
                    <span class="flex gap-0.5" :aria-label="`Rating ${item.rating} dari 5`">
                        <svg v-for="n in 5" :key="n" class="h-4 w-4" viewBox="0 0 24 24"
                            :fill="n <= item.rating ? '#f59e0b' : '#e5e7eb'" aria-hidden="true">
                            <path d="m12 2.5 2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3 6.1 20.6l1.3-6.6L2.5 9.4l6.6-.8z" />
                        </svg>
                    </span>

                    <blockquote class="m-0 mt-4 flex-1 text-[14px] leading-7 text-[#404040]">
                        “{{ item.quote }}”
                    </blockquote>

                    <div class="mt-6 flex items-center gap-3 border-t border-black/5 pt-5">
                        <span
                            class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-red text-sm font-semibold"
                            style="color: #fff" aria-hidden="true">
                            {{ initial(item.name) }}
                        </span>
                        <span class="min-w-0">
                            <span class="block truncate text-[13px] font-semibold">{{ item.name }}</span>
                            <span class="block truncate text-xs text-[#737373]">{{ item.role }}</span>
                        </span>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>