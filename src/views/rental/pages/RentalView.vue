<script setup>
import { onMounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'
import RentalForm from '../components/RentalForm.vue'
import RentalSpecs from '../components/RentalSpecs.vue'
import { getRentablePrinters } from '../services/rentalService'
import RentalInfo from '../components/RentalInfo.vue'

useSeo(() => ({
    title: 'Sewa Printer',
    description: 'Butuh printer untuk kantor, acara, atau proyek? Ajukan sewa printer bersama AMAZiNK.',
    path: '/sewa-printer',
}))

const printers = ref([])
const loading = ref(true)
const loadError = ref('')
const selectedId = ref(null)

async function load() {
    loading.value = true
    loadError.value = ''
    try {
        printers.value = await getRentablePrinters()
    } catch (e) {
        loadError.value = e.message
    } finally {
        loading.value = false
    }
}

function pick(id) {
    selectedId.value = id
    document.getElementById('form-sewa')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

onMounted(load)
</script>

<template>
    <main class="bg-[#f7f7f5] text-[#171717]">
        <section class="relative overflow-hidden bg-gradient-to-b from-white to-[#f7f7f5]">
            <div class="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-red/10 blur-3xl">
            </div>

            <div class="relative mx-auto max-w-3xl px-5 pb-8 pt-10 text-center sm:px-8 sm:pb-12 sm:pt-16">
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Sewa Printer</p>
                <h1
                    class="mx-auto mt-3 max-w-2xl text-[clamp(28px,4.6vw,46px)] font-semibold leading-[1.08] tracking-[-0.05em]">
                    Butuh printer tanpa harus membeli?
                </h1>
                <p class="mx-auto mb-0 mt-3 max-w-md text-[13px] leading-7 text-[#737373] sm:text-sm">
                    Pilih printer, tulis kebutuhanmu, lalu tim AMAZiNK akan menghubungimu.
                </p>
            </div>
        </section>

        <div class="mx-auto max-w-4xl space-y-12 px-5 pb-16 sm:space-y-16 sm:px-8 sm:pb-24">
            <RentalForm v-model:selected-id="selectedId" :printers="printers" :loading="loading" :load-error="loadError"
                @retry="load" />

            <RentalSpecs :printers="printers" :loading="loading" @pick="pick" />

            <RentalInfo />
        </div>

    </main>
</template>