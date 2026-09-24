# CampusLens

CampusLens is a college discovery and comparison MVP. It is built on the existing Next.js App Router frontend. The application supports server-side college search, filtering, sorting, pagination, detailed college pages, and two- or three-college comparison while preserving the original editorial academic visual system.

## Features

The MVP provides college discovery by name, short name, city, state, description, tags, and course; composable location, course, fee, and rating filters; allowlisted sorting; database-level pagination; college details with courses, placements, and reviews; and comparison of two or three colleges.

When `DATABASE_URL` is configured, PostgreSQL is the source of truth. When it is intentionally absent, the query layer uses the original fictional dataset as a local development fallback so the UI and production build can still be checked without claiming database execution succeeded.

## Architecture

```text
Next.js pages and components
          ↓
      lib/queries.ts
          ↓
 Next.js Route Handlers / Prisma
          ↓
       PostgreSQL / Neon
```

The query layer is centralized in `lib/queries.ts`. The public REST endpoints are implemented as Next.js Route Handlers under `app/api`. Route handlers validate all query parameters and return consistent `{ data, pagination }` or `{ error }` response shapes. Prisma is initialized through `lib/prisma.ts` using a development-safe singleton.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14.2.35, React 18, TypeScript 5.4.5, TailwindCSS |
| Routing | Next.js App Router |
| Backend | Next.js Route Handlers |
| Database | PostgreSQL |
| ORM | Prisma 5 |
| Deployment target | Vercel with Neon PostgreSQL |

## Database schema

The Prisma schema is in `prisma/schema.prisma`. `College` stores the searchable and displayable institution profile and the persisted visual accent index. `Course` is a one-to-many child of `College`. `Placement` is a one-to-one child keyed by unique `collegeId` and owns package and placement metrics. `Review` is a one-to-many child of `College`.

Relationships use explicit foreign keys and deliberate `RESTRICT` delete behavior. Indexes cover `College.slug`, `city`, `state`, `rating`, `annualFees`, `name`, `Course.collegeId`, `Course.name`, `Placement.collegeId`, `Review.collegeId`, and `Review.rating` based on the application’s query patterns.

## API endpoints

| Method and path | Purpose |
| --- | --- |
| `GET /api/colleges` | Search, filter, sort, and paginate colleges. |
| `GET /api/colleges/[id]` | Fetch a college by database ID; the existing slug is also accepted for frontend compatibility. |
| `GET /api/compare?ids=id1,id2,id3` | Fetch exactly two or three unique colleges for comparison. |

`GET /api/colleges` accepts `q`, `location`, `city`, `state`, `course`, `minFees`, `maxFees`, `minRating`, `sort`, `page`, and `limit`. Sort values are restricted to `relevance`, `rating`, `fees`, `fees-low`, `fees-high`, `placement`, `package`, and `name`. `limit` is capped at 50, and an out-of-range page is safely clamped to the last available page.

A successful listing has this shape:

```json
{
  "data": [],
  "pagination": { "page": 1, "limit": 12, "total": 0, "totalPages": 1 }
}
```

A successful detail or comparison response has a `data` property. Invalid input returns HTTP 400, missing colleges return HTTP 404, and unexpected server failures return a generic HTTP 500 response without stack traces or database details.

## Environment variables

Copy `.env.example` to `.env` and provide a PostgreSQL connection string:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/campuslens?sslmode=require"
```

`.env` is intentionally not committed. A local PostgreSQL instance or a Neon pooled connection can be used.

## Local setup

```bash
npm install
npm run prisma:generate
npm run db:migrate
npm run db:seed
npm run dev
```

If PostgreSQL is unavailable, omit the migration and seed commands. The site can still be built and inspected using the original local dataset fallback, but database-backed API execution remains unverified until `DATABASE_URL` is available.

## Prisma commands

```bash
npm run prisma:validate
npm run prisma:generate
npm run db:migrate
npm run db:seed
```

The seed script is `prisma/seed.ts`. It reuses the approximately 12 original fictional colleges from `lib/data/colleges.ts` and normalizes their courses and reviews. Placement records are created for every college; median package and placement rate are derived MVP fields because they were not present in the original frontend dataset.

## Verification commands

```bash
npm run typecheck
npm run lint
npm run build
```

With a configured database, also verify:

```bash
curl http://localhost:3000/api/colleges
curl 'http://localhost:3000/api/colleges?q=engineering&sort=rating&page=1&limit=12'
curl 'http://localhost:3000/api/colleges?city=Mumbai'
curl 'http://localhost:3000/api/colleges?minRating=4'
curl 'http://localhost:3000/api/colleges?minFees=100000&maxFees=300000'
curl 'http://localhost:3000/api/compare?ids=1,2'
```

## Vercel & Neon deployment

Create a Neon PostgreSQL database, copy its pooled or direct connection string into Vercel as `DATABASE_URL`, and deploy the repository as a Next.js project. Run the migration against the deployment database with `npm run db:migrate`, then run `npm run db:seed` once. Vercel builds should run `npm run build`; Prisma Client is generated during dependency installation or can be generated explicitly before the build.

## Verification status

The following are verified without a live database: Prisma generation and schema validation with a placeholder URL, seed-data integrity, TypeScript, ESLint, the production build, and API contract smoke tests against the documented fallback path. PostgreSQL migration application, seed execution, and API queries against actual database rows remain **NOT VERIFIED — DATABASE_URL REQUIRED**.

## Known limitations

Authentication, saved colleges, recommendations, discussions, payments, and administrative workflows remain intentionally outside the MVP scope. The original dataset contains summary placement values but not median package or placement-rate fields, so the seed derives those two placement values for display completeness. A live database was not available in this workspace; schema validation, Prisma client generation, TypeScript checking, and the no-database build path can be verified locally, while migration application and seed execution require a real PostgreSQL connection.

## Important implementation decisions

Next.js server components use the centralized query seam rather than scattering fetch calls across components; the query seam uses Prisma when `DATABASE_URL` is configured and retains the original dataset only as an explicit no-database fallback. The frontend never uses the mock array for the configured production database path. The original dataset is used as the seed source and for local fallback only.

The frontend’s centralized query seam was preserved rather than scattering fetch calls across components. The list API filters and paginates in the database when configured, and sort fields are mapped through a strict allowlist. The detail API accepts both IDs and slugs so the existing `/colleges/[id]` route remains stable. The comparison endpoint rejects zero, one, duplicate, invalid, or more-than-three IDs. Explicit relation constraints use `RESTRICT` deletes to avoid silently removing college data.
