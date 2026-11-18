<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatRupiah, printerLabel, rentalTotals } from '../services/rentalService'

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
                class="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
                role="dialog" aria-modal="true" aria-labelledby="compare-title" @click.self="emit('close')">
                <div class="max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7"
                    style="padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px))">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="compare-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Rincian paket sewa
                            </h2>
                            <p class="mb-0 mt-1 text-[13px] text-[#737373]">
                                {{ printerLabel(printer) }}. Aset adalah nilai jika dibeli, sewa adalah
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

                    <!-- HP: tiap komponen jadi kartu, supaya tidak perlu menggeser tabel ke samping -->
                    <ul class="m-0 mt-5 flex list-none flex-col gap-2 p-0 sm:hidden">
                        <li v-for="item in printer.components" :key="item.name"
                            class="rounded-2xl bg-[#f7f7f5] p-4 ring-1 ring-black/5">
                            <p class="m-0 flex items-baseline justify-between gap-3 text-[14px] font-semibold">
                                {{ item.name }}
                                <span class="shrink-0 text-xs font-bold text-brand-red">{{ item.qty }}x</span>
                            </p>
                            <dl class="m-0 mt-2 grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <dt class="text-[#737373]">Aset</dt>
                                    <dd class="m-0 mt-0.5 text-[13px] font-semibold">{{ money(item.asset * item.qty) }}</dd>
                                </div>
                                <div>
                                    <dt class="text-[#737373]">Sewa / bulan</dt>
                                    <dd class="m-0 mt-0.5 text-[13px] font-semibold">{{ money(item.rent * item.qty) }}</dd>
                                </div>
                            </dl>
                            <ul v-if="item.benefits.length" class="m-0 mt-2 list-disc space-y-0.5 pl-4 text-xs text-[#525252]">
                                <li v-for="benefit in item.benefits" :key="benefit">{{ benefit }}</li>
                            </ul>
                        </li>

                        <li class="rounded-2xl bg-[#171717] p-4 text-white">
                            <p class="m-0 text-xs text-white/60">Total sewa per bulan</p>
                            <p class="m-0 mt-0.5 text-xl font-bold tracking-[-0.02em]">{{ money(totals.rent) }}</p>
                            <p class="m-0 mt-1 text-xs text-white/60">Total aset: {{ money(totals.asset) }}</p>
                        </li>
                    </ul>

                    <div class="mt-5 hidden overflow-x-auto rounded-2xl ring-1 ring-black/10 sm:block">
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

                    <dl class="m-0 mt-4 grid gap-x-6 gap-y-1.5 text-xs leading-5 text-[#737373] sm:grid-cols-3">
                        <div><dt class="inline font-semibold text-[#171717]">Qty: </dt><dd class="m-0 inline">jumlah unit komponen dalam paket.</dd></div>
                        <div><dt class="inline font-semibold text-[#171717]">Aset: </dt><dd class="m-0 inline">nilai komponen jika dibeli.</dd></div>
                        <div><dt class="inline font-semibold text-[#171717]">Sewa / bulan: </dt><dd class="m-0 inline">biaya yang dibayar tiap bulan.</dd></div>
                    </dl>

                    <div class="mt-5 flex sm:justify-end">
                        <button type="button"
                            class="h-11 w-full cursor-pointer rounded-full border-0 bg-brand-red px-6 transition-opacity hover:opacity-90 sm:w-auto"
                            style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('apply', printer)">
                            Ajukan sewa paket ini
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>