<script setup>
import { useRouteProgress } from '@/composables/useRouteProgress'

const { state } = useRouteProgress()
</script>

<template>
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[110] h-0.5" aria-hidden="true">
        <div class="h-full bg-brand-red shadow-[0_0_8px_rgba(225,29,46,0.6)] transition-[width,opacity] duration-200 ease-out motion-reduce:transition-none"
            :style="{ width: `${state.width}%`, opacity: state.visible ? 1 : 0 }"></div>
    </div>
</template>
