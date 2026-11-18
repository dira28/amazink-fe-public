<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import PhoneInput from '@/components/base/PhoneInput.vue'
import { usePageSection } from '@/composables/usePage'
import { validatePhoneValue } from '@/utils/phone'
import { formatRupiah, printerLabel, rentalTotals } from '../services/rentalService'

const props = defineProps({
    open: { type: Boolean, default: false },
    // Daftar paket untuk dipilih bila pengajuan dimulai tanpa paket.
    printers: { type: Array, default: () => [] },
    // Asal pengajuan: { printer, units, months }. Tanpa paket, semuanya diisi penyewa; dari daftar harga hanya
    // paket (dan harganya) yang terisi; dari kalkulator paket, jumlah unit, dan lama sewa ikut terisi.
    request: { type: Object, default: () => ({ printer: null, units: 0, months: 0 }) },
    // Pelanggan yang sedang masuk: nama dan nomornya mengisi formulir otomatis.
    user: { type: Object, default: null },
    // Terisi setelah pengajuan dikirim: tautan WhatsApp yang sama, bila tab barunya diblokir browser.
    sentUrl: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const options = usePageSection('sewa-printer', 'contact', {
    purposes: ['Kantor', 'Sekolah', 'Usaha / toko', 'Acara / proyek', 'Pribadi'].map((text, i) => ({ id: `purpose-${i + 1}`, text })),
    durations: ['1 bulan', '3 bulan', '6 bulan', '12 bulan'].map((text, i) => ({ id: `duration-${i + 1}`, text })),
})
const DURATIONS = computed(() => options.value.durations.map((item) => item.text?.trim()).filter(Boolean))
const PURPOSES = computed(() => options.value.purposes.map((item) => item.text?.trim()).filter(Boolean))
// Pilihan awal lama sewa: yang ketiga bila ada, selain itu yang terakhir.
const defaultDuration = () => DURATIONS.value[Math.min(2, DURATIONS.value.length - 1)] ?? OTHER
const OTHER = 'Lainnya'

const form = reactive({ name: '', phone: '', reason: '' })
const printerId = ref('')
const unitInput = ref('')
const choice = ref('')
const custom = ref('')
const purposeChoice = ref('')
const purposeCustom = ref('')
const errors = reactive({ name: '', phone: '', purpose: '', reason: '', duration: '', units: '' })

const pickerOpen = ref(false)
const pickerOptions = computed(() => [
    { id: '', label: 'Pilih paket printer' },
    ...props.printers.map((item) => ({ id: item.id, label: printerLabel(item) })),
])
const pickerLabel = computed(() => pickerOptions.value.find((item) => item.id === printerId.value)?.label ?? pickerOptions.value[0].label)

function choosePrinter(id) {
    printerId.value = id
    pickerOpen.value = false
}

const mode = computed(() => {
    if (!props.request.printer) return 'manual'

    return props.request.units > 0 ? 'calculator' : 'price'
})
const chosenPrinter = computed(() => props.request.printer ?? props.printers.find((item) => item.id === printerId.value) ?? null)
const unitCount = computed(() => (mode.value === 'calculator' ? props.request.units : Number.parseInt(unitInput.value, 10) || 0))
const rentPerUnit = computed(() => rentalTotals(chosenPrinter.value).rent)
const autoPrice = computed(() => mode.value !== 'manual' || !!chosenPrinter.value)
const total = computed(() => {
    if (!autoPrice.value) return 0

    return rentPerUnit.value * unitCount.value
})

const subtitle = computed(() => ({
    manual: 'Lengkapi detail sewa di bawah ini.',
    price: 'Sesuai paket yang Anda pilih.',
    calculator: 'Sesuai perhitungan di kalkulator.',
})[mode.value])

const onUnitInput = (event) => {
    unitInput.value = event.target.value.replace(/\D/g, '').slice(0, 3)
}

// Lama sewa dari kalkulator dipilih bila ada di pilihan; selain itu diisi sebagai "Lainnya".
function applyDuration(months) {
    custom.value = ''
    if (!months) {
        choice.value = defaultDuration()
        return
    }

    const text = `${months} bulan`
    const match = DURATIONS.value.find((item) => item.toLowerCase() === text)
    choice.value = match ?? OTHER
    if (!match) custom.value = text
}

const duration = computed(() => (choice.value === OTHER ? custom.value.trim() : choice.value))
const purpose = computed(() => (purposeChoice.value === OTHER ? purposeCustom.value.trim() : purposeChoice.value))

function submit() {
    errors.name = form.name.trim() ? '' : 'Isi nama Anda.'
    errors.phone = validatePhoneValue(form.phone)
    errors.purpose = purpose.value ? '' : 'Pilih untuk kepentingan apa printer ini.'
    errors.reason = form.reason.trim().length < 10 ? 'Tulis alasan pengajuan minimal 10 karakter.' : ''
    errors.duration = duration.value ? '' : 'Isi lama sewa yang dibutuhkan.'
    errors.units = unitCount.value >= 1 ? '' : 'Isi jumlah unit yang dibutuhkan (minimal 1).'

    if (Object.values(errors).some(Boolean)) return

    emit('submit', {
        name: form.name.trim(),
        phone: form.phone,
        purpose: purpose.value,
        reason: form.reason.trim(),
        duration: duration.value,
        printer: chosenPrinter.value,
        units: unitCount.value,
        total: total.value,
    })
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
        if (!open) return

        form.name = props.user?.name ?? ''
        form.phone = props.user?.phone ?? ''
        form.reason = ''
        purposeChoice.value = ''
        purposeCustom.value = ''
        printerId.value = ''
        pickerOpen.value = false
        unitInput.value = ''
        applyDuration(props.request.months)
        Object.keys(errors).forEach((key) => (errors[key] = ''))
    }
)

const onKeydown = (event) => {
    if (event.key !== 'Escape' || !props.open) return

    if (pickerOpen.value) pickerOpen.value = false
    else emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})

