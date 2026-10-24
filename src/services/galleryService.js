import { apiGet } from './http'

// Kategori galeri beserta foto-fotonya, sesuai urutan di admin.
export const fetchGallery = () => apiGet('/public/gallery')
