<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { formatRupiah, rentalTotals } from '../services/rentalService'

const props = defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['apply'])

const MONTH_OPTIONS = [1, 3, 6, 12]
const MAX_UNITS = 20
const TICKS = [1, 5, 10, 15, 20]
const THUMB = 24
const INCLUDED = ['Unit printer siap pakai', 'Tinta atau toner termasuk', 'Servis dan maintenance', 'Dukungan teknis']

const printerId = ref('')
const units = ref(1)
const months = ref(6)

watch(
    () => props.printers,
    (list) => {
        if (list.length && !list.some((item) => item.id === printerId.value)) {
            printerId.value = list[0].id
        }
    },
    { immediate: true }
)

const printer = computed(() => props.printers.find((item) => item.id === printerId.value) ?? null)
const totals = computed(() => rentalTotals(printer.value))

const monthly = computed(() => totals.value.rent * units.value)
const periodTotal = computed(() => monthly.value * months.value)
const buyCost = computed(() => totals.value.asset * units.value)

const position = (value) => `calc(${THUMB / 2}px + (100% - ${THUMB}px) * ${(value - 1) / (MAX_UNITS - 1)})`
const fill = computed(() => position(units.value))
const monthIndex = computed(() => MONTH_OPTIONS.indexOf(months.value))

const open = ref(false)
const activeIndex = ref(0)
const picker = ref(null)

const selectedIndex = computed(() => props.printers.findIndex((item) => item.id === printerId.value))
const rentOf = (item) => formatRupiah(rentalTotals(item).rent)

const scrollToActive = () =>
    nextTick(() => document.getElementById(`printer-option-${activeIndex.value}`)?.scrollIntoView({ block: 'nearest' }))

const openList = () => {
    activeIndex.value = Math.max(selectedIndex.value, 0)
    open.value = true
    scrollToActive()
}

const closeList = () => {
    open.value = false
}

const choose = (item) => {
    printerId.value = item.id
    closeList()
}

const onPickerKey = (event) => {
    const { key } = event
    const last = props.printers.length - 1

    if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault()
        if (!open.value) return openList()
        activeIndex.value = Math.min(Math.max(activeIndex.value + (key === 'ArrowDown' ? 1 : -1), 0), last)
        scrollToActive()
    } else if ((key === 'Home' || key === 'End') && open.value) {
        event.preventDefault()
        activeIndex.value = key === 'Home' ? 0 : last
        scrollToActive()
    } else if (key === 'Enter' || key === ' ') {
        event.preventDefault()
        if (!open.value) return openList()
        const item = props.printers[activeIndex.value]
        if (item) choose(item)
    } else if (key === 'Escape' && open.value) {
        event.preventDefault()
        closeList()
    } else if (key === 'Tab') {
        closeList()
    }
}

const onOutside = (event) => {
    if (picker.value && !picker.value.contains(event.target)) closeList()
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))


const rangeClass =
    'h-1.5 w-full cursor-pointer appearance-none rounded-full text-brand-red outline-none ' +
    'bg-[linear-gradient(to_right,currentColor_var(--fill),#e7e5e4_var(--fill))] ' +
    '[&::-webkit-slider-thumb]:box-border [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 ' +
    '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full ' +
    '[&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-solid ' +
    '[&::-webkit-slider-thumb]:border-current [&::-webkit-slider-thumb]:bg-white ' +
    '[&::-webkit-slider-thumb]:shadow-[0_3px_10px_rgba(0,0,0,0.2)] [&::-webkit-slider-thumb]:transition-transform ' +
    'hover:[&::-webkit-slider-thumb]:scale-110 ' +
    '[&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:w-6 ' +
    '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-solid ' +
    '[&::-moz-range-thumb]:border-current [&::-moz-range-thumb]:bg-white ' +
    '[&::-moz-range-thumb]:shadow-[0_3px_10px_rgba(0,0,0,0.2)]'
</script>

