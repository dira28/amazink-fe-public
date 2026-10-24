<script setup>
import { ref } from 'vue'

defineProps({
    id: { type: String, default: undefined },
    modelValue: { type: String, default: '' },
    modelValue: { type: String, default: '' },
    autocomplete: { type: String, default: 'off' },
    placeholder: { type: String, default: '' },
    invalid: { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])

const visible = ref(false)
</script>

<template>
    <span class="relative mt-1.5 block">
        <input :id="id" :value="modelValue" :type="visible ? 'text' : 'password'" required :autocomplete="autocomplete"
            :placeholder="placeholder" :aria-invalid="invalid || undefined"
            class="h-12 w-full rounded-xl border-0 bg-[#f7f7f5] pl-4 pr-12 text-sm outline-none ring-1 focus:ring-2"
            :class="invalid ? 'ring-red-400 focus:ring-red-500' : 'ring-black/10 focus:ring-brand-red'"
            @input="$emit('update:modelValue', $event.target.value)" />

        <button type="button" :aria-label="visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
            :aria-pressed="visible"
            class="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-transparent transition-colors hover:bg-gray-200/70"
            :style="{ color: visible ? '#171717' : '#6b7280' }" @click="visible = !visible">
            <!-- Mata terbuka: password sedang tersembunyi -->
            <svg v-if="!visible" class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
            </svg>

            <!-- Mata dicoret: password sedang terlihat -->
            <svg v-else class="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M9.9 5.2A9.8 9.8 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1" />
                <path d="M6.6 6.6A17 17 0 0 0 2 12s3.6 7 10 7a9.7 9.7 0 0 0 4.4-1" />
                <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                <path d="m3 3 18 18" />
            </svg>
        </button>
    </span>
</template>