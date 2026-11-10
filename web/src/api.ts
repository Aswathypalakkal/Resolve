// Complete API client with resilient mock fallback

export type DisputeItem = {
  id: string
  type: string
  amount: number
  status: string
  createdAt: string
  age: string
  handledBy?: string
  strength: number
  facts: { delivered?: string; addressMatch?: string; comms?: string }
  meta: {
    buyerClaim: string
    order: string
    txn: string
    carrier: string
    tracking: string
    delivered: string
    shipped: string
    ordered: string
  }
  evidence: Array<{ fact: string; sourceId: string; rec: { id: string; kind: string; text: string; source: string } }>
  rec: { action: 'FIGHT' | 'OFFER' | 'ACCEPT' | 'REVIEW'; amount?: number; why: string }
  policy: { needsApproval: boolean; reason: string }
}

const mockState = {
  mode: 'PayPal Sandbox',
  stats: { open: 24, handled: 42, recovered: 4860, avgDays: 1.8, auto: 5 },
  spent: 0,
  active: true,
  rules: [
    { id: 'r1', kind: 'auto-accept', on: true, value: 15, title: 'Auto-Accept', desc: 'Accept the dispute automatically' },
    { id: 'r2', kind: 'auto-refund', on: true, value: 50, title: 'Auto-Refund', desc: 'Offer 50% refund' },
    { id: 'r3', kind: 'approval', on: true, value: 100, title: 'Require Approval', desc: 'Review manually' }
  ],
  sample: {
    open: 24,
    resolved: 42,
    recovered: 4860,
    avgDays: 1.8,
    winRate: 72,
    hoursSaved: 48,
    trend: [
      { d: 'Oct 14', resolved: 12, open: 18 },
      { d: 'Oct 21', resolved: 16, open: 22 },
      { d: 'Oct 28', resolved: 20, open: 19 },
      { d: 'Nov 4', resolved: 24, open: 15 }
    ],
    activity: [
      { t: 'Dispute #PPD-00124 won', ago: '2h ago', k: 'ok' },
      { t: 'Partial refund offered', ago: '3h ago', k: 'info' },
      { t: 'Awaiting approval', ago: '4h ago', k: 'wait' }
    ],
    savings: [
      { d: 'Oct 1', v: 850 },
      { d: 'Oct 8', v: 1620 },
      { d: 'Oct 15', v: 2450 },
      { d: 'Oct 22', v: 3600 },
      { d: 'Oct 30', v: 4860 }
    ]
  },
  disputes: [
    {
      id: 'PPD-00124',
      type: 'ITEM_NOT_RECEIVED',
      amount: 89.99,
      status: 'OPEN',
      createdAt: '2025-04-24T10:00:00Z',
      age: '1h',
      strength: 95,
      facts: { delivered: 'TRK-940011188922', addressMatch: 'ORD-8X1234567890', comms: 'MSG-COMM-1' },
      meta: {
        buyerClaim: 'Item not received',
        order: '8X1234567890',
        txn: '4P9876543210',
        carrier: 'USPS',
        tracking: '940011188922',
        delivered: '2025-04-24',
        shipped: '2025-04-21',
        ordered: '2025-04-18'
      },
      evidence: [
        { fact: 'delivered', sourceId: 'TRK-940011188922', rec: { id: 'TRK-940011188922', kind: 'tracking', text: 'USPS tracking #940011188922 shows delivery confirmed on Apr 24, 2025 to buyer address.', source: 'paypal' } },
        { fact: 'addressMatch', sourceId: 'ORD-8X1234567890', rec: { id: 'ORD-8X1234567890', kind: 'order', text: 'Order #8X1234567890 ship-to address matches verified buyer PayPal address.', source: 'paypal' } },
        { fact: 'comms', sourceId: 'MSG-COMM-1', rec: { id: 'MSG-COMM-1', kind: 'message', text: 'We notified the customer about delivery via automated shipment notification.', source: 'paypal' } }
      ],
      rec: {
        action: 'FIGHT',
        why: "The tracking shows the item was delivered to the buyer's address. We have confirmed fulfillment on Apr 24, 2025."
      },
      policy: {
        needsApproval: true,
        reason: 'Evidence submissions are always reviewed before filing with PayPal.'
      }
    },
    {
      id: 'PPD-00123',
      type: 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED',
      amount: 49.50,
      status: 'OPEN',
      createdAt: '2025-04-24T08:00:00Z',
      age: '3h',
      strength: 65,
      facts: { comms: 'MSG-COMM-2' },
      meta: {
        buyerClaim: 'Item not as described',
        order: '4C7788120',
        txn: '9K1122334455',
        carrier: 'FedEx',
        tracking: '789123456789',
        delivered: '2025-04-22',
        shipped: '2025-04-19',
        ordered: '2025-04-16'
      },
      evidence: [
        { fact: 'comms', sourceId: 'MSG-COMM-2', rec: { id: 'MSG-COMM-2', kind: 'message', text: 'Buyer claims minor cosmetic flaw on packaging.', source: 'paypal' } }
      ],
      rec: {
        action: 'OFFER',
        amount: 24.75,
        why: 'A 50% partial refund ($24.75) is cheaper than the $35.00 return shipping cost, and resolves the case immediately.'
      },
      policy: {
        needsApproval: true,
        reason: 'Settlement offer requires merchant confirmation.'
      }
    },
    {
      id: 'PPD-00122',
      type: 'UNAUTHORIZED',
      amount: 120.00,
      status: 'ACCEPTED',
      handledBy: 'autopilot',
      createdAt: '2025-04-24T06:00:00Z',
      age: '5h',
      strength: 80,
      facts: { delivered: 'TRK-9400111899', addressMatch: 'ORD-5D9921034' },
      meta: {
        buyerClaim: 'Unauthorized transaction',
        order: '5D9921034',
        txn: '7T4455667788',
        carrier: 'USPS',
        tracking: '9400111899',
        delivered: '2025-04-23',
        shipped: '2025-04-20',
        ordered: '2025-04-17'
      },
      evidence: [
        { fact: 'addressMatch', sourceId: 'ORD-5D9921034', rec: { id: 'ORD-5D9921034', kind: 'order', text: 'Order #5D9921034 shipped to buyer registered address.', source: 'paypal' } }
      ],
      rec: {
        action: 'ACCEPT',
        amount: 120.00,
        why: 'Accepted under merchant risk policy.'
      },
      policy: {
        needsApproval: false,
        reason: 'Auto-accepted under merchant rule.'
      }
    },
    {
      id: 'PPD-00121',
      type: 'ITEM_NOT_RECEIVED',
      amount: 75.00,
      status: 'OPEN',
      createdAt: '2025-04-23T10:00:00Z',
      age: '1d',
      strength: 30,
      facts: {},
      meta: {
        buyerClaim: 'Item not received',
        order: '2B1100456',
        txn: '3M7788990011',
        carrier: 'UPS',
        tracking: '1Z9999999999999999',
        delivered: '',
        shipped: '2025-04-20',
        ordered: '2025-04-18'
      },
      evidence: [],
      rec: {
        action: 'REVIEW',
        why: 'Tracking shows package still in transit. Manual verification recommended.'
      },
      policy: {
        needsApproval: true,
        reason: 'Tracking in transit.'
      }
    },
    {
      id: 'PPD-00120',
      type: 'QUALITY_ISSUE',
      amount: 60.00,
      status: 'OPEN',
      createdAt: '2025-04-23T09:00:00Z',
      age: '1d',
      strength: 40,
      facts: { comms: 'MSG-COMM-3' },
      meta: {
        buyerClaim: 'Quality issue',
        order: '7E5566778',
        txn: '1Q3344556677',
        carrier: 'DHL',
        tracking: '4455667788',
        delivered: '2025-04-21',
        shipped: '2025-04-18',
        ordered: '2025-04-15'
      },
      evidence: [
        { fact: 'comms', sourceId: 'MSG-COMM-3', rec: { id: 'MSG-COMM-3', kind: 'message', text: 'Customer messaged about seam stitching.', source: 'paypal' } }
      ],
      rec: {
        action: 'REVIEW',
        why: 'Customer reported a quality defect. Review photos or offer replacement.'
      },
      policy: {
        needsApproval: true,
        reason: 'Quality assessment needed.'
      }
    }
  ] as any[],
  log: [
    { at: new Date(Date.now() - 2 * 3600000).toISOString(), id: 'PPD-00124', action: 'FIGHT', by: 'merchant (approved)', detail: 'Dispute #PPD-00124 won' },
    { at: new Date(Date.now() - 3 * 3600000).toISOString(), id: 'PPD-00123', action: 'OFFER', by: 'autopilot', detail: 'Partial refund offered' },
    { at: new Date(Date.now() - 4 * 3600000).toISOString(), id: 'PPD-00121', action: 'REVIEW', by: 'system', detail: 'Awaiting approval' }
  ]
}

