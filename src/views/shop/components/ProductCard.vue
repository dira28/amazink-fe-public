<script setup>
import { onBeforeUnmount, ref } from 'vue'
import AddToCartDialog from './AddToCartDialog.vue'

defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const dialogOpen = ref(false)
const justAdded = ref(false)

let resetTimer

function onAdded() {
    justAdded.value = true

    clearTimeout(resetTimer)
    resetTimer = setTimeout(() => {
        justAdded.value = false
    }, 1800)
}

onBeforeUnmount(() => clearTimeout(resetTimer))
</script>

<template>
    <article
        class="group flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <RouterLink :to="`/produk/${product.slug}`"
            class="product-card-media relative block overflow-hidden bg-[#F7F7F5]"
            :aria-label="`Lihat ${product.name}`">
            <div class="aspect-[4/3] overflow-hidden">
                <img v-if="product.image" :src="product.image" :alt="product.name" loading="lazy"
                    class="h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-105" />

                <div v-else class="flex h-full items-center justify-center text-xs text-gray-400">
                    Gambar belum tersedia
                </div>
            </div>

            <span v-if="product.badge"
                class="absolute left-3 top-3 rounded-full bg-brand-red px-3 py-1 text-[10px] font-semibold text-white">
                {{ product.badge }}
            </span>

            <span v-if="product.stock === 0" class="absolute inset-0 flex items-center justify-center bg-white/60">
                <span class="rounded-full bg-gray-900 px-3 py-2 text-xs font-semibold text-white">
                    Stok habis
                </span>
            </span>
        </RouterLink>

        <div class="flex flex-1 flex-col p-4">
            <p class="text-[10px] font-semibold uppercase tracking-widest text-brand-red">
                {{ product.category }}
            </p>

            <RouterLink :to="`/produk/${product.slug}`"
                class="mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-5 text-gray-950 transition-colors hover:text-brand-red">
                {{ product.name }}
            </RouterLink>

            <p class="product-card-price mt-3 text-sm font-bold text-gray-950">
                {{ product.priceLabel }}
            </p>

            <div class="mt-auto flex items-center gap-2 pt-3.5">
                <RouterLink :to="`/produk/${product.slug}`"
                    class="inline-flex h-10 min-w-0 flex-1 items-center justify-center gap-[7px] rounded-lg border border-gray-950 bg-gray-950 text-[11px] font-semibold text-white no-underline transition-colors duration-200 hover:border-brand-red hover:bg-brand-red">
                    Lihat detail
                    <svg class="h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
                        aria-hidden="true">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                    </svg>
                </RouterLink>

                <button type="button" :disabled="product.stock === 0"
                    :aria-label="`Tambah ${product.name} ke keranjang`"
                    :title="product.stock === 0 ? 'Stok habis' : 'Tambah ke keranjang'"
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                    :class="justAdded
                        ? 'border-brand-red bg-brand-red text-white'
                        : 'border-gray-300 text-gray-700 hover:border-brand-red hover:text-brand-red disabled:hover:border-gray-300 disabled:hover:text-gray-700'"
                    @click="dialogOpen = true">
                    <svg v-if="justAdded" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                        stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]" aria-hidden="true">
                        <path d="m5 12 4 4L19 6" />
                    </svg>

                    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"
                        stroke-linecap="round" stroke-linejoin="round" class="h-[18px] w-[18px]" aria-hidden="true">
                        <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H6.2" />
                        <circle cx="9.5" cy="20" r="1.2" />
                        <circle cx="17" cy="20" r="1.2" />
                    </svg>
                </button>
            </div>
        </div>

        <AddToCartDialog v-if="dialogOpen" :product="product" @close="dialogOpen = false" @added="onAdded" />
    </article>
</template>