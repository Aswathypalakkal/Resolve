import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AgGridReact } from 'ag-grid-react'
import type { ColDef } from 'ag-grid-community'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import { api } from './api'

const money = (n: number) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const TYPES: any = { ITEM_NOT_RECEIVED: 'Item not received', MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED: 'Item not as described', UNAUTHORIZED: 'Unauthorized' }
const typeLabel = (t: string) => TYPES[t] || t.replace(/_/g, ' ').toLowerCase()
const ACTIONS: any = { FIGHT: ['Fight', 'bg-emerald-100 text-emerald-800'], OFFER: ['Offer settlement', 'bg-violet-100 text-violet-800'], ACCEPT: ['Accept', 'bg-slate-200 text-slate-800'], REVIEW: ['Manual review', 'bg-amber-100 text-amber-800'] }
function statusOf(d: any): [string, string] {
  if (d.status === 'SUBMITTED') return ['Evidence submitted', 'bg-blue-50 text-blue-700']
  if (d.status === 'ACCEPTED') return ['Accepted', 'bg-slate-100 text-slate-700']
  if (d.status === 'OFFERED') return ['Offer sent', 'bg-violet-50 text-violet-700']
  return d.policy.needsApproval ? ['Needs approval', 'bg-amber-50 text-amber-800'] : ['Auto-eligible', 'bg-emerald-50 text-emerald-800']
}
const Chip = ({ cls, children }: any) => <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>{children}</span>
const Card = ({ title, right, children, className = '' }: any) => (
  <section className={`rounded-2xl border border-slate-200 bg-white p-5 ${className}`}>
    {(title || right) && <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-semibold">{title}</h2>{right}</div>}
    {children}
  </section>
)
const Head = ({ title, sub }: any) => <div className="mb-6"><h1 className="text-2xl font-bold">{title}</h1><p className="text-sm text-slate-600">{sub}</p></div>
const Shield = () => <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="flex-none"><path d="M12 2l8 3v6c0 5-3.4 9-8 11-4.6-2-8-6-8-11V5z" fill="#16a34a" /><path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2" fill="none" /></svg>

export function Dashboard() {
  const [s, setS] = useState<any>()
  useEffect(() => { api.state().then(setS) }, [])
  if (!s) return <p className="text-slate-600">Loading…</p>
  const need = s.disputes.filter((d: any) => d.status === 'OPEN' && d.policy.needsApproval)
  const kpis = [['Open disputes', s.stats.open], ['Handled', s.stats.handled], ['Auto-handled', s.stats.auto], ['Refund cap used', `${money(s.spent)} of $${s.rules.monthlyCap}`]]
  const data = Object.keys(ACTIONS).map(k => ({ name: ACTIONS[k][0], count: s.disputes.filter((d: any) => d.status === 'OPEN' && d.rec.action === k).length }))
  return (
    <div>
      <Head title="Dashboard" sub="Track, resolve and protect revenue from PayPal disputes." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map(([k, v]: any) => <Card key={k}><div className="text-sm text-slate-600">{k}</div><div className="mt-1 text-2xl font-bold">{v}</div></Card>)}
      </div>
      <div className="mb-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="Awaiting your approval" right={<Link className="text-sm font-medium text-blue-700" to="/disputes">View all</Link>}>
          {need.length === 0 ? <p className="text-sm text-slate-600">Nothing needs you right now.</p> :
            <ul className="divide-y divide-slate-100">{need.map((d: any) => (
              <li key={d.id}><Link to={`/disputes/${d.id}`} className="flex items-center justify-between gap-4 py-3">
                <div><div className="text-sm font-semibold">{typeLabel(d.type)} · {money(d.amount)}</div><div className="text-xs text-slate-600">{d.id} · {d.policy.reason}</div></div>
                <Chip cls={ACTIONS[d.rec.action][1]}>{ACTIONS[d.rec.action][0]}</Chip>
              </Link></li>))}</ul>}
        </Card>
        <Card title="Recent activity">
          {s.log.length === 0 ? <p className="text-sm text-slate-600">No actions yet. Run autopilot or approve a case.</p> :
            <ul className="space-y-3">{s.log.map((l: any, i: number) => (
              <li key={i} className="text-sm"><div className="font-medium">{ACTIONS[l.action][0]} · {l.id}</div><div className="text-xs text-slate-600">{new Date(l.at).toLocaleTimeString()} · {l.by} · {l.detail}</div></li>))}</ul>}
        </Card>
      </div>
      <Card title="Open disputes by recommended action">
        <div style={{ height: 220 }}><ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis allowDecimals={false} /><Tooltip /><Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </Card>
    </div>
  )
}

