'use client'

import { useState, useEffect, useRef } from 'react'
import { validateLocationGeofence, type RouteGeofence } from '@/lib/geofence-utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { cn } from '@/lib/utils'

import {
  MapPin,
  Search,
  CheckCircle2,
  Loader2,
  X,
  AlertCircle,
} from 'lucide-react'

// You'll need to install these:
// npm install leaflet react-leaflet
// npm install -D @types/leaflet

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom colorful markers
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg style="transform: rotate(45deg); margin-top: -8px; margin-left: -2px;" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  })
}

const pickupIcon = createCustomIcon('#3b82f6') // Blue
const dropoffIcon = createCustomIcon('#ef4444') // Red

type Location = {
  lat: number
  lng: number
  address: string
  name?: string
}

type SearchResult = {
  place_id: number
  display_name: string
  lat: string
  lon: string
  name?: string
  address?: {
    road?: string
    suburb?: string
    city?: string
    county?: string
  }
}

// Component to handle map events and update view
function MapController({
  center,
  zoom,
  onMapClick,
}: {
  center: [number, number]
  zoom: number
  onMapClick: (lat: number, lng: number) => void
}) {
  const map = useMap()

  // Update map view when center changes
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 })
  }, [center, zoom, map])

  // Handle map clicks
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng)
    }

    map.on('click', handleClick)
    return () => {
      map.off('click', handleClick)
    }
  }, [map, onMapClick])

  return null
}

type LocationPickerProps = {
  initialLocation?: Location
  onLocationConfirm: (location: Location) => void
  type: 'pickup' | 'dropoff'
  title?: string
  routeGeofence?: RouteGeofence | null // ✅ ADD THIS
}

