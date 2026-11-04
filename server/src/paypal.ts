const BASE = 'https://api-m.sandbox.paypal.com'
export const live = () => !!(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET)
let tok: { v: string; exp: number } | null = null
async function token() {
  if (tok && tok.exp > Date.now()) return tok.v
  const basic = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')
  const r = await fetch(BASE + '/v1/oauth2/token', { method: 'POST', headers: { Authorization: 'Basic ' + basic, 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' })
  const j: any = await r.json()
  if (!r.ok) throw new Error('PayPal authentication failed. Check your sandbox client ID and secret.')
  tok = { v: j.access_token, exp: Date.now() + (j.expires_in - 60) * 1000 }
  return tok.v
}
async function pp(path: string, method = 'GET', body?: any) {
  const r = await fetch(BASE + path, { method, headers: { Authorization: 'Bearer ' + (await token()), 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  const t = await r.text(); const j: any = t ? JSON.parse(t) : {}
  if (!r.ok) throw new Error(`PayPal ${r.status}: ${j.message || j.name || t}`)
  return j
}
export const listDisputes = () => pp('/v1/customer/disputes?page_size=20')
export const getDispute = (id: string) => pp(`/v1/customer/disputes/${id}`)
export const provideEvidence = (id: string, notes: string) => pp(`/v1/customer/disputes/${id}/provide-evidence`, 'POST', { evidences: [{ evidence_type: 'OTHER', notes: notes.slice(0, 2000) }] })
export const makeOffer = (id: string, amount: number, note: string, cur = 'USD') => pp(`/v1/customer/disputes/${id}/make-offer`, 'POST', { note, offer_amount: { currency_code: cur, value: amount.toFixed(2) } })
export const acceptClaim = (id: string, note: string) => pp(`/v1/customer/disputes/${id}/accept-claim`, 'POST', { note, accept_claim_reason: 'COMPANY_POLICY' })
