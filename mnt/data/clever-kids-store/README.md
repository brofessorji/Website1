# Clever Kids — Ecommerce Storefront

A responsive premium storefront for two digital children's activity books.

## Included
- Responsive editorial-style storefront
- Adventure Edition, Explorer Edition and Complete Bundle product flows
- Product detail modal with previews
- Cart logic and bundle pricing
- Demo checkout flow
- Private PDF storage outside `public/`
- Signed download-token pattern in `server.js`
- Privacy / Terms / Refund starter pages
- Local preview assets

## Run locally
1. Install Node.js 20+.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env` and set a long random `DOWNLOAD_SECRET`.
4. Run `npm start`.
5. Open `http://localhost:3000`.

## Before production
### 1. Payment provider
No live payment provider was selected in the brief, so the checkout is intentionally in demo mode. Replace the `/api/checkout` branch with a server-side order call for your chosen provider (for India, a provider such as Razorpay is a common option). Verify payment signatures/webhooks on the server before issuing any download token.

### 2. Second PDF
`private/explorer-edition.pdf` is intentionally not included because the Explorer Edition PDF was not supplied. Add the finished PDF there with that exact filename.

### 3. Secure delivery
Keep PDFs outside `public/`. The sample server issues HMAC-signed tokens. For production, also persist orders in a database, add token expiry, log fulfillment, rate-limit download attempts, and use your provider's webhook as the source of truth.

### 4. Brand details
Replace the placeholder contact email in `public/index.html` and finalize the legal pages for the actual business.

## Design notes
The design deliberately avoids AI-style UI patterns: no gradients, no glass cards, no fake reviews, no fake metrics, no urgency timers, and no excessive decoration. The visual language uses editorial typography, warm paper tones, restrained coral/gold accents, and product-first layouts.