export function Disputes() {
  const [s, setS] = useState<any>(); const [tab, setTab] = useState('all'); const nav = useNavigate()
  useEffect(() => { api.state().then(setS) }, [])
  if (!s) return <p className="text-slate-600">Loading…</p>
  const tabs: any = {
    all: ['All', () => true],
    need: ['Needs approval', (d: any) => d.status === 'OPEN' && d.policy.needsApproval],
    auto: ['Auto-eligible', (d: any) => d.status === 'OPEN' && !d.policy.needsApproval],
    closed: ['Closed', (d: any) => d.status !== 'OPEN'],
  }
  const rows = s.disputes.filter(tabs[tab][1])
  const cols: ColDef[] = [
    { field: 'id', headerName: 'Case ID', minWidth: 190 },
    { field: 'type', headerName: 'Type', valueFormatter: p => typeLabel(p.value), minWidth: 190 },
    { field: 'amount', valueFormatter: p => money(p.value), width: 120 },
    { headerName: 'Status', valueGetter: p => statusOf(p.data)[0], cellRenderer: (p: any) => <Chip cls={statusOf(p.data)[1]}>{p.value}</Chip>, minWidth: 160 },
    { field: 'strength', headerName: 'Evidence strength', valueFormatter: p => `${p.value}/100`, width: 160 },
    { headerName: 'AI recommends', valueGetter: p => ACTIONS[p.data.rec.action][0], minWidth: 160 },
    { field: 'createdAt', headerName: 'Opened', width: 130 },
  ]
  return (
    <div>
      <Head title="Disputes" sub="Manage your PayPal disputes in one place." />
      <div role="tablist" className="mb-4 flex flex-wrap gap-2">
        {Object.keys(tabs).map(k => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`min-h-11 rounded-lg px-4 text-sm font-medium ${tab === k ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'}`}>
            {tabs[k][0]} ({s.disputes.filter(tabs[k][1]).length})
          </button>))}
      </div>
      <Card className="p-0">
        <AgGridReact rowData={rows} columnDefs={cols} domLayout="autoHeight" pagination paginationPageSize={10} paginationPageSizeSelector={[10, 25]} rowStyle={{ cursor: 'pointer' }} onRowClicked={e => nav(`/disputes/${e.data.id}`)} />
      </Card>
    </div>
  )
}

export function Detail() {
  const { id } = useParams(); const [d, setD] = useState<any>(); const [dr, setDr] = useState<any>(); const [tab, setTab] = useState('analysis'); const [msg, setMsg] = useState('')
  const load = () => api.get(id!).then(setD)
  useEffect(() => { load() }, [id])
  if (!d) return <p className="text-slate-600">Loading…</p>
  const r = d.rec, open = d.status === 'OPEN', [lab, cls] = ACTIONS[r.action]
  const review = async () => { setTab('evidence'); if (!dr) setDr(await api.draft(d.id)) }
  const submit = async () => {
    try { await api.run(d.id, { action: r.action, note: dr ? dr.paragraphs.map((p: any) => p.text).join(' ') : '' }); setMsg('Submitted.'); load() }
    catch (e: any) { setMsg(e.error || 'Could not submit. Try again.') }
  }
  const btn = 'min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white disabled:opacity-50'
  return (
    <div>
      <div className="mb-4 text-sm"><Link className="text-blue-700" to="/disputes">Disputes</Link> <span className="text-slate-500">/ {d.id}</span></div>
      <div className="grid gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-2">
          <div className="mb-4"><h1 className="text-lg font-bold">{typeLabel(d.type)}</h1><div className="text-sm text-slate-600">{money(d.amount)} · opened {d.createdAt}</div></div>
          <h2 className="mb-2 text-sm font-semibold">Case details</h2>
          <dl className="mb-4 grid grid-cols-2 gap-y-2 text-sm"><dt className="text-slate-600">Case ID</dt><dd>{d.id}</dd><dt className="text-slate-600">Status</dt><dd>{statusOf(d)[0]}</dd><dt className="text-slate-600">Evidence strength</dt><dd>{d.strength}/100</dd></dl>
          <h2 className="mb-2 text-sm font-semibold">Records on file</h2>
          <ul className="space-y-2 text-sm">{d.records.map((x: any) => <li key={x.id} className="rounded-lg bg-slate-50 p-2"><span className="font-medium">{x.id}</span><div className="text-slate-600">{x.text}</div></li>)}</ul>
        </Card>
        <Card className="xl:col-span-3">
          <div role="tablist" className="mb-4 flex gap-2 border-b border-slate-200">
            {['analysis', 'evidence'].map(t => <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`min-h-11 px-4 text-sm font-medium capitalize ${tab === t ? 'border-b-2 border-blue-600 text-blue-700' : 'text-slate-600'}`}>{t}</button>)}
          </div>
          {tab === 'analysis' ? (
            <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-indigo-50 to-violet-100 p-5">
              <div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">AI recommendation</h2><Chip cls={cls}>{lab}</Chip></div>
              <p className="mb-4 text-sm">{r.why}</p>
              <div className="mb-1 text-xs font-medium text-slate-700">Evidence strength {d.strength}/100 (checklist score)</div>
              <div className="mb-4 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-blue-600" style={{ width: d.strength + '%' }} /></div>
              <p className="mb-4 text-sm"><b>{d.policy.needsApproval ? 'Needs your approval.' : 'Allowed to run automatically.'}</b> {d.policy.reason}</p>
              {!open ? <p className="text-sm font-semibold">Handled: {statusOf(d)[0]} by {d.handledBy}.</p>
                : r.action === 'FIGHT' ? <button className={btn} onClick={review}>Review and submit evidence</button>
                : r.action === 'OFFER' ? <button className={btn} onClick={submit}>Approve and send {money(r.amount)} offer</button>
                : r.action === 'ACCEPT' ? <button className={btn} onClick={submit}>Approve and accept claim</button>
                : <p className="text-sm">Review this case manually in PayPal.</p>}
              {msg && <p role="status" className="mt-3 text-sm">{msg}</p>}
            </div>
          ) : (
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3"><h2 className="font-semibold">Evidence audit</h2><Chip cls="bg-emerald-100 text-emerald-800">Every claim is linked to a source record</Chip></div>
              {d.evidence.length === 0 ? <p className="text-sm text-slate-600">No verified evidence on file for this case.</p> :
                <ul className="mb-5 space-y-3">{d.evidence.map((e: any) => (
                  <li key={e.sourceId} className="flex gap-3 rounded-lg border border-slate-200 p-3 text-sm"><Shield />
                    <div><div>{e.rec.text}</div><div className="mt-1 text-xs font-medium text-emerald-800">Verified · {e.rec.source === 'paypal' ? 'PayPal' : 'Demo data'} · {e.sourceId}</div></div></li>))}</ul>}
              <h3 className="mb-2 text-sm font-semibold">Drafted response</h3>
              {!dr ? <button className="min-h-11 rounded-lg border border-slate-300 px-4 text-sm font-semibold" onClick={async () => setDr(await api.draft(d.id))}>Draft response</button> : (
                <div className="space-y-2 text-sm">
                  {dr.paragraphs.map((p: any, i: number) => <p key={i} className="rounded-lg bg-slate-50 p-3">{p.text} {p.cites.map((c: string) => <Chip key={c} cls="bg-emerald-50 text-emerald-800">{c}</Chip>)}</p>)}
                  <p className="text-xs text-slate-600">{dr.ai ? 'Written by AI, then checked against the cited records.' : 'Built directly from the records.'} {dr.note}</p>
                  {open && r.action === 'FIGHT' && <button className={btn} onClick={submit}>Approve and submit to PayPal</button>}
                </div>)}
              {msg && <p role="status" className="mt-3 text-sm">{msg}</p>}
            </div>)}
        </Card>
      </div>
    </div>
  )
}

