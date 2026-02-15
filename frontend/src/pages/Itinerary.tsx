import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Calendar, Clock, MapPin, Plus, Trash2, Share2, Sparkles } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { api } from '@/lib/api'

export default function Itinerary() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['itineraries'],
    queryFn: () => api.getItineraries(),
  })

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Itineraries</h1>
            <p className="text-gray-600 mt-1">Plan and optimize your trips</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Itinerary
          </button>
        </div>

        {data?.data?.itineraries?.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No itineraries yet</h3>
            <p className="text-gray-600 mt-2">Create your first itinerary to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 btn-primary"
            >
              Create Itinerary
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.data?.itineraries?.map((itinerary: any) => (
              <div key={itinerary._id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{itinerary.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(itinerary.date).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {itinerary.totalDuration} min
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-600">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {itinerary.items?.slice(0, 3).map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.location?.name}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                          {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {itinerary.items?.length > 3 && (
                    <p className="text-center text-sm text-gray-500">
                      +{itinerary.items.length - 3} more stops
                    </p>
                  )}
                </div>

                {!itinerary.isOptimized && (
                  <button className="mt-4 w-full py-2 bg-purple-50 text-purple-600 rounded-lg font-medium hover:bg-purple-100 flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Optimize with AI
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
