import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { MapPin, Compass, Calendar, Star, ChevronRight, Heart, Clock, Users, Award, Camera, Navigation, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { LocationCard } from '@/components/locations/LocationCard'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { api } from '@/lib/api'

// Real Sriperumbudur temple and location images
const heroImages = [
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vallakottai_Murugan_Temple_gopuram.jpg/800px-Vallakottai_Murugan_Temple_gopuram.jpg',
    title: 'Vallakottai Murugan Temple',
    subtitle: '9th Century Heritage'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rajiv_Gandhi_Memorial_Sriperumbudur.jpg/800px-Rajiv_Gandhi_Memorial_Sriperumbudur.jpg',
    title: 'Rajiv Gandhi Memorial',
    subtitle: 'National Monument'
  },
  {
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Sriperumbudur_Temple_Tower.jpg/600px-Sriperumbudur_Temple_Tower.jpg',
    title: 'Sriperumbudur Temple',
    subtitle: 'Ancient Architecture'
  }
]

const categories = [
  { id: 'temple', name: 'Temples', icon: '🛕', count: 12, color: 'from-red-500 to-orange-500', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Vallakottai_Murugan_Temple_gopuram.jpg/400px-Vallakottai_Murugan_Temple_gopuram.jpg' },
  { id: 'monument', name: 'Monuments', icon: '🏛️', count: 5, color: 'from-amber-500 to-yellow-500', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rajiv_Gandhi_Memorial_Sriperumbudur.jpg/400px-Rajiv_Gandhi_Memorial_Sriperumbudur.jpg' },
  { id: 'industrial', name: 'Industrial', icon: '🏭', count: 8, color: 'from-blue-500 to-cyan-500', image: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400' },
  { id: 'nature', name: 'Nature', icon: '🌳', count: 6, color: 'from-green-500 to-emerald-500', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400' },
  { id: 'food', name: 'Food', icon: '🍽️', count: 15, color: 'from-orange-500 to-red-500', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', count: 9, color: 'from-purple-500 to-pink-500', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400' },
]

const stats = [
  { value: '500K+', label: 'Annual Visitors', icon: Users },
  { value: '4.7★', label: 'Temple Rating', icon: Star },
  { value: '24/7', label: 'AI Assistance', icon: Award },
  { value: '50+', label: 'Locations', icon: MapPin },
]

export default function Home() {
  const { data: featured, isLoading: featuredLoading, error: featuredError } = useQuery({
    queryKey: ['featured'],
    queryFn: () => api.getFeaturedLocations(),
  })

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ['popular'],
    queryFn: () => api.getPopularLocations(8),
  })

  if (featuredLoading) return <LoadingSpinner fullScreen />
  if (featuredError) return <ErrorMessage message="Failed to load featured locations" />

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with 3D Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Images with Parallax */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900" />
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-110"
              style={{
                backgroundImage: `url(${heroImages[0].url})`,
                filter: 'blur(3px) brightness(0.4)'
              }}
            />
          </div>
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-temple-gold/20 to-temple-saffron/20 blur-xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-xl"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <Sparkles className="w-4 h-4 text-temple-gold" />
                <span className="text-sm text-white/90">AI-Powered Travel Guide</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
                Discover{' '}
                <span className="text-gradient block mt-2">Sriperumbudur</span>
              </h1>

              <p className="mt-6 text-xl text-gray-300 max-w-xl leading-relaxed">
                Explore ancient temples, historic monuments, and hidden gems with personalized
                AI recommendations. Your journey to spiritual and cultural discovery starts here.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/explore"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-temple-gold to-temple-saffron text-gray-900 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-temple-gold/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Explore Map
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/recommendations"
                  className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Compass className="w-5 h-5 mr-2" />
                  AI Recommendations
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-4 gap-4">
                {stats.map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-temple-gold" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Content - 3D Card Stack */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative h-[600px]"
            >
              {heroImages.map((img, idx) => (
                <motion.div
                  key={img.title}
                  className="absolute w-80 rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    top: `${idx * 120}px`,
                    right: `${idx * 40}px`,
                    zIndex: heroImages.length - idx,
                  }}
                  whileHover={{ scale: 1.05, rotateY: 5, zIndex: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative aspect-[4/3]">
                    <img
                      src={img.url}
                      alt={img.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561361058-e1c1f38c938d?w=800';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg">{img.title}</h3>
                      <p className="text-gray-300 text-sm">{img.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Category Section with 3D Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-4">
              Browse by Category
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              What are you looking for?
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -10, rotateX: 10 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <Link to={`/explore?category=${category.id}`}>
                  <div className={`relative h-48 rounded-2xl overflow-hidden shadow-lg group cursor-pointer`}>
                    {/* Background Image */}
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1561361058-e1c1f38c938d?w=400';
                      }}
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-80 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-4 text-center">
                      <span className="text-4xl mb-2">{category.icon}</span>
                      <h3 className="text-white font-bold text-lg">{category.name}</h3>
                      <p className="text-white/80 text-sm">{category.count} places</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Locations with 3D Hover */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-medium">Featured</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Must-Visit Destinations</h2>
              <p className="text-gray-600 mt-2">Handpicked places you shouldn't miss</p>
            </motion.div>
            <Link
              to="/explore"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-medium group"
            >
              View All
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured?.data?.locations?.slice(0, 8).map((location: any, idx: number) => (
              <motion.div
                key={location._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <LocationCard location={location} variant="default" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Experiences */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-primary-600 font-medium">Trending</span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2">Popular Experiences</h2>
              <p className="text-gray-600 mt-2">Most visited places by travelers</p>
            </motion.div>
          </div>

          {popularLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popular?.data?.locations?.map((location: any, idx: number) => (
                <motion.div
                  key={location._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <LocationCard location={location} variant="compact" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4">
              <Sparkles className="w-4 h-4" />
              Powered by AI
            </span>
            <h2 className="text-4xl md:text-5xl font-bold">Smart Travel Planning</h2>
            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Our AI analyzes your preferences to create the perfect itinerary
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Personalized Recommendations',
                description: 'AI learns your preferences and suggests places you\'ll love',
                gradient: 'from-pink-500 to-rose-500',
              },
              {
                icon: Navigation,
                title: 'Route Optimization',
                description: 'Smart algorithms find the most efficient path between locations',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Clock,
                title: 'Time-Based Planning',
                description: 'Consider opening hours, crowd density, and travel time',
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -10, rotateX: 5 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform" />
                <div className="relative p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 transition-colors">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900">Start Your Journey</h2>
            <p className="text-gray-600 mt-2">Choose how you want to explore Sriperumbudur</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: 'Explore the Map',
                description: 'Discover nearby attractions with our interactive 3D map',
                link: '/explore',
                gradient: 'from-blue-500 to-indigo-600',
                image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600',
              },
              {
                icon: Compass,
                title: 'AI Recommendations',
                description: 'Get personalized suggestions based on your interests',
                link: '/recommendations',
                gradient: 'from-purple-500 to-pink-600',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600',
              },
              {
                icon: Calendar,
                title: 'Build Itinerary',
                description: 'Create and optimize your perfect day trip with AI',
                link: '/itinerary',
                gradient: 'from-green-500 to-teal-600',
                image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600',
              },
            ].map((action, idx) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
              >
                <Link to={action.link}>
                  <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    {/* Background Image */}
                    <img
                      src={action.image}
                      alt={action.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t ${action.gradient} opacity-90 mix-blend-multiply`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4"
                      >
                        <action.icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">{action.title}</h3>
                      <p className="text-white/80">{action.description}</p>
                      <div className="mt-4 inline-flex items-center text-white font-medium">
                        Get Started
                        <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900">Trusted by Travelers</h2>
            <p className="text-gray-600 mt-2">Join thousands of visitors exploring Sriperumbudur</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'History Enthusiast', quote: 'The AI recommendations helped me discover hidden gems I would have missed!', avatar: '👩‍🦰' },
              { name: 'Rajesh Kumar', role: 'Business Traveler', quote: 'Perfect for quick trips. The route optimization saved me hours.', avatar: '👨‍💼' },
              { name: 'Anita Patel', role: 'Family Tourist', quote: 'Temple information was accurate and detailed. Great for families.', avatar: '👩‍👧‍👦' },
            ].map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
                className="card-3d p-8"
              >
                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
