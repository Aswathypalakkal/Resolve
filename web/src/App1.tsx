import { useEffect, useState } from 'react'
import { NavLink, Outlet, Route, Routes } from 'react-router-dom'
import { api } from './api'
import { Dashboard, Disputes, Detail, Rules } from './pages'

function Layout() {
  const [k, setK] = useState(0)
  const [mode, setMode] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => { api.state().then(s => setMode(s.mode)) }, [k])
  const run = async (f: () => Promise<any>, ok: (r: any) => string) => {
    try { setMsg(ok(await f())); setK(k + 1) } catch (e: any) { setMsg(e.error || 'Something went wrong.') }
  }
  const link = ({ isActive }: any) => `block rounded-lg px-3 py-3 text-sm font-medium ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-white/10'}`
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-none flex-col bg-[#0b1233] p-4">
        <div className="mb-6 flex items-center gap-2 px-2 text-xl font-bold text-white">
          <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" fill="#3b82f6" /><path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" /></svg>
          Resolve
        </div>
        <nav className="space-y-1">
          <NavLink to="/" end className={link}>Dashboard</NavLink>
          <NavLink to="/disputes" className={link}>Disputes</NavLink>
          <NavLink to="/automation" className={link}>Automation</NavLink>
        </nav>
        <div className="mt-auto rounded-lg bg-white/10 p-3 text-xs text-slate-200">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />{mode || 'Connecting'}
          <div className="mt-1 text-slate-400">Sandbox only. No real money.</div>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-8">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          {msg && <span role="status" className="mr-auto text-sm text-slate-600">{msg}</span>}
          <button className="min-h-11 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold" onClick={() => run(api.sync, r => `Imported ${r.imported} dispute(s) from PayPal.`)}>Sync from PayPal</button>
          <button className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white" onClick={() => run(api.auto, () => 'Autopilot handled every case your rules allow.')}>Run autopilot</button>
        </div>
        <Outlet key={k} />
      </main>
    </div>
  )
}
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="disputes" element={<Disputes />} />
        <Route path="disputes/:id" element={<Detail />} />
        <Route path="automation" element={<Rules />} />
      </Route>
    </Routes>
  )
}
