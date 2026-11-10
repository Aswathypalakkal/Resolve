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
  const s = strength(d)
  const activeRules = (store.rulesList || []).filter(r => r.on !== false)

  if (store.rulesActive === false) {
    return { action: 'REVIEW', amount: 0, why: 'Automation rules are disabled. Case is held for manual review.' }
  }

  // 1. Check active Auto-Accept rules
  const autoAcceptRules = activeRules.filter(r => r.kind === 'auto-accept' || r.tag === 'Auto-Accept')
  for (const r of autoAcceptRules) {
    const threshMatch = r.title?.match(/(?:≤|<=|<|under|\$)\s*(\d+(?:\.\d+)?)/i)
    const threshold = threshMatch ? parseFloat(threshMatch[1]) : (r.value ?? store.rules.autoAcceptUnder ?? 15)
    if (d.amount <= threshold) {
      return {
        action: 'ACCEPT',
        amount: d.amount,
        ruleId: r.id,
        ruleTitle: r.title,
        why: `Matched rule "${r.title}": Claim amount ($${d.amount}) is within $${threshold} limit.`
      }
    }
  }

  // 2. Check active Auto-Refund / Settlement rules
  const autoRefundRules = activeRules.filter(r => r.kind === 'auto-refund' || r.tag === 'Auto-Refund')
  for (const r of autoRefundRules) {
    const isNoDeliveryMatch = r.title?.toLowerCase().includes('no delivery') || r.title?.toLowerCase().includes('not received')
    const matchesCondition = isNoDeliveryMatch
      ? (d.type === 'ITEM_NOT_RECEIVED' || d.meta?.buyerClaim?.toLowerCase().includes('not received')) && !d.facts.delivered
      : (d.type === 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED' || d.type === 'QUALITY_ISSUE')

    if (matchesCondition) {
      const pctMatch = (r.desc || r.title)?.match(/(\d+)%/)
      const pct = pctMatch ? parseFloat(pctMatch[1]) / 100 : 0.5
      const offer = +(d.amount * pct).toFixed(2)
      return {
        action: 'OFFER',
        amount: offer,
        ruleId: r.id,
        ruleTitle: r.title,
        why: `Matched rule "${r.title}": Offering ${Math.round(pct * 100)}% partial refund ($${offer}).`
      }
    }
  }

  // 3. Check active Auto-Fight rules
  const autoFightRules = activeRules.filter(r => r.kind === 'auto-fight' || r.tag === 'Auto-Fight')
  for (const r of autoFightRules) {
    if (d.facts.delivered || s >= 70) {
      return {
        action: 'FIGHT',
        amount: 0,
        ruleId: r.id,
        ruleTitle: r.title,
        why: `Matched rule "${r.title}": Verified carrier delivery proof available.`
      }
    }
  }

  // 4. Fallback: Carrier delivery confirmed -> FIGHT
  if (s >= store.rules.minStrength || d.facts.delivered) {
    return {
      action: 'FIGHT',
      amount: 0,
      why: d.facts.delivered
        ? "Carrier tracking confirms delivery to buyer's PayPal address. Verified evidence package ready to fight."
        : `Evidence strength is ${s}/100, above your ${store.rules.minStrength} threshold. Every claim is backed by a source record.`
    }
  }

  // 5. Fallback: SNAD / Quality issue with high return cost -> OFFER
  if (d.type === 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED' || d.type === 'QUALITY_ISSUE') {
    const offer = +(d.amount * 0.2).toFixed(2)
    if (d.returnCost >= offer) {
      return {
        action: 'OFFER',
        amount: offer,
        why: `A 20% partial refund ($${offer}) is cheaper than the $${d.returnCost} return and restocking cost.`
      }
    }
  }

  return { action: 'REVIEW', amount: 0, why: `Evidence strength is ${s}/100, below auto-resolution threshold. A person should decide.` }
}

export function policy(d: Dispute, rec: any) {
  if (store.rulesActive === false) {
    return { needsApproval: true, reason: 'Automation rules disabled.' }
  }
  if (rec.action === 'REVIEW') {
    return { needsApproval: true, reason: 'Needs a human decision.' }
  }

  // Check approval rules
  const activeRules = (store.rulesList || []).filter(r => r.on !== false)
  const approvalRules = activeRules.filter(r => r.kind === 'approval' || r.tag === 'Require Approval')
  for (const ar of approvalRules) {
    const m = ar.title?.match(/(?:>|over|\$)\s*(\d+(?:\.\d+)?)/i)
    const thresh = m ? parseFloat(m[1]) : (ar.value ?? store.rules.requireApprovalOver ?? 100)
    if (d.amount > thresh) {
      return { needsApproval: true, reason: `Over $${thresh} approval threshold (Rule: "${ar.title}").` }
    }
  }

  const cost = rec.action === 'ACCEPT' || rec.action === 'OFFER' ? (rec.amount || 0) : 0
  if (store.spent + cost > store.rules.monthlyCap) {
    return { needsApproval: true, reason: `Would exceed your $${store.rules.monthlyCap} monthly refund cap.` }
  }

  // If matched an active rule allowing automation
  if (rec.ruleId) {
    const matched = activeRules.find(r => r.id === rec.ruleId)
    if (matched) {
      return { needsApproval: false, reason: `Automated under rule: "${matched.title}"` }
    }
  }

  if (rec.action === 'FIGHT') {
    return { needsApproval: true, reason: 'Evidence submissions are reviewed before sending to PayPal.' }
  }

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
