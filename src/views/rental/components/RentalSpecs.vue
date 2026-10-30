<script setup>
defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
})

defineEmits(['pick'])

const rows = [
    { key: 'type', label: 'Jenis' },
    { key: 'functions', label: 'Fungsi' },
    { key: 'speed', label: 'Kecepatan' },
    { key: 'paper', label: 'Kertas' },
    { key: 'suitableFor', label: 'Cocok untuk' },
]
</script>

<template>
    <section aria-labelledby="spek-sewa-title">
        <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Bandingkan</p>
        <h2 id="spek-sewa-title" class="m-0 mt-2 text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
            Spesifikasi dan perbandingan
        </h2>
        <p class="mb-0 mt-2 max-w-xl text-[13px] leading-6 text-[#737373]">
            Lihat perbedaan tiap printer, lalu pilih yang paling cocok untuk kebutuhanmu.
        </p>

        <div v-if="loading" class="mt-6 h-56 animate-pulse rounded-3xl bg-white ring-1 ring-black/5" role="status"
            aria-label="Memuat spesifikasi"></div>

        <div v-else-if="printers.length" class="mt-6 overflow-x-auto rounded-3xl bg-white ring-1 ring-black/5">
            <table class="w-full min-w-[640px] border-collapse text-left text-[13px]">
                <caption class="sr-only">Perbandingan spesifikasi printer sewa</caption>
                <thead>
                    <tr class="border-b border-black/5">
                        <th scope="col" class="w-36 px-5 py-4 text-xs font-medium text-[#737373]">Printer</th>
                        <th v-for="item in printers" :key="item.id" scope="col" class="px-5 py-4 align-top">
                            <span class="block text-[11px] font-medium text-[#737373]">{{ item.brand }}</span>
                            <span class="block text-[15px] font-semibold">{{ item.name }}</span>
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="row in rows" :key="row.key" class="border-b border-black/5 last:border-0">
                        <th scope="row" class="px-5 py-3.5 text-xs font-medium text-[#737373]">{{ row.label }}</th>
                        <td v-for="item in printers" :key="item.id" class="px-5 py-3.5 leading-6">
                            {{ item[row.key] || '-' }}
                        </td>
                    </tr>

                    <tr>
                        <th scope="row" class="px-5 py-4"></th>
                        <td v-for="item in printers" :key="item.id" class="px-5 py-4">
                            <button type="button"
                                class="h-9 cursor-pointer rounded-full border-0 bg-[#171717] px-5 transition-colors hover:bg-brand-red"
                                style="color: #fff; font-size: 12px; font-weight: 600" @click="$emit('pick', item.id)">
                                Pilih
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <p v-else class="mt-6 rounded-3xl bg-white p-6 text-center text-[13px] text-[#737373] ring-1 ring-black/5">
            Daftar printer sewa belum tersedia.
        </p>
    </section>
</template>