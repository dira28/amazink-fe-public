<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'
import { submitRental } from '../services/rentalService'

const MAX_PHOTO_MB = 5
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const props = defineProps({
    open: { type: Boolean, default: false },
    printers: { type: Array, default: () => [] },
    printer: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const { isLoggedIn } = useAuth()

const model = ref('')
const reason = ref('')
const photo = ref(null)
const preview = ref('')
const photoError = ref('')
const error = ref('')
const submitting = ref(false)
const requestId = ref('')

const labelOf = (p) => `${p.brand} ${p.name}`

const matched = computed(
    () => props.printers.find((p) => labelOf(p).toLowerCase() === model.value.trim().toLowerCase()) ?? null
)

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

function goLogin() {
    emit('close')
    router.push({ name: 'login', query: { redirect: route.fullPath } })
}

async function submit() {
    if (!isLoggedIn.value) return goLogin()

    error.value = ''

    if (model.value.trim().length < 2) {
        error.value = 'Isi model printer yang ingin disewa.'
        return
    }
    if (reason.value.trim().length < 10) {
        error.value = 'Tulis alasan pengajuan minimal 10 karakter.'
        return
    }

    submitting.value = true
    try {
        const result = await submitRental({
            printerId: matched.value?.id ?? null,
            printerLabel: model.value.trim(),
            note: reason.value.trim(),
            photo: photo.value,
        })
        requestId.value = result.id
    } catch (e) {
        error.value = e.message
    } finally {
        submitting.value = false
    }
}

function resetForm() {
    requestId.value = ''
    reason.value = ''
    error.value = ''
    photoError.value = ''
    clearPhoto()
    model.value = props.printer ? labelOf(props.printer) : ''
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
        if (open) resetForm()
    }
)

const onKeydown = (event) => {
    if (event.key === 'Escape' && props.open && !submitting.value) emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
    clearPhoto()
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="open"
                class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                role="dialog" aria-modal="true" aria-labelledby="form-sewa-title" @click.self="emit('close')">
                <div class="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
                    <!-- Berhasil -->
                    <div v-if="requestId" class="py-4 text-center" role="status">
                        <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-green-50">
                            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="m5 12 5 5L20 7" />
                            </svg>
                        </span>
                        <h2 id="form-sewa-title" class="m-0 mt-4 text-xl font-semibold tracking-[-0.02em]">
                            Pengajuan terkirim
                        </h2>
                        <p class="mx-auto mb-0 mt-2 max-w-sm text-sm leading-6 text-[#737373]">
                            Tim AMAZiNK akan menghubungimu untuk konfirmasi {{ model }}. Nomor pengajuan:
                            <strong class="text-[#171717]">{{ requestId }}</strong>
                        </p>
                        <button type="button"
                            class="mt-6 h-11 cursor-pointer rounded-full border-0 bg-[#171717] px-6 transition-colors hover:bg-brand-red"
                            style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('close')">
                            Selesai
                        </button>
                    </div>

                    <!-- Form -->
                    <form v-else @submit.prevent="submit">
                        <div class="flex items-center justify-between gap-4">
                            <h2 id="form-sewa-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Form pengajuan
                            </h2>
                            <button type="button" aria-label="Tutup"
                                class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-[#f7f7f5] text-[#171717] transition-colors hover:bg-gray-200"
                                @click="emit('close')">
                                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="1.8" stroke-linecap="round" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6L6 18" />
                                </svg>
                            </button>
                        </div>

                        <p v-if="!isLoggedIn" class="mb-0 mt-3 rounded-xl bg-amber-50 px-4 py-3 text-[13px]"
                            style="color: #92400e">
                            Kamu perlu masuk ke akun sebelum mengirim pengajuan.
                        </p>

                        <fieldset :disabled="!isLoggedIn || submitting"
                            class="m-0 min-w-0 border-0 p-0 disabled:opacity-60">
                            <label class="mt-5 block">
                                <span class="text-[13px] font-semibold">Model printer</span>
                                <input v-model="model" type="text" list="rental-model-list" maxlength="80"
                                    autocomplete="off" placeholder="Pilih dari daftar atau tulis sendiri"
                                    class="mt-2 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                                <datalist id="rental-model-list">
                                    <option v-for="item in printers" :key="item.id" :value="labelOf(item)" />
                                </datalist>
                            </label>

                            <label class="mt-4 block">
                                <span class="text-[13px] font-semibold">Alasan pengajuan</span>
                                <textarea v-model="reason" rows="4" maxlength="500"
                                    placeholder="Contoh: dipakai untuk apa, perkiraan jumlah cetak, dan lama sewa yang dibutuhkan"
                                    class="mt-2 w-full resize-y rounded-xl border-0 bg-[#f7f7f5] p-4 text-sm leading-6 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red"></textarea>
                                <span class="block text-right text-[11px] text-[#737373]">{{ reason.length }}/500</span>
                            </label>

                            <div class="mt-3">
                                <p class="m-0 text-[13px] font-semibold">
                                    Lampirkan foto
                                    <span class="font-normal text-[#737373]">(opsional)</span>
                                </p>

                                <div v-if="preview" class="mt-2 flex items-center gap-4 rounded-2xl bg-[#f7f7f5] p-3">
                                    <img :src="preview" alt="Pratinjau foto"
                                        class="h-16 w-16 shrink-0 rounded-xl object-cover" />
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
                                    class="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-[#f7f7f5] px-4 py-6 text-center transition-colors hover:border-brand-red/50">
                                    <span class="text-[13px] font-semibold">Pilih foto</span>
                                    <span class="mt-0.5 text-xs text-[#737373]">
                                        JPG, PNG, atau WebP, maksimal {{ MAX_PHOTO_MB }} MB
                                    </span>
                                    <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only"
                                        @change="onPhoto" />
                                </label>

                                <p v-if="photoError" role="alert" class="mb-0 mt-2 text-xs" style="color: #b91c1c">
                                    {{ photoError }}
                                </p>
                            </div>
                        </fieldset>

                        <p v-if="error" role="alert" class="mb-0 mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                            style="color: #b91c1c">
                            {{ error }}
                        </p>

                        <button type="submit" :disabled="submitting"
                            class="mt-5 h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            style="color: #fff; font-size: 14px; font-weight: 600">
                            {{ submitting ? 'Mengirim...' : isLoggedIn ? 'Ajukan sewa' : 'Masuk untuk menyewa' }}
                        </button>
                    </form>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>