import React from 'react'
import { Link } from 'react-router-dom'

const D: Record<string, string> = {
  home: 'M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  shield: 'M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z',
  bolt: 'M13 2L4 14h7l-1 8 9-12h-7z',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  sliders: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0M16 4v4M10 10v4M18 16v4',
  search: 'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3',
  bell: 'M6 9a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 004 0',
  check: 'M5 12l5 5L20 7',
  checkCircle: 'M22 11.1V12a10 10 0 11-5.9-9.1M22 4L12 14l-3-3',
  sparkle: 'M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14',
  refresh: 'M21 12a9 9 0 11-3-6.7M21 4v5h-5',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  filter: 'M3 5h18l-7 8v6l-4-2v-4z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 100-6 3 3 0 000 6z',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  lock: 'M6 11V8a6 6 0 1112 0v3M5 11h14v10H5z',
  dollar: 'M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  clock: 'M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z',
  pin: 'M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10zM12 11a2 2 0 100-4 2 2 0 000 4z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  plus: 'M12 5v14M5 12h14',
  info: 'M12 16v-4M12 8h0M22 12a10 10 0 11-20 0 10 10 0 0120 0z'
}

export const Icon = ({ n, size = 18, className = '' }: { n: string; size?: number; className?: string }) => {
  if (n === 'google') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={`flex-none ${className}`}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
    )
  }
  if (n === 'paypal') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`flex-none ${className}`}>
        <path d="M7 4h7.5c2.5 0 4.5 1.8 4.5 4.2 0 2.8-2 4.8-4.8 4.8H10.5L9 20H5.5L7 4z" fill="#003087" />
        <path d="M9.5 8h6.5c2.2 0 3.8 1.6 3.8 3.7 0 2.5-1.8 4.3-4.3 4.3h-3.2L11 22H8l1.5-14z" fill="#0079C1" opacity="0.9" />
        <path d="M10.5 13H12c2.5 0 4.3-1.8 4.3-4.3 0-1-.3-1.9-.9-2.6C15 6.7 14.3 7 13.5 7H9.5L8 16h2.5l-.5-3z" fill="#00457C" opacity="0.3" />
      </svg>
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`flex-none ${className}`}>
      <path d={D[n] || D.info} />
    </svg>
  )
}

export const money = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const T: Record<string, string> = {
  ITEM_NOT_RECEIVED: 'Item Not Received',
  MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED: 'Item Not As Described',
  UNAUTHORIZED: 'Unauthorized',
  QUALITY_ISSUE: 'Quality Issue'
}
export const typeLabel = (t: string) => T[t] || t.replace(/_/g, ' ')

export const ago = (iso: string) => {
  const diffHours = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 36e5))
  return diffHours < 24 ? diffHours + 'h' : Math.round(diffHours / 24) + 'd'
}

