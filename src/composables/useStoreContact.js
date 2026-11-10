import { computed } from 'vue'
import { usePageSection } from '@/composables/usePage'
import { waLinkTo } from '@/utils/whatsapp'

// Nomor WhatsApp toko dari Halaman > Footer > Kontak (diatur admin). Kosong: nomor bawaan website.
export function useStoreContact() {
    const contact = usePageSection('footer', 'contact', { phone: '' })

    return {
        phone: computed(() => contact.value.phone),
        link: (message = '') => waLinkTo(contact.value.phone, message),
    }
}
