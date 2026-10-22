import { readonly, ref } from 'vue'

const loading = ref(false)
const message = ref('Memuat...')

export function usePageLoading() {
    return {
        loading: readonly(loading),
        message: readonly(message),
        start: (text = 'Memuat...') => {
            message.value = text
            loading.value = true
        },
        stop: () => {
            loading.value = false
        },
    }
}