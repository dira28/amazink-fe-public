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
import RentalSteps from '../components/RentalSteps.vue'
import { useAuth } from '@/stores/auth'
import { buildRentalMessage, rentalWhatsappLink, toPrinters } from '../services/rentalService'

usePageSeo('sewa-printer', () => ({
    title: 'Sewa Printer',
    description: 'Butuh printer untuk kantor, acara, atau proyek? Ajukan sewa printer bersama AMAZiNK.',
    path: '/sewa-printer',
}))

const status = pageStatus('sewa-printer')
const prices = usePageSection('sewa-printer', 'prices', { packages: [], categories: [] })
const contact = usePageSection('sewa-printer', 'contact', { phone: '' })
const { user } = useAuth()

const printers = computed(() => toPrinters(prices.value.packages, prices.value.categories))
const loading = computed(() => !status.settled)
const loadError = computed(() => (status.failed ? 'Daftar printer sewa belum dapat dimuat. Periksa koneksi Anda.' : ''))

const selected = ref(null)
const request = ref({ printer: null, units: 0, months: 0 })
const compareOpen = ref(false)
const requestOpen = ref(false)
// Tautan WhatsApp setelah pengajuan dikirim; dipakai modal bila tab barunya diblokir browser.
const sentUrl = ref('')
// Paket yang diminta tampil di daftar harga (dari pencari paket).
const focus = ref({ id: '', tick: 0 })
const modalOpen = computed(() => requestOpen.value || compareOpen.value)

function retry() {
    window.location.reload()
}

// "Ajukan sewa" membuka modal alasan dan lama sewa dulu, lalu pengajuan dilanjutkan di WhatsApp ke CP.
function openForm(printer = null, extra = null) {
    selected.value = printer
    request.value = { printer, units: extra?.units ?? 0, months: extra?.months ?? 0 }
    compareOpen.value = false
    sentUrl.value = ''
    requestOpen.value = true
}

// Dipanggil langsung dari klik kirim, jadi tab WhatsApp boleh dibuka. Modal tetap tampil dengan pesan "terkirim"
// dan tautan cadangan, karena browser bisa saja memblokir tab baru.
function sendToWhatsapp(details) {
    const url = rentalWhatsappLink(contact.value.phone, buildRentalMessage(details.printer, user.value, details))
    window.open(url, '_blank', 'noopener,noreferrer')
    sentUrl.value = url
}

// Transisi sederhana untuk tombol yang saling mengarah di halaman ini: gulir halus, lalu bagian tujuan
// muncul naik sedikit sambil memudar masuk.
function goTo(id) {
    const target = document.getElementById(id)
    if (!target) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    if (reduced) return

    target.animate(
        [
            { opacity: 0.35, transform: 'translateY(18px)' },
            { opacity: 1, transform: 'none' },
        ],
        { duration: 600, delay: 150, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' },
    )
}

function onAnchorClick(event) {
    const link = event.target.closest?.('a[href^="#"]')
    const id = link?.getAttribute('href').slice(1)
    if (!id || !document.getElementById(id)) return

    event.preventDefault()
    goTo(id)
}

function showPackage(printer) {
    focus.value = { id: printer.id, tick: focus.value.tick + 1 }
    goTo('daftar-harga')
}

function openCompare(printer) {
    selected.value = printer
    compareOpen.value = true
}
</script>

<template>
    <main class="text-[#171717]" @click="onAnchorClick">
        <RentalHero @apply="openForm" />
        <RentalMarquee />

        <div class="bg-white py-16 sm:py-24">
            <RentalProblems />
        </div>

        <RentalBenefit />

        <div class="bg-[#f4f3ef] py-16 sm:py-24">
            <RentalPriceList :printers="printers" :loading="loading" :load-error="loadError" :focus="focus"
                @apply="openForm" @compare="openCompare" @retry="retry" />
        </div>

        <RentalSteps @apply="openForm" />

        <RentalCalculator :printers="printers" :loading="loading" @apply="openForm" />

        <RentalCustomers />

        <div class="bg-[#141414] py-16 pb-24 sm:py-24 sm:pb-32">
            <RentalFaq />
        </div>

        <RentalStickyBar :printers="printers" :hidden="modalOpen" @apply="openForm" />

        <RentalCompare :open="compareOpen" :printer="selected" @close="compareOpen = false" @apply="openForm" />

        <RentalRequestDialog :open="requestOpen" :printers="printers" :request="request" :user="user" :sent-url="sentUrl"
            @close="requestOpen = false" @submit="sendToWhatsapp" />
    </main>
</template>