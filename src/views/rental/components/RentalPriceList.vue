<script setup>
import { computed, ref, watch } from 'vue'
import { formatRupiah, rentalTotals } from '../services/rentalService'

const props = defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    loadError: { type: String, default: '' },
})

const emit = defineEmits(['apply', 'compare', 'retry'])

const index = ref(0)
const current = computed(() => props.printers[index.value] ?? null)
const price = computed(() => (current.value ? rentalTotals(current.value).rent : 0))

watch(
    () => props.printers.length,
    (total) => {
        if (index.value >= total) index.value = 0
    }
)

function go(step) {
    const total = props.printers.length
    if (total < 2) return
    index.value = (index.value + step + total) % total
}
</script>

<template>
    <section id="daftar-harga" aria-labelledby="rental-price" class="mx-auto max-w-6xl scroll-mt-24 px-5 sm:px-8">
        <h2 id="rental-price" class="m-0 text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
            Daftar dan price list sewa
        </h2>
        <p class="mb-0 mt-2 max-w-xl text-[13px] leading-6 text-[#737373]">
            Harga sudah termasuk printer, tinta atau toner, dan servis. Geser untuk melihat paket lainnya.
        </p>

        <div v-if="loading" class="mt-6 h-72 animate-pulse rounded-[32px] bg-white ring-1 ring-black/5" role="status"
            aria-label="Memuat daftar harga"></div>

        <div v-else-if="loadError" class="mt-6 rounded-3xl bg-red-50 p-5 text-[13px]" style="color: #b91c1c"
            role="alert">
            {{ loadError }}
            <button type="button" class="ml-1 cursor-pointer border-0 bg-transparent p-0 font-semibold underline"
                style="color: #b91c1c" @click="emit('retry')">
                Coba lagi
            </button>
        </div>

        <div v-else-if="current" class="mt-6 rounded-[32px] bg-white p-4 ring-1 ring-black/5 sm:p-6">
            <div class="grid items-center gap-6 md:grid-cols-2 md:gap-10">
                <div
                    class="grid aspect-[4/3] place-items-center overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100">
                    <img v-if="current.image" :src="current.image" :alt="`${current.brand} ${current.name}`"
                        class="h-full w-full object-contain p-6" />
                    <svg v-else class="h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <circle cx="8.5" cy="9" r="1.5" />
                        <path d="m21 15-5-5L5 20" />
                    </svg>
                </div>

                <div class="md:pr-4">
                    <p class="m-0 text-xs font-medium text-[#737373]">{{ current.brand }}</p>
                    <h3 class="m-0 mt-1 text-xl font-semibold tracking-[-0.02em]">{{ current.name }}</h3>
                    <p class="mb-0 mt-2 text-[13px] leading-6 text-[#737373]">{{ current.functions }}</p>

                    <p class="mb-0 mt-6 text-xs font-medium text-[#737373]">Harga sewa per bulan</p>
                    <p class="m-0 mt-1 text-3xl font-bold tracking-[-0.03em]">{{ formatRupiah(price) }}</p>

                    <div class="mt-6 grid grid-cols-2 gap-2">
                        <button type="button"
                            class="h-11 cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90"
                            style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('apply', current)">
                            Ajukan sewa
                        </button>
                        <button type="button"
                            class="h-11 cursor-pointer rounded-full border-0 bg-white ring-1 ring-black/15 transition-colors hover:ring-brand-red/50"
                            style="color: #171717; font-size: 13px; font-weight: 600" @click="emit('compare', current)">
                            Lihat perbandingan
                        </button>
                    </div>
                </div>
            </div>

            <!-- Penunjuk paket -->
            <div v-if="printers.length > 1" class="mt-5 flex items-center justify-end gap-3">
                <div class="flex items-center gap-1.5" role="tablist" aria-label="Pilih paket">
                    <button v-for="(item, i) in printers" :key="item.id" type="button" role="tab"
                        :aria-selected="i === index" :aria-label="`${item.brand} ${item.name}`"
                        class="h-2 cursor-pointer rounded-full border-0 p-0 transition-all duration-200"
                        :class="i === index ? 'w-6 bg-brand-red' : 'w-2 bg-gray-300 hover:bg-gray-400'"
                        @click="index = i"></button>
                </div>

                <div class="flex gap-1.5">
                    <button type="button" aria-label="Paket sebelumnya"
                        class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-[#f7f7f5] text-[#171717] ring-1 ring-black/10 transition-colors hover:ring-brand-red/50"
                        @click="go(-1)">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </button>
                    <button type="button" aria-label="Paket berikutnya"
                        class="grid h-9 w-9 cursor-pointer place-items-center rounded-full border-0 bg-[#f7f7f5] text-[#171717] ring-1 ring-black/10 transition-colors hover:ring-brand-red/50"
                        @click="go(1)">
                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m9 18 6-6-6-6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <p v-else class="mt-6 rounded-3xl bg-white p-6 text-center text-[13px] text-[#737373] ring-1 ring-black/5">
            Daftar printer sewa belum tersedia.
        </p>
    </section>
</template>