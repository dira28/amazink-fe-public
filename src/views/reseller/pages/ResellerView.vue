<script setup>
import ResellerHero from '../components/ResellerHero.vue'
import ResellerAbout from '../components/ResellerAbout.vue'
import ResellerOpportunity from '../components/ResellerOpportunity.vue'
import ResellerForm from '../components/ResellerForm.vue'
import ResellerPreview from '../components/ResellerPreview.vue'
import { usePageSeo } from '@/composables/useSeo'

usePageSeo('reseller', () => ({
    title: 'Program Reseller AMAZiNK',
    description: 'Gabung jadi reseller tinta dan toner AMAZiNK.',
    path: '/reseller',
}))
</script>

<template>
    <div class="bg-white text-[#171717] antialiased">
        <ResellerHero />
        <ResellerAbout />
        <ResellerOpportunity />
        <ResellerForm />
        <ResellerPreview />
    </div>
</template>