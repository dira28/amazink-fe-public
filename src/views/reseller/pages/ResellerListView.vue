<script setup>
import { RouterLink } from 'vue-router'
import ResellerDirectory from '../components/ResellerDirectory.vue'
import { useSeo } from '@/composables/useSeo'

useSeo(() => ({
    title: 'Daftar Reseller Resmi',
    description: 'Temukan reseller resmi AMAZiNK di kotamu.',
    path: '/reseller/daftar',
}))
</script>

<template>
    <div class="bg-[#f7f7f5] text-[#171717] antialiased">
        <div class="mx-auto max-w-7xl px-5 pt-8 sm:px-8 sm:pt-10">
            <RouterLink to="/reseller"
                class="text-sm font-medium text-gray-500 no-underline transition-colors hover:text-brand-red">
                ← Kembali ke Reseller
            </RouterLink>
        </div>

        <ResellerDirectory />
    </div>
</template>