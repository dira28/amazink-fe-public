<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
    open: { type: Boolean, default: false },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    confirmLabel: { type: String, default: 'Ya' },
    cancelLabel: { type: String, default: 'Batal' },
    danger: { type: Boolean, default: false },
})

const emit = defineEmits(['confirm', 'cancel'])

const dialogRef = ref(null)

function onKeydown(event) {
    if (event.key === 'Escape') emit('cancel')
}

watch(
    () => props.open,
    (open) => {
        document.body.style.overflow = open ? 'hidden' : ''

        if (open) {
            window.addEventListener('keydown', onKeydown)
            nextTick(() => dialogRef.value?.focus())
        } else {
            window.removeEventListener('keydown', onKeydown)
        }
    }
)

onBeforeUnmount(() => {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
    <Teleport to="body">
        <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0"
            leave-active-class="transition duration-150 ease-in" leave-to-class="opacity-0">
            <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
                @click.self="emit('cancel')">
                <div ref="dialogRef" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title"
                    :aria-describedby="description ? 'confirm-desc' : undefined" tabindex="-1"
                    class="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl outline-none">
                    <span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                        :class="danger ? 'bg-red-50 text-brand-red' : 'bg-gray-100 text-gray-700'">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                            stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                            <path d="M12 9v4m0 4h.01" />
                            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
                        </svg>
                    </span>

                    <h2 id="confirm-title" class="mt-5 text-lg font-semibold text-gray-950">{{ title }}</h2>

                    <p v-if="description" id="confirm-desc" class="mt-2 text-sm leading-6 text-gray-500">
                        {{ description }}
                    </p>

                    <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row">
                        <button type="button"
                            class="flex-1 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-500"
                            @click="emit('cancel')">
                            {{ cancelLabel }}
                        </button>

                        <button type="button"
                            class="flex-1 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
                            :class="danger ? 'bg-brand-red' : 'bg-[#171717]'" @click="emit('confirm')">
                            {{ confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>