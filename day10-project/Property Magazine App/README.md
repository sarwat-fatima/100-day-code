# Property Magazine App — Complete Setup & Deployment Guide
Premium minimalist Japanese-style architecture & property magazine (Casa BRUTUS / Muji / Apple editorial inspired), built for **low-end development hardware**.

This repo contains:
- `Next.js` App Router frontend + API routes (TypeScript, Tailwind, Framer Motion, Zustand)
- `Auth.js` (NextAuth v5 beta) with MongoDB Atlas adapter
- `MongoDB Atlas + Mongoose` for user data, bookmarks, reading history, collections, subscriptions, analytics
- `Sanity CMS` for editorial content (articles, properties)
- `Cloudinary` helper + upload API route for optimized media uploads
- Hosting-ready for `Vercel`

No dummy content is shipped. You will add real content in Sanity, and real users will sign in via OAuth providers.

---

## Table of contents
1. Prerequisites
2. Project install & run (local)
3. Folder structure
4. MongoDB Atlas setup (collections + indexes)
5. Auth.js setup (GitHub + Google)
6. Sanity CMS setup (Studio + schemas)
7. Cloudinary setup (uploads)
8. Zustand (what we store locally)
9. Environment variables
10. API routes (what exists)
11. Performance strategy (low-end laptop)
12. Vercel deployment
13. Post-deployment checklist (real-time + webhooks)

---

## 1) Prerequisites
Install:
- Node.js **v20 LTS**
- Git

Verify:
```bash
node --version
npm --version
git --version
```

---

## 2) Project install & run (local)
From the repo root:
```bash
npm install
npm run dev
```
App runs at `http://localhost:3000`
(`npm run dev` is configured to use `--webpack` for better Windows stability on low-end machines.)

Sanity Studio (separate terminal):
```bash
cd sanity-studio-
npm install
cp .env.example .env
# fill SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET
npm run dev
```
Studio runs at `http://localhost:3333`

---

## 3) Folder structure (high level)
```
src/
  app/
    (auth)/login/page.tsx
    (main)/
      page.tsx
      articles/
      properties/
      moodboard/
      search/
      profile/
    api/
      auth/[...nextauth]/route.ts
      bookmarks/route.ts
      reading-history/route.ts
      collections/route.ts
      collections/items/route.ts
      search/route.ts
      upload/route.ts
      revalidate/route.ts
      sanity/sync/route.ts
      health/route.ts
  components/
    layout/
    home/
    article/
    property/
    moodboard/
    search/
    auth/
    ui/
  hooks/
  lib/
    auth/
    db/
    sanity/
    cloudinary/
    utils/
  models/
    (mongoose schemas)
  store/
sanity-studio/
  schemas/
  sanity.config.ts
```

---

## 4) MongoDB Atlas setup (Collections + Indexes)
MongoDB does not use “tables”; it uses **databases** and **collections**. With Mongoose, collections are created automatically on first write.

### Step A — Create Atlas cluster
1. Create Atlas account: `https://mongodb.com/atlas`
2. Build a database → **M0 free tier**
3. Create a DB user (save username/password)
4. Network access: allow your IP (or `0.0.0.0/0` for quick setup)
5. Get connection string (Drivers)

Your connection string should look like:
```
mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/propertymagazine?retryWrites=true&w=majority
```
mongodb+srv://sarwatfatima928_db_user:<db_password>@cluster0.zt7qxrj.mongodb.net/?appName=Cluster0

### Step B — Add `MONGODB_URI`
Create `.env.local` in repo root (copy from `.env.example`) and set:
```
MONGODB_URI=...
```

### What is stored in MongoDB in this app?
User-system data (real-time, per user):
- bookmarks, reading history, collections/moodboards, subscriptions/payments, notifications, analytics events, search history

Auth.js adapter also creates/uses:
- `users`, `accounts`, `sessions`, `verification_tokens`

Optional “content cache” (synced from Sanity by webhook):
- `articles`, `properties` (see `src/app/api/sanity/sync/route.ts`)

---

## 5) Auth.js setup (GitHub + Google)
This project uses **NextAuth v5 beta** (Auth.js).

### Step A — AUTH secret
Generate:
```bash
openssl rand -base64 32
```
Put it into:
```
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
```

### Step B — GitHub OAuth
1. `https://github.com/settings/developers` → New OAuth App
2. Homepage URL: `http://localhost:3000`
3. Callback URL: `http://localhost:3000/api/auth/callback/github`
4. Copy:
```
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Step C — Google OAuth
1. `https://console.cloud.google.com` → create project
2. OAuth consent screen → External
3. Create credentials → OAuth Client ID → Web application
4. Redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy:
```
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Login page: `src/app/(auth)/login/page.tsx`
Auth config: `src/lib/auth/auth.ts`

---

## 6) Sanity CMS setup (Studio + Schemas)
This repo includes a ready Studio in `sanity-studio/`.

### Step A — Create a Sanity project
1. `https://sanity.io` → create account
2. Create a project (note the **Project ID**)
3. Dataset: `production`

