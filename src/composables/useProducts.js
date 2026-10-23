import { ref } from 'vue'
import { shopProducts } from '@/data/products'

const products = ref([...shopProducts])

export function useProducts() {
    async function refreshProducts() {
        // TODO: replace with the real API call
        products.value = [...shopProducts]
    }

    return { products, refreshProducts }
}