<script setup>
import { computed } from 'vue'

const props = defineProps({
    modelValue: { type: Number, required: true },
    totalPages: { type: Number, required: true },
    dark: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])

const items = computed(() => {
    const total = props.totalPages
    const current = props.modelValue

    if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

    const list = [1]
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    if (start > 2) list.push('...')
    for (let i = start; i <= end; i++) list.push(i)
    if (end < total - 1) list.push('...')
    list.push(total)

    return list
})

const go = (next) => emit('update:modelValue', Math.min(Math.max(next, 1), props.totalPages))
</script>

<template>
    <nav class="flex items-center gap-1.5" aria-label="Halaman">
        <button type="button" :disabled="modelValue === 1" aria-label="Halaman sebelumnya"
            class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-colors hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-700"
            @click="go(modelValue - 1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
            </svg>
        </button>

        <template v-for="(item, index) in items" :key="`${item}-${index}`">
            <span v-if="item === '...'" class="px-1 text-xs text-[#a3a3a3]">…</span>
            <button v-else type="button" :aria-current="item === modelValue ? 'page' : undefined"
                class="grid h-10 min-w-10 cursor-pointer place-items-center rounded-full border-0 px-2 transition-colors"
                :class="item === modelValue
                    ? (dark ? 'bg-[#171717]' : 'bg-brand-red')
                    : 'bg-transparent hover:bg-white'" :style="{
                        color: item === modelValue ? '#ffffff' : '#374151',
                        fontSize: '12px',
                        fontWeight: 600,
                        lineHeight: 1,
                    }" @click="go(item)">
                {{ item }}
            </button>
        </template>

        <button type="button" :disabled="modelValue === totalPages" aria-label="Halaman berikutnya"
            class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-colors hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-700"
            @click="go(modelValue + 1)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
            </svg>
        </button>
    </nav>
</template>