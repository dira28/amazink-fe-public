<script setup>
import { computed } from 'vue'

const props = defineProps({
    variant: { type: String, default: 'primary' },
    to: { type: [String, Object], default: null },
})

const classes = computed(() => [
    'inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition',
    props.variant === 'primary'
        ? 'bg-brand-red text-white hover:opacity-90'
        : 'border border-white/30 text-white hover:border-white hover:bg-white/10',
])
</script>

<template>
    <RouterLink v-if="to" :to="to" :class="classes">
        <slot />
    </RouterLink>
    <button v-else type="button" :class="classes">
        <slot />
    </button>
</template>