const field = 'mt-2 w-full rounded-xl border-0 bg-[#f7f7f5] text-sm outline-none ring-1 focus:ring-2'
const ringOf = (message) => (message ? 'ring-red-400 focus:ring-red-500' : 'ring-black/10 focus:ring-brand-red')
</script>

<template>
    <Teleport to="body">
        <Transition name="dialog">
            <div v-if="open" class="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
                role="dialog" aria-modal="true" aria-labelledby="request-title" @click.self="emit('close')">
                <div v-if="sentUrl"
                    class="dialog-card stagger max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 text-center shadow-2xl sm:rounded-3xl sm:p-8"
                    style="padding-bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px))">
                    <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#25d366]/15 text-[#128c4a]">
                        <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m5 12 5 5 9-10" />
                        </svg>
                    </span>
                    <h2 id="request-title" class="mb-0 mt-4 text-xl font-semibold tracking-[-0.02em]">
                        Pengajuan siap dikirim
                    </h2>
                    <p class="mb-0 mt-2 text-[13px] leading-6 text-[#737373]">
                        WhatsApp dibuka di tab baru. Tekan tombol kirim di WhatsApp
                        agar pengajuanmu sampai ke tim kami.
                    </p>

                    <a :href="sentUrl" target="_blank" rel="noopener noreferrer"
                        class="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full no-underline transition hover:brightness-95"
                        style="background-color: #25d366; color: #0b3d1f; font-size: 14px; font-weight: 600">
                        WhatsApp tidak terbuka? Buka di sini
                    </a>
                    <button type="button"
                        class="mt-2 h-11 w-full cursor-pointer rounded-full border-0 bg-transparent text-[13px] font-semibold text-[#737373] transition-colors hover:text-[#171717]"
                        @click="emit('close')">
                        Tutup
                    </button>
                </div>

                <form v-else novalidate
                    class="dialog-card stagger max-h-[94dvh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-2xl sm:rounded-3xl sm:p-8 pb-0 sm:pb-0" @submit.prevent="submit">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="request-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Ajukan sewa
                            </h2>
                            <p class="mb-0 mt-1 text-[13px] text-[#737373]">
                                {{ subtitle }}
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

                    <div class="relative mt-5">
                        <span id="request-package-label" class="text-[13px] font-semibold">Paket printer</span>

                        <div v-if="request.printer" class="mt-2 flex min-h-12 w-full items-center rounded-xl bg-[#f7f7f5] px-4 text-sm font-medium ring-1 ring-black/10">
                            {{ printerLabel(request.printer) }}
                        </div>

                        <template v-else>
                            <button type="button" aria-haspopup="listbox" :aria-expanded="pickerOpen"
                                aria-labelledby="request-package-label"
                                :class="[field, 'flex h-12 cursor-pointer items-center justify-between gap-3 px-4 text-left']"
                                @click="pickerOpen = !pickerOpen" @blur="pickerOpen = false">
                                <span class="truncate" :class="printerId ? '' : 'text-[#737373]'">{{ pickerLabel }}</span>
                                <svg class="h-4 w-4 shrink-0 text-[#737373] transition-transform duration-200"
                                    :class="pickerOpen ? 'rotate-180' : ''" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" aria-hidden="true">
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            <Transition name="picker">
                                <ul v-if="pickerOpen" role="listbox" aria-labelledby="request-package-label"
                                    class="absolute inset-x-0 top-full z-20 m-0 mt-2 list-none overflow-hidden rounded-2xl border border-black/10 bg-white p-1.5 shadow-[0_18px_40px_rgb(0_0_0/0.16)]">
                                    <li v-for="item in pickerOptions" :key="item.id" role="option"
                                        :aria-selected="item.id === printerId"
                                        class="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[#f7f7f5]"
                                        :class="item.id === printerId ? 'bg-[#f7f7f5] font-semibold' : ''"
                                        @mousedown.prevent="choosePrinter(item.id)">
                                        <span :class="item.id ? '' : 'text-[#737373]'">{{ item.label }}</span>
                                        <svg v-if="item.id === printerId" class="h-4 w-4 shrink-0 text-brand-red"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"
                                            stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                            <path d="m5 12 5 5 9-10" />
                                        </svg>
                                    </li>
                                </ul>
                            </Transition>
                        </template>
                    </div>

                    <div class="mt-3 grid gap-3 sm:grid-cols-2">
                        <div>
                            <label for="request-units" class="text-[13px] font-semibold">Jumlah unit</label>
                            <div v-if="mode === 'calculator'" class="mt-2 flex min-h-12 w-full items-center rounded-xl bg-[#f7f7f5] px-4 text-sm font-medium ring-1 ring-black/10">{{ unitCount }} unit</div>
                            <template v-else>
                                <input id="request-units" :value="unitInput" type="text" inputmode="numeric"
                                    placeholder="Contoh: 5" :aria-invalid="!!errors.units || undefined"
                                    :class="[field, ringOf(errors.units), 'h-12 px-4']" @input="onUnitInput" />
                                <span v-if="errors.units" class="mt-1 block text-xs" style="color: #b91c1c">{{ errors.units }}</span>
                            </template>
                        </div>

                        <div>
                            <template v-if="!autoPrice">
                                <label for="request-total" class="text-[13px] font-semibold">Total harga per bulan</label>
                                <input id="request-total" type="text" disabled placeholder="Harga paket per bulan"
                                    :class="[field, ringOf(''), 'h-12 cursor-not-allowed px-4']" />
                            </template>
                            <template v-else>
                                <span class="text-[13px] font-semibold">
                                    {{ mode === 'calculator' ? 'Total harga' : 'Harga sewa' }}
                                </span>
                                <div class="mt-2 flex min-h-12 w-full items-center rounded-xl bg-[#f7f7f5] px-4 text-sm font-medium ring-1 ring-black/10">
                                    <template v-if="mode === 'calculator' || unitCount > 0">
                                        {{ formatRupiah(total) }} / bulan
                                    </template>
                                    <template v-else>{{ formatRupiah(rentPerUnit) }} / unit / bulan</template>
                                </div>
                                <p v-if="mode !== 'calculator' && unitCount > 0" class="mb-0 mt-1 text-xs text-[#737373]">
                                    {{ formatRupiah(rentPerUnit) }} x {{ unitCount }} unit
                                </p>
                            </template>
                        </div>
                    </div>

                    <div class="mt-4 grid gap-3 sm:grid-cols-2">
                    <label class="block">
                        <span class="text-[13px] font-semibold">Nama</span>
                        <input v-model="form.name" type="text" maxlength="80" autocomplete="name"
                            placeholder="Nama Anda atau perusahaan" :aria-invalid="!!errors.name || undefined"
                            :class="[field, ringOf(errors.name), 'h-12 px-4']" />
                        <span v-if="errors.name" class="mt-1 block text-xs" style="color: #b91c1c">{{ errors.name }}</span>
                    </label>

                    <div>
                        <label for="request-phone" class="text-[13px] font-semibold">Nomor WhatsApp</label>
                        <PhoneInput id="request-phone" v-model="form.phone" variant="soft" :invalid="!!errors.phone" />
                        <span v-if="errors.phone" class="mt-1 block text-xs" style="color: #b91c1c">{{ errors.phone }}</span>
                    </div>
                    </div>

                    <fieldset class="m-0 mt-4 min-w-0 border-0 p-0">
                        <legend class="p-0 text-[13px] font-semibold">Untuk kepentingan apa?</legend>

                        <div class="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            <button v-for="item in [...PURPOSES, OTHER]" :key="item" type="button"
                                :aria-pressed="purposeChoice === item"
                                class="h-10 w-full cursor-pointer rounded-full border-0 px-2 text-[13px] font-semibold transition-colors"
                                :class="purposeChoice === item
                                    ? 'bg-[#171717] text-white'
                                    : 'bg-[#f7f7f5] text-[#171717] ring-1 ring-black/10 hover:ring-brand-red/50'"
                                @click="purposeChoice = item">
                                {{ item }}
                            </button>
                        </div>

                        <input v-if="purposeChoice === OTHER" v-model="purposeCustom" type="text" maxlength="40"
                            placeholder="Contoh: rumah sakit, kampus, komunitas"
                            :class="[field, ringOf(errors.purpose), 'h-12 px-4']" />
                        <span v-if="errors.purpose" class="mt-1 block text-xs" style="color: #b91c1c">{{ errors.purpose }}</span>
                    </fieldset>

                    <label class="mt-4 block">
                        <span class="text-[13px] font-semibold">Alasan pengajuan</span>
                        <textarea v-model="form.reason" rows="2" maxlength="500"
                            placeholder="Contoh: dipakai untuk apa dan perkiraan jumlah cetak per bulan"
                            :aria-invalid="!!errors.reason || undefined"
                            :class="[field, ringOf(errors.reason), 'resize-y p-4 leading-6']"></textarea>
                        <span class="mt-1 flex justify-between gap-3 text-[11px] text-[#737373]">
                            <span v-if="errors.reason" class="text-xs" style="color: #b91c1c">{{ errors.reason }}</span>
                            <span v-else />
                            {{ form.reason.length }}/500
                        </span>
                    </label>

                    <fieldset class="m-0 mt-3 min-w-0 border-0 p-0">
                        <legend class="p-0 text-[13px] font-semibold">Lama sewa</legend>

                        <div class="mt-2 grid grid-cols-3 gap-2">
                            <button v-for="item in [...DURATIONS, OTHER]" :key="item" type="button"
                                :aria-pressed="choice === item"
                                class="h-10 w-full cursor-pointer rounded-full border-0 px-2 text-[13px] font-semibold transition-colors"
                                :class="choice === item
                                    ? 'bg-[#171717] text-white'
                                    : 'bg-[#f7f7f5] text-[#171717] ring-1 ring-black/10 hover:ring-brand-red/50'"
                                @click="choice = item">
                                {{ item }}
                            </button>
                        </div>

                        <input v-if="choice === OTHER" v-model="custom" type="text" maxlength="40"
                            placeholder="Contoh: 2 tahun, atau selama proyek"
                            :class="[field, ringOf(errors.duration), 'h-12 px-4']" />
                        <span v-if="errors.duration" class="mt-1 block text-xs" style="color: #b91c1c">{{ errors.duration }}</span>
                    </fieldset>

                    <div class="sticky bottom-0 -mx-6 mt-5 bg-white px-6 pt-3 sm:-mx-8 sm:px-8"
                        style="padding-bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px))">
                    <button type="submit"
                        class="h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        Lanjut ke WhatsApp
                    </button>
                    <p class="mb-0 mt-3 text-center text-xs text-[#737373]">
                        Anda akan diarahkan ke WhatsApp untuk mengirim pengajuan ke tim kami.
                    </p>
                    </div>
                </form>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Latar memudar, kartu naik sambil membesar sedikit dengan pantulan kecil, lalu isinya muncul berurutan. */
