<script setup>
defineProps({
    item: { type: Object, required: true },
    open: { type: Boolean, default: false },
})

defineEmits(['toggle'])
</script>

<template>
    <div class="border-b border-black/10 last:border-b-0">
        <h3 class="m-0">
            <button type="button" :id="`faq-q-${item.id}`" :aria-expanded="open" :aria-controls="`faq-a-${item.id}`"
                class="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-5 py-5 text-left transition-colors hover:bg-black/[0.02] sm:px-7"
                @click="$emit('toggle')">
                <span class="text-[15px] font-semibold leading-6 tracking-[-0.01em]"
                    :class="open ? 'text-brand-red' : ''" :style="open ? undefined : { color: '#171717' }">
                    {{ item.question }}
                </span>

                <span class="grid h-8 w-8 shrink-0 place-items-center rounded-full transition-colors duration-300"
                    :class="open ? 'bg-brand-red' : 'bg-[#f4f3ee]'" :style="{ color: open ? '#ffffff' : '#171717' }"
                    aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        class="h-4 w-4 transition-transform duration-300" :class="open ? 'rotate-45' : ''">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                </span>
            </button>
        </h3>

        <div :id="`faq-a-${item.id}`" role="region" :aria-labelledby="`faq-q-${item.id}`"
            class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
            :class="open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden">
                <p class="m-0 whitespace-pre-line px-5 pb-6 pr-14 text-[14px] leading-7 sm:px-7 sm:pr-16"
                    style="color: #5b5b5b">
                    {{ item.answer }}
                </p>
            </div>
        </div>
    </div>
</template>