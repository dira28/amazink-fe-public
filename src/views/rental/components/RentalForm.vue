<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { submitRental } from '../services/rentalService'

const OTHER = '__other'
const MAX_PHOTO_MB = 5
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const props = defineProps({
    printers: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    loadError: { type: String, default: '' },
    selectedId: { type: String, default: null },
})

const emit = defineEmits(['update:selectedId', 'retry'])

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const search = ref('')
const customSeries = ref('')
const note = ref('')
const photo = ref(null)
const preview = ref('')
const photoError = ref('')
const error = ref('')
const submitting = ref(false)
const requestId = ref('')

const norm = (text) => String(text ?? '').toLowerCase().replace(/[^a-z0-9]/g, '')

const filtered = computed(() => {
    const q = norm(search.value)
    if (!q) return props.printers
    return props.printers.filter((p) => norm(`${p.brand}${p.name}${p.type}`).includes(q))
})

const selectedPrinter = computed(() => props.printers.find((p) => p.id === props.selectedId) ?? null)

const printerLabel = computed(() => {
    if (props.selectedId === OTHER) return customSeries.value.trim()
    return selectedPrinter.value ? `${selectedPrinter.value.brand} ${selectedPrinter.value.name}` : ''
})

const select = (id) => emit('update:selectedId', id)

function goLogin() {
    router.push({ name: 'login', query: { redirect: `${route.path}#form-sewa` } })
}

function clearPhoto() {
    if (preview.value) URL.revokeObjectURL(preview.value)
    photo.value = null
    preview.value = ''
}

function onPhoto(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    photoError.value = ''

    if (!PHOTO_TYPES.includes(file.type)) {
        photoError.value = 'Format foto harus JPG, PNG, atau WebP.'
        return
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
        photoError.value = `Ukuran foto maksimal ${MAX_PHOTO_MB} MB.`
        return
    }

    clearPhoto()
    photo.value = file
    preview.value = URL.createObjectURL(file)
}

async function submit() {
    if (!isLoggedIn.value) return goLogin()

    error.value = ''

    if (!props.selectedId) {
        error.value = 'Pilih printer terlebih dahulu.'
        return
    }
    if (props.selectedId === OTHER && customSeries.value.trim().length < 2) {
        error.value = 'Tulis seri printer yang kamu cari.'
        return
    }

    submitting.value = true
    try {
        const result = await submitRental({
            printerId: props.selectedId,
            printerLabel: printerLabel.value,
            note: note.value.trim(),
            photo: photo.value,
        })
        requestId.value = result.id
    } catch (e) {
        error.value = e.message
    } finally {
        submitting.value = false
    }
}

function reset() {
    requestId.value = ''
    note.value = ''
    customSeries.value = ''
    search.value = ''
    clearPhoto()
    emit('update:selectedId', null)
}

onBeforeUnmount(clearPhoto)
</script>

