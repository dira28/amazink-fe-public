<script setup>
defineProps({
    id: { type: String, default: '' },
    eyebrow: { type: String, default: '' },
    title: { type: String, required: true },
    accent: { type: String, default: '' },
    description: { type: String, default: '' },
    center: { type: Boolean, default: false },
    dark: { type: Boolean, default: false },
})
</script>

<template>
    <header :class="center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'">
        <p v-if="eyebrow"
            class="m-0 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-brand-red">
            <span class="block h-0.5 w-6 bg-brand-red" aria-hidden="true" />
            {{ eyebrow }}
            <span v-if="center" class="block h-0.5 w-6 bg-brand-red" aria-hidden="true" />
        </p>

        <h2 :id="id || undefined" :class="dark ? 'text-white' : 'text-[#14161b]'"
            class="mb-0 mt-3 text-[clamp(26px,3.6vw,40px)] font-bold leading-[1.1] tracking-[-0.045em]">
            {{ title }}
            <span v-if="accent" class="text-brand-red">{{ accent }}</span>
        </h2>

        <p v-if="description" class="mb-0 mt-3 text-sm leading-7" :class="dark ? 'text-white/60' : 'text-[#737373]'">{{
            description }}</p>
    </header>
</template>