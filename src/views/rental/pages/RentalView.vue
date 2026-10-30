<script setup>
import { onMounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'
import RentalHero from '../components/RentalHero.vue'
import RentalBenefit from '../components/RentalBenefit.vue'
import RentalPriceList from '../components/RentalPriceList.vue'
import RentalCustomers from '../components/RentalCustomers.vue'
import RentalCompare from '../components/RentalCompare.vue'
import RentalForm from '../components/RentalForm.vue'
import { getCustomers, getRentablePrinters } from '../services/rentalService'

useSeo(() => ({
    title: 'Sewa Printer',
    description: 'Butuh printer untuk kantor, acara, atau proyek? Ajukan sewa printer bersama AMAZiNK.',
    path: '/sewa-printer',
}))

const printers = ref([])
const customers = ref([])
const loading = ref(true)
const loadError = ref('')

const selected = ref(null)
const formOpen = ref(false)
const compareOpen = ref(false)

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

async function loadCustomers() {
    try {
        customers.value = await getCustomers()
    } catch {
        customers.value = []
    }
}

function openForm(printer) {
    selected.value = printer
    compareOpen.value = false
    formOpen.value = true
}

function openCompare(printer) {
    selected.value = printer
    compareOpen.value = true
}

onMounted(() => {
    load()
    loadCustomers()
})
</script>

<template>
    <main class="space-y-12 bg-[#f7f7f5] pb-16 text-[#171717] sm:space-y-16 sm:pb-24">
        <RentalHero />

        <RentalBenefit />

        <RentalPriceList :printers="printers" :loading="loading" :load-error="loadError" @apply="openForm"
            @compare="openCompare" @retry="load" />

        <RentalCustomers :customers="customers" />

        <RentalCompare :open="compareOpen" :printer="selected" @close="compareOpen = false" @apply="openForm" />

        <RentalForm :open="formOpen" :printers="printers" :printer="selected" @close="formOpen = false" />
    </main>
</template>