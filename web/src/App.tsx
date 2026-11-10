import React, { useEffect, useState } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api } from './api'
import { Icon, Logo } from './ui'
import { Login, Dashboard, Disputes, Detail, Submit, Rules, Assistant, Reports, Settings } from './pages'

const NAV: [string, string, string][] = [
  ['/', 'Dashboard', 'home'],
  ['/disputes', 'Disputes', 'shield'],
  ['/automation', 'Automation', 'bolt'],
  ['/reports', 'Reports', 'chart'],
  ['/settings', 'Settings', 'sliders']
]

function Layout({ onOut }: { onOut: () => void }) {
  const [need, setNeed] = useState(12)
  const [q, setQ] = useState('')
  const loc = useLocation()
  const nav = useNavigate()

  useEffect(() => {
    api.state().then((s: any) => {
      if (s?.stats?.open) setNeed(s.stats.open)
    })
  }, [loc.pathname])

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold transition ${
      isActive
        ? 'bg-[#2563eb] text-white shadow-sm'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  return (
    <div className="flex min-h-screen bg-[#f4f7fc]">
      {/* Dark Sidebar matching Mockup exactly */}
      <aside className="hidden w-64 flex-none flex-col bg-[#0b1235] p-5 lg:flex">
        <div className="mb-8 px-2 pt-2">
          <Logo />
        </div>

        <nav className="space-y-1.5">
          {NAV.map(([to, t, i]) => (
            <NavLink key={to} to={to} end={to === '/'} className={linkCls}>
              <Icon n={i} size={18} />
              <span>{t}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Connection Status Badge */}
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/10 p-3.5 text-xs text-white backdrop-blur-xs">
          <span className="relative flex h-2.5 w-2.5 flex-none">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <div>
            <div className="font-bold text-white">PayPal Sandbox</div>
            <div className="text-[11px] font-semibold text-emerald-400">Connected</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="min-w-0 flex-1">
        {/* Mobile top nav */}
        <nav className="flex flex-wrap gap-2 bg-[#0b1235] p-3 lg:hidden">
          {NAV.map(([to, t]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }: any) =>
                `rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  isActive ? 'bg-[#2563eb] text-white' : 'text-slate-300'
                }`
              }
            >
              {t}
            </NavLink>
          ))}
        </nav>

        {/* Top Header */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-slate-200/80 bg-white/95 px-8 py-3.5 backdrop-blur-sm">
          <form
            className="relative max-w-md flex-1"
            role="search"
            onSubmit={e => {
              e.preventDefault()
              nav('/disputes?q=' + encodeURIComponent(q))
            }}
          >
            <Icon n="search" size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              aria-label="Search disputes and orders"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search disputes, orders..."
              className="h-10 w-full rounded-xl bg-slate-100/80 pl-10 pr-4 text-xs font-medium text-slate-700 transition focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </form>

          <div className="ml-auto flex items-center gap-4">
            <Link
              to="/disputes?tab=need"
              aria-label={`${need} disputes need action`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            >
              <Icon n="bell" size={20} />
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
            </Link>

            <button
              onClick={onOut}
              aria-label="Sign out"
              title="Sign out"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#10267a] text-xs font-extrabold text-white shadow-2xs transition hover:opacity-90"
            >
              AP
            </button>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [ok, setOk] = useState(() => localStorage.getItem('resolve-auth') !== '0')
  const set = (v: boolean) => {
    localStorage.setItem('resolve-auth', v ? '1' : '0')
    setOk(v)
  }

  return (
    <Routes>
      <Route path="/login" element={ok ? <Navigate to="/" replace /> : <Login onAuth={() => set(true)} />} />
      <Route element={ok ? <Layout onOut={() => set(false)} /> : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="disputes/:id" element={<Detail />} />
        <Route path="disputes/:id/submit" element={<Submit />} />
        <Route path="automation" element={<Rules />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}
