import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { MapPin, Clock, Star, Phone, Globe, Calendar, Heart, Share2, ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { api } from '@/lib/api'

export default function LocationDetail() {
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['location', id],
    queryFn: () => api.getLocationById(id!),
    enabled: !!id,
  })

  const location = data?.data?.location

  if (isLoading) return <LoadingSpinner fullScreen />
  if (error || !location) return <ErrorMessage message="Location not found" onRetry={refetch} />

  const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' })
  const todayHours = location.operatingHours?.[today as keyof typeof location.operatingHours]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        {location.images?.[0] ? (
          <img
            src={location.images[0]}
            alt={location.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <span className="text-6xl">🛕</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Back Button */}
        <Link
          to="/explore"
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
          <span className="inline-block px-3 py-1 bg-temple-gold/90 rounded-full text-sm font-medium mb-2 capitalize">
            {location.category}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold">{location.name}</h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 mr-1" />
              {location.rating.toFixed(1)} ({location.reviewCount} reviews)
            </span>
            <span className="flex items-center">
              <Clock className="w-5 h-5 mr-1" />
              {location.visitDuration} mins
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed">{location.description}</p>
            </div>

            {/* History */}
            {location.history && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">History</h2>
                <p className="text-gray-600 leading-relaxed">{location.history}</p>
              </div>
            )}

            {/* Architecture */}
            {location.architecture && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Architecture</h2>
                <p className="text-gray-600 leading-relaxed">{location.architecture}</p>
              </div>
            )}

            {/* Rituals */}
            {location.rituals?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Daily Rituals</h2>
                <div className="space-y-3">
                  {location.rituals.map((ritual: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 w-16 text-sm font-medium text-primary-600">
                        {ritual.time}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{ritual.name}</h4>
                        <p className="text-sm text-gray-600">{ritual.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips */}
            {location.tips?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Visitor Tips</h2>
                <ul className="space-y-2">
                  {location.tips.map((tip: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-primary-500 mt-1">&#8226;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Information</h3>

              <div className="space-y-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-900">{location.address?.street}</p>
                    <p className="text-sm text-gray-600">
                      {location.address?.city}, {location.address?.state} {location.address?.pincode}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                {location.contact?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${location.contact.phone}`}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      {location.contact.phone}
                    </a>
                  </div>
                )}

                {/* Website */}
                {location.contact?.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a
                      href={location.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {/* Hours */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Hours</p>
                    {todayHours && (
                      <p className="text-sm text-gray-600">
                        Today: {todayHours.closed ? 'Closed' : `${todayHours.open} - ${todayHours.close}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="card p-6">
              <h3 className="font-bold text-gray-900 mb-4">Accessibility</h3>
              <div className="space-y-2">
                {Object.entries(location.accessibility || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2 text-sm">
                    <span
                      className={`w-2 h-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                    />
                    <span className={value ? 'text-gray-900' : 'text-gray-400'}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
