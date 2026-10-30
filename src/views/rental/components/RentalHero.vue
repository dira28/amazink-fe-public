<script setup>
// Isi dengan gambar asli, misal '/images/rental/hero.jpg'
const heroImage = ''
</script>

<template>
    <section class="mx-auto max-w-6xl px-5 pt-8 sm:px-8 sm:pt-12">
        <div
            class="grid items-center gap-8 rounded-[32px] bg-white p-6 ring-1 ring-black/5 sm:p-10 md:grid-cols-[1.1fr_1fr] md:gap-12">
            <div>
                <h1 class="m-0 text-[clamp(28px,4.4vw,46px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Butuh printer tanpa harus membeli?
                </h1>
                <p class="mb-0 mt-4 max-w-md text-[13px] leading-7 text-[#737373] sm:text-sm">
                    Sewa printer lengkap dengan tinta atau toner dan servisnya. Pilih paket, ajukan, lalu tim AMAZiNK
                    akan menghubungimu.
                </p>
                <a href="#daftar-harga"
                    class="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#171717] px-6 no-underline transition-colors hover:bg-brand-red"
                    style="color: #fff; font-size: 13px; font-weight: 600">
                    Lihat harga sewa
                </a>
            </div>

            <div
                class="grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-black/5">
                <img v-if="heroImage" :src="heroImage" alt="Printer sewa AMAZiNK" class="h-full w-full object-cover" />
                <svg v-else class="h-14 w-14 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <circle cx="8.5" cy="9" r="1.5" />
                    <path d="m21 15-5-5L5 20" />
                </svg>
            </div>
        </div>
    </section>
</template>