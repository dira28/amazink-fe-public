<script setup>
import { ref } from 'vue'
import RentalHeading from './RentalHeading.vue'
import { waLink } from '../services/rentalService'

// CONTOH. Sesuaikan jawaban dengan ketentuan sewa AMAZiNK yang sebenarnya.
const faqs = [
    {
        q: 'Apa saja yang termasuk dalam biaya sewa?',
        a: 'Biaya sewa sudah mencakup printer, tinta atau toner, serta servis dan perawatan. Rincian tiap paket bisa dilihat lewat tombol Lihat perbandingan.',
    },
    {
        q: 'Apakah ada biaya di awal?',
        a: 'Kamu tidak perlu membeli printer. Untuk ketentuan lain seperti deposit atau biaya pemasangan, tim kami akan menjelaskan saat mengonfirmasi pengajuanmu.',
    },
    {
        q: 'Berapa lama minimal masa sewa?',
        a: 'Lama sewa menyesuaikan paket dan kebutuhanmu. Tulis lama sewa yang diinginkan di form pengajuan, lalu tim kami akan mengonfirmasinya.',
    },
    {
        q: 'Bagaimana jika printer rusak?',
        a: 'Servis ditanggung tim AMAZiNK. Jika perlu, printer akan diganti dengan unit pengganti supaya pekerjaanmu tidak terhenti.',
    },
    {
        q: 'Bagaimana cara mengajukan sewa?',
        a: 'Pilih paket di daftar harga, klik Ajukan sewa, isi formulirnya, lalu tim AMAZiNK akan menghubungimu untuk langkah berikutnya.',
    },
]

const open = ref(0)
const toggle = (index) => {
    open.value = open.value === index ? -1 : index
}

const waUrl = waLink('Halo AMAZiNK, saya ingin bertanya soal sewa printer.')
</script>

<template>
    <section aria-labelledby="rental-faq" class="mx-auto max-w-6xl px-5 sm:px-8">
        <div class="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
            <div>
                <RentalHeading id="rental-faq" dark eyebrow="FAQ" title="Pertanyaan seputar" accent="sewa printer" />

                <div class="mt-6 rounded-3xl bg-white p-5 ring-1 ring-black/5">
                    <p class="m-0 text-[15px] font-semibold text-[#14161b]">Masih ada pertanyaan?</p>
                    <p class="mb-0 mt-1 text-[13px] leading-6 text-[#737373]">
                        Tim kami siap menjawab langsung lewat WhatsApp.
                    </p>
                    <a :href="waUrl" target="_blank" rel="noopener noreferrer"
                        class="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-[#25d366] px-6 no-underline transition hover:brightness-95"
                        style="color: #0b3d1f; font-size: 14px; font-weight: 600">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path
                                d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.2 14c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.9.9c.3.1.5.2.5.3.1.2.1.8-.1 1.4Z" />
                        </svg>
                        Chat WhatsApp
                    </a>
                </div>
            </div>

            <ul class="m-0 flex list-none flex-col gap-3 p-0">
                <li v-for="(item, index) in faqs" :key="item.q" class="rounded-2xl bg-white ring-1 ring-black/5">
                    <h3 class="m-0">
                        <button type="button" :id="`faq-btn-${index}`" :aria-expanded="open === index"
                            :aria-controls="`faq-panel-${index}`"
                            class="flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border-0 bg-transparent px-5 py-4 text-left"
                            style="color: #14161b; font-size: 14px; font-weight: 600" @click="toggle(index)">
                            {{ item.q }}
                            <span
                                class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-red-50 text-brand-red transition-transform duration-200"
                                :class="open === index ? 'rotate-45' : ''">
                                <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
                                    <path d="M12 5v14M5 12h14" />
                                </svg>
                            </span>
                        </button>
                    </h3>

                    <div :id="`faq-panel-${index}`" role="region" :aria-labelledby="`faq-btn-${index}`"
                        class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
                        :class="open === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
                        <div class="overflow-hidden">
                            <p class="m-0 px-5 pb-5 text-[13px] leading-7 text-[#737373]">{{ item.a }}</p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>