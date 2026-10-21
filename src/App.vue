<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import PageLoader from '@/components/layout/PageLoader.vue'
import { usePageLoading } from '@/composables/usePageLoading'

const { loading } = usePageLoading()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-black text-white">
    <PageLoader :show="loading" />
    <TheHeader />
    <main class="flex-1">
      <RouterView />
    </main>
    <TheFooter />
  </div>
</template>