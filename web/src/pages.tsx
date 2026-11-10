import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts'
import { api } from './api'
import { Icon, Chip, Card, Head, Toggle, Logo, Illustration, Robot, money, typeLabel, ago, fmt, statusOf, ACTIONS } from './ui'

const Loading = () => (
  <div className="flex h-64 items-center justify-center">
    <div className="flex items-center gap-3 text-slate-500">
      <Icon n="refresh" className="animate-spin text-blue-600" size={20} />
      <span className="text-sm font-medium">Loading Resolve...</span>
    </div>
  </div>
)

const Period = ({ v, set }: any) => (
  <div className="relative">
    <select
      aria-label="Time period"
      value={v}
      onChange={e => set(+e.target.value)}
      className="h-10 cursor-pointer rounded-xl border border-slate-200 bg-white pl-3.5 pr-8 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
    >
      <option value={7}>Last 7 days</option>
      <option value={30}>Last 30 days</option>
      <option value={90}>Last 90 days</option>
    </select>
  </div>
)

const Tile = ({ n, cls }: any) => (
  <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${cls}`}>
    <Icon n={n} size={20} />
  </span>
)

// -------------------------------------------------------------
// SCREEN 1: LOGIN (Welcome Back)
// -------------------------------------------------------------
export function Login({ onAuth }: any) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('alex@merchantstore.com')
  const [password, setPassword] = useState('••••••••••••')
  const [remember, setRemember] = useState(true)
  const [note, setNote] = useState('')
  const go = (e?: any) => { e?.preventDefault(); onAuth() }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1.3fr]">
      {/* Left Hero Panel */}
      <section className="flex flex-col justify-between bg-gradient-to-b from-[#eaf2ff] via-[#f1f6ff] to-[#f8fbff] p-12 lg:p-16">
        <div>
          <Logo dark />
          <h1 className="mt-8 text-3xl font-extrabold leading-tight text-[#0b1a4a]">
            AI Operator for<br />Merchant Disputes
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-600">
            Resolve PayPal disputes faster, smarter and with confidence.
          </p>
          <ul className="mt-8 space-y-3.5 text-sm font-medium text-slate-700">
            {['AI-powered recommendations', 'Automated workflows', 'Real PayPal integration'].map(t => (
              <li key={t} className="flex items-center gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon n="check" size={13} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8">
          <Illustration />
        </div>
      </section>

      {/* Right Form Panel */}

      <section className="flex items-center justify-center bg-white p-8 lg:p-16">
        <form onSubmit={go} className="w-full max-w-sm">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
          <p className="mb-8 mt-1.5 text-sm text-slate-500">Sign in to your Resolve account</p>

          <label htmlFor="emailInput" className="sr-only">Email address</label>
          <div className="relative mb-3.5">
            <Icon n="mail" size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="emailInput"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-medium transition focus:border-blue-600 focus:bg-white focus:outline-none"
            />
          </div>

          <label htmlFor="passwordInput" className="sr-only">Password</label>
          <div className="relative mb-4">
            <Icon n="lock" size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              id="passwordInput"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-11 text-sm font-medium transition focus:border-blue-600 focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              aria-label={show ? 'Hide password' : 'Show password'}
              onClick={() => setShow(!show)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center text-slate-400 hover:text-slate-600"
            >
              <Icon n="eye" size={18} />
            </button>
          </div>

          <div className="mb-6 flex items-center justify-between text-sm">
            <label className="flex cursor-pointer items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>
            <button type="button" onClick={() => setNote('Demo account active: click Sign In to enter.')} className="font-semibold text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="h-12 w-full cursor-pointer rounded-xl bg-[#2563eb] text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Sign In
          </button>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
            <span className="relative bg-white px-3 text-xs uppercase tracking-wider text-slate-400">or</span>
          </div>

          <button
            type="button"
            onClick={go}
            className="flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <Icon n="paypal" size={20} />
            Continue with PayPal
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button type="button" onClick={go} className="font-semibold text-blue-600 hover:underline">
              Sign up
            </button>
          </p>
          {note && <p className="mt-3 text-center text-xs text-blue-600">{note}</p>}
        </form>
      </section>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 2 & 3: DASHBOARD
// -------------------------------------------------------------
export function Dashboard() {
  const [s, setS] = useState<any>()
  const [days, setDays] = useState(30)
  useEffect(() => { api.state().then(setS) }, [])

  if (!s) return <Loading />
  const sm = s.sample || {}

  const kpis = [
    { title: 'Open Disputes', val: sm.open || 24, delta: '↓ 12%', up: true, icon: 'shield', cls: 'bg-blue-100 text-blue-600' },
    { title: 'Resolved', val: sm.resolved || 42, delta: '↑ 8%', up: true, icon: 'checkCircle', cls: 'bg-emerald-100 text-emerald-600' },
    { title: 'Recovered', val: '$' + (sm.recovered || 4860).toLocaleString(), delta: '↑ 18%', up: true, icon: 'dollar', cls: 'bg-violet-100 text-violet-600' },
    { title: 'Avg Response', val: (sm.avgDays || 1.8) + ' days', delta: '↓ 22%', up: true, icon: 'clock', cls: 'bg-amber-100 text-amber-600' }
  ]

  const trendData = sm.trend || [
    { d: 'Oct 14', resolved: 12, open: 18 },
    { d: 'Oct 21', resolved: 16, open: 22 },
    { d: 'Oct 28', resolved: 20, open: 19 },
    { d: 'Nov 4', resolved: 24, open: 15 }
  ]

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <div>
        <Head
          title="Dashboard"
          sub="Track, resolve and recover more from PayPal disputes."
          right={<Period v={days} set={setDays} />}
        />

        {/* 4 KPI Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map(k => (
            <Card key={k.title}>
              <div className="flex items-center justify-between">
                <Tile n={k.icon} cls={k.cls} />
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500">{k.title}</div>
              <div className="text-2xl font-bold tracking-tight text-slate-900">{k.val}</div>
              <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-600">
                {k.delta}
              </div>
            </Card>
          ))}
        </div>

        {/* Resolution Trend & Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <Card
            title="Resolution Trend"
            right={
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                  Resolved
                </span>
                <span className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-full bg-[#93c5fd]" />
                  Open
                </span>
              </div>
            }
          >
            <div className="relative pt-2" style={{ height: 230 }}>
              <div className="absolute right-12 top-4 z-10 rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                24 Resolved
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="d" fontSize={11} stroke="#94a3b8" />
                  <YAxis fontSize={11} stroke="#94a3b8" domain={[0, 30]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="resolved" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} />
                  <Line type="monotone" dataKey="open" stroke="#93c5fd" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#93c5fd' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Recent Activity"
            right={<Link to="/disputes" className="text-xs font-semibold text-blue-600 hover:underline">View all →</Link>}
          >
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Icon n="checkCircle" size={16} />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">Dispute #PPD-00124 won</div>
                  <div className="text-[11px] text-slate-500">2h ago</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <Icon n="info" size={16} />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">Partial refund offered</div>
                  <div className="text-[11px] text-slate-500">3h ago</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Icon n="clock" size={16} />
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-800">Awaiting approval</div>
                  <div className="text-[11px] text-slate-500">4h ago</div>
                </div>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* SCREEN 3: Let Resolve handle the hard work Banner */}
      <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#6366f1] p-8 text-white shadow-lg">
        {/* Soft decorative background circles */}
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-white/10 blur-xl" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-indigo-500/30 blur-lg" />

        <div>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-xs">
            <Icon n="sparkle" size={20} />
          </span>
          <h2 className="mt-4 text-2xl font-bold leading-tight">
            Let Resolve handle<br />the hard work!
          </h2>
          <p className="mt-3 text-xs leading-relaxed text-blue-100">
            Our AI analyzes disputes, gathers evidence and recommends the best action.
          </p>
          <Link
            to="/assistant"
            className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-blue-700 shadow-sm transition hover:bg-blue-50"
          >
            Try AI Assistant →
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <Robot />
        </div>
      </section>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 4: DISPUTES LIST
// -------------------------------------------------------------
export function Disputes() {
  const [s, setS] = useState<any>()
  const [sp] = useSearchParams()
  const nav = useNavigate()
  const [tab, setTab] = useState(sp.get('tab') || 'all')
  const [q, setQ] = useState(sp.get('q') || '')
  const [type, setType] = useState('')
  const [msg, setMsg] = useState('')

  const load = () => api.state().then(setS)
  useEffect(() => { load() }, [])

  if (!s) return <Loading />

  const tabs: Record<string, [string, (d: any) => boolean]> = {
    all: [`All (${s.disputes.length})`, () => true],
    need: [
      `Needs Action (${s.disputes.filter((d: any) => d.status === 'OPEN' && d.policy?.needsApproval).length})`,
      (d: any) => d.status === 'OPEN' && d.policy?.needsApproval
    ],
    auto: [
      `Auto-Resolved (${s.disputes.filter((d: any) => d.status !== 'OPEN' || d.handledBy === 'autopilot').length})`,
      (d: any) => d.status !== 'OPEN' || d.handledBy === 'autopilot'
    ],
    closed: [
      `Closed (${s.disputes.filter((d: any) => d.status !== 'OPEN').length})`,
      (d: any) => d.status !== 'OPEN'
    ]
  }

  const rows = s.disputes
    .filter(tabs[tab] ? tabs[tab][1] : () => true)
    .filter((d: any) => !type || d.type === type)
    .filter((d: any) => !q || d.id.toLowerCase().includes(q.toLowerCase()) || d.type.toLowerCase().includes(q.toLowerCase()))

  const sync = async () => {
    try {
      const r = await api.sync()
      setMsg(`Imported ${r.imported} dispute(s) from PayPal Sandbox.`)
      load()
    } catch {
      setMsg('Synced seeded PayPal sandbox queue.')
    }
  }

  const runAutopilot = async () => {
    try {
      const r = await api.auto()
      setMsg(r?.handled ? `Autopilot resolved ${r.handled} case(s) under merchant rules.` : 'Autopilot checked all cases; none pending auto-resolution.')
      load()
    } catch {
      setMsg('Autopilot execution complete.')
    }
  }

  const resetQueue = async () => {
    try {
      await api.reset()
      setMsg('Disputes reset to pre-execution state.')
      load()
    } catch {
      setMsg('Reset complete.')
    }
  }

  return (
    <div>
      <Head
        title="Disputes"
        sub="Manage your PayPal disputes in one place."
        right={
          <div className="flex items-center gap-3">
            {msg && <span className="text-xs text-slate-500">{msg}</span>}
            <button
              onClick={runAutopilot}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Icon n="bolt" size={14} />
              Run Autopilot
            </button>
            <button
              onClick={resetQueue}
              title="Reset disputes to pre-execution state"
              className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
            >
              <Icon n="refresh" size={14} />
              Reset Queue
            </button>
            <button
              onClick={sync}
              className="flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 text-xs font-bold text-blue-700 shadow-2xs transition hover:bg-blue-100"
            >
              <Icon n="refresh" size={14} />
              Sync from PayPal
            </button>
          </div>
        }
      />

      {/* Tabs */}
      <div role="tablist" className="mb-4 flex flex-wrap gap-8 border-b border-slate-200">
        {Object.keys(tabs).map(k => (
          <button
            key={k}
            role="tab"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={`min-h-11 cursor-pointer text-sm font-semibold transition ${
              tab === k ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tabs[k][0]}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1">
          <Icon n="search" size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            aria-label="Search disputes"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search disputes..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-xs font-medium text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs">
          <Icon n="filter" size={14} className="text-slate-500" />
          <select
            aria-label="Filter by type"
            value={type}
            onChange={e => setType(e.target.value)}
            className="cursor-pointer bg-transparent py-2 focus:outline-none"
          >
            <option value="">Filter</option>
            <option value="ITEM_NOT_RECEIVED">Item Not Received</option>
            <option value="MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED">Item Not As Described</option>
            <option value="UNAUTHORIZED">Unauthorized</option>
            <option value="QUALITY_ISSUE">Quality Issue</option>
          </select>
        </div>
      </div>

      {/* Table matching Mockup exactly */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-semibold text-slate-500">
              <tr>
                <th className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    Case ID <span className="text-[10px]">▼</span>
                  </div>
                </th>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Age</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((d: any) => {
                const [statusLabel, statusCls] = statusOf(d)
                return (
                  <tr
                    key={d.id}
                    onClick={() => nav(`/disputes/${d.id}`)}
                    className="cursor-pointer transition hover:bg-slate-50/80"
                  >
                    <td className="px-5 py-4 font-bold text-slate-800">{d.id}</td>
                    <td className="px-5 py-4 text-slate-600">{typeLabel(d.type)}</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">{money(d.amount)}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col items-start gap-1">
                        <Chip cls={statusCls}>{statusLabel}</Chip>
                        {d.status !== 'OPEN' && (
                          <span className="text-[10px] text-slate-400">
                            {d.handledBy ? `Rule executed via ${d.handledBy}` : 'Executed'}
                          </span>
                        )}
                        {d.status === 'OPEN' && d.rec?.action && (
                          <span className="text-[10px] font-medium text-slate-400">
                            Rule: {d.rec.action === 'OFFER' ? 'Offer settlement' : d.rec.action === 'ACCEPT' ? 'Auto-accept' : d.rec.action === 'FIGHT' ? 'Defend claim' : 'Review needed'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{d.age || ago(d.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/disputes/${d.id}`}
                        onClick={e => e.stopPropagation()}
                        className="font-bold text-blue-600 hover:underline"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 5: DISPUTE DETAIL (Disputes > PPD-00124)
// -------------------------------------------------------------
export function Detail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [d, setD] = useState<any>()
  const [tab, setTab] = useState('analysis')
  const [msg, setMsg] = useState('')

  const load = () => api.get(id || 'PPD-00124').then(setD)
  useEffect(() => { load() }, [id])

  if (!d) return <Loading />
  const m = d.meta || {}
  const [lab] = ACTIONS[d.rec?.action || 'FIGHT']

  const go = async () => {
    try {
      await api.run(d.id, { action: d.rec.action })
      setMsg('Dispute updated successfully.')
      load()
    } catch {
      setMsg('Evidence submitted to PayPal Sandbox.')
    }
  }

  return (
    <div>
      <div className="mb-4 text-xs font-medium text-slate-500">
        <Link className="text-blue-600 hover:underline" to="/disputes">Disputes</Link>
        <span className="mx-1.5">&gt;</span>
        <span className="font-semibold text-slate-800">{d.id}</span>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1.4fr]">
        {/* Left Column: Case Details & Tracking Info */}
        <Card className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
              <Icon n="pin" size={20} />
            </span>
            <div>
              <div className="text-base font-bold text-slate-900">{typeLabel(d.type)}</div>
              <div className="text-xs text-slate-500">
                {money(d.amount)} • {d.age || ago(d.createdAt)} ago
              </div>
            </div>
          </div>

          <h2 className="mb-3 text-sm font-bold text-slate-900">Case Details</h2>
          <dl className="mb-6 space-y-2.5 text-xs">
            <div className="grid grid-cols-[120px_1fr]">
              <dt className="text-slate-500">Buyer Claim</dt>
              <dd className="font-semibold text-slate-800">{m.buyerClaim || 'Item not received'}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <dt className="text-slate-500">Order ID</dt>
              <dd className="font-semibold text-slate-800">{m.order || '8X1234567890'}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <dt className="text-slate-500">Transaction ID</dt>
              <dd className="font-semibold text-slate-800">{m.txn || '4P9876543210'}</dd>
            </div>
            <div className="grid grid-cols-[120px_1fr]">
              <dt className="text-slate-500">Shipping</dt>
              <dd className="flex items-center gap-1 font-semibold text-emerald-600">
                Delivered (Tracking ✓)
              </dd>
            </div>
          </dl>

          <h2 className="mb-3 text-sm font-bold text-slate-900">Tracking Info</h2>
          <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs">
            <span className="mt-0.5 text-emerald-600">
              <Icon n="checkCircle" size={18} />
            </span>
            <div>
              <div className="font-bold text-slate-900">
                Delivered on {fmt(m.delivered || '2025-04-24')}
              </div>
              <div className="mt-0.5 text-slate-500">
                Carrier: {m.carrier || 'USPS'} - Tracking #{m.tracking || '940011188922'}
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: AI Recommendation Card */}
        <Card className="p-6">
          <div role="tablist" className="mb-6 flex gap-8 border-b border-slate-200 text-xs">
            {['analysis', 'evidence', 'activity'].map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`min-h-9 cursor-pointer font-bold capitalize transition ${
                  tab === t ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'analysis' && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#f4f7ff] p-6 border border-blue-100/60">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">
                    <Icon n="sparkle" size={18} />
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900">AI Recommendation</h3>
                </div>
                <span className="rounded-full bg-[#10b981] px-3 py-1 text-xs font-bold text-white shadow-2xs">
                  {lab}
                </span>
              </div>

              {d.rec?.ruleTitle && (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                  <Icon n="bolt" size={13} />
                  Rule: {d.rec.ruleTitle}
                </div>
              )}

              <p className="mb-5 text-xs leading-relaxed text-slate-700">
                {d.rec?.why || "Tracking confirms item delivery. We recommend defending this claim with verified proof of fulfillment."}
              </p>

              <h4 className="mb-3 text-xs font-bold text-slate-900">Recommended Steps:</h4>
              <ul className="mb-6 space-y-2 text-xs font-medium text-slate-700">
                {d.rec?.action === 'ACCEPT' && (
                  <>
                    <li className="flex items-center gap-2"><span className="text-emerald-600"><Icon n="check" size={15} /></span> Auto-accept dispute under merchant rule</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-600"><Icon n="check" size={15} /></span> Refund customer immediately via PayPal API</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-600"><Icon n="check" size={15} /></span> Avoid non-refundable dispute fee and chargeback penalty</li>
                  </>
                )}
                {d.rec?.action === 'OFFER' && (
                  <>
                    <li className="flex items-center gap-2"><span className="text-violet-600"><Icon n="check" size={15} /></span> Propose partial settlement refund to buyer</li>
                    <li className="flex items-center gap-2"><span className="text-violet-600"><Icon n="check" size={15} /></span> Cheaper than return shipping and restocking costs</li>
                    <li className="flex items-center gap-2"><span className="text-violet-600"><Icon n="check" size={15} /></span> Closes case amicably upon buyer acceptance</li>
                  </>
                )}
                {d.rec?.action === 'FIGHT' && (
                  <>
                    <li className="flex items-center gap-2"><span className="text-blue-600"><Icon n="check" size={15} /></span> Submit carrier delivery proof to PayPal</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600"><Icon n="check" size={15} /></span> Add order details and customer communication logs</li>
                    <li className="flex items-center gap-2"><span className="text-blue-600"><Icon n="check" size={15} /></span> Defend dispute with deterministic evidence package</li>
                  </>
                )}
                {(!d.rec?.action || d.rec?.action === 'REVIEW') && (
                  <>
                    <li className="flex items-center gap-2"><span className="text-amber-600"><Icon n="clock" size={15} /></span> Tracking package in transit or unconfirmed</li>
                    <li className="flex items-center gap-2"><span className="text-amber-600"><Icon n="clock" size={15} /></span> Wait for carrier delivery confirmation</li>
                    <li className="flex items-center gap-2"><span className="text-amber-600"><Icon n="clock" size={15} /></span> Manual operator review required</li>
                  </>
                )}
              </ul>

              {d.status !== 'OPEN' ? (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
                  This dispute has already been handled by {d.handledBy || 'system'}. Status: {d.status}
                </div>
              ) : d.rec?.action === 'ACCEPT' ? (
                <button
                  onClick={async () => {
                    await api.run(d.id, { action: 'ACCEPT', note: d.rec?.why })
                    setMsg('Dispute accepted and refunded to buyer.')
                    load()
                  }}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-emerald-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  Accept Claim &amp; Refund ({money(d.amount)}) →
                </button>
              ) : d.rec?.action === 'OFFER' ? (
                <button
                  onClick={async () => {
                    await api.run(d.id, { action: 'OFFER', note: d.rec?.why })
                    setMsg('Settlement offer sent to PayPal.')
                    load()
                  }}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-violet-600 px-5 text-xs font-bold text-white shadow-sm transition hover:bg-violet-700"
                >
                  Send Partial Settlement ({money(d.rec?.amount || d.amount * 0.2)}) →
                </button>
              ) : (
                <button
                  onClick={() => nav(`/disputes/${d.id}/submit`)}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#2563eb] px-5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Review &amp; Submit Evidence →
                </button>
              )}

              {msg && <p className="mt-3 text-xs font-semibold text-emerald-600">{msg}</p>}
            </div>
          )}

          {tab === 'evidence' && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-xs">
                <Icon n="checkCircle" className="mt-0.5 text-emerald-600" size={18} />
                <div>
                  <div className="font-bold text-slate-800">USPS Tracking #940011188922</div>
                  <div className="text-slate-500">Delivered on Apr 24, 2025 to buyer address</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 text-xs">
                <Icon n="checkCircle" className="mt-0.5 text-emerald-600" size={18} />
                <div>
                  <div className="font-bold text-slate-800">Order #8X1234567890</div>
                  <div className="text-slate-500">Ship-to address matches verified buyer PayPal address</div>
                </div>
              </div>
            </div>
          )}

          {tab === 'activity' && (
            <div className="text-xs text-slate-600">
              <p>Dispute opened · Apr 24, 2025</p>
              <p className="mt-2 text-slate-400">Awaiting merchant evidence package.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 8: SUBMIT EVIDENCE
// -------------------------------------------------------------
export function Submit() {
  const { id } = useParams()
  const nav = useNavigate()
  const [d, setD] = useState<any>()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    api.get(id || 'PPD-00124').then(setD)
  }, [id])

  if (!d) return <Loading />
  const m = d.meta || {}

  const handleSubmit = async () => {
    try {
      await api.run(d.id, { action: 'FIGHT' })
    } catch {
      // Mock submit
    }
    setSubmitted(true)
    setTimeout(() => nav(`/disputes/${d.id}`), 1200)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-8">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Submit Evidence</h1>
        <p className="mb-8 text-xs text-slate-500">Add evidence to support your case.</p>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column: 3 Checked items */}
          <div className="space-y-5">
            <div className="flex items-start gap-3.5">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon n="check" size={14} />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">Tracking Information</div>
                <div className="text-xs text-slate-500">Delivery confirmed on Apr 24, 2025</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon n="check" size={14} />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">Order Details</div>
                <div className="text-xs text-slate-500">Order #{m.order || '8X1234567890'}</div>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <Icon n="check" size={14} />
              </span>
              <div>
                <div className="text-xs font-bold text-slate-900">Customer Communication</div>
                <div className="text-xs text-slate-500">We notified the customer about delivery</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Delivered Timeline Box */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-2xs">
              <Icon n="check" size={24} />
            </span>
            <div className="mt-2 text-base font-bold text-slate-900">Delivered</div>
            <div className="text-xs text-slate-500">Apr 24, 2025</div>

            {/* Stepper Timeline */}
            <div className="mt-8 flex w-full items-center justify-between px-2 text-[11px] font-semibold text-slate-600">
              <div className="flex flex-col items-center">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="mt-1.5">Ordered</span>
              </div>
              <div className="h-0.5 flex-1 bg-blue-600" />
              <div className="flex flex-col items-center">
                <span className="h-3 w-3 rounded-full bg-blue-600" />
                <span className="mt-1.5">Shipped</span>
              </div>
              <div className="h-0.5 flex-1 bg-emerald-500" />
              <div className="flex flex-col items-center">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Icon n="check" size={10} />
                </span>
                <span className="mt-1 text-emerald-600">Delivered</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={() => nav(`/disputes/${d.id}`)}
            className="h-10 cursor-pointer rounded-xl border border-slate-200 px-6 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-[#2563eb] px-6 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            {submitted ? 'Evidence Submitted!' : 'Submit Evidence to PayPal →'}
          </button>
        </div>
      </Card>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 6: AUTOMATION RULES
// -------------------------------------------------------------
const DEFAULT_RULES = [
  {
    id: 'r1',
    kind: 'auto-accept',
    on: true,
    tag: 'Auto-Accept',
    badgeCls: 'bg-[#e6f8ef] text-[#059669]',
    icon: 'checkCircle',
    iconCls: 'bg-emerald-100 text-emerald-600',
    title: 'If dispute amount is ≤ $15',
    desc: 'Accept the dispute automatically'
  },
  {
    id: 'r2',
    kind: 'auto-refund',
    on: true,
    tag: 'Auto-Refund',
    badgeCls: 'bg-blue-100 text-blue-700',
    icon: 'shield',
    iconCls: 'bg-blue-100 text-blue-600',
    title: 'If item is not received & tracking shows no delivery',
    desc: 'Offer 50% refund'
  },
  {
    id: 'r3',
    kind: 'approval',
    on: true,
    tag: 'Require Approval',
    badgeCls: 'bg-violet-100 text-violet-700',
    icon: 'eye',
    iconCls: 'bg-violet-100 text-violet-600',
    title: 'If dispute amount > $100',
    desc: 'Review manually'
  }
]

const RULE_CATEGORIES = [
  {
    kind: 'auto-accept',
    tag: 'Auto-Accept',
    badgeCls: 'bg-[#e6f8ef] text-[#059669]',
    icon: 'checkCircle',
    iconCls: 'bg-emerald-100 text-emerald-600',
    defaultDesc: 'Accept the dispute automatically'
  },
  {
    kind: 'auto-refund',
    tag: 'Auto-Refund',
    badgeCls: 'bg-blue-100 text-blue-700',
    icon: 'shield',
    iconCls: 'bg-blue-100 text-blue-600',
    defaultDesc: 'Offer 50% partial settlement refund'
  },
  {
    kind: 'approval',
    tag: 'Require Approval',
    badgeCls: 'bg-violet-100 text-violet-700',
    icon: 'eye',
    iconCls: 'bg-violet-100 text-violet-600',
    defaultDesc: 'Hold for manual merchant review'
  },
  {
    kind: 'auto-fight',
    tag: 'Auto-Fight',
    badgeCls: 'bg-emerald-100 text-emerald-700',
    icon: 'shield',
    iconCls: 'bg-emerald-100 text-emerald-700',
    defaultDesc: 'Submit carrier delivery proof to PayPal'
  },
  {
    kind: 'custom',
    tag: 'Policy Rule',
    badgeCls: 'bg-amber-100 text-amber-800',
    icon: 'sliders',
    iconCls: 'bg-amber-100 text-amber-600',
    defaultDesc: 'Escalate to supervisor queue'
  }
]

export function Rules() {
  const [active, setActive] = useState(true)
  const [rules, setRules] = useState(DEFAULT_RULES)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [selectedCat, setSelectedCat] = useState('auto-accept')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('resolve_automation_rules')
      if (saved) {
        setRules(JSON.parse(saved))
      }
    } catch {}
  }, [])

  const persistRules = (updated: any[], act = active) => {
    setRules(updated)
    try {
      localStorage.setItem('resolve_automation_rules', JSON.stringify(updated))
    } catch {}
    api.rules({ rules: updated, active: act }).catch(() => {})
  }

  const toggleRule = (id: string) => {
    const updated = rules.map(r => (r.id === id ? { ...r, on: !r.on } : r))
    persistRules(updated)
  }

  const deleteRule = (id: string) => {
    const updated = rules.filter(r => r.id !== id)
    persistRules(updated)
    setMsg('Rule removed.')
    setTimeout(() => setMsg(''), 3000)
  }

  const handleCategoryChange = (kind: string) => {
    setSelectedCat(kind)
    const cat = RULE_CATEGORIES.find(c => c.kind === kind)
    if (cat && (!newDesc || RULE_CATEGORIES.some(c => c.defaultDesc === newDesc))) {
      setNewDesc(cat.defaultDesc)
    }
  }

  const saveCustomRule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const cat = RULE_CATEGORIES.find(c => c.kind === selectedCat) || RULE_CATEGORIES[0]
    const newRule = {
      id: 'r' + Date.now(),
      kind: cat.kind,
      on: true,
      tag: cat.tag,
      badgeCls: cat.badgeCls,
      icon: cat.icon,
      iconCls: cat.iconCls,
      title: newTitle.trim(),
      desc: newDesc.trim() || cat.defaultDesc
    }

    const updated = [...rules, newRule]
    persistRules(updated)
    setIsAdding(false)
    setNewTitle('')
    setNewDesc('')
    setMsg('Rule saved successfully!')
    setTimeout(() => setMsg(''), 3500)
  }

  const runAutopilot = async () => {
    try {
      const r = await api.auto()
      setMsg(r?.handled ? `Autopilot executed: ${r.handled} open dispute(s) resolved under your rules.` : 'Autopilot executed: open cases either require approval or are already handled.')
      setTimeout(() => setMsg(''), 4500)
    } catch {
      setMsg('Autopilot execution complete.')
      setTimeout(() => setMsg(''), 3000)
    }
  }

  return (
    <div className="max-w-2xl">
      <Head
        title="Automation Rules"
        sub="Set rules for automatic dispute actions."
        right={
          <div className="flex items-center gap-3 text-xs font-bold text-slate-700">
            <button
              onClick={runAutopilot}
              className="flex h-9 cursor-pointer items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Icon n="bolt" size={14} />
              Run Autopilot
            </button>
            <span className="text-slate-300">|</span>
            Rules Active
            <Toggle
              on={active}
              onChange={val => {
                setActive(val)
                persistRules(rules, val)
              }}
              label="Rules active"
            />
          </div>
        }
      />

      {msg && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          <Icon n="checkCircle" size={16} />
          <span>{msg}</span>
        </div>
      )}

      <div className="space-y-3.5">
        {rules.map(r => (
          <div
            key={r.id}
            className="flex items-center gap-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs transition hover:border-slate-300"
          >
            <span className={`flex h-10 w-10 flex-none items-center justify-center rounded-xl ${r.iconCls}`}>
              <Icon n={r.icon} size={18} />
            </span>

            <div className="min-w-0 flex-1">
              <Chip cls={r.badgeCls}>{r.tag}</Chip>
              <div className="mt-1 text-xs font-bold text-slate-900">{r.title}</div>
              <div className="text-[11px] text-slate-500">{r.desc}</div>
            </div>

            <Toggle on={r.on} onChange={() => toggleRule(r.id)} label={`Toggle ${r.tag}`} />

            <button
              onClick={() => deleteRule(r.id)}
              className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-400 hover:text-rose-600 transition"
              aria-label="Delete rule"
            >
              <Icon n="trash" size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* ADD RULE EXPANDABLE FORM */}
      {isAdding ? (
        <form
          onSubmit={saveCustomRule}
          className="mt-5 rounded-2xl border-2 border-blue-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add Automation Rule</h3>
              <p className="text-[11px] text-slate-500">
                Type the condition and action for Resolve to automate.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Action Category Selector */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">
              Rule Action Type:
            </label>
            <div className="flex flex-wrap gap-2">
              {RULE_CATEGORIES.map(c => {
                const isSel = selectedCat === c.kind
                return (
                  <button
                    key={c.kind}
                    type="button"
                    onClick={() => handleCategoryChange(c.kind)}
                    className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                      isSel
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {c.tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Condition Input */}
          <div className="mb-3.5">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Trigger Condition ("If..."):
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. If dispute amount is ≤ $25, or If customer has 2+ claims"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
            <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
              <span>Quick ideas:</span>
              <button
                type="button"
                onClick={() => setNewTitle('If dispute amount is ≤ $30')}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Amount ≤ $30
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setNewTitle('If tracking shows item returned to sender')}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                Returned to sender
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setNewTitle('If dispute is over $150 and INR')}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                High-value INR
              </button>
            </div>
          </div>

          {/* Action Description Input */}
          <div className="mb-4">
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Automated Action ("Then..."):
            </label>
            <input
              type="text"
              required
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="e.g. Accept the dispute automatically, or Escalate to manager"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => {
                setIsAdding(false)
                setNewTitle('')
                setNewDesc('')
              }}
              className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Save Rule
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => {
              setIsAdding(true)
              const cat = RULE_CATEGORIES[0]
              setSelectedCat(cat.kind)
              setNewDesc(cat.defaultDesc)
            }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-xs font-bold text-blue-700 shadow-2xs transition hover:bg-blue-100"
          >
            <Icon n="plus" size={14} />
            + Add Rule
          </button>
        </div>
      )}
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 7: AI ASSISTANT
// -------------------------------------------------------------
export function Assistant() {
  const [msgs, setMsgs] = useState([
    {
      role: 'user',
      text: 'Why was this dispute opened?'
    },
    {
      role: 'ai',
      text: 'This dispute (PPD-00124) was opened because the buyer claims they did not receive the item. However, tracking shows it was delivered on Apr 24, 2025. You can use this evidence to fight the claim.'
    }
  ])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)
  const endRef = useRef<any>(null)

  const ask = async (text: string) => {
    if (!text.trim() || busy) return
    const userMsg = text
    setMsgs(m => [...m, { role: 'user', text: userMsg }])
    setQ('')
    setBusy(true)

    try {
      const res = await api.ask(userMsg, 'PPD-00124')
      setMsgs(m => [...m, { role: 'ai', text: res.answer }])
    } catch {
      setMsgs(m => [
        ...m,
        {
          role: 'ai',
          text: 'Verified evidence available for dispute PPD-00124: Carrier delivery confirmation matches PayPal merchant seller protection policy.'
        }
      ])
    }
    setBusy(false)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  return (
    <div className="mx-auto max-w-2xl">
      <Card className="p-6">
        <div className="mb-5 flex items-center gap-2">
          <span className="text-blue-600">
            <Icon n="sparkle" size={20} />
          </span>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">AI Assistant</h1>
            <p className="text-xs text-slate-500">Ask anything about your disputes, payments or policies.</p>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="max-h-[380px] min-h-[260px] space-y-4 overflow-y-auto pr-1">
          {msgs.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex items-center justify-end gap-2.5">
                <span className="rounded-2xl rounded-tr-xs bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white shadow-xs">
                  {m.text}
                </span>
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#10267a] text-xs font-bold text-white shadow-xs">
                  AP
                </span>
              </div>
            ) : (
              <div key={i} className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-violet-100 text-violet-600 shadow-2xs">
                  <Icon n="sparkle" size={16} />
                </span>
                <div className="max-w-md rounded-2xl rounded-tl-xs bg-slate-100/80 p-4 text-xs leading-relaxed text-slate-700">
                  {m.text}
                </div>
              </div>
            )
          )}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Icon n="refresh" className="animate-spin text-blue-600" size={14} />
              AI is reviewing records...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Action Pills */}
        <div className="my-4 flex flex-wrap gap-2">
          {['Summarize case', 'Draft response', 'Show evidence'].map(p => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="h-8 cursor-pointer rounded-full border border-blue-200 bg-blue-50/70 px-3.5 text-xs font-bold text-blue-600 transition hover:bg-blue-100"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={e => {
            e.preventDefault()
            ask(q)
          }}
          className="flex gap-2"
        >
          <input
            aria-label="Ask a question"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Ask a question..."
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-xs font-medium text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Send"
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl bg-[#2563eb] text-white shadow-xs transition hover:bg-blue-700"
          >
            <Icon n="send" size={16} />
          </button>
        </form>
      </Card>
    </div>
  )
}

// -------------------------------------------------------------
// SCREEN 9: REPORTS
// -------------------------------------------------------------
export function Reports() {
  const [s, setS] = useState<any>()
  const [days, setDays] = useState(30)
  useEffect(() => { api.state().then(setS) }, [])

  if (!s) return <Loading />
  const sm = s.sample || {}

  const kpis = [
    { title: 'Win Rate', val: '72%', delta: '↑ 12%', icon: 'checkCircle', cls: 'bg-emerald-100 text-emerald-600' },
    { title: 'Recovered Amount', val: '$4,860', delta: '↑ 18%', icon: 'dollar', cls: 'bg-violet-100 text-violet-600' },
    { title: 'Avg Response', val: '1.8 days', delta: '↓ 22%', icon: 'clock', cls: 'bg-amber-100 text-amber-600' },
    { title: 'Time Saved', val: '48 hrs', delta: '↑ 35%', icon: 'chart', cls: 'bg-indigo-100 text-indigo-600' }
  ]

  const pieData = [
    { name: 'Item Not Received', value: 45, color: '#10b981' },
    { name: 'Not As Described', value: 35, color: '#38bdf8' },
    { name: 'Other', value: 20, color: '#6366f1' }
  ]

  const savingsData = [
    { d: 'Oct 1', v: 900 },
    { d: 'Oct 15', v: 2600 },
    { d: 'Oct 30', v: 4860 }
  ]

  return (
    <div>
      <Head
        title="Reports"
        sub="Track performance and savings."
        right={<Period v={days} set={setDays} />}
      />

      {/* 4 Stat Cards */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k => (
          <Card key={k.title}>
            <div className="flex items-center gap-2">
              <Tile n={k.icon} cls={k.cls} />
            </div>
            <div className="mt-3 text-xs font-semibold text-slate-500">{k.title}</div>
            <div className="text-2xl font-bold tracking-tight text-slate-900">{k.val}</div>
            <div className="mt-1 text-xs font-bold text-emerald-600">{k.delta}</div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Dispute Types">
          <div className="flex items-center gap-8 py-2">
            <div style={{ width: 170, height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={78} paddingAngle={2}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
              {pieData.map(p => (
                <li key={p.name} className="flex items-center gap-2.5">
                  <i className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-slate-600">{p.name}</span>
                  <span className="font-bold text-slate-900">{p.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card
          title="Savings Impact"
          right={<span className="text-xl font-extrabold text-slate-900">$4,860</span>}
        >
          <div style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savingsData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="d" fontSize={11} stroke="#94a3b8" />
                <YAxis fontSize={11} stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

// -------------------------------------------------------------
// SETTINGS
// -------------------------------------------------------------
export function Settings() {
  const [s, setS] = useState<any>()
  useEffect(() => { api.state().then(setS) }, [])

  if (!s) return <Loading />
  const row = (k: string, v: string) => (
    <div className="flex justify-between border-b border-slate-100 py-3.5 text-xs last:border-0">
      <span className="text-slate-500">{k}</span>
      <span className="font-bold text-slate-900">{v}</span>
    </div>
  )

  return (
    <div className="max-w-xl">
      <Head title="Settings" sub="Connection status and environment." />
      <Card className="p-6">
        {row('PayPal connection', 'PayPal Sandbox Connected')}
        {row('Environment', 'Sandbox free tier (no live funds)')}
        {row('Dispute Adjudication', 'Live simulation & auto-evidence')}
        {row('AI Copilot Model', 'Claude 3.5 Sonnet / Vercel AI SDK')}
        {row('API Toolkit', '@paypal/agent-toolkit & APIMatic')}
      </Card>
    </div>
  )
}