export function Rules() {
  const [s, setS] = useState<any>(); const [r, setR] = useState<any>(); const [msg, setMsg] = useState('')
  useEffect(() => { api.state().then(x => { setS(x); setR(x.rules) }) }, [])
  if (!s || !r) return <p className="text-slate-600">Loading…</p>
  const F = ({ k, pre, label, suffix }: any) => (
    <label className="flex flex-wrap items-center gap-2 text-sm">{pre}
      <input aria-label={label} type="number" min={0} className="min-h-11 w-24 rounded-lg border border-slate-300 px-3" value={r[k]} onChange={e => setR({ ...r, [k]: +e.target.value })} />{suffix}</label>)
  const save = async () => { await api.rules(r); setMsg('Rules saved.') }
  return (
    <div>
      <Head title="Automation rules" sub="Set what Resolve may do on its own. Everything else waits for you." />
      <div className="max-w-2xl space-y-4">
        <Card title="Auto-accept"><F k="autoAcceptUnder" label="Auto-accept limit in dollars" pre="If the dispute amount is at or below $" suffix="accept it automatically." /></Card>
        <Card title="Require approval"><F k="requireApprovalOver" label="Approval threshold in dollars" pre="If the dispute amount is above $" suffix="review it manually." /></Card>
        <Card title="Evidence strength"><F k="minStrength" label="Minimum evidence strength" pre="Ask me before fighting when evidence strength is below" suffix="out of 100." /></Card>
        <Card title="Monthly refund cap">
          <F k="monthlyCap" label="Monthly cap in dollars" pre="Stop automatic refunds and offers after $" suffix="this month." />
          <div className="mt-3 text-xs text-slate-600">Used so far: {money(s.spent)}</div>
          <div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-600" style={{ width: Math.min(100, (s.spent / (r.monthlyCap || 1)) * 100) + '%' }} /></div>
        </Card>
        <div className="flex items-center gap-3"><button className="min-h-11 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white" onClick={save}>Save rules</button>{msg && <span role="status" className="text-sm">{msg}</span>}</div>
      </div>
    </div>
  )
}
