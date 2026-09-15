# IndoForgien

A responsive React storefront for considered everyday objects. It demonstrates product API integration, client-side authentication, protected checkout and orders routes, cart state, form validation with React Hook Form + Yup, and toast feedback with react-hot-toast.

## Features

- Product listing from `VITE_API_URL` with loading and API error states
- Add, remove, and adjust cart quantities
- Demo login persisted in browser storage
- Protected `/checkout` and `/orders` routes
- Separate payment page with UPI, card, and cash-on-delivery options
- Accessible camera barcode/QR scanner with duplicate detection
- Indian rupee display pricing using a configurable conversion rate
- Yup validation for login and checkout forms
- Success and error feedback through react-hot-toast
- Responsive desktop and mobile layout
- Jest + React Testing Library coverage for homepage render, product fetch, login validation, cart addition, and route protection

## Local development

```bash
npm install
npm run dev
```

The app uses Fake Store API by default. To connect a deployed backend or product service, set `VITE_API_URL` in the deployment environment:

```env
VITE_API_URL=https://your-api.example.com/products
```

## Verification

```bash
npm test
npm run build
npm run lint
```

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Keep the framework preset as Vite and use `npm run build` as the build command.
4. Set `VITE_API_URL` under Project Settings > Environment Variables.
5. Deploy. `vercel.json` keeps client-side routes working after refresh.

## Internship submission checklist

- Upload the complete project, including this README, to GitHub.
- Record a demo showing the home page, responsive layout, API loading, login validation, cart, protected checkout, and deployed URL.
- Upload the video to LinkedIn with a short project summary.
- Tag `@InfoBharatInterns` in the LinkedIn post.
