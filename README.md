# Edu Notes Marketplace (Firebase MVP)

This repository contains an MVP starter for a digital-product marketplace focused on university notes/PYQs.

## Stack
- Firebase Hosting
- Firebase Authentication (Google)
- Firestore
- Firebase Storage
- Cloud Functions (Node.js)

## MVP Features Included
- Public product listing (from Firestore)
- Google sign-in
- Manual UPI checkout request (`pending_approval`)
- Owner-only admin panel (toggle by admin email list)
- Approve/reject orders
- Purchases page for users

## Project Structure
- `web/` - Vite + React frontend
- `functions/` - Firebase callable functions
- `firestore.rules` - Firestore security rules
- `storage.rules` - Storage security rules
- `firestore.indexes.json` - Query indexes

## Quick Start
1. Install Firebase CLI: `npm i -g firebase-tools`
2. `firebase login`
3. Create project and set alias: `firebase use --add`
4. Frontend setup:
   - `cd web && npm install`
   - copy `.env.example` to `.env` and fill Firebase config
5. Functions setup:
   - `cd ../functions && npm install`
6. Run local emulators from repo root:
   - `firebase emulators:start`
7. Deploy:
   - `firebase deploy`

## One-time Admin Setup
Set your owner email in `web/src/config/admin.ts`.
For production, move to custom claims and secure callable functions.

## Next Steps
- Replace admin-email check with Firebase custom claims.
- Add signed URL generation for file download.
- Add notifications for pending orders.
- Add watermarking for anti-sharing.


## Current UI Status
- `/` has a styled landing page with category cards and checkout flow explanation.
- `/products` shows sample product cards and pricing placeholders.
- `/my-orders` and `/admin` are scaffold pages with clear purpose text.
- `/remaining` lists implementation tasks still pending for production readiness.


## Trust & UX improvements
- Improved page structure and messaging so students clearly understand payment, approval, and access flow.
- Added friendly sections for trust indicators, transparent pricing preview, and clear order status explanation.
- Added an explicit roadmap page (`/remaining`) to show what is implemented vs pending.
