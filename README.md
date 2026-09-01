# Campus Connect AI

A cinematic, AI-assisted university operations experience with:

- Role-aware student, faculty, moderator, and admin views
- RSVP, waitlist, event submission, and approval workflows
- Privacy-first Lost & Found cases and claim verification
- Named campus updates and moderated anonymous confessions
- Notifications, moderation queue, and an operations command center
- A source-aware CampusAI assistant with a safe offline demo fallback
- Smooth cursor tracking, scroll storytelling, and responsive accessibility

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000/dashboard`.

## Enable the live AI model

Copy `.env.example` to `.env.local`, keep the Firebase values, and add a server-only `OPENAI_API_KEY`. `OPENAI_MODEL` defaults to `gpt-5.4-mini`. Without a key, CampusAI remains fully usable in an honest, deterministic campus-demo mode.

Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable. Restart the development server after changing environment variables.

## Firebase backend

The app has two deliberate modes:

- Visitors get a complete, local portfolio demo without needing an account.
- Signed-in users get Firebase Authentication, real-time Firestore synchronization, per-user RSVP and notification state, moderation workflows, claim records, and protected image uploads.

Lost & Found keeps public clues in `lostItems/{caseId}` and stores identifying evidence separately in `lostItems/{caseId}/private/evidence`. The role/persona switcher changes the storytelling view only; protected staff access is always based on the authenticated user document.

Create a Firebase web app, enable Email/Password and Google authentication, create Firestore and Storage, then fill `.env.local` from `.env.example`. Deploy the checked-in rules and indexes with:

```bash
npx firebase-tools login
npx firebase-tools use YOUR_FIREBASE_PROJECT_ID
npx firebase-tools deploy --only firestore,storage
```

To grant a trusted staff account access, update its `users/{uid}.role` field in the Firebase console to `faculty`, `moderator`, or `admin`. New accounts always start as `student`; the UI selector cannot elevate permissions.

## Verification

```bash
npm run build
```

The production build covers the dashboard, events, campus map, Lost & Found, feed, command center, authentication pages, and the server-side AI route.

## Production boundary

This repository now contains a deployable application backend, but connecting an actual university requires institution-owned data, policy approval, verified campus maps/GPS inputs, monitoring, backups, and a staff onboarding process. The visual map currently demonstrates routing with curated campus nodes rather than claiming live indoor navigation.
