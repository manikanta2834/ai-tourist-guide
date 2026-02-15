import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Map as MapIcon, List, Locate } from 'lucide-react'
import { MapContainer } from '@/components/map/MapContainer'
import { LocationCard } from '@/components/locations/LocationCard'
import { CategoryFilter } from '@/components/locations/CategoryFilter'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useMapStore } from '@/stores/mapStore'
import { api } from '@/lib/api'

export default function Explore() {
  const [view, setView] = useState<'map' | 'list'>('map')
  const [searchQuery, setSearchQuery] = useState('')
  const { viewState, setViewState, setUserLocation, setIsLocating, isLocating } = useMapStore()

  // Fetch nearby locations
  const { data: locations, isLoading, error, refetch } = useQuery({
    queryKey: ['locations', 'nearby', viewState.latitude, viewState.longitude],
    queryFn: () =>
      api.getLocations({
        lat: viewState.latitude,
        lng: viewState.longitude,
        radius: 10,
      }),
  })

  // Handle geolocation
  const handleLocate = () => {
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        setViewState({ latitude, longitude, zoom: 15 })
        setIsLocating(false)
      },
      (error) => {
        console.error('Geolocation error:', error)
        setIsLocating(false)
      },
      { enableHighAccuracy: true }
    )
  }

  const handleMarkerClick = (locationId: string) => {
    // Navigate to location detail
    window.location.href = `/location/${locationId}`
  }

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)]">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 md:top-20 md:left-8 md:right-auto md:w-96">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('map')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'map' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  view === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>

            <button
              onClick={handleLocate}
              disabled={isLocating}
              className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium text-primary-600 hover:bg-primary-50"
            >
              <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              {isLocating ? 'Locating...' : 'My Location'}
            </button>
          </div>
        </div>
      </div>

      <div className="h-full flex">
        {/* Map View */}
        {view === 'map' && (
          <div className="flex-1 relative">
            <MapContainer
              locations={locations?.data?.locations || []}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        )}

        {/* List View */}
        {view === 'list' && (
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8">
              <div className="mb-6">
                <CategoryFilter />
              </div>

              {isLoading && <LoadingSpinner />}
              {error && <ErrorMessage message="Failed to load locations" onRetry={refetch} />}

              {!isLoading && !error && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-sm">
                    Found {locations?.data?.locations?.length || 0} places nearby
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations?.data?.locations?.map((location: any) => (
                      <LocationCard key={location._id} location={location} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
