import { apiGet } from './http'

// Testimoni yang dipublikasikan di admin.
export const fetchTestimonials = () => apiGet('/public/testimonials')
