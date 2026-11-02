# Sebak — Community Service & Social Development Events Platform

Sebak is a single-page application where everyday people can create, join and manage
social service events in their neighbourhood — winter clothes drives, blanket
distributions, tree plantations, street cleanups and more.

> **Live site:** add your deployed URL here (Vercel → Project → Domains)

## Features

- **Create events** — any logged-in user can publish an event with a title, description,
  event type, thumbnail URL, location and event date. Past dates are rejected by form
  validation and a date picker minimum, so every event stays actionable.
- **Upcoming events** — a public card grid of every live event, with expired dates
  filtered out, linking to a full event details page for each card.
- **Join events** — the details page is open to everyone; joining is one click for
  logged-in volunteers and every join is saved with the event and user data.
- **Manage events** — organizers see only their own events and can update them through
  a validated modal or delete them behind a SweetAlert confirmation.
- **Joined events** — a private page listing everything the logged-in user signed up
  for, sorted by event date.
- **Secure authentication** — email + password and Google sign-in powered by BetterAuth.
  Passwords must include an uppercase letter, a lowercase letter and at least 6
  characters. Private routes remember the user across reloads via a stored JWT.
- **Modern UX** — light/dark theme toggle, loading skeletons, toasts and dialog
  confirmations instead of browser alerts, and a fully responsive layout.

## Tech stack

- **Next.js (App Router)** with JavaScript and Tailwind CSS
- **Custom UI components** (button, card, dialog, dropdown menu, select, skeleton…) styled like shadcn/ui
- **BetterAuth inside this app** — email/password + Google social login, a session cookie on `/api/auth` and a JWT from the jwt plugin (also served at `/api/auth/jwks` for the API server to verify)
- **Axios interceptor** — attaches the JWT to every protected API request and clears an expired session
- **Sonner** toasts + **SweetAlert2** confirmations
- **Express + MongoDB backend** lives in a separate server repository

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:5000   # express api for events/joins
   DB_NAME=sebak                               # auth database name
   MONGODB_URI=...                             # same db the api server uses
   BETTER_AUTH_SECRET=...                      # node -e "…" random string
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=...                        # redirect: /api/auth/callback/google
   GOOGLE_CLIENT_SECRET=...
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project structure

```
src/
  app/              # routes (home, login, register, events…)
  app/api/auth/     # BetterAuth handler (sign-in, get-session, token, jwks)
  components/       # navbar, footer, sections, forms, ui primitives
  lib/              # auth config, api client, validation, formatting
```
