<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { cheapestRent, formatRupiah } from '../services/rentalService'

const props = defineProps({
    printers: { type: Array, default: () => [] },
    hidden: { type: Boolean, default: false },
})

const emit = defineEmits(['apply'])

const price = computed(() => cheapestRent(props.printers))
const scrolled = ref(false)
const show = computed(() => scrolled.value && !props.hidden && price.value > 0)

const onScroll = () => {
    scrolled.value = window.scrollY > 480
}

onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full"
        enter-to-class="translate-y-0" leave-active-class="transition duration-200 ease-in"
        leave-from-class="translate-y-0" leave-to-class="translate-y-full">
        <div v-if="show"
            class="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-black/10 bg-white/95 px-4 pt-3 pr-20 backdrop-blur md:hidden"
            style="padding-bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px))">
            <div class="min-w-0">
                <p class="m-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#737373]">Mulai dari</p>
                <p class="m-0 truncate text-base font-bold tracking-[-0.02em] text-[#14161b]">
                    {{ formatRupiah(price) }}
                    <span class="text-xs font-medium text-[#737373]">/ bulan</span>
                </p>
            </div>

            <button type="button" class="h-10 shrink-0 cursor-pointer rounded-full border-0 bg-brand-red px-5"
                style="color: #fff; font-size: 13px; font-weight: 600" @click="emit('apply', null)">
                Ajukan sewa
            </button>
        </div>
    </Transition>
</template>