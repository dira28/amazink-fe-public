<script setup>
defineProps({
    label: { type: String, required: true },
    glass: { type: Boolean, default: false },
})
</script>

<template>
    <span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
        :class="glass ? 'bg-white/90 text-[#171717] backdrop-blur' : 'bg-[#f4eee8] text-[#171717]'">
        <span class="h-2 w-2 rounded-full bg-brand-red"></span>
        {{ label }}
    </span>
</template>