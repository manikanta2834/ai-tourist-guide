import { Link, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { User, Settings, Heart, MapPin, LogOut } from 'lucide-react'

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium capitalize">
                {user?.role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {[
            { icon: User, label: 'Edit Profile', href: '#' },
            { icon: Heart, label: 'Favorites', href: '/explore' },
            { icon: MapPin, label: 'Visited Places', href: '/explore' },
            { icon: Settings, label: 'Preferences', href: '#' },
          ].map((item, idx) => (
            <Link
              key={item.label}
              to={item.href}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0"
            >
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-4 p-4 text-red-600 hover:bg-red-50"
          >
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
