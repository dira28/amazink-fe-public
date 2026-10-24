import { apiGet } from './http'

// Printer beserta tinta yang cocok (hanya tinta yang tampil di katalog).
export const fetchPrinters = () => apiGet('/public/printers')