### Step B — Configure Studio env
In `sanity-studio/.env`:
```
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

### Step C — Configure Next.js env
In root `.env.local`:
```
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_token   # optional for private datasets; recommended for webhooks
```

### Step D — Studio schemas
Already included:
- `sanity-studio/schemas/article.ts`
- `sanity-studio/schemas/property.ts`

Publish content by setting `publishedAt` (required by the frontend queries).

---

## 7) Cloudinary setup (uploads)
Create account: `https://cloudinary.com`

Add env vars to `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

Upload route (signed, server-side):
- `POST /api/upload`
- Body: `{ "dataUrl": "data:image/...base64...", "folder": "property-magazine/articles" }`

Code:
- `src/lib/cloudinary/upload.ts`
- `src/app/api/upload/route.ts`

---

## 8) Zustand (minimal usage)
Local-only state (fast UX, low overhead):
- `src/store/useUIStore.ts` → theme toggle
- `src/store/useUserStore.ts` → local bookmarks + reading progress cache

Server truth for logged-in users:
- `/api/bookmarks`
- `/api/reading-history`
- `/api/collections`

---

## 9) Environment variables (root `.env.local`)
Copy:
```bash
cp .env.example .env.local
```

Required for local app to fully work:
- `MONGODB_URI`
- `AUTH_SECRET`, `AUTH_URL`
- OAuth provider keys (GitHub and/or Google)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`

Optional but recommended:
- Cloudinary keys (for uploads)
- `SANITY_API_TOKEN` (for secure syncing)
- `SANITY_WEBHOOK_SECRET` (to secure the sync webhook)

Add this too:
```
SANITY_WEBHOOK_SECRET=some_long_random_value
```

---

## 10) API routes (what exists)
- Auth: `src/app/api/auth/[...nextauth]/route.ts`
- Bookmarks: `src/app/api/bookmarks/route.ts`
- Reading history: `src/app/api/reading-history/route.ts`
- Moodboard collections: `src/app/api/collections/route.ts`
- Add/remove items: `src/app/api/collections/items/route.ts`
- Search (Sanity GROQ): `src/app/api/search/route.ts`
- Upload (Cloudinary): `src/app/api/upload/route.ts`
- Revalidate pages: `src/app/api/revalidate/route.ts`
- Sanity → Mongo sync + revalidate: `src/app/api/sanity/sync/route.ts`
- Health check: `src/app/api/health/route.ts`

---

## 11) Performance strategy (low-end laptop)
What this repo does to stay light:
- Minimal dependencies; no Redux, no heavy animation libraries
- Subtle Framer Motion usage only where needed
- Uses Next.js Server Components for list pages (less client JS)
- Image optimization via `next/image` + modern formats
- MongoDB connection caching to avoid hot-reload connection storms

Recommended local workflow:
- Run **only one** `npm run dev` for Next.js
- Run Sanity Studio only when editing content
- Disable telemetry:
  - Windows PowerShell: `setx NEXT_TELEMETRY_DISABLED 1`

---

## 12) Vercel deployment
1. Push this repo to GitHub
2. Import into Vercel
3. Add **all** `.env.local` variables into Vercel project settings
4. Set `AUTH_URL` to your Vercel URL, e.g.:
   - `https://your-app.vercel.app`
5. Update OAuth callback URLs to the Vercel domain:
   - GitHub: `https://your-app.vercel.app/api/auth/callback/github`
   - Google: `https://your-app.vercel.app/api/auth/callback/google`

---

## 13) Post-deployment checklist (real-time content)
### A) Sanity Webhook → real-time updates + Mongo sync
In Sanity project settings:
1. API → Webhooks → Add webhook
2. URL:
   - `https://your-app.vercel.app/api/sanity/sync`
3. Add a header:
   - `x-propertymagazine-secret: <SANITY_WEBHOOK_SECRET>`
4. Trigger on: create, update, delete (at least create/update)
5. Filter:
   - `_type == "article" || _type == "property"`

When you publish/update in Sanity, the app will:
- Upsert `articles/properties` cache in Mongo (optional but useful)
- Revalidate `/`, `/articles`, `/properties`, and the detail page

### B) Verify end-to-end
- Homepage loads on Vercel
- OAuth login works
- Publishing an article/property in Sanity shows on the website
- Bookmarks persist after refresh (signed-in)
- Moodboards create + persist

---

## Note about “ZIP output”
I can’t attach a zip directly from here, but this folder already contains the complete code. To create a zip on Windows:
- Right-click the project folder → “Send to” → “Compressed (zipped) folder”
