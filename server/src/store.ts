export type Rec = { id: string; kind: string; text: string; source: 'paypal' | 'demo' }

export type Dispute = {
  id: string
  type: string
  amount: number
  status: 'OPEN' | 'SUBMITTED' | 'ACCEPTED' | 'OFFERED'
  createdAt: string
  age?: string
  returnCost: number
  live: boolean
  handledBy?: string
  facts: { delivered?: string; addressMatch?: string; comms?: string; signature?: string }
  meta?: {
    order?: string
    txn?: string
    carrier?: string
    tracking?: string
    delivered?: string
    shipped?: string
    ordered?: string
    buyerClaim?: string
  }
  records: Rec[]
}

const R = (id: string, kind: string, text: string): Rec => ({ id, kind, text, source: 'demo' })

export const store = {
  disputes: [
    {
      id: 'PPD-00124',
      type: 'ITEM_NOT_RECEIVED',
      amount: 89.99,
      status: 'OPEN',
      createdAt: '2025-04-24T10:00:00Z',
      age: '1h',
      returnCost: 0,
      live: false,
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
      records: [
        R('TRK-940011188922', 'tracking', 'USPS tracking #940011188922 shows delivery confirmed on Apr 24, 2025 to buyer address.'),
        R('ORD-8X1234567890', 'order', 'Order #8X1234567890 ship-to address matches verified buyer PayPal address.'),
        R('MSG-COMM-1', 'message', 'We notified the customer about delivery via automated shipment notification.')
      ]
    },
    {
      id: 'PPD-00123',
      type: 'MERCHANDISE_OR_SERVICE_NOT_AS_DESCRIBED',
      amount: 49.50,
      status: 'OPEN',
      createdAt: '2025-04-24T08:00:00Z',
      age: '3h',
      returnCost: 15,
      live: false,
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
      records: [
        R('ORD-4C7788120', 'order', 'Order #4C7788120 delivered on 2025-04-22.'),
        R('MSG-COMM-2', 'message', 'Buyer claims minor cosmetic flaw on packaging.')
      ]
    },
    {
      id: 'PPD-00122',
      type: 'UNAUTHORIZED',
      amount: 120.00,
      status: 'ACCEPTED',
      handledBy: 'autopilot',
      createdAt: '2025-04-24T06:00:00Z',
      age: '5h',
      returnCost: 0,
      live: false,
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
      records: [
        R('ORD-5D9921034', 'order', 'Order #5D9921034 shipped to buyer registered address.')
      ]
    },
    {
      id: 'PPD-00121',
      type: 'ITEM_NOT_RECEIVED',
      amount: 75.00,
      status: 'OPEN',
      createdAt: '2025-04-23T10:00:00Z',
      age: '1d',
      returnCost: 0,
      live: false,
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
      records: [
        R('ORD-2B1100456', 'order', 'Order #2B1100456 shipped on 2025-04-20 in transit.')
      ]
    },
    {
      id: 'PPD-00120',
      type: 'QUALITY_ISSUE',
      amount: 60.00,
      status: 'OPEN',
      createdAt: '2025-04-23T09:00:00Z',
      age: '1d',
      returnCost: 18,
      live: false,
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
      records: [
        R('ORD-7E5566778', 'order', 'Order #7E5566778 for jacket, delivered 2025-04-21.'),
        R('MSG-COMM-3', 'message', 'Buyer reports stitching quality issue.')
      ]
    }
  ] as Dispute[],

  rulesList: [
    { id: 'r1', kind: 'auto-accept', on: true, value: 15, title: 'Auto-Accept', desc: 'Accept the dispute automatically' },
    { id: 'r2', kind: 'auto-refund', on: true, value: 50, title: 'Auto-Refund', desc: 'Offer 50% refund' },
    { id: 'r3', kind: 'approval', on: true, value: 100, title: 'Require Approval', desc: 'Review manually' }
  ],

  rules: { autoAcceptUnder: 15, requireApprovalOver: 100, minStrength: 80, monthlyCap: 500 },
  rulesActive: true,
  spent: 0,
  log: [
    { at: new Date(Date.now() - 2 * 3600000).toISOString(), id: 'PPD-00124', action: 'FIGHT', by: 'merchant (approved)', detail: 'Dispute #PPD-00124 won' },
    { at: new Date(Date.now() - 3 * 3600000).toISOString(), id: 'PPD-00123', action: 'OFFER', by: 'autopilot', detail: 'Partial refund offered' },
    { at: new Date(Date.now() - 4 * 3600000).toISOString(), id: 'PPD-00121', action: 'REVIEW', by: 'system', detail: 'Awaiting approval' }
  ] as { at: string; id: string; action: string; by: string; detail: string }[],

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
  }
}
