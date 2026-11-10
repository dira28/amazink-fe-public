<script setup>
import { computed, ref } from 'vue'
import { usePageSeo } from '@/composables/useSeo'
import { pageStatus, usePageSection } from '@/composables/usePage'
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
import RentalRequestDialog from '../components/RentalRequestDialog.vue'
import { useAuth } from '@/stores/auth'
import { buildRentalMessage, rentalWhatsappLink, toPrinters } from '../services/rentalService'

usePageSeo('sewa-printer', () => ({
    title: 'Sewa Printer',
    description: 'Butuh printer untuk kantor, acara, atau proyek? Ajukan sewa printer bersama AMAZiNK.',
    path: '/sewa-printer',
}))

// Paket sewa diatur admin di Halaman > Sewa Printer.
const status = pageStatus('sewa-printer')
const prices = usePageSection('sewa-printer', 'prices', { packages: [] })
// Nomor CP tujuan tombol "Ajukan sewa", diatur admin.
const contact = usePageSection('sewa-printer', 'contact', { phone: '' })
const { user } = useAuth()

const printers = computed(() => toPrinters(prices.value.packages))
const loading = computed(() => !status.settled)
const loadError = computed(() => (status.failed ? 'Daftar printer sewa belum dapat dimuat. Periksa koneksi Anda.' : ''))

const selected = ref(null)
const compareOpen = ref(false)
const requestOpen = ref(false)
const modalOpen = computed(() => requestOpen.value || compareOpen.value)

function retry() {
    window.location.reload()
}

// "Ajukan sewa" membuka modal alasan dan lama sewa dulu, lalu pengajuan dilanjutkan di WhatsApp ke CP.
function openForm(printer = null) {
    selected.value = printer
    compareOpen.value = false
    requestOpen.value = true
}

function sendToWhatsapp(details) {
    requestOpen.value = false
    window.open(
        rentalWhatsappLink(contact.value.phone, buildRentalMessage(selected.value, user.value, details)),
        '_blank',
        'noopener,noreferrer',
    )
}

function openCompare(printer) {
    selected.value = printer
    compareOpen.value = true
}
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
                @compare="openCompare" @retry="retry" />
        </div>

        <RentalCalculator :printers="printers" :loading="loading" @apply="openForm" />

        <RentalCustomers />

        <div class="bg-[#141414] py-16 pb-24 sm:py-24 sm:pb-32">
            <RentalFaq />
        </div>

        <RentalStickyBar :printers="printers" :hidden="modalOpen" @apply="openForm" />

        <RentalCompare :open="compareOpen" :printer="selected" @close="compareOpen = false" @apply="openForm" />

        <RentalRequestDialog :open="requestOpen" :printer="selected" @close="requestOpen = false"
            @submit="sendToWhatsapp" />
    </main>
</template>