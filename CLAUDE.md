# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Galgo Keeper** — a personal tool to track content to read/watch (articles, papers, blogs, news), books, and videos (movies, TV shows, documentaries).

Stack: **Next.js + Tailwind CSS**. Data lives in client-side state only (no database yet). Resets on refresh.

## Commands

All commands run from the `content-manager/` subdirectory.

- `npm install` — install dependencies (must run before anything else, including Playwright MCP)
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — lint
- `npx playwright test` — run Playwright tests

## MCP

Playwright MCP is configured in `.mcp.json` (project root, NOT inside `.claude/`) with cwd set to `content-manager/`. It requires `npm install` to have been run first — without `node_modules` present, the MCP server will fail to connect.

## Architecture

Three content sections, each with its own set of routes:

### Content (articles, videos, papers, blogs, news)
| Route | Purpose |
|---|---|
| `/content` | Browse/filter by type, status, category. Desktop: two-column with inline detail panel |
| `/content/add` | Form to add a new content item |
| `/content/[id]` | Detail view (used on mobile, also direct URL access) |

### Books
| Route | Purpose |
|---|---|
| `/books` | Browse/filter by status, category. Desktop: two-column with inline detail panel |
| `/books/add` | Form to add a new book |
| `/books/[id]` | Detail view (used on mobile, also direct URL access) |

### Videos (movies, TV shows, documentaries)
| Route | Purpose |
|---|---|
| `/videos` | Browse/filter by type, status, category. Desktop: two-column with inline detail panel |
| `/videos/add` | Form to add a new video |
| `/videos/[id]` | Detail view (used on mobile, also direct URL access) |

### Dashboard
| Route | Purpose |
|---|---|
| `/` | Shows items currently in progress (reading books, in-progress content, watching videos) |

### Layout
- Desktop: fixed left sidebar nav (224px) + main content area
- Mobile: bottom tab bar nav, standard page navigation
- On desktop list pages, clicking an item opens a detail panel on the right instead of navigating away

## Data Model

All state is held in-memory via React context (`AppContext.tsx`). Resets on refresh.

### ContentItem
```
id, title, url, type, status, priority, category, isPrivate, yearCompleted, coverImage, statusHistory, notes, dateAdded
```
- type: "article" | "video" | "paper" | "blog" | "news" | "other"
- status: "queued" | "in-progress" | "done" | "dropped"

### Book
```
id, title, author, status, rating, category, isPrivate, yearCompleted, coverImage, statusHistory, notes, dateAdded
```
- status: "want-to-read" | "reading" | "finished" | "dropped"
- When created with "finished" status, statusHistory date is set to 31/12/YYYY of yearCompleted

### Video
```
id, title, type, status, rating, recommendedBy, category, isPrivate, yearCompleted, statusHistory, notes, dateAdded
```
- type: "movie" | "tv-show" | "documentary"
- status: "queued" | "watching" | "watched" | "dropped"

## Deployment

Two Vercel projects from this repo:

| Project | URL | What |
|---|---|---|
| `galgo-keeper` | https://galgo-keeper.vercel.app | Assignment landing page (`index.html`) |
| `content-manager` | https://content-manager-dusky.vercel.app | Next.js app (from `content-manager/`) |

Deploy the Next.js app: `cd content-manager && vercel --prod`

## Key Components

- `AppContext.tsx` — all data models, state, CRUD functions, status cycles, status history logic
- `Nav.tsx` — sidebar (desktop) + bottom tab bar (mobile)
- `CategoryInput.tsx` — autocomplete text input for categories (keyboard nav + click)
- `StatusTimeline.tsx` — vertical timeline with colored circles and dashed connectors

## Style

- Color-coded sections: Content (blue), Books (violet), Videos (amber)
- List pages use pill category headers + compact consolidated rows
- Items sorted: in-progress first, then queued, with completed hidden behind a toggle
- Detail views show a vertical status timeline with colored circles
- Photo capture (camera or gallery) on Content and Books add forms
- yearCompleted field appears conditionally when status is set to done/finished/watched
