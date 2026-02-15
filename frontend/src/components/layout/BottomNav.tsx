import { Link, useLocation } from 'react-router-dom'
import { Home, Map, Compass, Calendar, User } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'

export function BottomNav() {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Map, label: 'Explore' },
    { path: '/recommendations', icon: Compass, label: 'For You' },
    { path: '/itinerary', icon: Calendar, label: 'Plan' },
    { path: isAuthenticated ? '/profile' : '/login', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center py-3 px-4 min-w-[64px] ${
                isActive ? 'text-primary-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[10px] font-medium mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