export default function LocationPicker({
  initialLocation,
  onLocationConfirm,
  type,
  title,
  routeGeofence, // ✅ ADD THIS
}: LocationPickerProps) {
  const [center, setCenter] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [-1.286389, 36.817223] // Nairobi default
  )
  const [zoom, setZoom] = useState(13)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(initialLocation || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ✅ ADD GEOFENCE VALIDATION STATE
  const [geofenceError, setGeofenceError] = useState<string | null>(null)
  const [validationDistance, setValidationDistance] = useState<number | null>(null)

  const markerIcon = type === 'pickup' ? pickupIcon : dropoffIcon

  // Debug log for search results visibility
  useEffect(() => {
    if (showResults && searchResults.length > 0) {
      console.log('Dropdown should be visible with', searchResults.length, 'results')
    }
  }, [showResults, searchResults])

  // Debounced search function
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSearchResults([])
      setShowResults(false)
      setSearchError(null)
      return
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(searchQuery)
    }, 800) // Increased debounce time to reduce API calls

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery])

  const searchLocation = async (query: string) => {
    setIsSearching(true)
    setSearchError(null)

    console.log('Searching for:', query) // Debug log

    try {
      // Using Photon API - most reliable for geocoding
      const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=-1.286389&lon=36.817223&limit=8`
      console.log('Fetching from:', url) // Debug log

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      })

      clearTimeout(timeoutId)

      console.log('Response status:', response.status) // Debug log

      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`)
      }

      const photonData = await response.json()
      console.log('Search results:', photonData) // Debug log

      // Convert Photon format to our format
      const results: SearchResult[] =
        photonData.features?.map((feature: any, index: number) => {
          const props = feature.properties
          const coords = feature.geometry.coordinates

          // Build display name from available properties
          const nameParts = [props.name, props.street, props.city || props.county, 'Kenya'].filter(Boolean)

          return {
            place_id: props.osm_id || index,
            display_name: nameParts.join(', '),
            lat: String(coords[1]),
            lon: String(coords[0]),
            name: props.name || props.street || 'Location',
            address: {
              road: props.street,
              suburb: props.district,
              city: props.city,
              county: props.county,
            },
          }
        }) || []

      console.log('Processed results:', results.length, 'locations') // Debug log

      if (results.length === 0) {
        setSearchError(`No results found for "${query}". Try a different search term like "Westlands" or "Karen".`)
        setSearchResults([])
        setShowResults(false)
      } else {
        console.log('Setting search results and showing dropdown') // Debug log
        // Set results first, then show them
        setSearchResults(results)
        setShowResults(true)
        console.log('Dropdown should now be visible') // Debug log
      }
    } catch (error: any) {
      console.error('Search error:', error)

      if (error.name === 'AbortError') {
        setSearchError('Search is taking too long. Please check your internet connection.')
      } else {
        setSearchError('Search failed. Please try again or click directly on the map.')
      }

      setSearchResults([])
      setShowResults(false)
    } finally {
      setIsSearching(false)
    }
  }

  // ✅ UPDATE handleSearchResultClick WITH GEOFENCE VALIDATION
  const handleSearchResultClick = async (result: SearchResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    // ✅ VALIDATE GEOFENCE FIRST
    if (routeGeofence) {
      const validation = validateLocationGeofence(`${lat},${lng}`, routeGeofence)

      if (!validation.isValid) {
        setGeofenceError(validation.errorMessage)
        setValidationDistance(validation.distance)
        setShowResults(false)
        return // ❌ BLOCK selection if outside geofence
      } else {
        setGeofenceError(null)
        setValidationDistance(validation.distance)
      }
    }

    // Extract a clean name from the result
    const locationName =
      result.name || result.address?.road || result.address?.suburb || result.display_name.split(',')[0]

    // Update map position with zoom
    setCenter([lat, lng])
    setZoom(17) // Zoom in closer when selecting from search

    // Set the location
    setSelectedLocation({
      lat,
      lng,
      address: result.display_name,
      name: locationName,
    })

    // Close search results
    setShowResults(false)
    setSearchQuery('')
    setSearchError(null)
  }

  // ✅ UPDATE handleMapClick WITH GEOFENCE VALIDATION
  const handleMapClick = async (lat: number, lng: number) => {
    setIsReverseGeocoding(true)

    // ✅ VALIDATE GEOFENCE FIRST
    if (routeGeofence) {
      const validation = validateLocationGeofence(`${lat},${lng}`, routeGeofence)

      if (!validation.isValid) {
        setGeofenceError(validation.errorMessage)
        setValidationDistance(validation.distance)
        setIsReverseGeocoding(false)
        return // ❌ BLOCK selection if outside geofence
      } else {
        setGeofenceError(null)
        setValidationDistance(validation.distance)
      }
    }

    // Immediately set the location with coordinates
    setSelectedLocation({
      lat,
      lng,
      address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      name: 'Selected Location',
    })

    // Then fetch the address using Photon reverse geocoding
    try {
      const response = await fetch(`https://photon.komoot.io/reverse?` + `lat=${lat}&` + `lon=${lng}`, {
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }

      const data = await response.json()
      const feature = data.features?.[0]

      if (feature) {
        const props = feature.properties

        // Extract meaningful name
        const locationName = props.name || props.street || props.district || props.city || 'Selected Location'

        const displayName = [props.name, props.street, props.district || props.suburb, props.city, 'Kenya']
          .filter(Boolean)
          .join(', ')

        setSelectedLocation({
          lat,
          lng,
          address: displayName,
          name: locationName,
        })
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      // Keep the coordinates-based location if reverse geocoding fails
    } finally {
      setIsReverseGeocoding(false)
    }
  }

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsReverseGeocoding(true)
      setSearchError(null) // Clear any previous errors

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setCenter([lat, lng])
          setZoom(16)
          handleMapClick(lat, lng)
        },
        (error) => {
          console.error('Geolocation error:', error)
          setIsReverseGeocoding(false)

          // Only show error for non-permission issues
          // Permission denied is expected if user hasn't granted access
          if (error.code !== error.PERMISSION_DENIED) {
            let errorMessage = 'Unable to get your location.'
            if (error.code === error.POSITION_UNAVAILABLE) {
              errorMessage = 'Location information unavailable. Please try searching for your location instead.'
            } else if (error.code === error.TIMEOUT) {
              errorMessage = 'Location request timed out. Please try searching for your location instead.'
            }
            setSearchError(errorMessage)
          }
          // For permission denied, we silently fail since it's expected behavior
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      )
    } else {
      alert('Geolocation is not supported by your browser. Please search for your location instead.')
    }
  }

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationConfirm(selectedLocation)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    setSearchError(null)
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking inside the search container
      const target = e.target as HTMLElement
      if (target.closest('.search-container')) {
        return
      }
      if (showResults) {
        setShowResults(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showResults])

  return (
    <Card className="shadow-2xl border-0 overflow-hidden bg-white/90 backdrop-blur-sm">
      <div
        className={cn(
          'absolute inset-0',
          type === 'pickup'
            ? 'bg-gradient-to-br from-blue-400/10 to-cyan-400/10'
            : 'bg-gradient-to-br from-red-400/10 to-pink-400/10'
        )}
      />

      <CardHeader className="space-y-2 relative z-10">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <div
            className={cn(
              'p-3 rounded-2xl shadow-lg',
              type === 'pickup'
                ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                : 'bg-gradient-to-br from-red-500 to-pink-600'
            )}
          >
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <span
            className={cn(
              'bg-gradient-to-r bg-clip-text text-transparent',
              type === 'pickup' ? 'from-blue-600 to-cyan-600' : 'from-red-600 to-pink-600'
            )}
          >
            {title || (type === 'pickup' ? 'Select Pickup Location' : 'Select Dropoff Location')}
          </span>
        </CardTitle>
        <CardDescription>Click on the map to select a location, or use the search below to find specific places</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Search Bar */}
        <div className="space-y-2" style={{ position: 'relative', overflow: 'visible' }}>
          <Label className="font-semibold flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search for a Location
          </Label>
          <div
            className="relative search-container"
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', overflow: 'visible' }}
          >
            <div className="relative">
              <Input
                type="text"
                placeholder="Try: Westlands, Karen, Kilimani, Brookhouse..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowResults(true)}
                className={cn(
                  'h-12 pl-4 pr-10 border-2 shadow-sm',
                  type === 'pickup' ? 'focus:border-blue-400' : 'focus:border-red-400'
                )}
              />
              {/* Loading indicator for search */}
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                </div>
              )}
              {/* Clear search button */}
              {searchQuery && !isSearching && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Helper text */}
            {searchQuery.length > 0 && searchQuery.length < 3 && !isSearching && (
              <p className="text-xs text-gray-500 mt-1 ml-1">Type at least 3 characters to search...</p>
            )}

            {/* Searching indicator */}
            {isSearching && (
              <p className="text-xs text-blue-600 mt-1 ml-1 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" />
                Searching for "{searchQuery}"...
              </p>
            )}

            {/* Search Error Alert */}
            {searchError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{searchError}</AlertDescription>
              </Alert>
            )}

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div
                className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl max-h-80 overflow-y-auto"
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 9999,
                  marginTop: '8px',
                  display: 'block',
                  border: '4px solid #3b82f6', // Bright blue border to see if it renders
                  backgroundColor: 'white',
                }}
              >
                <div className="p-2 bg-blue-100 border-b-2 border-blue-300">
                  <p className="text-sm font-bold text-blue-900">
                    ✅ {searchResults.length} location{searchResults.length > 1 ? 's' : ''} found - click to zoom
                  </p>
                </div>
                {searchResults.map((result, index) => {
                  const locationName = result.name || result.address?.road || result.display_name.split(',')[0]

                  return (
                    <button
                      key={`${result.place_id}-${index}`}
                      onClick={() => handleSearchResultClick(result)}
                      className="w-full p-4 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors focus:bg-blue-100 focus:outline-none"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn('p-2 rounded-lg flex-shrink-0', type === 'pickup' ? 'bg-blue-100' : 'bg-red-100')}>
                          <MapPin className={cn('w-5 h-5', type === 'pickup' ? 'text-blue-600' : 'text-red-600')} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate mb-1">📍 {locationName}</div>
                          <div className="text-xs text-gray-500 line-clamp-2">{result.display_name}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* ✅ Geofence Error Alert (RIGHT AFTER SEARCH and BEFORE MAP) */}
        {geofenceError && (
          <Alert variant="destructive" className="animate-in slide-in-from-top duration-300">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <div className="font-semibold mb-1">Location Outside Route Area</div>
              <div className="text-sm">{geofenceError}</div>
              {validationDistance && (
                <div className="text-xs mt-1 opacity-90">Please select a location closer to the route corridor.</div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Map */}
        <div className="h-[400px] rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative">
          {isReverseGeocoding && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm font-medium">Getting address...</span>
            </div>
          )}

          {/* Map instructions overlay */}
          {!selectedLocation && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-black/75 text-white px-4 py-2 rounded-full shadow-lg">
              <p className="text-sm font-medium">🔍 Search above or click anywhere on the map</p>
            </div>
          )}

          <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController center={center} zoom={zoom} onMapClick={handleMapClick} />
            {selectedLocation && (
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={markerIcon}>
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <div className="font-bold mb-1 text-sm">{selectedLocation.name}</div>
                    <div className="text-xs text-gray-600 mb-2">{selectedLocation.address}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>

        {/* Selected Location Info (hide if geofence error) */}
        {selectedLocation && !geofenceError && (
          <div
            className={cn(
              'p-4 rounded-xl border-2 shadow-lg animate-in slide-in-from-bottom duration-300',
              type === 'pickup'
                ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn('p-2 rounded-lg flex-shrink-0', type === 'pickup' ? 'bg-blue-100' : 'bg-red-100')}>
                <MapPin className={cn('w-5 h-5', type === 'pickup' ? 'text-blue-600' : 'text-red-600')} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm mb-1">✅ Selected Location:</div>
                <div className="text-sm font-semibold mb-1">{selectedLocation.name}</div>
                <div className="text-xs text-gray-600 mb-2 line-clamp-2">{selectedLocation.address}</div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </Badge>

                  {/* ✅ SHOW DISTANCE IF VALIDATED */}
                  {validationDistance !== null && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                      ✓ {validationDistance.toFixed(1)}km from route
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Button (disable if geofence error exists) */}
        <Button
          onClick={handleConfirm}
          disabled={!selectedLocation || geofenceError !== null}
          className={cn(
            'w-full h-14 shadow-xl text-lg font-bold transform hover:scale-105 transition-all',
            type === 'pickup'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700'
              : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700',
            (!selectedLocation || geofenceError) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Confirm {type === 'pickup' ? 'Pickup' : 'Dropoff'} Location
        </Button>
      </CardContent>
    </Card>
  )
}
