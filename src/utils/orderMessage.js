import { formatPhone } from '@/utils/phone'

const formatPrice = (price) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)

const printerText = (printer) => (typeof printer === 'string' ? printer : printer ? `${printer.brand} ${printer.series}` : '')

// Pesan WhatsApp berisi ringkasan pesanan, dikirim pelanggan ke CP untuk melanjutkan transaksi.
export function buildOrderMessage(order) {
    const lines = order.items.flatMap((item, index) => {
        const detail = [item.variant, printerText(item.printer) && `Printer ${printerText(item.printer)}`].filter(Boolean)

        return [
            `${index + 1}. ${item.name}`,
            `   ${item.qty} x ${formatPrice(item.price)} = ${formatPrice(item.price * item.qty)}`,
            ...(detail.length ? [`   ${detail.join(' | ')}`] : []),
        ]
    })

    const customer = order.customer ?? {}

    return [
        'Halo AMAZiNK, saya ingin melanjutkan pesanan saya.',
        '',
        `*Pesanan ${order.id}*`,
        ...lines,
        '',
        `*Total: ${formatPrice(order.subtotal)}*`,
        '',
        '*Data penerima*',
        `Nama: ${customer.name ?? ''}`,
        `WhatsApp: ${formatPhone(customer.phone) || customer.phone || ''}`,
        `Alamat: ${customer.address ?? ''}`,
        ...(customer.note ? [`Catatan: ${customer.note}`] : []),
        '',
        'Mohon informasi pembayaran dan pengirimannya. Terima kasih.',
    ].join('\n')
}

// Pesan WhatsApp untuk pesanan yang sudah selesai tetapi bermasalah; `issue` diisi pelanggan lewat modal.
export function buildIssueMessage(order, issue = '') {
    const date = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(order.createdAt))

    return [
        'Halo AMAZiNK, saya mengalami kendala pada pesanan yang sudah selesai.',
        '',
        `*Pesanan ${order.id}*`,
        `Tanggal pesanan: ${date}`,
        `Total: ${formatPrice(order.subtotal)}`,
        'Barang:',
        ...order.items.map((item) => `- ${item.qty}x ${item.name}`),
        '',
        '*Kendala yang dialami*',
        issue,
        '',
        'Mohon bantuannya. Terima kasih.',
    ].join('\n')
}
