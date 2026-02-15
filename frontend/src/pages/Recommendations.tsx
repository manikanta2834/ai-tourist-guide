import { useQuery } from '@tanstack/react-query'
import { Sparkles, MapPin, Clock } from 'lucide-react'
import { LocationCard } from '@/components/locations/LocationCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { useAuthStore } from '@/stores/authStore'
import { api } from '@/lib/api'

export default function Recommendations() {
  const { isAuthenticated } = useAuthStore()

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => api.getRecommendations(),
    enabled: isAuthenticated,
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Personalized Recommendations</h1>
          <p className="text-gray-600 mb-6">Sign in to get AI-powered recommendations</p>
          <a href="/login" className="btn-primary">Sign In</a>
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner fullScreen />

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium text-purple-200">AI-Powered</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Recommended For You</h1>
          <p className="mt-2 text-purple-100 max-w-2xl">
            Based on your preferences and behavior, we've selected these places
            that match your interests
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <ErrorMessage message="Failed to load recommendations" onRetry={refetch} />
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Top Recommendations
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.data?.recommendations?.map((rec: any) => (
                  <div key={rec.location._id} className="relative">
                    <div className="absolute -top-2 -right-2 z-10">
                      <span className="px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                        {(rec.score * 100).toFixed(0)}% Match
                      </span>
                    </div>
                    <LocationCard location={rec.location} />
                    {rec.reasons?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.reasons.map((reason: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded-full"
                          >
                            <Sparkles className="w-3 h-3 mr-1" />
                            {reason}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendation Insights */}
            <div className="card p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
              <h3 className="font-bold text-gray-900 mb-4">How We Recommend</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { icon: Sparkles, title: 'AI Analysis', desc: 'Matches your preferences' },
                  { icon: MapPin, title: 'Location', desc: 'Nearby attractions' },
                  { icon: Clock, title: 'Time', desc: 'Currently open places' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
