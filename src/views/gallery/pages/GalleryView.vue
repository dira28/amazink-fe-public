<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import GalleryCard from '../components/GalleryCard.vue'
import GalleryLightbox from '../components/GalleryLightbox.vue'
import { USE_MOCK } from '@/services/http'
import { fetchGallery } from '@/services/galleryService'
import { galleryCategories, galleryItems } from '../data/gallery'
import { useProducts } from '@/composables/useProducts'
import { usePolling } from '@/composables/usePolling'
import { waLink } from '@/utils/whatsapp'

const { products, refreshProducts } = useProducts()
usePolling(refreshProducts, 30000)

const AUTOPLAY_MS = 4000
const MAX_ITEMS = 15
const SHAPES = ['portrait', 'landscape', 'square']

const contactLink = waLink('Halo AMAZiNK, saya tertarik dengan hasil cetak di galeri dan ingin konsultasi kebutuhan cetak.')

const allItems = ref(USE_MOCK ? galleryItems : [])
const loading = ref(!USE_MOCK)
const failed = ref(false)

// Newest first, so the cap keeps the latest works
const sortedItems = computed(() =>
    [...allItems.value].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
)

const category = ref('all')

const items = computed(() =>
    (category.value === 'all'
        ? sortedItems.value
        : sortedItems.value.filter((item) => item.category === category.value)
    ).slice(0, MAX_ITEMS)
)

const total = computed(() => items.value.length)

const tabs = computed(() => [
    { id: 'all', label: 'Semua', count: Math.min(sortedItems.value.length, MAX_ITEMS) },
    ...galleryCategories
        .map((item) => ({
            ...item,
            count: Math.min(sortedItems.value.filter((work) => work.category === item.id).length, MAX_ITEMS),
        }))
        .filter((tab) => tab.count > 0),
])

const startIndex = (count) => Math.max(0, Math.min(2, Math.floor((count - 1) / 2)))

const active = ref(startIndex(items.value.length))
const openId = ref(null)

const viewport = ref(null)
const track = ref(null)
const slides = []
const offset = ref(0)
const ready = ref(false)

const hovering = ref(false)
const dragging = ref(false)
const dragX = ref(0)

let timer
let observer
let pressed = false
let moved = false
let startX = 0

const counter = computed(() =>
    total.value
        ? `${String(active.value + 1).padStart(2, '0')} / ${String(total.value).padStart(2, '0')}`
        : ''
)

const emptyMessage = computed(() =>
    loading.value ? 'Memuat galeri...' : failed.value ? 'Galeri gagal dimuat' : 'Belum ada foto'
)

function fromApi(categories) {
    return categories
        .flatMap((category) =>
            category.items.map((photo) => ({
                id: String(photo.id),
                title: category.name,
                categoryLabel: category.name,
                description: '',
                image: photo.image,
                placeholder: '',
                date: null,
            }))
        )
        .map((item, index) => ({ ...item, shape: SHAPES[index % SHAPES.length] }))
}

async function loadPhotos() {
    if (USE_MOCK) return

    try {
        items.value = fromApi(await fetchGallery())
        active.value = Math.max(0, Math.min(2, items.value.length - 1))
        await nextTick()
        measure()
    } catch {
        failed.value = true
    } finally {
        loading.value = false
    }
}

function measure() {
    const el = slides[active.value]
    if (!viewport.value || !el) return
    offset.value = viewport.value.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2)
}

function stopAuto() {
    clearInterval(timer)
}

function startAuto() {
    stopAuto()
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    timer = setInterval(() => {
        if (hovering.value || dragging.value || openId.value || document.hidden) return
        go(active.value + 1)
    }, AUTOPLAY_MS)
}

function go(index, { wrap = true } = {}) {
    if (!total.value) return

    active.value = wrap
        ? (index + total.value) % total.value
        : Math.min(Math.max(index, 0), total.value - 1)
    startAuto()
}

const next = () => go(active.value + 1)
const prev = () => go(active.value - 1)

async function selectCategory(id) {
    if (id === category.value) return

    ready.value = false
    openId.value = null
    dragX.value = 0
    category.value = id
    active.value = startIndex(total.value)

    await nextTick()
    measure()
    await nextTick()
    requestAnimationFrame(() => {
        ready.value = true
    })

    startAuto()
}

function onSelect(index) {
    if (moved) return

    if (index === active.value) openId.value = items.value[index].id
    else go(index, { wrap: false })
}

