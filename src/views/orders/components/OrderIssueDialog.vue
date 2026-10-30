<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
    open: { type: Boolean, default: false },
    orderId: { type: String, default: '' },
})

const emit = defineEmits(['close', 'submit'])

const issue = ref('')
const error = ref('')

function submit() {
    error.value = ''

    if (issue.value.trim().length < 10) {
        error.value = 'Tulis kendala Anda minimal 10 karakter.'
        return
    }

    emit('submit', issue.value.trim())
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''
        if (!open) return

        issue.value = ''
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
            <div v-if="open"
                class="fixed inset-0 z-[60] grid place-items-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
                role="dialog" aria-modal="true" aria-labelledby="issue-title" @click.self="emit('close')">
                <form class="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl sm:p-7" @submit.prevent="submit">
                    <div class="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="issue-title" class="m-0 text-xl font-semibold tracking-[-0.02em]">
                                Laporkan kendala
                            </h2>
                            <p class="mb-0 mt-1 text-[13px] text-[#737373]">Pesanan {{ orderId }}</p>
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
                        <span class="text-[13px] font-semibold">Kendala yang dialami</span>
                        <textarea v-model="issue" rows="5" maxlength="500"
                            placeholder="Contoh: barang yang datang tidak sesuai pesanan, atau kemasan rusak saat diterima"
                            class="mt-2 w-full resize-y rounded-xl border-0 bg-[#f7f7f5] p-4 text-sm leading-6 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-brand-red"></textarea>
                        <span class="block text-right text-[11px] text-[#737373]">{{ issue.length }}/500</span>
                    </label>

                    <p v-if="error" role="alert" class="mb-0 mt-3 rounded-xl bg-red-50 px-4 py-3 text-[13px]"
                        style="color: #b91c1c">
                        {{ error }}
                    </p>

                    <button type="submit"
                        class="mt-5 h-12 w-full cursor-pointer rounded-full border-0 bg-brand-red transition-opacity hover:opacity-90"
                        style="color: #fff; font-size: 14px; font-weight: 600">
                        Lanjut ke WhatsApp
                    </button>
                    <p class="mb-0 mt-3 text-center text-xs text-[#737373]">
                        Anda akan diarahkan ke WhatsApp untuk mengirim laporan ke tim kami.
                    </p>
                </form>
            </div>
        </Transition>
    </Teleport>
</template>
