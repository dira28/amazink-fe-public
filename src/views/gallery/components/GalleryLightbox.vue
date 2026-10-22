<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { formatMonth } from '../data/gallery'
import GalleryImage from './GalleryImage.vue'

const props = defineProps({
    items: { type: Array, required: true },
    activeId: { type: String, default: null },
})

const emit = defineEmits(['close', 'change'])

const index = computed(() => props.items.findIndex((item) => item.id === props.activeId))
const item = computed(() => props.items[index.value])
const isOpen = computed(() => index.value !== -1)

function move(step) {
    const total = props.items.length
    emit('change', props.items[(index.value + step + total) % total].id)
}

function onKeydown(event) {
    if (!isOpen.value) return
    if (event.key === 'Escape') emit('close')
    if (event.key === 'ArrowLeft') move(-1)
    if (event.key === 'ArrowRight') move(1)
}

watch(isOpen, (open) => {
    document.body.style.overflow = open ? 'hidden' : ''
})

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
            <div v-if="isOpen"
                class="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-8"
                role="dialog" aria-modal="true" :aria-label="item.title" @click.self="emit('close')">
                <button type="button" aria-label="Tutup"
                    class="absolute right-4 top-4 grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
                    @click="emit('close')">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        class="h-5 w-5" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                <button type="button" aria-label="Sebelumnya"
                    class="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
                    @click="move(-1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>

                <button type="button" aria-label="Berikutnya"
                    class="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
                    @click="move(1)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                        stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>

                <figure class="m-0 flex max-h-full w-full max-w-4xl flex-col items-center gap-5"
                    @click.self="emit('close')">
                    <GalleryImage :key="item.id" :item="item"
                        class="max-h-[66vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" />

                    <figcaption class="w-full max-w-xl text-center" style="color: #fff">
                        <span
                            class="inline-flex rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]"
                            style="color: #171717">
                            {{ item.categoryLabel }}
                        </span>
                        <span class="mt-3 block text-xl font-semibold tracking-[-0.03em]">{{ item.title }}</span>
                        <span class="mt-2 block text-[14px] leading-6" style="color: rgba(255, 255, 255, 0.75)">
                            {{ item.description }}
                        </span>
                        <span class="mt-3 block text-[12px]" style="color: rgba(255, 255, 255, 0.55)">
                            {{ formatMonth(item.date) }} • {{ index + 1 }} / {{ items.length }}
                        </span>
                    </figcaption>
                </figure>
            </div>
        </Transition>
    </Teleport>
</template>