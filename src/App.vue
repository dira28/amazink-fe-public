<script setup>
import TheHeader from '@/components/layout/TheHeader.vue'
import TheFooter from '@/components/layout/TheFooter.vue'
import PageLoader from '@/components/layout/PageLoader.vue'
import { usePageLoading } from '@/composables/usePageLoading'
import WhatsAppFloat from '@/components/WhatsAppFloat.vue'


const { loading } = usePageLoading()
</script>

<template>
  <div class="flex min-h-screen flex-col bg-brand-black text-white">
    <PageLoader :show="loading" />
    <TheHeader />
    <main class="flex-1">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
      <WhatsAppFloat />
    </main>
    <TheFooter />
  </div>
</template>