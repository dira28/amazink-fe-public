<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { usePageSection } from '@/composables/usePage'
import { formatRupiah, printerLabel, rentalTotals } from '../services/rentalService'

const props = defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
})

const emit = defineEmits(['apply'])

const MONTH_OPTIONS = [1, 3, 6, 12]
const MAX_UNITS = 20
const TICKS = [1, 5, 10, 15, 20]
const THUMB = 24

const content = usePageSection('sewa-printer', 'calculator', {
    eyebrow: 'Kalkulator',
    title: 'Hitung biaya sewa',
    description: 'Atur jumlah printer dan lama sewa, hasilnya langsung terlihat. Penawaran final dari tim kami.',
    button_label: 'Ajukan sewa paket ini',
    included: [
        { id: 'calc-1', text: 'Unit printer siap pakai' },
        { id: 'calc-2', text: 'Tinta atau toner termasuk' },
        { id: 'calc-3', text: 'Servis dan maintenance' },
        { id: 'calc-4', text: 'Dukungan teknis' },
    ],
})

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

// Angka berjalan ke nilai baru (seperti hitung naik/turun) dengan gerak yang melambat lembut di akhir,
// sambil memudar masuk. Bila pengguna memilih "kurangi gerakan", angka langsung berganti.
const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useTween(source, duration = 900) {
    const shown = ref(source.value)
    let frame = 0

    watch(source, (to) => {
        cancelAnimationFrame(frame)
        if (reduceMotion) {
            shown.value = to
            return
        }

        const from = shown.value
        // Bila nilai lama dan baru sama-sama kelipatan 1.000, angka berjalan per 1.000 sehingga "000" di belakang
        // tidak ikut berubah; selain itu berjalan per rupiah.
        const unit = from % 1000 === 0 && to % 1000 === 0 ? 1000 : 1
        const start = performance.now()
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 5)
            shown.value = Math.round((from + (to - from) * eased) / unit) * unit
            if (t < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
    })

    onBeforeUnmount(() => cancelAnimationFrame(frame))

    return shown
}

const monthlyShown = useTween(monthly)
const periodShown = useTween(periodTotal)
const buyShown = useTween(buyCost)

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

            <div v-else class="grid items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-14">
                <div>
                    <p class="m-0 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
                        <span class="block h-0.5 w-6 bg-brand-red" aria-hidden="true" />
                        {{ content.eyebrow }}
                    </p>
                    <h2 id="rental-calc"
                        class="mb-0 mt-3 whitespace-nowrap text-[clamp(26px,3.3vw,40px)] font-bold leading-[1.05] tracking-[-0.045em]">
                        {{ content.title }}
                    </h2>
                    <p class="mb-0 mt-3 max-w-sm text-sm leading-7 text-white/65">
                        {{ content.description }}
                    </p>

                    <p class="mb-0 mt-7 inline-flex flex-wrap items-center gap-x-2 rounded-full bg-white/10 px-4 py-2 text-[13px] text-white/70 ring-1 ring-white/10">
                        {{ printerLabel(printer) }}
                        <span class="font-semibold text-white">{{ formatRupiah(totals.rent) }}</span>
                        <span class="text-white/50">/ unit / bulan</span>
                    </p>

                    <ul class="m-0 mt-6 list-none space-y-2.5 p-0 text-[13px]">
                        <li v-for="item in content.included" :key="item.id || item.text" class="flex items-center gap-2.5 text-white/80">
                            <svg class="h-4 w-4 shrink-0 text-brand-red" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"
                                aria-hidden="true">
                                <path d="m5 12 5 5 9-10" />
                            </svg>
                            {{ item.text }}
                        </li>
                    </ul>

                    <button type="button"
                        class="mt-8 h-12 cursor-pointer rounded-full border-0 bg-brand-red px-8 shadow-[0_18px_36px_-14px_rgba(225,29,46,0.75)] transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 14px; font-weight: 700" @click="emit('apply', printer, { units, months })">
                        {{ content.button_label }}
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
                                <span class="truncate font-semibold">{{ printerLabel(printer) }}</span>
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
                                            <span v-if="item.categoryName" class="block text-xs text-[#737373]">{{ item.categoryName }}</span>
                                            <span class="block truncate text-sm"
                                                :class="item.id === printerId ? 'font-semibold' : 'font-medium'">
                                                {{ [item.brandName, item.name].filter(Boolean).join(' ') }}
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
                            <div class="relative mt-3 h-6">
                                <input id="rental-units" v-model.number="units" type="range" min="1" :max="MAX_UNITS"
                                    step="1"
                                    class="peer absolute inset-0 z-10 m-0 h-full w-full cursor-pointer opacity-0" />
                                <span aria-hidden="true"
                                    class="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-[#e7e5e4]">
                                    <span class="absolute inset-y-0 left-0 rounded-full bg-brand-red transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
                                        :style="{ width: fill }" />
                                </span>
                                <span aria-hidden="true"
                                    class="pointer-events-none absolute top-1/2 box-border h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-solid border-brand-red bg-white shadow-[0_3px_10px_rgba(0,0,0,0.2)] transition-[left,transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] peer-hover:scale-110 peer-active:scale-110 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-red/25 motion-reduce:transition-none"
                                    :style="{ left: fill }" />
                            </div>
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

                    <div class="rounded-b-3xl bg-[#b3141f] px-6 py-6 text-white sm:px-8">
                        <!-- Angka di bawah bergerak tiap frame, jadi pembaca layar hanya diberi nilai akhirnya. -->
                        <span class="sr-only" aria-live="polite">Total biaya per bulan {{ formatRupiah(monthly) }}</span>
                        <p class="m-0 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">Total biaya per bulan</p>
                        <p class="mb-0 mt-1 text-[clamp(38px,4.6vw,56px)] font-extrabold leading-none tracking-[-0.045em] tabular-nums" aria-hidden="true">
                            <span :key="monthly" class="num-fade block">{{ formatRupiah(monthlyShown) }}</span>
                        </p>

                        <dl class="m-0 mt-4 grid gap-3 border-t border-white/25 pt-4 text-[13px] sm:grid-cols-3">
                            <div>
                                <dt class="text-white/75">Total {{ months }} bulan</dt>
                                <dd class="m-0 mt-0.5 font-semibold tabular-nums">
                                    <span :key="periodTotal" class="num-fade block">{{ formatRupiah(periodShown) }}</span>
                                </dd>
                            </div>
                            <div>
                                <dt class="text-white/75">Modal awal</dt>
                                <dd class="m-0 mt-0.5 font-semibold">Rp0</dd>
                            </div>
                            <div>
                                <dt class="text-white/75">Jika dibeli sendiri</dt>
                                <dd
                                    class="m-0 mt-0.5 font-semibold tabular-nums text-white/60 line-through decoration-white/50">
                                    <span :key="buyCost" class="num-fade block">{{ formatRupiah(buyShown) }}</span>
                                </dd>
                            </div>
                        </dl>

                        <p class="mb-0 mt-3 text-xs text-white/70">Hanya perkiraan. Harga akhir dikonfirmasi tim
                            AMAZiNK.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
/* Tiap nilai baru memudar masuk dari agak redup; elemen dibuat ulang lewat :key sehingga animasinya mulai lagi. */
.num-fade {
    animation: num-fade 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes num-fade {
    from { opacity: 0.35; }
    to { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
    .num-fade { animation: none; }
}
</style>