// Hover hanya dihitung untuk mouse, supaya sentuhan di HP tidak menghentikan autoplay
function onPointerEnter(event) {
    if (event.pointerType === 'mouse') hovering.value = true
}

function onPointerLeave(event) {
    if (event.pointerType === 'mouse') hovering.value = false
}

// Fokus hanya menghentikan autoplay kalau lewat keyboard
function onFocusIn(event) {
    if (event.target.matches?.(':focus-visible')) hovering.value = true
}

function onPointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    pressed = true
    moved = false
    startX = event.clientX
}

function onPointerMove(event) {
    if (!pressed) return

    if (event.pointerType === 'mouse' && event.buttons === 0) {
        pressed = false
        return
    }

    const dx = event.clientX - startX

    if (!moved && Math.abs(dx) > 6) {
        moved = true
        dragging.value = true
        viewport.value.setPointerCapture(event.pointerId)
    }

    if (moved) dragX.value = dx
}

function onPointerEnd() {
    if (!pressed) return
    pressed = false
    if (!moved) return

    // Jarak geser menyesuaikan lebar karya yang sedang di tengah
    const unit = slides[active.value]?.offsetWidth ?? 260
    const dx = dragX.value
    let steps = Math.round(-dx / unit)
    if (steps === 0 && Math.abs(dx) > Math.min(50, unit * 0.2)) steps = dx < 0 ? 1 : -1

    dragging.value = false
    dragX.value = 0
    go(active.value + steps, { wrap: false })
}

function onKeydown(event) {
    if (openId.value) return

    if (event.key === 'ArrowLeft') {
        event.preventDefault()
        prev()
    }

    if (event.key === 'ArrowRight') {
        event.preventDefault()
        next()
    }
}

function onLightboxChange(id) {
    openId.value = id
    const index = items.value.findIndex((item) => item.id === id)
    if (index !== -1) active.value = index
}

watch(active, measure)

onMounted(async () => {
    measure()

    // Pantau slider dan track, supaya posisi tengah dihitung ulang saat layar berubah
    observer = new ResizeObserver(measure)
    observer.observe(viewport.value)
    if (track.value) observer.observe(track.value)

    await nextTick()
    requestAnimationFrame(() => {
        ready.value = true
    })

    startAuto()
    loadPhotos()
})

onBeforeUnmount(() => {
    stopAuto()
    observer?.disconnect()
})
</script>