<template>
    <section id="form-sewa" class="scroll-mt-24" aria-labelledby="form-sewa-title">
        <div class="rounded-3xl bg-white p-5 ring-1 ring-black/5 sm:p-8">
            <!-- Berhasil -->
            <div v-if="requestId" class="py-6 text-center" role="status">
                <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50">
                    <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m5 12 5 5L20 7" />
                    </svg>
                </span>
                <h2 class="m-0 mt-4 text-xl font-semibold tracking-[-0.02em]">Permintaan sewa terkirim</h2>
                <p class="mx-auto mb-0 mt-2 max-w-sm text-sm leading-6 text-[#737373]">
                    Tim AMAZiNK akan menghubungimu untuk konfirmasi {{ printerLabel }}. Nomor permintaan:
                    <strong class="text-[#171717]">{{ requestId }}</strong>
                </p>
                <button type="button"
                    class="mt-6 h-11 cursor-pointer rounded-full border-0 bg-[#171717] px-6 transition-colors hover:bg-brand-red"
                    style="color: #fff; font-size: 13px; font-weight: 600" @click="reset">
                    Ajukan sewa lagi
                </button>
            </div>

            <!-- Form -->
            <form v-else @submit.prevent="submit">
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Ajukan sewa</p>
                <h2 id="form-sewa-title" class="m-0 mt-2 text-[clamp(22px,3vw,30px)] font-semibold tracking-[-0.03em]">
                    Pilih printer yang ingin disewa
                </h2>

                <fieldset :disabled="!isLoggedIn || submitting" class="m-0 min-w-0 border-0 p-0 disabled:opacity-60">
                    <!-- Langkah 1: printer -->
                    <div class="mt-6">
                        <p class="m-0 flex items-center gap-2 text-[13px] font-semibold">
                            <span class="grid h-5 w-5 place-items-center rounded-full bg-[#171717] text-[11px]"
                                style="color: #fff">1</span>
                            Seri printer
                        </p>

                        <div class="relative mt-3">
                            <svg class="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" aria-hidden="true">
                                <circle cx="11" cy="11" r="7" />
                                <path d="m20 20-3.5-3.5" />
                            </svg>
                            <input v-model="search" type="search" autocomplete="off" aria-label="Cari seri printer"
                                placeholder="Cari seri atau jenis printer"
                                class="h-12 w-full rounded-full border-0 bg-[#f7f7f5] pl-11 pr-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                        </div>

                        <div v-if="loading" class="mt-3 flex flex-wrap gap-2" role="status" aria-label="Memuat printer">
                            <span v-for="n in 4" :key="n"
                                class="h-9 w-32 animate-pulse rounded-full bg-gray-100"></span>
                        </div>

                        <div v-else-if="loadError" class="mt-3 rounded-2xl bg-red-50 p-4 text-[13px]"
                            style="color: #b91c1c" role="alert">
                            {{ loadError }}
                            <button type="button"
                                class="ml-1 cursor-pointer border-0 bg-transparent p-0 font-semibold underline"
                                style="color: #b91c1c" @click="emit('retry')">
                                Coba lagi
                            </button>
                        </div>

                        <div v-else class="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Pilih printer">
                            <button v-for="item in filtered" :key="item.id" type="button" role="radio"
                                :aria-checked="selectedId === item.id"
                                class="h-10 cursor-pointer rounded-full border-0 px-4 transition duration-200" :class="selectedId === item.id
                                    ? 'bg-brand-red shadow-md'
                                    : 'bg-white ring-1 ring-black/10 hover:ring-brand-red/40'"
                                :style="{ color: selectedId === item.id ? '#fff' : '#171717', fontSize: '13px', fontWeight: 600 }"
                                @click="select(item.id)">
                                {{ item.brand }} {{ item.name }}
                            </button>

                            <button type="button" role="radio" :aria-checked="selectedId === OTHER"
                                class="h-10 cursor-pointer rounded-full border border-dashed border-gray-300 px-4 transition duration-200"
                                :class="selectedId === OTHER ? 'bg-[#171717]' : 'bg-transparent hover:border-brand-red/50'"
                                :style="{ color: selectedId === OTHER ? '#fff' : '#374151', fontSize: '13px', fontWeight: 600 }"
                                @click="select(OTHER)">
                                Seri lain
                            </button>
                        </div>

                        <p v-if="!loading && !loadError && !filtered.length"
                            class="mb-0 mt-3 text-[13px] text-[#737373]">
                            Tidak ada yang cocok dengan “{{ search }}”. Pilih “Seri lain” untuk menulis sendiri.
                        </p>

                        <input v-if="selectedId === OTHER" v-model="customSeries" type="text" maxlength="80"
                            aria-label="Tulis seri printer" placeholder="Tulis seri printer yang dicari"
                            class="mt-3 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                    </div>

                    <!-- Langkah 2: keterangan -->
                    <label class="mt-6 block">
                        <span class="flex items-center gap-2 text-[13px] font-semibold">
                            <span class="grid h-5 w-5 place-items-center rounded-full bg-[#171717] text-[11px]"
                                style="color: #fff">2</span>
                            Keterangan
                            <span class="font-normal text-[#737373]">(opsional)</span>
                        </span>
                        <textarea v-model="note" rows="4" maxlength="500"
                            placeholder="Contoh: dipakai untuk apa, perkiraan jumlah cetak, dan lama sewa yang dibutuhkan"
                            class="mt-3 w-full resize-y rounded-xl border-0 bg-[#f7f7f5] p-4 text-sm leading-6 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red"></textarea>
                        <span class="mt-1 block text-right text-[11px] text-[#737373]">{{ note.length }}/500</span>
                    </label>

                    <!-- Langkah 3: foto -->
                    <div class="mt-4">
                        <p class="m-0 flex items-center gap-2 text-[13px] font-semibold">
                            <span class="grid h-5 w-5 place-items-center rounded-full bg-[#171717] text-[11px]"
                                style="color: #fff">3</span>
                            Foto pendukung
                            <span class="font-normal text-[#737373]">(opsional)</span>
                        </p>

                        <div v-if="preview" class="mt-3 flex items-center gap-4 rounded-2xl bg-[#f7f7f5] p-3">
                            <img :src="preview" alt="Pratinjau foto pendukung"
                                class="h-20 w-20 shrink-0 rounded-xl object-cover" />
                            <div class="min-w-0 flex-1">
                                <p class="m-0 truncate text-[13px] font-semibold">{{ photo.name }}</p>
                                <p class="m-0 mt-0.5 text-xs text-[#737373]">
                                    {{ (photo.size / 1024 / 1024).toFixed(2) }} MB
                                </p>
                            </div>
                            <button type="button"
                                class="h-9 shrink-0 cursor-pointer rounded-full border-0 bg-white px-4 ring-1 ring-black/10 transition-colors hover:ring-brand-red/40"
                                style="color: #374151; font-size: 12px; font-weight: 600" @click="clearPhoto">
                                Hapus
                            </button>
                        </div>

                        <label v-else
                            class="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#f7f7f5] px-4 py-7 text-center transition-colors hover:border-brand-red/50">
                            <svg class="h-7 w-7 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="3" y="4" width="18" height="16" rx="2" />
                                <circle cx="8.5" cy="9" r="1.5" />
                                <path d="m21 15-5-5L5 20" />
                            </svg>
                            <span class="mt-2 text-[13px] font-semibold">Pilih foto</span>
                            <span class="mt-0.5 text-xs text-[#737373]">JPG, PNG, atau WebP, maksimal {{ MAX_PHOTO_MB }}
                                MB</span>
                            <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only"
                                @change="onPhoto" />
                        </label>

                        <p v-if="photoError" role="alert" class="mb-0 mt-2 text-xs" style="color: #b91c1c">
                            {{ photoError }}
                        </p>
                    </div>
                </fieldset>

                <p v-if="error" role="alert" class="mb-0 mt-5 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                    style="color: #b91c1c">
                    {{ error }}
                </p>

                <button type="submit" :disabled="submitting"
                    class="mt-6 h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    style="color: #fff; font-size: 14px; font-weight: 600">
                    {{ submitting ? 'Mengirim...' : isLoggedIn ? 'Ajukan sewa' : 'Masuk untuk menyewa' }}
                </button>
            </form>
        </div>
    </section>
</template>