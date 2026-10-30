<script setup>
import { computed, ref } from 'vue'
import { usePageSeo } from '@/composables/useSeo'
import { pageStatus, usePageSection } from '@/composables/usePage'
import RentalHero from '../components/RentalHero.vue'
import RentalBenefit from '../components/RentalBenefit.vue'
import RentalPriceList from '../components/RentalPriceList.vue'
import RentalCustomers from '../components/RentalCustomers.vue'
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

function retry() {
    window.location.reload()
}

// "Ajukan sewa" membuka modal alasan dan lama sewa dulu, lalu pengajuan dilanjutkan di WhatsApp ke CP.
function openForm(printer) {
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
    <main class="space-y-12 bg-[#f7f7f5] pb-16 text-[#171717] sm:space-y-16 sm:pb-24">
        <RentalHero />

        <RentalBenefit />

        <RentalPriceList :printers="printers" :loading="loading" :load-error="loadError" @apply="openForm"
            @compare="openCompare" @retry="retry" />

        <RentalCustomers />

        <RentalCompare :open="compareOpen" :printer="selected" @close="compareOpen = false" @apply="openForm" />

        <RentalRequestDialog :open="requestOpen" :printer="selected" @close="requestOpen = false"
            @submit="sendToWhatsapp" />
    </main>
</template>
