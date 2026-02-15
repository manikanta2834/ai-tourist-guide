import { useMapStore } from '@/stores/mapStore'

const categories = [
  { id: 'temple', label: 'Temples', icon: '🛕' },
  { id: 'monument', label: 'Monuments', icon: '🏛️' },
  { id: 'museum', label: 'Museums', icon: '🏺' },
  { id: 'industrial', label: 'Industrial', icon: '🏭' },
  { id: 'nature', label: 'Nature', icon: '🌳' },
  { id: 'food', label: 'Food', icon: '🍽️' },
  { id: 'cultural', label: 'Cultural', icon: '🎭' },
]

export function CategoryFilter() {
  const { filters, toggleFilter } = useMapStore()

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = filters.categories.includes(category.id)
        return (
          <button
            key={category.id}
            onClick={() => toggleFilter('categories', category.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        )
      })}
    </div>
  )
}
