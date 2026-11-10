<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
    open: { type: Boolean, default: false },
    printer: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const DURATIONS = ['1 bulan', '3 bulan', '6 bulan', '12 bulan']
const OTHER = 'Lainnya'

const reason = ref('')
const choice = ref(DURATIONS[2])
const custom = ref('')
const error = ref('')

const duration = computed(() => (choice.value === OTHER ? custom.value.trim() : choice.value))

function submit() {
    error.value = ''

    if (reason.value.trim().length < 10) {
        error.value = 'Tulis alasan pengajuan minimal 10 karakter.'
        return
    }
    if (!duration.value) {
        error.value = 'Isi lama sewa yang dibutuhkan.'
        return
    }

    emit('submit', { reason: reason.value.trim(), duration: duration.value })
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
        if (!open) return

        reason.value = ''
        choice.value = DURATIONS[2]
        custom.value = ''
        error.value = ''
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
                role="dialog" aria-modal="true" aria-labelledby="request-title" @click.self="emit('close')">
                <form class="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-7" @submit.prevent="submit">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="request-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Ajukan sewa
                            </h2>
                            <p class="mb-0 mt-1 text-[13px] text-[#737373]">
                                {{ [printer.brand, printer.name].filter(Boolean).join(' ') }}
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

                    <label class="mt-5 block">
                        <span class="text-[13px] font-semibold">Alasan pengajuan</span>
                        <textarea v-model="reason" rows="4" maxlength="500"
                            placeholder="Contoh: dipakai untuk apa dan perkiraan jumlah cetak per bulan"
                            class="mt-2 w-full resize-y rounded-xl border-0 bg-[#f7f7f5] p-4 text-sm leading-6 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red"></textarea>
                        <span class="block text-right text-[11px] text-[#737373]">{{ reason.length }}/500</span>
                    </label>

                    <fieldset class="m-0 mt-3 min-w-0 border-0 p-0">
                        <legend class="p-0 text-[13px] font-semibold">Lama sewa</legend>

                        <div class="mt-2 flex flex-wrap gap-2">
                            <button v-for="item in [...DURATIONS, OTHER]" :key="item" type="button"
                                :aria-pressed="choice === item"
                                class="h-10 cursor-pointer rounded-full border-0 px-4 text-[13px] font-semibold transition-colors"
                                :class="choice === item
                                    ? 'bg-[#171717] text-white'
                                    : 'bg-[#f7f7f5] text-[#171717] ring-1 ring-black/10 hover:ring-brand-red/50'"
                                @click="choice = item">
                                {{ item }}
                            </button>
                        </div>

                        <input v-if="choice === OTHER" v-model="custom" type="text" maxlength="40"
                            placeholder="Contoh: 2 tahun, atau selama proyek"
                            class="mt-3 h-12 w-full rounded-xl border-0 bg-[#f7f7f5] px-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red" />
                    </fieldset>

                    <p v-if="error" role="alert" class="mb-0 mt-4 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit"
                        class="mt-5 h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        Lanjut ke WhatsApp
                    </button>
                    <p class="mb-0 mt-3 text-center text-xs text-[#737373]">
                        Anda akan diarahkan ke WhatsApp untuk mengirim pengajuan ke tim kami.
                    </p>
                </form>
            </div>
        </Transition>
    </Teleport>
</template>
