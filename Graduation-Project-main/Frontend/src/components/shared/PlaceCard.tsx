import { Link } from 'react-router-dom'
import { MapPin, Star, Ticket } from 'lucide-react'
import { Badge, Card } from '@/components/ui'
import { absoluteMediaUrl } from '@/utils/media'
import { formatCurrency } from '@/utils/format'
import type { Place } from '@/types'

interface PlaceCardProps {
  place: Place & { averageRate?: number | null; rating?: number | null }
}

function pickRating(p: PlaceCardProps['place']): number | null {
  const raw = p.averageRate ?? p.rating
  if (raw === null || raw === undefined) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

export function PlaceCard({ place }: PlaceCardProps) {
  const rating = pickRating(place)
  const image = absoluteMediaUrl(place.mainImageUrl) || 'https://placehold.co/600x400?text=No+Image'

  // Defensive: never link to /explore/undefined which would collapse all cards to one page.
  if (!place.id) {
    return null
  }

  return (
    <Link to={`/explore/${place.id}`} aria-label={`Open details for ${place.name}`}>
      <Card hover padding="none" className="group overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={place.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=No+Image'
            }}
          />
          {/* Bottom gradient for legibility */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent" />

          {/* Top-left rating chip — actual avgRate when present, otherwise 'New'. */}
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-[var(--accent)] px-2.5 py-1 text-xs font-bold text-[var(--text-on-accent)] shadow-[var(--shadow-sm)] backdrop-blur">
            {rating !== null ? (
              <>
                <Star className="h-3.5 w-3.5 fill-current" />
                {rating.toFixed(1)}
              </>
            ) : (
              <>
                <Star className="h-3.5 w-3.5" />
                New
              </>
            )}
          </div>

          {/* Bottom-right price chip — neutral glass on dark gradient */}
          <div className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-[var(--radius-pill)] bg-white/95 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-[var(--shadow-sm)] backdrop-blur">
            <Ticket className="h-3.5 w-3.5" />
            {place.ticketPrice > 0 ? formatCurrency(place.ticketPrice) : 'Free'}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 font-bold text-[var(--text-primary)] transition-colors group-hover:text-[var(--brand)]">
              {place.name}
            </h3>
            <Badge variant="primary">{place.type || 'Attraction'}</Badge>
          </div>
          <div className="mt-2 flex items-center gap-3 text-sm text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {place.city || 'Egypt'}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
