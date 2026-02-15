import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapPin, Compass, Calendar, Star, ChevronRight } from 'lucide-react'
import { LocationCard } from '@/components/locations/LocationCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { api } from '@/lib/api'

export default function Home() {
  const { data: featured, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.getFeaturedLocations(),
  })

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: () => api.getPopularLocations(6),
  })

  if (featuredLoading) return <LoadingSpinner fullScreen />
  if (featuredError) return <ErrorMessage message="Failed to load featured locations" />

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1561361058-e1c1f38c938d')] bg-cover bg-center" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Discover
              <span className="text-temple-gold"> Sriperumbudur</span>
              <br />
              with AI Guidance
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-200 max-w-2xl">
              Explore ancient temples, historic monuments, and hidden gems with personalized
              recommendations powered by artificial intelligence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Explore Map
              </Link>
              <Link
                to="/recommendations"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                <Compass className="w-5 h-5 mr-2" />
                Get Recommendations
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 md:mt-16 grid grid-cols-3 gap-8 max-w-xl">
            {[
              { value: '500K+', label: 'Annual Visitors' },
              { value: '4.7★', label: 'Temple Rating' },
              { value: '24/7', label: 'AI Assistance' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-temple-gold">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Destinations</h2>
              <p className="text-gray-600 mt-1">Handpicked places you shouldn't miss</p>
            </div>
            <Link
              to="/explore"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured?.data?.locations?.map((location: any) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-12 md:py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Popular Experiences</h2>
              <p className="text-gray-600 mt-1">Most visited places by travelers</p>
            </div>
            <Link
              to="/explore"
              className="flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>

          {popularLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popular?.data?.locations?.map((location: any) => (
                <LocationCard key={location._id} location={location} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
            Plan Your Visit
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Explore the Map',
                description: 'Discover nearby attractions with our interactive map',
                link: '/explore',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Compass,
                title: 'AI Recommendations',
                description: 'Get personalized suggestions based on your preferences',
                link: '/recommendations',
                color: 'bg-purple-50 text-purple-600',
              },
              {
                icon: Calendar,
                title: 'Build Itinerary',
                description: 'Create and optimize your perfect day trip',
                link: '/itinerary',
                color: 'bg-green-50 text-green-600',
              },
            ].map((action) => (
              <Link
                key={action.title}
                to={action.link}
                className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
