import { create } from 'zustand'

interface ViewState {
  latitude: number
  longitude: number
  zoom: number
}

interface SelectedLocation {
  id: string
  name: string
  latitude: number
  longitude: number
}

interface FilterState {
  categories: string[]
  priceRange: string | null
  rating: number | null
  accessibility: string[]
}

interface MapState {
  viewState: ViewState
  selectedLocation: SelectedLocation | null
  hoveredLocation: string | null
  filters: FilterState
  showFilters: boolean
  isLocating: boolean
  userLocation: { latitude: number; longitude: number } | null
  setViewState: (viewState: Partial<ViewState>) => void
  setSelectedLocation: (location: SelectedLocation | null) => void
  setHoveredLocation: (locationId: string | null) => void
  setFilters: (filters: Partial<FilterState>) => void
  toggleFilter: (type: keyof FilterState, value: string) => void
  clearFilters: () => void
  setShowFilters: (show: boolean) => void
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void
  setIsLocating: (isLocating: boolean) => void
  flyToLocation: (latitude: number, longitude: number, zoom?: number) => void
}

// Sriperumbudur coordinates
const DEFAULT_CENTER = {
  latitude: 12.9675,
  longitude: 79.9410,
  zoom: 13
}

export const useMapStore = create<MapState>((set, get) => ({
  viewState: DEFAULT_CENTER,
  selectedLocation: null,
  hoveredLocation: null,
  filters: {
    categories: [],
    priceRange: null,
    rating: null,
    accessibility: []
  },
  showFilters: false,
  isLocating: false,
  userLocation: null,

  setViewState: (viewState) => set((state) => ({
    viewState: { ...state.viewState, ...viewState }
  })),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setHoveredLocation: (locationId) => set({ hoveredLocation: locationId }),

  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  toggleFilter: (type, value) => set((state) => {
    const current = state.filters[type]
    if (Array.isArray(current)) {
      const exists = current.includes(value)
      return {
        filters: {
          ...state.filters,
          [type]: exists ? current.filter(v => v !== value) : [...current, value]
        }
      }
    }
    return {
      filters: {
        ...state.filters,
        [type]: current === value ? null : value
      }
    }
  }),

  clearFilters: () => set({
    filters: {
      categories: [],
      priceRange: null,
      rating: null,
      accessibility: []
    }
  }),

  setShowFilters: (show) => set({ showFilters: show }),

  setUserLocation: (location) => set({ userLocation: location }),

  setIsLocating: (isLocating) => set({ isLocating }),

  flyToLocation: (latitude, longitude, zoom = 15) => {
    set({
      viewState: { latitude, longitude, zoom },
      selectedLocation: { id: '', name: '', latitude, longitude }
    })
  }
}))
