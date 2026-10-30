<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatRupiah, rentalTotals } from '../services/rentalService'

const props = defineProps({
    open: { type: Boolean, default: false },
    printer: { type: Object, default: null },
})

const emit = defineEmits(['close', 'apply'])

const totals = computed(() => rentalTotals(props.printer))
const money = (value) => (value ? formatRupiah(value) : '-')

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
    }
)

const onKeydown = (event) => {
    if (event.key === 'Escape' && props.open) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open && printer"
                class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                role="dialog" aria-modal="true" aria-labelledby="compare-title" @click.self="emit('close')">
                <div class="w-full max-w-4xl rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="compare-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Rincian paket sewa
                            </h2>
                            <p class="mb-0 mt-1 text-[13px] text-[#737373]">
                                {{ printer.brand }} {{ printer.name }}. Aset adalah nilai jika dibeli, sewa adalah
                                biaya per bulan.
                            </p>
                        </div>

                        <button type="button" aria-label="Tutup"
                            class="grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f7f7f5] text-[#171717] transition-colors hover:bg-gray-200"
                            @click="emit('close')">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                                <path d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>

                    <div class="mt-5 overflow-x-auto rounded-2xl ring-1 ring-black/10">
                        <table class="w-full min-w-[640px] border-collapse text-left text-[13px]">
                            <caption class="sr-only">Rincian komponen, aset, dan sewa per bulan</caption>
                            <thead>
                                <tr class="bg-[#f7f7f5] text-xs font-semibold text-[#171717]">
                                    <th scope="col" class="px-4 py-3">Komponen</th>
                                    <th scope="col" class="w-14 px-4 py-3 text-center">Qty</th>
                                    <th scope="col" class="px-4 py-3 text-right">Aset</th>
                                    <th scope="col" class="px-4 py-3 text-right">Sewa / bulan</th>
                                    <th scope="col" class="px-4 py-3">Benefit</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr v-for="item in printer.components" :key="item.name"
                                    class="border-t border-black/5 align-top">
                                    <th scope="row" class="px-4 py-3 font-medium">{{ item.name }}</th>
                                    <td class="px-4 py-3 text-center">{{ item.qty }}</td>
                                    <td class="px-4 py-3 text-right">{{ money(item.asset * item.qty) }}</td>
                                    <td class="px-4 py-3 text-right">{{ money(item.rent * item.qty) }}</td>
                                    <td class="px-4 py-3">
                                        <ul class="m-0 list-disc space-y-0.5 pl-4 text-[#525252]">
                                            <li v-for="benefit in item.benefits" :key="benefit">{{ benefit }}</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>

                            <tfoot>
                                <tr class="border-t border-black/10 bg-[#f7f7f5] font-semibold">
                                    <th scope="row" class="px-4 py-3">Total biaya</th>
                                    <td></td>
                                    <td class="px-4 py-3 text-right">{{ money(totals.asset) }}</td>
                                    <td class="px-4 py-3 text-right text-brand-red">{{ money(totals.rent) }}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div class="mt-5 flex justify-end">
                        <button type="button"
                            class="h-11 cursor-pointer rounded-full border-0 bg-brand-red px-6 transition-opacity hover:opacity-90"
                            style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('apply', printer)">
                            Ajukan sewa paket ini
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>