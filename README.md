# React Test Task — Pharma Testing Dashboard

A single-page application built with React 19 + TypeScript + Vite. Users log in against the
[DummyJSON](https://dummyjson.com) test API and browse/track drug & vaccine testing records —
a dashboard, a searchable data table, a detail ("Process") view, and a bonus WebSocket chat. The
UI is styled after a pharmaceutical-company dashboard reference design
([Figma: DEMO for Dima Bukovsky](https://www.figma.com/design/FXH4IrR8Vho44BpcloBNfc/DEMO-for-Dima-Bukovsky)),
while the data itself is the generic DummyJSON `/products` endpoint — see "About the data" below.

## Functionality

- **Login** (`/login`) — authenticates against `POST https://dummyjson.com/auth/login`. Try
  `emilys` / `emilyspass` (or any [DummyJSON test user](https://dummyjson.com/users)). The
  session token is persisted to `localStorage` and restored on reload.
- **Home** (`/`) — dashboard with stat highlights and charts (line/bar/donut, via Recharts), all
  computed live from a real RTK Query response.
- **Tables** (`/tables`) — paginated, searchable data table fetched via RTK Query, with automatic
  response caching so revisiting a page/search doesn't re-fetch.
- **Process** (`/tables/:id`) — full detail view for a single record: location, dates, an image
  gallery/lightbox, "Get directions" (real Google Maps link), and "Add to Calendar" (generates a
  real downloadable `.ics` file).
- **Documentation** (`/documentation`) — in-app docs page summarizing the stack and page list.
- **Chat** (`/chat`) — bonus WebSocket chat connected to the public echo server
  `wss://ws.ifelse.io`; anything you send is echoed back by the server.
- Unauthenticated visitors are redirected to `/login`; unknown routes render a 404 page.

## About the data

DummyJSON's `/products` endpoint doesn't have fields like "facility", "trial dates", or
"manufacturer" — so those are derived **deterministically** from each product's real `id`,
`rating`, `stock`, `price`, and `discountPercentage` in
[`src/features/products/pharmaMapping.ts`](./src/features/products/pharmaMapping.ts). Same
product id always produces the same facility/dates/progress, and every number shown ultimately
traces back to the live API response — nothing on screen is random or hardcoded mock data.

## Tech stack / dependencies

| Purpose | Library |
|---|---|
| Build tool | [Vite](https://vite.dev/) |
| UI framework | React 19 + TypeScript |
| Routing | [React Router](https://reactrouter.com/) (v8, data mode) |
| Global/server state | [Redux Toolkit](https://redux-toolkit.js.org/) + [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) |
| Component library | [MUI (Material UI)](https://mui.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Linting/formatting | ESLint (flat config, typescript-eslint) + Prettier |

Full dependency list and versions are in `package.json`.

## Project structure

```
src/
  app/          # store, router, theme, layout, route guard, composition root (App.tsx)
  pages/        # one component per route
  features/     # domain-scoped: auth/, products/, chat/ — each owns its slice/api/components
  vite-env.d.ts
```

The `@` path alias points at `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`),
so imports look like `import { useAppSelector } from '@/app/hooks'` regardless of file depth.

## Getting started

Requires Node.js 22+.

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build      # type-check + production build
npm run preview    # preview the production build locally
npm run lint       # ESLint
npm run format     # Prettier --write
```

> Note: this project was scaffolded in a sandboxed environment without npm registry access, so
> `npm install` has not been run against it yet. Run it locally before `npm run dev`/`build` — if
> any peer-dependency versions have moved on since this was written, bump them as npm suggests.

## Deployment

Any static host works since this is a client-only SPA (React Router in browser data mode). To
deploy on **Vercel**:

```bash
npm i -g vercel
vercel
```

Or on **Netlify**: connect the repo, set build command `npm run build` and publish directory
`dist`. For a client-side router, add a redirect/rewrite rule so all paths serve `index.html`
(e.g. a `_redirects` file with `/* /index.html 200` for Netlify, or the equivalent `vercel.json`
rewrite for Vercel).

**Deployed at:** _add your live URL here once deployed_

## Notes for the mentor review

- All components are typed; `@typescript-eslint/no-explicit-any` is set to `error` in
  `eslint.config.js` to enforce the "no `any`" requirement.
- `React.memo`, `useRef`, `forwardRef` + `useImperativeHandle`, and `useEffect` cleanup are each
  used for a concrete reason (not just to check a box) — see `ProductCard.tsx`,
  `ImageLightbox.tsx`, `ProductDetailPage.tsx`, and `useWebSocket.ts` respectively, each with an
  inline comment explaining why.
- The pharma-themed table/dashboard values are all derived from real API fields, not mocked —
  see "About the data" above and `pharmaMapping.ts`.
- RTK Query cache tags (`tagTypes`/`providesTags`) are set up on the products API so future
  mutations (e.g. an edit/delete feature) can invalidate exactly the right cached entries.


todo:  
seen how to use useCalback, how to properlly works useMeno, 

react memo high order component 