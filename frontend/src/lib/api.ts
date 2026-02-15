import axios, { AxiosError, AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/authStore'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        const tokens = useAuthStore.getState().tokens
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          useAuthStore.getState().logout()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password })
    return response.data
  }

  async register(email: string, password: string, name: string) {
    const response = await this.client.post('/auth/register', { email, password, name })
    return response.data
  }

  async getCurrentUser() {
    const response = await this.client.get('/auth/me')
    return response.data
  }

  // Location endpoints
  async getLocations(params: { lat?: number; lng?: number; radius?: number; category?: string }) {
    const response = await this.client.get('/locations/nearby', { params })
    return response.data
  }

  async getLocationById(id: string) {
    const response = await this.client.get(`/locations/${id}`)
    return response.data
  }

  async searchLocations(query: string, filters?: object) {
    const response = await this.client.get('/locations/search', {
      params: { q: query, ...filters }
    })
    return response.data
  }

  async getPopularLocations(limit = 10) {
    const response = await this.client.get('/locations/popular', { params: { limit } })
    return response.data
  }

  async getFeaturedLocations() {
    const response = await this.client.get('/locations/featured')
    return response.data
  }

  // Recommendation endpoints
  async getRecommendations(params?: { lat?: number; lng?: number; timeBudget?: number }) {
    const response = await this.client.get('/recommendations', { params })
    return response.data
  }

  // Itinerary endpoints
  async createItinerary(data: { name: string; date: string; locationIds: string[] }) {
    const response = await this.client.post('/itineraries', data)
    return response.data
  }

  async getItineraries() {
    const response = await this.client.get('/itineraries')
    return response.data
  }

  async getItineraryById(id: string) {
    const response = await this.client.get(`/itineraries/${id}`)
    return response.data
  }

  // Favorites
  async addFavorite(locationId: string) {
    const response = await this.client.post(`/auth/favorites/${locationId}`)
    return response.data
  }

  async removeFavorite(locationId: string) {
    const response = await this.client.delete(`/auth/favorites/${locationId}`)
    return response.data
  }
}

export const api = new ApiClient()
