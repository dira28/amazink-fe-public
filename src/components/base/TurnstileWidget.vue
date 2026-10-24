<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  siteKey: { type: String, required: true },
})

const emit = defineEmits(['verify', 'error'])

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

const container = ref(null)
let widgetId = null

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile)

    let script = document.getElementById(SCRIPT_ID)
    if (!script) {
      script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', () => resolve(window.turnstile))
    script.addEventListener('error', () => {
      script.remove()
      reject(new Error('Gagal memuat CAPTCHA. Periksa koneksi internet Anda.'))
    })
  })

onMounted(async () => {
  try {
    const turnstile = await loadScript()
    widgetId = turnstile.render(container.value, {
      sitekey: props.siteKey,
      size: 'flexible',
      theme: 'light',
      callback: (token) => emit('verify', token),
      'expired-callback': () => emit('verify', ''),
      'error-callback': () => emit('error', 'CAPTCHA gagal dimuat. Muat ulang halaman.'),
    })
  } catch (e) {
    emit('error', e.message)
  }
})

onBeforeUnmount(() => {
  if (widgetId !== null) window.turnstile?.remove(widgetId)
})

const reset = () => {
  emit('verify', '')
  if (widgetId !== null) window.turnstile?.reset(widgetId)
}

defineExpose({ reset })
</script>

<template>
  <div ref="container" class="min-h-16.25 w-full"></div>
</template>
