import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Compass,
  Globe,
  Heart,
  MapPin,
  Shield,
  Sparkles,
  Star,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button, GridSkeleton } from '@/components/ui'
import { useAuth } from '@/context/AuthContext'
import { placesApi } from '@/api/places'
import { PlaceCard } from '@/components/shared/PlaceCard'
import { getErrorMessage } from '@/api/axios'
import { useToast } from '@/context/ToastContext'
import type { Place } from '@/types'

const HERO_VIDEO = '/assets/vid.mp4'
const HERO_POSTER =
  'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1600&q=80'

type Gov = { name: string; tagline: string; image: string }
const GOVERNORATES: Gov[] = [
  { name: 'Cairo',           tagline: 'City of a Thousand Minarets',    image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=600&q=75' },
  { name: 'Giza',            tagline: 'Home of the Great Pyramids',      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=600&q=75' },
  { name: 'Luxor',           tagline: "World's Greatest Open-Air Museum",image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?auto=format&fit=crop&w=600&q=75' },
  { name: 'Aswan',           tagline: 'The Nubian Heart of Egypt',       image: 'https://images.unsplash.com/photo-1626100134240-0d8b6d3a5b8d?auto=format&fit=crop&w=600&q=75' },
  { name: 'Alexandria',      tagline: 'Pearl of the Mediterranean',      image: 'https://images.unsplash.com/photo-1601469089893-7a3fcfd99c50?auto=format&fit=crop&w=600&q=75' },
  { name: 'Hurghada',        tagline: 'Red Sea Coral Paradise',          image: 'https://images.unsplash.com/photo-1606046604972-77cc76aee944?auto=format&fit=crop&w=600&q=75' },
  { name: 'Sharm El Sheikh', tagline: 'Gateway to the Sinai',            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=75' },
  { name: 'Dahab',           tagline: "Diver's Utopia",                  image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=75' },
]

const FEATURES = [
  { icon: Sparkles, title: 'AI Trip Planning',   desc: 'Personalized day-by-day itineraries built around your budget and interests in seconds.' },
  { icon: Users,    title: 'Verified Guides',    desc: 'Hand-vetted local experts with deep knowledge and a proven 5-star track record.' },
  { icon: Shield,   title: 'Secure Booking',     desc: 'End-to-end payment protection and full quality guarantee on every reservation.' },
  { icon: Star,     title: 'Honest Reviews',     desc: 'Authentic traveler feedback — so you always know exactly what to expect.' },
]

const STATS = [
  { v: '120+', l: 'Local Guides'   },
  { v: '50+',  l: 'Heritage Sites' },
  { v: '4.9★', l: 'Avg Rating'     },
]

export function LandingPage() {
  const { isAuthenticated, hasRole } = useAuth()
  const [places, setPlaces]           = useState<Place[]>([])
  const [loading, setLoading]         = useState(true)
  const { showToast }                  = useToast()

  useEffect(() => {
    placesApi.getAll()
      .then(setPlaces)
      .catch((e) => showToast(getErrorMessage(e), 'error'))
      .finally(() => setLoading(false))
  }, [showToast])

  const picks = useMemo(() => {
    const rated = [...places]
      .filter((p) => (p.averageRate ?? 0) > 0)
      .sort((a, b) => (b.averageRate ?? 0) - (a.averageRate ?? 0))
      .slice(0, 8)
    return rated.length ? rated : places.slice(0, 8)
  }, [places])

  return (
    <div style={{ background: 'var(--bg-canvas)' }}>

      {/* ┌──────────────────────────────────────────────────────────────┐
          │  HERO — contained card with visible left/right margins       │
          │  Video fills the CARD, NOT the full viewport.                │
          └──────────────────────────────────────────────────────────────┘ */}
      <div className="w-full px-3 sm:px-5 lg:px-8 pt-4 sm:pt-6 pb-1">
        <div
          className="relative w-full overflow-hidden"
          style={{
            borderRadius: '1.75rem',
            minHeight: 'clamp(360px, 52vh, 560px)',
            boxShadow: '0 24px 80px -16px rgba(0,0,0,0.60), 0 0 0 1px rgba(255,255,255,0.06) inset',
          }}
        >
          {/* Video — fills the CARD, not the screen */}
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay loop muted playsInline preload="metadata"
            poster={HERO_POSTER} aria-hidden
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>

          {/* Gradient — heavy on left (readable text), fades to transparent right (video shows) */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(105deg, rgba(6,9,20,0.92) 0%, rgba(6,9,20,0.62) 45%, rgba(6,9,20,0.12) 100%)' }}
          />

          {/* Pharaonic gold shimmer at card bottom */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] animate-gold-pulse"
            style={{ background: 'linear-gradient(90deg, transparent, #F59E0B 50%, transparent)' }}
          />

          {/* ── Content ── */}
          <div
            className="relative z-10 flex flex-col justify-center px-7 py-10 sm:px-12 sm:py-12 lg:px-20 lg:py-14"
            style={{ minHeight: 'clamp(360px, 52vh, 560px)' }}
          >
            <div className="max-w-[560px] animate-fade-in">

              {/* Identity badge */}
              <div
                className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase backdrop-blur-sm"
                style={{
                  letterSpacing: '0.18em',
                  border: '1px solid rgba(245,158,11,0.35)',
                  background: 'rgba(245,158,11,0.12)',
                  color: '#FCD34D',
                }}
              >
                <span aria-hidden>🇪🇬</span> Premium Egyptian Tourism
              </div>

              {/* Headline */}
              <h1
                className="font-black text-white"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.03, letterSpacing: '-0.02em' }}
              >
                Discover the<br />
                Land of{' '}
                <span className="text-gradient-gold">Pharaohs</span>
              </h1>

              {/* Gold divider */}
              <div className="my-5 flex items-center gap-3">
                <div style={{ height: 1, width: 72, background: 'linear-gradient(90deg,#F59E0B,transparent)' }} />
                <span className="select-none text-base" style={{ color: '#F59E0B' }} aria-hidden>𓂀</span>
                <div style={{ height: 1, width: 36, background: 'linear-gradient(270deg,#F59E0B,transparent)' }} />
              </div>

              <p className="max-w-md text-base leading-relaxed sm:text-lg" style={{ color: 'rgba(255,255,255,0.80)' }}>
                AI-powered itineraries, verified local guides, and unforgettable
                experiences — from Cairo's pyramids to Aswan's Nile sunsets.
              </p>

              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                {isAuthenticated && hasRole('Tourist') ? (
                  <Link to="/plans/create">
                    <Button size="lg" className="bg-gold-500 font-bold text-slate-900 shadow-lg shadow-gold-500/35 ring-2 ring-gold-400/30 hover:bg-gold-400">
                      <Sparkles className="h-5 w-5" /> Plan with AI
                    </Button>
                  </Link>
                ) : (
                  <Link to="/register">
                    <Button size="lg" className="bg-gold-500 font-bold text-slate-900 shadow-lg shadow-gold-500/35 ring-2 ring-gold-400/30 hover:bg-gold-400">
                      Start Your Journey <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link to="/explore">
                  <Button
                    size="lg" variant="outline"
                    className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-white/60 hover:bg-white/15"
                  >
                    Explore Places
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <dl className="mt-9 grid grid-cols-3 gap-4" style={{ maxWidth: 340 }}>
                {STATS.map((s) => (
                  <div key={s.l}>
                    <dt className="font-black" style={{ fontSize: 'clamp(1.5rem,3vw,2rem)', color: '#F59E0B' }}>{s.v}</dt>
                    <dd className="mt-0.5 text-[10px] font-semibold uppercase" style={{ letterSpacing: '0.16em', color: 'rgba(255,255,255,0.52)' }}>{s.l}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* ── TOP RATED ─────────────────────────────────────────────────────── */}
      <section className="container-app section-py">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="section-label text-primary-600 dark:text-primary-400">Travelers' Favorites</p>
            <h2 className="mt-1">Top Rated Destinations</h2>
            <div className="gold-rule mt-2 w-16" />
          </div>
          <Link to="/explore" className="hidden sm:block">
            <Button variant="ghost" className="gap-1.5">See all <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {picks.map((p) => <PlaceCard key={p.id} place={p} />)}
          </div>
        )}
      </section>

      {/* ── GOVERNORATES ──────────────────────────────────────────────────── */}
      <section className="bg-sand-50/70 section-py dark:bg-night-900/50">
        <div className="container-app">
          <div className="mb-8 text-center">
            <p className="section-label text-primary-600 dark:text-primary-400">Across the Nation</p>
            <h2 className="mt-1">Explore by Governorate</h2>
            <div className="gold-rule mx-auto mt-2 w-16" />
            <p className="mx-auto mt-3 max-w-lg text-muted">
              From the Pyramids of Giza to the temples of Luxor — every Egyptian city holds a different wonder.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {GOVERNORATES.map((g) => (
              <Link
                key={g.name}
                to={`/explore?governorate=${encodeURIComponent(g.name)}`}
                className="card-lift group relative overflow-hidden rounded-2xl ring-1 ring-sand-200 dark:ring-night-700 hover:ring-gold-400/50"
                style={{ '--hover-shadow': '0 12px 40px -12px rgba(245,158,11,0.22)' } as React.CSSProperties}
              >
                <div className="aspect-[4/5]">
                  <img
                    src={g.image} alt={g.name} loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/92 via-slate-950/20 to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="absolute inset-x-3 bottom-3 text-white">
                  <p className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-gold-300">
                    <MapPin className="h-3 w-3" /> Governorate
                  </p>
                  <h3 className="text-lg font-black leading-tight">{g.name}</h3>
                  <p className="mt-0.5 line-clamp-1 text-[11px]" style={{ color: 'rgba(255,255,255,0.62)' }}>{g.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ATHER ─────────────────────────────────────────────────────── */}
      <section className="container-app section-py">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="section-label text-primary-600 dark:text-primary-400">Why Ather</p>
          <h2 className="mt-1">Travel Smarter, Not Harder</h2>
          <div className="gold-rule mx-auto mt-2 w-16" />
          <p className="mt-3 text-muted">Everything you need to plan, book, and enjoy a flawless trip across Egypt.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card-lift group relative overflow-hidden rounded-2xl border border-sand-100 bg-white p-6 shadow-[var(--shadow-sm)] hover:border-gold-200/80 dark:border-night-700 dark:bg-night-800 dark:hover:border-gold-400/25"
            >
              <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-700 group-hover:text-white dark:bg-night-700 dark:text-primary-300 dark:group-hover:bg-primary-600">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-black text-[var(--text-primary)]">{title}</h3>
              <p className="text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── GUIDE CTA ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 text-white" style={{ background: 'var(--color-primary-950)' }}>
        <div
          aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 78% 50%,rgba(14,165,233,.22) 0%,transparent 58%),radial-gradient(ellipse at 16% 85%,rgba(245,158,11,.14) 0%,transparent 52%)' }}
        />
        <div className="container-app relative text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-gold-400" style={{ background: 'rgba(7,89,133,.6)', boxShadow: '0 0 0 1px rgba(245,158,11,.25)' }}>
            <Compass className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-black text-white sm:text-4xl">Are You a Tour Guide?</h2>
          <div className="gold-rule mx-auto mt-3 w-24" />
          <p className="mx-auto mt-4 max-w-lg leading-relaxed" style={{ color: 'rgba(203,213,225,0.9)' }}>
            Join the Ather network and connect with thousands of travelers from around
            the world who are ready to explore Egypt with a trusted guide by their side.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button variant="outline" className="border-gold-400/45 text-gold-300 hover:border-gold-400 hover:bg-gold-400/10">
              Join as a Guide <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────────────────── */}
      <section className="border-t border-sand-100 bg-white py-8 dark:border-night-800 dark:bg-night-900">
        <div className="container-app flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs font-bold uppercase tracking-widest text-muted">
          <span className="inline-flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Trusted by Travelers</span>
          <span className="inline-flex items-center gap-2"><Globe className="h-4 w-4 text-primary-600" /> 30+ Languages</span>
          <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-emerald-600" /> Verified Guides</span>
        </div>
      </section>
    </div>
  )
}
