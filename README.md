# Resolve: AI Operator for Merchant PayPal Disputes

> **Build What's Next with PayPal and AI** — Hackathon Project  
> *Transforming PayPal dispute operations with deterministic AI evidence grounding, autonomous settlement, and merchant guardrails.*

---

## 🎯 The Problem
Online merchants lose billions every year to customer disputes, chargebacks, and non-refundable PayPal dispute fees ($15–$20+ per incident). Resolving each dispute currently requires 45+ minutes of manual labor: hunting for carrier tracking, order records, customer communication logs, and drafting evidence packages. Missing deadlines or submitting weak evidence guarantees lost merchandise, lost revenue, and damaged merchant health scores.

## 💡 The Solution: Resolve
**Resolve** is an intelligent back-office operator that integrates directly with the **PayPal Customer Disputes API**, **Tracking API**, and **Dispute Webhooks**. It autonomously triages open disputes, evaluates merchant fulfillment records, predicts win probability, drafts zero-hallucination evidence packages with strict deterministic citations, and executes settlements or evidence submissions within customizable merchant guardrails.

```
                    ┌───────────────────────────────────────────────┐
                    │            PayPal Sandbox Webhooks            │
                    │ (CUSTOMER.DISPUTE.CREATED / UPDATED / RESOLVED)│
                    └───────────────────────┬───────────────────────┘
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Resolve AI Backend Engine                             │
│                                                                                 │
│  1. Context Ingestion:                                                          │
│     • Disputes API: GET /v1/customer/disputes/{id}                              │
│     • Tracking API: GET /v1/shipping/trackers/{id}                              │
│     • Orders API:   GET /v2/checkout/orders/{id}                                │
│                                                                                 │
│  2. Policy & Evidence Grounding Engine:                                         │
│     • Zero-Hallucination Citation Verification (cites ONLY verified records)    │
│     • Predicts Win Probability % & Recommends Action (Fight / Settle / Accept)  │
│     • Enforces Merchant Automation Rules (Auto-accept ≤ $15, monthly caps)     │
│                                                                                 │
│  3. Execution Layer (@paypal/agent-toolkit):                                    │
│     • Fight:   POST /v1/customer/disputes/{id}/provide-evidence                 │
│     • Settle:  POST /v1/customer/disputes/{id}/make-offer                       │
│     • Accept:  POST /v1/customer/disputes/{id}/accept-claim                     │
└─────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼
                           ┌─────────────────────────────┐
                           │   Resolve Modern UI Cockpit │
                           │   (Approve / Audit / Stats) │
                           └─────────────────────────────┘
```

---

## 🚀 Key Features

1. **Deterministic, Zero-Hallucination Evidence Grounding:**  
   Every single claim in an AI-drafted defense package is cryptographically cross-checked against source records (USPS/FedEx tracking, PayPal transaction IDs, customer message logs). Any hallucinated numbers or facts are strictly rejected before submission.

2. **Autonomous Settlement & Negotiation Copilot (`make-offer` API):**  
   For "Significantly Not As Described" (SNAD) claims, Resolve calculates whether offering a 20%–50% partial refund is cheaper than reverse shipping and restocking fees, automatically proposing settlement offers to the buyer via PayPal's API.

3. **Configurable Merchant Guardrails (Human-in-the-Loop):**  
   - **Auto-Accept:** Claims under \$15 auto-resolve immediately to eliminate costly staff time.  
   - **Auto-Refund:** Claims where tracking confirms non-delivery offer automated partial/full refund.  
   - **Approval Thresholds:** High-value claims (>\$100) or low-confidence cases always hold for human sign-off.

4. **Real-Time PayPal Sandbox Adjudication:**  
   Full end-to-end sandbox lifecycle simulation: create a dispute, import via webhooks, generate evidence, submit to PayPal, and watch the case adjudicate in real time.

5. **Executive Analytics & Dispute Health:**  
   Tracks win rates (72%), dollars recovered (\$4,860), hours saved (48 hrs), and flags root causes (e.g. carrier bottlenecks or sizing defects) to protect merchant account health.

---

## 🛠️ Tech Stack & PayPal Surface

- **PayPal Developer Platform:**
  - Customer Disputes API (`list`, `details`, `provide-evidence`, `make-offer`, `accept-claim`)
  - Tracking API & Add Tracking (`/v1/shipping/trackers`)
  - Checkout & Orders API (`/v2/checkout/orders`)
  - Dispute Webhooks
  - `@paypal/agent-toolkit` & APIMatic Context Plugins
- **Frontend:** React 18, Vite, Tailwind CSS v4, Lucide/Heroicons SVG styling, Recharts
- **Backend:** Node.js, Express, TypeScript, tsx
- **AI Engine:** Claude 3.5 Sonnet / Vercel AI SDK function calling with grounding audit validation

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/your-username/resolve.git
cd resolve
npm run install:all
```

### 2. Configure Environment (Optional for Live Sandbox)
```bash
cp .env.example server/.env
```
Edit `server/.env`:
```env
PAYPAL_CLIENT_ID=your_sandbox_client_id
PAYPAL_CLIENT_SECRET=your_sandbox_client_secret
ANTHROPIC_API_KEY=your_key_here    # Optional: deterministic engine used as fallback
PORT=8787
```
*(Note: If no keys are provided, Resolve boots in full **Interactive Demo Mode** pre-seeded with exact test disputes, so judges can test every feature instantly without sandbox setup).*

### 3. Run Development Servers
```bash
# Terminal 1 (Backend API & Sandbox Proxy)
npm run dev:server    # http://localhost:8787

# Terminal 2 (Web Cockpit)
npm run dev:web       # http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🎬 3-Minute Demo Script for Judges

1. **0:00 – 0:30 (The Problem):** Show Dashboard metrics—explain how merchants lose thousands to friendly fraud and tedious dispute filing.
2. **0:30 – 1:30 (The Core Fight Loop):** Click into dispute `PPD-00124` (Item Not Received - \$89.99). Show the AI analysis citing USPS tracking `#940011188922` (delivered Apr 24, 2025). Click **"Review & Submit Evidence"**, inspect the delivery timeline, and click **"Submit Evidence to PayPal"**.
3. **1:30 – 2:10 (Automation Rules):** Navigate to **Automation Rules**. Demonstrate how the \$15 auto-accept rule and 50% auto-refund rule protect merchant margins autonomously.
4. **2:10 – 2:40 (AI Assistant Copilot):** Open the **AI Assistant** tab. Ask *"Why was this dispute opened?"* and click *"Draft response"* to showcase instant verifiable drafting.
5. **2:40 – 3:00 (Reports & Wrap-up):** Highlight the **Reports** view showing 72% win rate, \$4,860 recovered, and the open-source MIT repository.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
