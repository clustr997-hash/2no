# MicroMall Edu Cheats

Firebase + React marketplace for SPPU and DBATU subject documents. Students browse by university, year, branch, and subject. Admin uploads notes, PYQs, PDFs, and images, changes prices, and approves UPI payments before paid downloads unlock.

## What is included

- Public browse flow: SPPU FY/SY/TY/BE and DBATU FY/SY/TY/BE.
- Branch and subject pages with shareable URLs.
- Student login for orders and approved downloads.
- Admin-only dashboard for subject CRUD, document upload/delete, UPI settings, and order approval/rejection.
- Private Firebase Storage files served through callable signed URLs.
- Manual UPI flow with GPay, PhonePe, and Paytm UI.

## Firebase integration

1. Create a Firebase project and enable:
   - Authentication: Google provider.
   - Firestore Database.
   - Storage.
   - Cloud Functions.
   - Hosting.

2. Copy frontend config:
   - In Firebase Console, open Project settings > General > Your apps > Web app.
   - Copy the Firebase config values into `web/.env` using `web/.env.example` as the template.

3. Set the Firebase project locally:
   ```bash
   firebase login
   firebase use --add
   ```

4. Install dependencies:
   ```bash
   cd web
   npm install
   cd ../functions
   npm install
   ```

5. Set your admin email in `web/src/config/admin.ts` for UI visibility, then set the real Firebase admin custom claim. Example one-time script from `functions/`:
   ```bash
   node -e "const admin=require('firebase-admin');admin.initializeApp();admin.auth().getUserByEmail('YOUR_EMAIL@gmail.com').then(u=>admin.auth().setCustomUserClaims(u.uid,{admin:true})).then(()=>console.log('admin set'))"
   ```

6. Deploy rules, indexes, functions, and hosting:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage:rules,functions,hosting
   ```

## Admin workflow

1. Login with the admin Google account.
2. Open `Admin`.
3. Add subjects for SPPU/DBATU, year, branch, name, price, and paid/free status.
4. Select a subject and upload PDFs/images as notes, PYQs, assignments, or other documents.
5. Update payment settings with your UPI ID.
6. Approve or reject pending student payment submissions.

## Student workflow

1. Open Browse and select university > year > branch > subject.
2. Free subjects or free previews can be opened directly.
3. Paid subjects require student login, UPI payment, transaction ID, and admin approval.
4. After approval, the subject appears in `My Access` and downloads are unlocked.

## Local development

```bash
cd web
npm run dev
```

For Firebase emulators, run from the repo root:

```bash
firebase emulators:start
```
