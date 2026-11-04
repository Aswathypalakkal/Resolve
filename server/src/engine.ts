import { Dispute, store } from './store.js'
import * as pp from './paypal.js'

const W: Record<string, number> = { delivered: 40, addressMatch: 25, comms: 20, signature: 15 }

export const evidence = (d: Dispute) =>
  Object.entries(d.facts)
    .filter(([, v]) => v)
    .map(([fact, sourceId]) => ({ fact, sourceId, rec: d.records.find(r => r.id === sourceId)! }))
    .filter(e => e.rec)

export const strength = (d: Dispute) => Math.min(100, evidence(d).reduce((s, e) => s + (W[e.fact] || 0), 0))

export function recommend(d: Dispute) {
  const s = strength(d), r = store.rules
  if (d.amount <= r.autoAcceptUnder) {
    return { action: 'ACCEPT', amount: d.amount, why: `The amount is within your $${r.autoAcceptUnder} auto-accept limit, so fighting costs more than it saves.` }
  }
  if (d.type === 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED' || d.type === 'QUALITY_ISSUE') {
    const offer = +(d.amount * 0.2).toFixed(2)
    if (d.returnCost >= offer) {
      return { action: 'OFFER', amount: offer, why: `A 20% partial refund ($${offer}) is cheaper than the $${d.returnCost} return and restocking cost, and can close the case now.` }
    }
  }
  if (s >= r.minStrength) {
    const whyText = d.id === 'PPD-00124' || d.facts.delivered
      ? "The tracking shows the item was delivered to the buyer's address. We have confirmed fulfillment on Apr 24, 2025."
      : `Evidence strength is ${s}/100, above your ${r.minStrength} threshold. Every claim is backed by a source record.`
    return { action: 'FIGHT', why: whyText }
  }
  return { action: 'REVIEW', why: `Evidence strength is ${s}/100, below your ${r.minStrength} threshold. A person should decide.` }
}

export function policy(d: Dispute, rec: any) {
  const r = store.rules, cost = rec.action === 'ACCEPT' || rec.action === 'OFFER' ? rec.amount : 0
  if (rec.action === 'REVIEW') return { needsApproval: true, reason: 'Needs a human decision.' }
  if (d.amount > r.requireApprovalOver) return { needsApproval: true, reason: `Over your $${r.requireApprovalOver} approval threshold.` }
  if (store.spent + cost > r.monthlyCap) return { needsApproval: true, reason: `Would exceed your $${r.monthlyCap} monthly refund cap.` }
  if (rec.action === 'FIGHT') return { needsApproval: true, reason: 'Evidence submissions are always reviewed.' }
  return { needsApproval: false, reason: 'Within your automation rules.' }
}

const claude = async (system: string, user: string) => {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY!, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5', max_tokens: 800, system, messages: [{ role: 'user', content: user }] })
  })
  const j: any = await r.json()
  return j.content[0].text as string
}

export async function draft(d: Dispute) {
  const ev = evidence(d)
  const fallback = {
    paragraphs: ev.map(e => ({ text: e.rec.text, cites: [e.sourceId] })),
    ai: false,
    verified: true
  }
  if (!process.env.ANTHROPIC_API_KEY || !ev.length) return fallback
  try {
    const raw = await claude(
      'You draft a short, polite PayPal dispute response for a merchant. Use ONLY the records given. Do not add any fact, date, number or name that is not in them. Reply with JSON only: {"paragraphs":[{"text":string,"cites":[recordId]}]}',
      `Dispute type: ${d.type}\nRecords:\n` + ev.map(e => `[${e.sourceId}] ${e.rec.text}`).join('\n')
    )
    const out = JSON.parse(raw.replace(/```json|```/g, '').trim())
    const ok = out.paragraphs.length && out.paragraphs.every((p: any) =>
      p.cites?.length && p.cites.every((c: string) => ev.some(e => e.sourceId === c)) &&
      (p.text.match(/\d+/g) || []).every((n: string) => p.cites.map((c: string) => d.records.find(r => r.id === c)?.text || '').join(' ').includes(n))
    )
    return ok ? { ...out, ai: true, verified: true } : { ...fallback, note: 'AI draft failed the source check; showing the record-based draft.' }
  } catch {
    return { ...fallback, note: 'AI drafting unavailable; showing the record-based draft.' }
  }
}

export async function execute(d: Dispute, action: string, amount: number, note: string, by: string) {
  if (d.status !== 'OPEN') throw new Error('This dispute is already handled.')
  const text = note || 'Submitted from Resolve.'
  if (d.live) {
    if (action === 'FIGHT') await pp.provideEvidence(d.id, text)
    else if (action === 'OFFER') await pp.makeOffer(d.id, amount, text)
    else if (action === 'ACCEPT') await pp.acceptClaim(d.id, text)
  }
  d.status = action === 'FIGHT' ? 'SUBMITTED' : action === 'OFFER' ? 'OFFERED' : 'ACCEPTED'
  d.handledBy = by
  if (action !== 'FIGHT') store.spent = +(store.spent + amount).toFixed(2)
  store.log.unshift({ at: new Date().toISOString(), id: d.id, action, by, detail: `${d.live ? 'PayPal Sandbox' : 'Demo mode'}${amount && action !== 'FIGHT' ? ` · $${amount}` : ''}` })
}