<template>
    <section id="hitung-biaya" aria-labelledby="rental-calc"
        class="relative scroll-mt-20 overflow-hidden bg-gradient-to-b from-[#1c1c1c] to-[#0d0d0d] py-14 text-white sm:py-20">
        <div aria-hidden="true"
            class="pointer-events-none absolute -left-24 -top-32 h-96 w-96 rounded-full bg-brand-red/30 blur-3xl" />
        <div aria-hidden="true"
            class="pointer-events-none absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />

        <div class="relative mx-auto max-w-5xl px-5 sm:px-8">
            <div v-if="loading" class="h-80 animate-pulse rounded-3xl bg-white/10" role="status"
                aria-label="Memuat kalkulator"></div>

            <p v-else-if="!printer" class="m-0 py-10 text-center text-[13px] text-white/60">
                Kalkulator tersedia setelah daftar paket sewa dimuat.
            </p>

            <div v-else class="grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
                <div>
                    <h2 id="rental-calc"
                        class="m-0 text-[clamp(24px,3.4vw,34px)] font-bold leading-[1.1] tracking-[-0.04em]">
                        Hitung biaya sewa
                    </h2>
                    <p class="mb-0 mt-2 text-[13px] leading-6 text-white/60">
                        Estimasi cepat. Penawaran final dari tim kami.
                    </p>

                    <p class="mb-0 mt-8 text-[13px] text-white/60">{{ printer.brand }} {{ printer.name }}</p>
                    <p class="m-0 mt-1 text-[clamp(28px,3.4vw,38px)] font-semibold leading-none tracking-[-0.04em]">
                        {{ formatRupiah(totals.rent) }}
                    </p>
                    <p class="m-0 mt-1.5 text-[13px] text-white/60">per unit, per bulan</p>

                    <ul class="m-0 mt-6 list-none space-y-2 p-0 text-[13px]">
                        <li v-for="item in INCLUDED" :key="item" class="flex items-center gap-2.5 text-white/85">
                            <svg class="h-4 w-4 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="m5 12 5 5 9-10" />
                            </svg>
                            {{ item }}
                        </li>
                    </ul>

                    <button type="button"
                        class="mt-7 h-11 cursor-pointer rounded-full border-0 bg-white px-7 transition-colors hover:bg-gray-200"
                        style="color: #171717; font-size: 13px; font-weight: 600" @click="emit('apply', printer)">
                        Ajukan sewa paket ini
                    </button>
                </div>

                <div class="rounded-3xl bg-white text-[#171717] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]">
                    <div class="space-y-5 px-6 pb-6 pt-6 sm:px-8 sm:pt-8">
                        <div ref="picker" class="relative">
                            <span id="printer-label" class="text-[13px] font-semibold">Paket printer</span>
                            <button type="button" role="combobox" aria-haspopup="listbox" :aria-expanded="open"
                                aria-controls="printer-listbox" aria-labelledby="printer-label"
                                :aria-activedescendant="open ? `printer-option-${activeIndex}` : undefined"
                                class="mt-2 flex h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border-0 pl-4 pr-3.5 text-left text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-brand-red"
                                :class="open ? 'bg-white ring-2 ring-brand-red' : 'bg-[#f6f5f2] ring-1 ring-black/5 hover:bg-[#f1efeb]'"
                                @click="open ? closeList() : openList()" @keydown="onPickerKey">
                                <span class="truncate">
                                    <span class="font-normal text-[#737373]">{{ printer.brand }}</span>
                                    <span class="font-semibold">{{ printer.name }}</span>
                                </span>
                                <svg class="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200"
                                    :class="open ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            <Transition enter-active-class="transition duration-150 ease-out"
                                enter-from-class="-translate-y-1 scale-[0.98] opacity-0"
                                enter-to-class="translate-y-0 scale-100 opacity-100"
                                leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100"
                                leave-to-class="opacity-0">
                                <ul v-if="open" id="printer-listbox" role="listbox" aria-labelledby="printer-label"
                                    class="absolute inset-x-0 top-full z-30 m-0 mt-2 max-h-64 origin-top list-none overflow-auto rounded-2xl bg-white p-1.5 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)] ring-1 ring-black/10">
                                    <li v-for="(item, index) in printers" :id="`printer-option-${index}`" :key="item.id"
                                        role="option" :aria-selected="item.id === printerId"
                                        class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors"
                                        :class="index === activeIndex ? 'bg-[#f6f5f2]' : ''"
                                        @mouseenter="activeIndex = index" @click="choose(item)">
                                        <span class="min-w-0">
                                            <span class="block text-xs text-[#737373]">{{ item.brand }}</span>
                                            <span class="block truncate text-sm"
                                                :class="item.id === printerId ? 'font-semibold' : 'font-medium'">
                                                {{ item.name }}
                                            </span>
                                        </span>
                                        <span class="flex shrink-0 items-center gap-2.5">
                                            <span class="text-xs tabular-nums text-[#737373]">{{ rentOf(item) }}</span>
                                            <svg v-if="item.id === printerId" class="h-4 w-4 text-brand-red"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                                <path d="m5 12 5 5 9-10" />
                                            </svg>
                                            <span v-else class="h-4 w-4" aria-hidden="true" />
                                        </span>
                                    </li>
                                </ul>
                            </Transition>
                        </div>

                        <div>
                            <div class="flex items-baseline justify-between">
                                <label for="rental-units" class="text-[13px] font-semibold">Jumlah printer</label>
                                <span class="text-lg font-bold tabular-nums text-brand-red" aria-live="polite">
                                    {{ units }} unit
                                </span>
                            </div>
                            <input id="rental-units" v-model.number="units" type="range" min="1" :max="MAX_UNITS"
                                step="1" :class="rangeClass" class="mt-3" :style="{ '--fill': fill }" />
                            <div class="relative mt-1.5 h-4 text-[11px] text-[#a3a3a3]" aria-hidden="true">
                                <span v-for="tick in TICKS" :key="tick" class="absolute top-0 -translate-x-1/2"
                                    :class="{ 'font-semibold text-brand-red': tick === units }"
                                    :style="{ left: position(tick) }">
                                    {{ tick }}
                                </span>
                            </div>
                        </div>

                        <div>
                            <p class="m-0 text-[13px] font-semibold">Lama sewa</p>
                            <div class="relative mt-2 grid grid-cols-4 rounded-xl bg-[#f6f5f2] p-1 ring-1 ring-black/5"
                                role="group" aria-label="Lama sewa">
                                <span aria-hidden="true"
                                    class="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/4)] rounded-lg bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] ring-1 ring-black/5 transition-transform duration-300 ease-out motion-reduce:transition-none"
                                    :style="{ transform: `translateX(${monthIndex * 100}%)` }" />
                                <button v-for="option in MONTH_OPTIONS" :key="option" type="button"
                                    :aria-pressed="months === option"
                                    class="relative h-9 cursor-pointer rounded-lg border-0 bg-transparent px-0 transition-colors"
                                    :style="{
                                        color: months === option ? '#171717' : '#737373',
                                        fontSize: '13px',
                                        fontWeight: months === option ? 700 : 500,
                                    }" @click="months = option">
                                    {{ option }} bulan
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-b-3xl border-t border-black/5 bg-[#faf9f7] px-6 py-5 sm:px-8"
                        aria-live="polite">
                        <p class="m-0 text-xs font-medium text-[#737373]">Total biaya per bulan</p>
                        <p class="mb-0 mt-1 text-[clamp(26px,3vw,34px)] font-extrabold leading-none tracking-[-0.04em]">
                            {{ formatRupiah(monthly) }}
                        </p>

                        <dl class="m-0 mt-4 grid gap-3 border-t border-black/5 pt-4 text-[13px] sm:grid-cols-3">
                            <div>
                                <dt class="text-[#737373]">Total {{ months }} bulan</dt>
                                <dd class="m-0 mt-0.5 font-semibold tabular-nums">{{ formatRupiah(periodTotal) }}</dd>
                            </div>
                            <div>
                                <dt class="text-[#737373]">Modal awal</dt>
                                <dd class="m-0 mt-0.5 font-semibold">Rp0</dd>
                            </div>
                            <div>
                                <dt class="text-[#737373]">Jika dibeli sendiri</dt>
                                <dd
                                    class="m-0 mt-0.5 font-semibold tabular-nums text-[#a3a3a3] line-through decoration-black/20">
                                    {{ formatRupiah(buyCost) }}
                                </dd>
                            </div>
                        </dl>

                        <p class="mb-0 mt-3 text-xs text-[#a3a3a3]">Perkiraan saja. Harga akhir dikonfirmasi tim
                            AMAZiNK.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>