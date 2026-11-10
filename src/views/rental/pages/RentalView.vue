<script setup>
import { computed, onMounted, ref } from 'vue'
import { useSeo } from '@/composables/useSeo'
import RentalHero from '../components/RentalHero.vue'
import RentalMarquee from '../components/RentalMarquee.vue'
import RentalProblems from '../components/RentalProblems.vue'
import RentalBenefit from '../components/RentalBenefit.vue'
import RentalPriceList from '../components/RentalPriceList.vue'
import RentalCalculator from '../components/RentalCalculator.vue'
import RentalCustomers from '../components/RentalCustomers.vue'
import RentalFaq from '../components/RentalFaq.vue'
import RentalStickyBar from '../components/RentalStickyBar.vue'
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
const modalOpen = computed(() => formOpen.value || compareOpen.value)

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

function openForm(printer = null) {
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
    <main class="text-[#171717]">
        <RentalHero />
        <RentalMarquee />

        <div class="bg-white py-16 sm:py-24">
            <RentalProblems @apply="openForm" />
        </div>

        <RentalBenefit />

        <div id="daftar-harga" class="scroll-mt-20 bg-[#f4f3ef] py-16 sm:py-24">
            <RentalPriceList :printers="printers" :loading="loading" :load-error="loadError" @apply="openForm"
                @compare="openCompare" @retry="load" />
        </div>

        <RentalCalculator :printers="printers" :loading="loading" @apply="openForm" />

        <div v-if="customers.length" class="bg-white py-16 sm:py-20">
            <RentalCustomers :customers="customers" />
        </div>

        <div class="bg-[#141414] py-16 pb-24 sm:py-24 sm:pb-32">
            <RentalFaq />
        </div>

        <RentalStickyBar :printers="printers" :hidden="modalOpen" @apply="openForm" />

        <RentalCompare :open="compareOpen" :printer="selected" @close="compareOpen = false" @apply="openForm" />

        <RentalForm :open="formOpen" :printers="printers" :printer="selected" @close="formOpen = false" />
    </main>
</template>