.dialog-enter-active {
    transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.dialog-leave-active {
    transition: opacity 0.25s ease-in-out;
}
.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}
.dialog-enter-active .dialog-card {
    animation: dialog-pop 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.dialog-leave-active .dialog-card {
    transform: translateY(16px) scale(0.985);
    transition: transform 0.25s ease-in-out;
}
.dialog-enter-active .stagger > * {
    animation: dialog-rise 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.dialog-enter-active .stagger > *:nth-child(1) { animation-delay: 0.1s; }
.dialog-enter-active .stagger > *:nth-child(2) { animation-delay: 0.14s; }
.dialog-enter-active .stagger > *:nth-child(3) { animation-delay: 0.18s; }
.dialog-enter-active .stagger > *:nth-child(4) { animation-delay: 0.22s; }
.dialog-enter-active .stagger > *:nth-child(5) { animation-delay: 0.26s; }
.dialog-enter-active .stagger > *:nth-child(6) { animation-delay: 0.3s; }
.dialog-enter-active .stagger > *:nth-child(7) { animation-delay: 0.34s; }
.dialog-enter-active .stagger > *:nth-child(8) { animation-delay: 0.38s; }
.dialog-enter-active .stagger > *:nth-child(n + 9) { animation-delay: 0.42s; }

.dialog-card {
    scrollbar-width: none;
}
.dialog-card::-webkit-scrollbar {
    display: none;
}

.picker-enter-active,
.picker-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}
.picker-enter-from,
.picker-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

@keyframes dialog-pop {
    from { opacity: 0; transform: translateY(28px) scale(0.975); }
    to { opacity: 1; transform: none; }
}
@keyframes dialog-rise {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
    .dialog-enter-active .dialog-card,
    .dialog-enter-active .stagger > * {
        animation: none;
    }
    .dialog-leave-active .dialog-card,
    .picker-enter-active,
    .picker-leave-active {
        transition: none;
    }
}
</style>
