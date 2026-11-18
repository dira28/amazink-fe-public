import { apiGet } from './http'

export const fetchGallery = () => apiGet('/public/gallery')
