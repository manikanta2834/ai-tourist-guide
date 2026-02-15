import { IUser } from '../models/User'
import { ILocation } from '../models/Location'
import { IReview } from '../models/Review'
import { IItinerary } from '../models/Itinerary'

export { IUser, ILocation, IReview, IItinerary }

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  status: 'success'
  results: number
  total: number
  page: number
  pages: number
  data: T
}
