<script setup>
defineProps({
    show: { type: Boolean, default: false },
})
</script>

<template>
    <Transition enter-active-class="transition-opacity duration-150" enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200" leave-to-class="opacity-0">
        <div v-if="show" class="fixed inset-0 z-100 flex items-center justify-center bg-white/85 backdrop-blur-sm"
            role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" class="h-8 w-8 animate-spin text-brand-red motion-reduce:animate-none"
                aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-opacity=".2" stroke-width="3" />
                <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
            </svg>
            <span class="sr-only">Memuat</span>
        </div>
    </Transition>
</template>