function applyRulesToDisputes(disputes: any[], rules: any[], active: boolean) {
  if (!active) {
    for (const d of disputes) {
      if (d.status === 'OPEN') {
        d.rec = { action: 'REVIEW', amount: 0, why: 'Automation rules disabled.' }
        d.policy = { needsApproval: true, reason: 'Automation rules disabled.' }
      }
    }
    return
  }

  const enabledRules = (rules || []).filter((r: any) => r.on !== false)

  for (const d of disputes) {
    if (d.status !== 'OPEN') continue

    let matched = false

    // 1. Auto-accept
    const autoAcceptRules = enabledRules.filter((r: any) => r.kind === 'auto-accept' || r.tag === 'Auto-Accept')
    for (const r of autoAcceptRules) {
      const m = r.title?.match(/(?:≤|<=|<|under|\$)\s*(\d+(?:\.\d+)?)/i)
      const thresh = m ? parseFloat(m[1]) : (r.value ?? 15)
      if (d.amount <= thresh) {
        d.rec = {
          action: 'ACCEPT',
          amount: d.amount,
          why: `Matched rule: "${r.title}". Auto-accepted under merchant limit.`
        }
        d.policy = { needsApproval: false, reason: `Matched rule: "${r.title}"` }
        matched = true
        break
      }
    }

    if (matched) continue

    // 2. Auto-refund
    const autoRefundRules = enabledRules.filter((r: any) => r.kind === 'auto-refund' || r.tag === 'Auto-Refund')
    for (const r of autoRefundRules) {
      const isNoDelivery = r.title?.toLowerCase().includes('no delivery') || r.title?.toLowerCase().includes('not received')
      const cond = isNoDelivery
        ? (d.type === 'ITEM_NOT_RECEIVED' || d.meta?.buyerClaim?.toLowerCase().includes('not received')) && !d.facts?.delivered
        : (d.type === 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED' || d.type === 'QUALITY_ISSUE')

      if (cond) {
        const pctMatch = (r.desc || r.title)?.match(/(\d+)%/)
        const pct = pctMatch ? parseFloat(pctMatch[1]) / 100 : 0.5
        const offer = +(d.amount * pct).toFixed(2)
        d.rec = {
          action: 'OFFER',
          amount: offer,
          why: `Matched rule: "${r.title}". Offered ${Math.round(pct * 100)}% partial refund ($${offer}).`
        }
        d.policy = { needsApproval: false, reason: `Matched rule: "${r.title}"` }
        matched = true
        break
      }
    }

    if (matched) continue

    // 3. Auto-fight
    const autoFightRules = enabledRules.filter((r: any) => r.kind === 'auto-fight' || r.tag === 'Auto-Fight')
    for (const r of autoFightRules) {
      if (d.facts?.delivered || (d.strength && d.strength >= 70)) {
        d.rec = {
          action: 'FIGHT',
          amount: 0,
          why: `Matched rule: "${r.title}". Carrier tracking confirms delivery.`
        }
        d.policy = { needsApproval: false, reason: `Auto-submitted under rule: "${r.title}"` }
        matched = true
        break
      }
    }

    if (matched) continue

    // 4. Default approval check
    const approvalRules = enabledRules.filter((r: any) => r.kind === 'approval' || r.tag === 'Require Approval')
    let overApproval = false
    for (const ar of approvalRules) {
      const m = ar.title?.match(/(?:>|over|\$)\s*(\d+(?:\.\d+)?)/i)
      const thresh = m ? parseFloat(m[1]) : (ar.value ?? 100)
      if (d.amount > thresh) {
        overApproval = true
        break
      }
    }

    if (d.facts?.delivered || (d.strength && d.strength >= 70)) {
      d.rec = {
        action: 'FIGHT',
        amount: 0,
        why: 'Tracking confirms delivery to buyer address on Apr 24, 2025.'
      }
      d.policy = {
        needsApproval: true,
        reason: overApproval ? 'Dispute amount exceeds approval threshold.' : 'Evidence review required before submission.'
      }
    } else {
      d.rec = {
        action: 'REVIEW',
        amount: 0,
        why: 'Low confidence / package in transit. Manual verification recommended.'
      }
      d.policy = {
        needsApproval: true,
        reason: 'Requires human review.'
      }
    }
  }
}

const j = async (u: string, o?: RequestInit) => {
  try {
    const r = await fetch('/api' + u, { headers: { 'content-type': 'application/json' }, ...o })
    if (r.ok) return await r.json()
  } catch {
    // Fall back to local mock
  }

  // Local mock responses
  if (u === '/state') {
    applyRulesToDisputes(mockState.disputes, mockState.rules, mockState.active)
    const openCount = mockState.disputes.filter((d: any) => d.status === 'OPEN').length
    const resolvedCount = mockState.disputes.filter((d: any) => d.status !== 'OPEN').length
    const autoCount = mockState.disputes.filter((d: any) => d.handledBy === 'autopilot').length
    mockState.stats = {
      ...mockState.stats,
      open: openCount,
      handled: resolvedCount,
      auto: autoCount
    }
    return mockState
  }
  if (u.startsWith('/disputes/')) {
    const parts = u.split('/')
    const id = parts[2]
    const d = mockState.disputes.find(x => x.id === id) || mockState.disputes[0]
    if (parts[3] === 'draft') {
      return {
        paragraphs: [
          { text: 'Order #8X1234567890 was shipped on Apr 21, 2025 via USPS tracking #940011188922.', cites: ['ORD-8X1234567890', 'TRK-940011188922'] },
          { text: 'Carrier records confirm parcel was delivered to the verified buyer address on Apr 24, 2025.', cites: ['TRK-940011188922'] },
          { text: 'Automated delivery notice was sent to buyer on Apr 24, 2025.', cites: ['MSG-COMM-1'] }
        ],
        ai: true,
        verified: true,
        note: 'Verified against PayPal records.'
      }
    }
    if (parts[3] === 'execute') {
      const b = o?.body ? JSON.parse(o.body as string) : {}
      d.status = b.action === 'FIGHT' ? 'SUBMITTED' : b.action === 'OFFER' ? 'OFFERED' : 'ACCEPTED'
      d.handledBy = 'merchant (approved)'
      return d
    }
    return d
  }
  if (u === '/rules') {
    if (o?.body) {
      const b = JSON.parse(o.body as string)
      if (b.rules) mockState.rules = b.rules
      if (typeof b.active === 'boolean') mockState.active = b.active
      applyRulesToDisputes(mockState.disputes, mockState.rules, mockState.active)
    }
    return { rules: mockState.rules, active: mockState.active }
  }
  if (u === '/autopilot') {
    applyRulesToDisputes(mockState.disputes, mockState.rules, mockState.active)
    let handledCount = 0
    for (const d of mockState.disputes) {
      if (d.status === 'OPEN' && !d.policy?.needsApproval) {
        d.status = d.rec.action === 'FIGHT' ? 'SUBMITTED' : d.rec.action === 'OFFER' ? 'OFFERED' : 'ACCEPTED'
        d.handledBy = 'autopilot'
        handledCount++
      }
    }
    const openCount = mockState.disputes.filter((d: any) => d.status === 'OPEN').length
    const resolvedCount = mockState.disputes.filter((d: any) => d.status !== 'OPEN').length
    const autoCount = mockState.disputes.filter((d: any) => d.handledBy === 'autopilot').length
    mockState.stats = {
      ...mockState.stats,
      open: openCount,
      handled: resolvedCount,
      auto: autoCount
    }
    return { ok: true, handled: handledCount, disputes: mockState.disputes }
  }
  if (u === '/reset') {
    mockState.disputes.forEach((d: any) => {
      if (d.id !== 'PPD-00122') {
        d.status = 'OPEN'
        delete d.handledBy
      }
    })
    applyRulesToDisputes(mockState.disputes, mockState.rules, mockState.active)
    const openCount = mockState.disputes.filter((d: any) => d.status === 'OPEN').length
    const resolvedCount = mockState.disputes.filter((d: any) => d.status !== 'OPEN').length
    mockState.stats = { ...mockState.stats, open: openCount, handled: resolvedCount }
    return { ok: true, disputes: mockState.disputes }
  }
  if (u === '/sync') {
    return { imported: 5 }
  }
  if (u === '/ask') {
    const b = o?.body ? JSON.parse(o.body as string) : {}
    const text = (b.text || '').toLowerCase()
    if (text.includes('why was this dispute opened') || text.includes('why')) {
      return { answer: 'This dispute (PPD-00124) was opened because the buyer claims they did not receive the item. However, tracking shows it was delivered on Apr 24, 2025. You can use this evidence to fight the claim.' }
    }
    if (text.includes('summarize')) {
      return { answer: 'Case Summary for PPD-00124: Item Not Received ($89.99). Buyer filed claim 1h ago. USPS tracking #940011188922 confirms delivery to buyer address on Apr 24, 2025. Evidence score: 95/100. Recommendation: Fight dispute with proof of fulfillment.' }
    }
    if (text.includes('draft response') || text.includes('draft')) {
      return { answer: "Drafted Response: 'The order #8X1234567890 was dispatched via USPS under tracking number #940011188922. Tracking logs confirm delivery to the designated buyer shipping address on April 24, 2025. Please review the attached proof of delivery to resolve this dispute in merchant favor.'" }
    }
    if (text.includes('show evidence') || text.includes('evidence')) {
      return { answer: 'Verified Evidence Package:\n• Tracking Information: USPS #940011188922 delivered Apr 24, 2025\n• Order Details: #8X1234567890 matching buyer shipping address\n• Customer Communication: Delivery notification sent on Apr 24, 2025.' }
    }
    return { answer: `Resolve AI: I analyzed your PayPal dispute query regarding "${b.text}". Based on PayPal merchant policy and tracking records, our recommendation is to fight this claim with verified delivery proof.` }
  }

  return { ok: true }
}

export const api = {
  state: () => j('/state'),
  get: (id: string) => j('/disputes/' + id),
  draft: (id: string) => j(`/disputes/${id}/draft`, { method: 'POST' }),
  run: (id: string, body: any) => j(`/disputes/${id}/execute`, { method: 'POST', body: JSON.stringify(body) }),
  rules: (r: any) => j('/rules', { method: 'PUT', body: JSON.stringify(r) }),
  auto: () => j('/autopilot', { method: 'POST' }),
  reset: () => j('/reset', { method: 'POST' }),
  sync: () => j('/sync', { method: 'POST' }),
  ask: (text: string, disputeId?: string) => j('/ask', { method: 'POST', body: JSON.stringify({ text, disputeId }) })
}
