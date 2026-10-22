<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { USE_MOCK } from '@/services/http'
import { fetchGallery } from '@/services/galleryService'

const categories = ref([])
const loading = ref(!USE_MOCK)
const failed = ref(false)
const active = ref('all')
const openIndex = ref(-1)

onMounted(async () => {
    if (USE_MOCK) return

    try {
        categories.value = await fetchGallery()
    } catch {
        failed.value = true
    } finally {
        loading.value = false
    }
})

const photos = computed(() =>
    categories.value
        .filter((category) => active.value === 'all' || String(category.id) === active.value)
        .flatMap((category) => category.items.map((item) => ({ ...item, category: category.name }))),
)

const current = computed(() => photos.value[openIndex.value])

const close = () => {
    openIndex.value = -1
}

const move = (step) => {
    if (!photos.value.length) return
    openIndex.value = (openIndex.value + step + photos.value.length) % photos.value.length
}

const onKey = (event) => {
    if (openIndex.value < 0) return
    if (event.key === 'Escape') close()
    if (event.key === 'ArrowRight') move(1)
    if (event.key === 'ArrowLeft') move(-1)
}

watch(active, close)
watch(openIndex, (value) => {
    document.body.style.overflow = value >= 0 ? 'hidden' : ''
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
})
</script>

<template>
    <div class="min-h-screen bg-[#f7f7f5] text-[#171717] antialiased">
        <div class="mx-auto max-w-7xl px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
            <header>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">Galeri AMAZiNK</p>
                <h1 class="mt-2.5 text-[clamp(32px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Galeri
                </h1>
                <p class="mt-3 max-w-lg text-sm leading-[1.8] text-[#737373]">
                    Dokumentasi produk, kegiatan, dan momen bersama AMAZiNK.
                </p>
            </header>

            <div v-if="categories.length" class="mt-8 flex max-w-full gap-2 overflow-x-auto pb-1">
                <button type="button" :aria-pressed="active === 'all'"
                    class="shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
                    :class="active === 'all' ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#d6d3d1] bg-white text-[#292524] hover:border-[#171717]'"
                    @click="active = 'all'">
                    Semua
                </button>

                <button v-for="category in categories" :key="category.id" type="button"
                    :aria-pressed="active === String(category.id)"
                    class="shrink-0 cursor-pointer rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors"
                    :class="active === String(category.id) ? 'border-[#171717] bg-[#171717] text-white' : 'border-[#d6d3d1] bg-white text-[#292524] hover:border-[#171717]'"
                    @click="active = String(category.id)">
                    {{ category.name }}
                </button>
            </div>

            <div v-if="photos.length" class="mt-6 columns-2 gap-3 sm:columns-3 sm:gap-4 lg:columns-4">
                <button v-for="(photo, index) in photos" :key="photo.id" type="button"
                    class="group relative mb-3 block w-full cursor-zoom-in overflow-hidden rounded-2xl border-0 bg-[#ebeae5] p-0 sm:mb-4"
                    :aria-label="`Perbesar foto ${photo.category}`" @click="openIndex = index">
                    <img :src="photo.image" :alt="photo.category" loading="lazy"
                        class="block h-auto w-full transition-transform duration-500 group-hover:scale-105" />
                    <span
                        class="absolute bottom-2 left-2 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                        {{ photo.category }}
                    </span>
                </button>
            </div>

            <div v-else
                class="mt-8 rounded-3xl bg-white px-5 py-14 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5">
                <p class="m-0 text-sm font-semibold">
                    {{ loading ? 'Memuat galeri...' : failed ? 'Galeri gagal dimuat' : 'Belum ada foto' }}
                </p>
                <p v-if="failed" class="mt-1 text-[13px] text-[#737373]">Periksa koneksi lalu muat ulang halaman.</p>
            </div>
        </div>

        <!-- Pratinjau foto -->
        <Teleport to="body">
            <div v-if="current" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
                role="dialog" aria-modal="true" aria-label="Pratinjau foto" @click.self="close">
                <button type="button" aria-label="Tutup"
                    class="absolute right-4 top-4 grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-2xl text-white transition-colors hover:bg-white/20"
                    @click="close">
                    ×
                </button>

                <button v-if="photos.length > 1" type="button" aria-label="Foto sebelumnya"
                    class="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-xl text-white transition-colors hover:bg-white/20 sm:left-6"
                    @click="move(-1)">
                    ←
                </button>

                <figure class="m-0 flex max-h-full max-w-5xl flex-col items-center">
                    <img :src="current.image" :alt="current.category"
                        class="max-h-[80vh] w-auto max-w-full rounded-xl object-contain" />
                    <figcaption class="mt-3 text-[13px] text-white/80">
                        {{ current.category }} · {{ openIndex + 1 }} / {{ photos.length }}
                    </figcaption>
                </figure>

                <button v-if="photos.length > 1" type="button" aria-label="Foto berikutnya"
                    class="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border-0 bg-white/10 text-xl text-white transition-colors hover:bg-white/20 sm:right-6"
                    @click="move(1)">
                    →
                </button>
            </div>
        </Teleport>
    </div>
</template>
