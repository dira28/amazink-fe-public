import { apiGet } from './http'

export const fetchTestimonials = () => apiGet('/public/testimonials')
