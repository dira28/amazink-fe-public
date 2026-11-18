import { apiGet } from './http'

export const fetchPrinters = () => apiGet('/public/printers')