<template>
    <div class="overflow-x-hidden bg-[#f7f7f5] text-[#171717] antialiased">
        <section class="relative overflow-hidden bg-linear-to-b from-[#f7f7f5] via-white to-[#f1f1ef]">
            <div class="mx-auto max-w-7xl px-5 pt-6 sm:px-8 sm:pt-10">
                <header class="flex items-end justify-between gap-4 sm:gap-6">
                    <div>
                        <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                            Galeri AMAZiNK
                        </p>
                        <h1 class="mt-2 text-[clamp(28px,4vw,44px)] font-semibold leading-[1.08] tracking-tighter">
                            Portofolio Kami
                        </h1>
                        <p class="mt-2 hidden max-w-xl text-sm leading-[1.7] text-[#737373] sm:block">
                            Kumpulan hasil cetak untuk berbagai kebutuhan, mulai dari dokumen, banner, label,
                            poster, hingga kemasan.
                        </p>
                    </div>

                    <div class="flex shrink-0 gap-2">
                        <button type="button" aria-label="Karya sebelumnya"
                            class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/10 transition-colors hover:text-brand-red sm:h-11 sm:w-11"
                            @click="prev">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                        <button type="button" aria-label="Karya berikutnya"
                            class="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-0 bg-white text-gray-700 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/10 transition-colors hover:text-brand-red sm:h-11 sm:w-11"
                            @click="next">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
                                stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" aria-hidden="true">
                                <path d="m9 18 6-6-6-6" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div role="tablist" aria-label="Kategori galeri"
                    class="-mx-5 mt-4 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:-mx-1 sm:mt-5 sm:flex-wrap sm:px-1 [&::-webkit-scrollbar]:hidden">
                    <button v-for="tab in tabs" :key="tab.id" type="button" role="tab"
                        :aria-selected="category === tab.id"
                        class="inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-0 px-4 transition-colors sm:h-10"
                        :class="category === tab.id
                            ? 'bg-[#171717]'
                            : 'bg-white ring-1 ring-black/5 hover:ring-brand-red/40'" :style="{
                                color: category === tab.id ? '#ffffff' : '#374151',
                                fontSize: '13px',
                                fontWeight: 600,
                            }" @click="selectCategory(tab.id)">
                        {{ tab.label }}
                        <span style="opacity: 0.55; font-size: 11px">{{ tab.count }}</span>
                    </button>
                </div>
            </div>

            <!-- --gallery-h: tinggi bingkai karya tengah, mengalir mengikuti lebar layar (200px - 340px) -->
            <div ref="viewport" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Galeri karya"
                class="relative mt-4 cursor-grab select-none overflow-hidden py-8 outline-none active:cursor-grabbing sm:mt-8 sm:py-12"
                style="touch-action: pan-y; --gallery-h: clamp(200px, 14vw + 140px, 340px)" @pointerdown="onPointerDown"
                @pointermove="onPointerMove" @pointerup="onPointerEnd" @pointercancel="onPointerEnd" @dragstart.prevent
                @pointerenter="onPointerEnter" @pointerleave="onPointerLeave" @focusin="onFocusIn"
                @focusout="hovering = false" @keydown="onKeydown">
                <p v-if="!items.length" class="m-0 py-24 text-center text-sm font-semibold text-[#737373]">
                    {{ emptyMessage }}
                </p>

                <div v-show="items.length" ref="track" class="relative flex w-max items-start gap-6 sm:gap-10 lg:gap-12"
                    :class="ready && !dragging
                        ? 'transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none'
                        : ''" :style="{ transform: `translateX(${offset + dragX}px)` }">
                    <GalleryCard v-for="(item, index) in items" :key="item.id"
                        :ref="(el) => (slides[index] = el?.$el ?? null)" :item="item"
                        :distance="Math.abs(index - active)" :active="index === active" @select="onSelect(index)" />
                </div>
            </div>

            <div class="relative pb-5 pt-1 sm:pb-8 sm:pt-2">
                <div
                    class="absolute inset-x-0 bottom-0 top-11 border-t border-black/10 bg-linear-to-b from-[#dedede] to-[#efefee] sm:top-16">
                </div>

                <div class="relative mx-auto w-[min(590px,88vw)]">
                    <div class="mb-3 text-center sm:mb-4" aria-live="polite">
                        <p class="m-0 mb-1 font-serif text-[12px] italic tabular-nums" style="color: #555">
                            {{ counter }}
                        </p>
                        <div class="relative h-px bg-black/25">
                            <span class="absolute -top-1 left-0 h-2.5 w-px bg-black/35"></span>
                            <span class="absolute -top-1 right-0 h-2.5 w-px bg-black/35"></span>
                        </div>
                    </div>

                    <div class="relative pb-9 sm:pb-13">
                        <div
                            class="h-6 rounded-[3px] bg-linear-to-b from-[#5b5553] via-[#403b3a] to-[#2b2827] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] sm:h-8">
                        </div>
                        <div
                            class="absolute left-0 top-6 h-9 w-5 bg-linear-to-r from-[#3a3534] to-[#262322] sm:top-8 sm:h-13 sm:w-8">
                        </div>
                        <div
                            class="absolute right-0 top-6 h-9 w-5 bg-linear-to-l from-[#3a3534] to-[#262322] sm:top-8 sm:h-13 sm:w-8">
                        </div>
                        <div class="absolute -bottom-1 left-[4%] h-4 w-[92%] rounded-full bg-black/20 blur-lg"></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="bg-[#0f0d12] px-5 py-16 text-center sm:py-24">
            <h2 class="m-0 font-serif text-[clamp(26px,4vw,44px)] font-normal leading-tight" style="color: #f7f7f5">
                Punya kebutuhan cetak sendiri?
            </h2>
            <p class="mx-auto mt-4 max-w-md text-[13px] leading-7 sm:text-sm" style="color: #8f8d94">
                Ceritakan kebutuhanmu ke tim AMAZiNK, kami bantu pilih tinta dan toner yang cocok untuk hasil
                cetak terbaik.
            </p>
            <a :href="contactLink" target="_blank" rel="noopener noreferrer"
                class="mt-8 inline-flex h-12 items-center rounded-md bg-[#2a2830] px-8 text-[13px] font-semibold uppercase tracking-[0.04em] no-underline transition-colors hover:bg-brand-red"
                style="color: #fff">
                Hubungi Kami
            </a>
        </section>

        <GalleryLightbox :items="items" :active-id="openId" @close="openId = null" @change="onLightboxChange" />
    </div>
</template>