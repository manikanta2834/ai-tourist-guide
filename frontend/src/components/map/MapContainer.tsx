import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapStore } from '@/stores/mapStore'

// Set your Mapbox token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja2h0bXJ4bTgwMnp5MnJzMTVzZ3N3Z3Z6In0.example'

interface MapContainerProps {
  locations?: Array<{
    _id: string
    name: string
    location: { coordinates: [number, number] }
    category: string
    rating?: number
  }>
  onMarkerClick?: (locationId: string) => void
}

const categoryColors: Record<string, string> = {
  temple: '#DC143C',
  monument: '#8B4513',
  museum: '#4169E1',
  industrial: '#4682B4',
  nature: '#228B22',
  cultural: '#9932CC',
  food: '#FF8C00',
  shopping: '#FF1493',
}

export function MapContainer({ locations = [], onMarkerClick }: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const { viewState, setViewState, selectedLocation } = useMapStore()
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [viewState.longitude, viewState.latitude],
      zoom: viewState.zoom,
    })

    map.current.on('load', () => {
      setIsMapLoaded(true)

      // Add navigation control
      map.current?.addControl(new mapboxgl.NavigationControl(), 'bottom-right')

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserHeading: true,
      })
      map.current?.addControl(geolocate, 'bottom-right')
    })

    // Update store on move
    map.current.on('move', () => {
      const center = map.current?.getCenter()
      const zoom = map.current?.getZoom()
      if (center) {
        setViewState({
          latitude: center.lat,
          longitude: center.lng,
          zoom: zoom || 13,
        })
      }
    })

    return () => {
      markers.current.forEach((marker) => marker.remove())
      map.current?.remove()
      map.current = null
    }
  }, [])

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Add new markers
    locations.forEach((location) => {
      const [lng, lat] = location.location.coordinates
      const color = categoryColors[location.category] || '#666'

      const el = document.createElement('div')
      el.className = 'custom-marker'
      el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      `

      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${location.name}</h3>
              <p class="text-xs text-gray-600 capitalize">${location.category}</p>
              ${location.rating ? `<div class="flex items-center mt-1">
                <span class="text-amber-500">&#9733;</span>
                <span class="text-xs ml-1">${location.rating.toFixed(1)}</span>
              </div>` : ''}
            </div>
          `)
        )
        .addTo(map.current)

      marker.getElement().addEventListener('click', () => {
        onMarkerClick?.(location._id)
      })

      markers.current.push(marker)
    })
  }, [locations, isMapLoaded, onMarkerClick])

  // Fly to selected location
  useEffect(() => {
    if (selectedLocation && map.current) {
      map.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 15,
        duration: 1500,
      })
    }
  }, [selectedLocation])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 rounded-xl" />
      {!isMapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
          <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  )
}
