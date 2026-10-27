import { apiGet } from './http'

// Rekening tujuan transfer yang aktif, diatur admin.
export const fetchPaymentAccounts = async () => {
    const accounts = await apiGet('/public/payment-accounts')

    return accounts.map((account) => ({
        id: account.id,
        bank: account.bank_name,
        number: account.account_number,
        holder: account.account_holder,
    }))
}

// Nomor dikelompokkan empat angka agar mudah dibaca dan dicocokkan: 1234 5678 90.
export const formatAccountNumber = (number) => String(number ?? '').replace(/(\d{4})(?=\d)/g, '$1 ')
