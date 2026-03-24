# Plan B WebApp (RINOMED 2026)

Fallback web deployment in case iOS/Android store publication is delayed or rejected.

## What this does

- Builds `apps/mobile_ionic` in production mode.
- Copies generated `www` output into `apps/planb_webapp/dist`.
- Adds SPA routing (`_redirects`) and cache headers (`_headers`) for static hosting.

## Features included

All features from the Ionic app are available in this web build, including:

- Agenda, Speakers, Sponsors, Info, Certificate, Profile
- **Comunidad RINOMED** — `/tabs/community`
  - Photo upload with RINOMED frame composition (Canvas API)
  - Download composed image
  - Copy Instagram caption
  - Open Instagram
  - Gallery of approved community submissions
  - Backend: `POST /v1/community/submissions`, `GET /v1/community/gallery`

> The community backend requires the `CommunitySubmission` Prisma migration to be applied:
> ```zsh
> cd services/api && npx prisma migrate dev --name add_community_submission
> ```

## Quick start

```zsh
cd apps/planb_webapp
npm run build
npm run check
npm run serve
```

Open: `http://localhost:8080`

## API override by environment variable

You can override the API base URL for Plan B builds without editing source files:

```zsh
cd apps/planb_webapp
PLANB_API_BASE_URL="https://adminweb-production-d7b5.up.railway.app" npm run build
```

The default source URL replaced in generated assets is:

`https://adminweb-production-d7b5.up.railway.app`

If this default changes in the future, you can also provide `PLANB_SOURCE_API_URL`:

```zsh
PLANB_SOURCE_API_URL="https://old-api.example.com" PLANB_API_BASE_URL="https://new-api.example.com" npm run build
```

## Deploy options

### Netlify

- Build command: `cd apps/planb_webapp && npm run build`
- Publish directory: `apps/planb_webapp/dist`

`netlify.toml` is included.

### Vercel

`vercel.json` is included. Import the repo and deploy.

### Any static hosting

Upload the content of:

`apps/planb_webapp/dist`

## Notes

- Production API URL (Plan B) is `https://adminweb-production-d7b5.up.railway.app` and comes from `apps/mobile_ionic/src/environments/environment.prod.ts`.
- For store fallback, recommended DNS: `web.rinomed2026.com`.
