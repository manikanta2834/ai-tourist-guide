import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, Heart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

interface LocationCardProps {
  location: {
    _id: string
    name: string
    description: string
    category: string
    rating: number
    reviewCount: number
    visitDuration: number
    images: string[]
    address?: { city: string }
  }
  variant?: 'default' | 'compact' | 'horizontal'
}

const categoryIcons: Record<string, string> = {
  temple: '🛕',
  monument: '🏛️',
  museum: '🏺',
  industrial: '🏭',
  nature: '🌳',
  cultural: '🎭',
  food: '🍽️',
  shopping: '🛍️',
}

export function LocationCard({ location, variant = 'default' }: LocationCardProps) {
  const { user, isAuthenticated, addFavorite, removeFavorite } = useAuthStore()
  const isFavorite = user?.favorites.includes(location._id)

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) return

    try {
      if (isFavorite) {
        await api.removeFavorite(location._id)
        removeFavorite(location._id)
      } else {
        await api.addFavorite(location._id)
        addFavorite(location._id)
      }
    } catch (error) {
      console.error('Favorite error:', error)
    }
  }

  if (variant === 'horizontal') {
    return (
      <Link to={`/location/${location._id}`}>
        <motion.div
          whileHover={{ y: -2 }}
          className="card flex gap-4 p-4"
        >
          <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-200 overflow-hidden">
            {location.images[0] ? (
              <img
                src={location.images[0]}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                {categoryIcons[location.category] || '📍'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-primary-600 font-medium capitalize">
                  {categoryIcons[location.category]} {location.category}
                </p>
                <h3 className="font-semibold text-gray-900 truncate">{location.name}</h3>
              </div>
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full hover:bg-gray-100 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
              <span className="flex items-center">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
                {location.rating.toFixed(1)}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {location.visitDuration} min
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link to={`/location/${location._id}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="card group"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {location.images[0] ? (
            <img
              src={location.images[0]}
              alt={location.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-5xl">
              {categoryIcons[location.category] || '📍'}
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium capitalize">
              {location.category}
            </span>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {location.name}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {location.description}
          </p>

          <div className="flex items-center gap-4 mt-3 text-sm">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 mr-1" />
              <span className="font-medium">{location.rating.toFixed(1)}</span>
              <span className="text-gray-400 ml-1">({location.reviewCount})</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {location.visitDuration} min
            </div>
          </div>

          {location.address?.city && (
            <div className="flex items-center text-sm text-gray-500 mt-2">
              <MapPin className="w-4 h-4 mr-1" />
              {location.address.city}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
