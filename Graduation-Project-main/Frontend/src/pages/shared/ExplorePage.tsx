import { useEffect, useMemo, useState } from 'react'
import { Search, MapPin, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { placesApi } from '@/api/places'
import { PlaceCard } from '@/components/shared/PlaceCard'
import { CardSkeleton, EmptyState, Input } from '@/components/ui'
import { getErrorMessage } from '@/api/axios'
import { useToast } from '@/context/ToastContext'
import { cn } from '@/utils/cn'
import type { Place } from '@/types'

const CATEGORIES = ['All', 'Temple', 'Museum', 'Beach', 'Nature', 'Pyramid', 'Monument', 'City', 'Market']

export function ExplorePage() {
  const [places, setPlaces] = useState<Place[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [searchParams, setSearchParams] = useSearchParams()
  const governorate = searchParams.get('governorate') ?? ''
  const { showToast } = useToast()

  useEffect(() => {
    placesApi
      .getAll()
      .then(setPlaces)
      .catch((err) => showToast(getErrorMessage(err), 'error'))
      .finally(() => setIsLoading(false))
  }, [showToast])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    const gov = governorate.trim().toLowerCase()
    return places.filter((p) => {
      if (category !== 'All' && p.type !== category) return false
      if (gov && (p.city ?? '').toLowerCase() !== gov) return false
      if (q && !(`${p.name} ${p.city ?? ''}`.toLowerCase().includes(q))) return false
      return true
    })
  }, [places, search, category, governorate])

  const clearGovernorate = () => {
    const next = new URLSearchParams(searchParams)
    next.delete('governorate')
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="container-app py-8">
      <h1 className="mb-2 text-2xl font-bold">Explore Egypt</h1>
      <p className="mb-6 text-muted">Discover the most amazing landmarks and tourist attractions.</p>

      {governorate && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1.5 text-sm font-semibold text-primary-800 ring-1 ring-primary-200 dark:bg-night-800 dark:text-primary-200 dark:ring-night-700">
          <MapPin className="h-4 w-4" />
          Filtering by {governorate}
          <button type="button" onClick={clearGovernorate} aria-label="Clear governorate filter">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search for a place…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                'whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                category === c
                  ? 'bg-primary-600 text-white shadow-sm shadow-primary-900/30'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-primary-300 dark:border-night-700 dark:bg-night-900 dark:text-slate-300'
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={MapPin} title="No places found" description="Try changing your search filters." />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  )
}