export const fmt = (iso: string) => {
  if (!iso) return ''
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export const ACTIONS: Record<string, [string, string]> = {
  FIGHT: ['Fight', 'bg-[#10b981] text-white hover:bg-emerald-600'],
  OFFER: ['Offer settlement', 'bg-violet-600 text-white'],
  ACCEPT: ['Accept', 'bg-slate-600 text-white'],
  REVIEW: ['Needs Review', 'bg-amber-500 text-white']
}

export function statusOf(d: any): [string, string] {
  if (d.status === 'SUBMITTED') return ['Evidence Submitted', 'bg-indigo-100 text-indigo-700']
  if (d.status === 'OFFERED') return ['Offer Sent', 'bg-violet-100 text-violet-700']
  if (d.status === 'ACCEPTED') return [d.handledBy === 'autopilot' ? 'Auto-Accepted' : 'Accepted', 'bg-[#e6f8ef] text-[#059669]']
  if (d.status === 'OPEN') {
    if (!d.policy?.needsApproval && d.rec?.action === 'ACCEPT') return ['Auto-Accept Ready', 'bg-[#e6f8ef] text-[#059669]']
    if (!d.policy?.needsApproval && d.rec?.action === 'OFFER') return ['Auto-Refund Ready', 'bg-blue-100 text-blue-700']
    if (d.policy?.needsApproval) return ['Needs Review', 'bg-[#fef3c7] text-[#d97706]']
    return ['AI Recommendation', 'bg-[#e0e7ff] text-[#4f46e5]']
  }
  return ['Open', 'bg-[#ffe4e6] text-[#e11d48]']
}

export const Chip = ({ cls, children }: { cls: string; children: React.ReactNode }) => (
  <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${cls}`}>{children}</span>
)

export const Card = ({ title, right, children, className = '' }: any) => (
  <section className={`rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs ${className}`}>
    {(title || right) && (
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold text-slate-900">{title}</h2>
        {right}
      </div>
    )}
    {children}
  </section>
)

export const Head = ({ title, sub, right }: any) => (
  <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-0.5 text-sm text-slate-500">{sub}</p>
    </div>
    {right}
  </div>
)

export const Toggle = ({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    aria-label={label}
    onClick={() => onChange(!on)}
    className={`relative h-6 w-11 flex-none cursor-pointer rounded-full transition-colors ${on ? 'bg-[#2563eb]' : 'bg-slate-300'}`}
  >
    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
  </button>
)

export const Logo = ({ dark }: { dark?: boolean }) => (
  <Link to="/" className={`inline-flex items-center gap-2.5 text-2xl font-bold tracking-tight ${dark ? 'text-[#0b1a4a]' : 'text-white'}`}>
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-sm">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" fill="#2563eb" />
        <path d="M9 12l2 2 4-4" stroke="#ffffff" strokeWidth="2.5" />
      </svg>
    </div>
    <span>Resolve</span>
  </Link>
)

// High-fidelity illustration for Login Screen matching the uploaded reference
export const Illustration = () => (
  <div className="relative flex w-full max-w-md items-center justify-center py-6">
    <svg viewBox="0 0 380 260" className="w-full drop-shadow-md" fill="none">
      {/* Background soft concentric waves */}
      <circle cx="190" cy="130" r="110" fill="#e0eaff" fillOpacity="0.4" />
      <circle cx="190" cy="130" r="80" fill="#d0e2ff" fillOpacity="0.3" />

      {/* Main Shield on Left */}
      <g transform="translate(45, 60)">
        <path d="M50 8l40 15v35c0 30-18 52-40 60-22-8-40-30-40-60V23L50 8z" fill="#2563eb" />
        <path d="M36 58l10 10 20-22" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Scales of Justice in Center */}
      <g transform="translate(130, 50)">
        {/* Beam and Pole */}
        <line x1="60" y1="20" x2="60" y2="120" stroke="#1d4ed8" strokeWidth="5" strokeLinecap="round" />
        <line x1="35" y1="120" x2="85" y2="120" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" />
        <line x1="15" y1="35" x2="105" y2="35" stroke="#1d4ed8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="60" cy="20" r="6" fill="#1d4ed8" />

        {/* Left Pan */}
        <line x1="20" y1="35" x2="5" y2="75" stroke="#60a5fa" strokeWidth="2" />
        <line x1="20" y1="35" x2="35" y2="75" stroke="#60a5fa" strokeWidth="2" />
        <path d="M0 75c0 14 40 14 40 0H0z" fill="#93c5fd" />

        {/* Right Pan */}
        <line x1="100" y1="35" x2="85" y2="75" stroke="#60a5fa" strokeWidth="2" />
        <line x1="100" y1="35" x2="115" y2="75" stroke="#60a5fa" strokeWidth="2" />
        <path d="M80 75c0 14 40 14 40 0H80z" fill="#93c5fd" />
      </g>

      {/* PayPal Logo with Glow on Right */}
      <g transform="translate(255, 65)">
        <rect x="0" y="10" width="80" height="90" rx="24" fill="#ffffff" stroke="#dbeafe" strokeWidth="2" filter="drop-shadow(0 4px 12px rgba(37,99,235,0.15))" />
        <g transform="translate(20, 22) scale(1.4)">
          <path d="M5 2h5.5c1.8 0 3.2 1.3 3.2 3 0 2-1.4 3.5-3.4 3.5H7.5L6.4 15H4L5 2z" fill="#003087" />
          <path d="M6.8 5h4.7c1.6 0 2.7 1.2 2.7 2.7 0 1.8-1.3 3.1-3.1 3.1H8.8L7.6 17H5.4l1.4-12z" fill="#0079C1" opacity="0.9" />
        </g>
      </g>
    </svg>
  </div>
)

// 3D Friendly Robot mascot matching the uploaded reference exactly
export const Robot = () => (
  <div className="relative flex items-center justify-center">
    <svg viewBox="0 0 180 180" className="w-36 h-36 drop-shadow-xl" fill="none">
      <defs>
        <radialGradient id="robotGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <line x1="90" y1="12" x2="90" y2="34" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <circle cx="90" cy="12" r="7" fill="#38bdf8" />
      <circle cx="90" cy="12" r="11" fill="url(#robotGlow)" />

      {/* Head */}
      <rect x="36" y="32" width="108" height="68" rx="28" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
      
      {/* Visor */}
      <rect x="48" y="44" width="84" height="42" rx="16" fill="#0f172a" />
      
      {/* Eyes with glow */}
      <circle cx="68" cy="62" r="7" fill="#38bdf8" />
      <circle cx="68" cy="60" r="2.5" fill="#ffffff" />
      <circle cx="112" cy="62" r="7" fill="#38bdf8" />
      <circle cx="112" cy="60" r="2.5" fill="#ffffff" />

      {/* Cute Smile */}
      <path d="M84 74c2 3 10 3 12 0" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Ears */}
      <rect x="28" y="52" width="8" height="26" rx="4" fill="#94a3b8" />
      <rect x="144" y="52" width="8" height="26" rx="4" fill="#94a3b8" />

      {/* Body */}
      <rect x="52" y="104" width="76" height="58" rx="22" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />

      {/* PayPal 'P' logo on chest badge */}
      <circle cx="90" cy="130" r="16" fill="#ffffff" stroke="#bfdbfe" strokeWidth="1.5" />
      <g transform="translate(83.5, 122) scale(0.9)">
        <path d="M4 1h4c1.4 0 2.5 1 2.5 2.3 0 1.5-1.1 2.7-2.7 2.7H6l-.8 6H3l1-11z" fill="#003087" />
        <path d="M5.4 3.5h3.6c1.2 0 2.1.9 2.1 2 0 1.3-1 2.4-2.4 2.4h-2l-.9 5.5H4.2l1.2-9.9z" fill="#0079C1" opacity="0.9" />
      </g>

      {/* Arms */}
      <rect x="28" y="114" width="16" height="34" rx="8" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="136" y="114" width="16" height="34" rx="8" fill="url(#bodyGrad)" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  </div>
)
