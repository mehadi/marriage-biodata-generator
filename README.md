# Marriage Bio Data Maker

Create professional Islamic marriage bio data with beautiful templates. Free, private, and easy to use—export to PDF or image. Available in **English** and **বাংলা (Bengali)**.

---

## Features

- **Structured form** — Personal, religious, education, professional, family, contact, and partner expectations
- **Live preview** — See your bio data update as you type
- **Eight templates** — Modern, Minimal, Gradient, Card, Elegant (modern styles); Traditional, Formal, Heritage (classic styles)
- **Drafts** — Save, load, and delete drafts in the browser (localStorage); no server storage
- **Export** — Download as PDF or PNG image, or print directly
- **Bilingual** — Full UI in English and Bengali with a persistent language preference
- **Privacy-first** — All data stays in your browser; nothing is sent to a server
- **Responsive** — Works on desktop and mobile; export works on all viewports

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **Create Bio Data** to build a biodata and export it.

### Build for production

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for SEO, sitemap, and Open Graph (e.g. `https://yourdomain.com`). No trailing slash. |

If unset, the app uses a default URL (see `lib/site-config.ts`).

---

## Project structure

| Path | Purpose |
|------|---------|
| `app/` | Next.js App Router: pages, layout, metadata, sitemap, robots, manifest |
| `components/` | UI components, form sections, templates (Modern/Traditional/Elegant), SEO (JsonLd, Breadcrumb) |
| `context/` | Language context for i18n |
| `hooks/` | `useBioDataForm` — form state, template selection, draft save |
| `lib/` | Site config, i18n (en/bn), section validation, utils |
| `services/` | Export (PDF/image/print), validation (Zod schemas), localStorage (drafts) |
| `types/` | BioData and related TypeScript types |

---

## Tech stack

| Category | Technologies |
|----------|--------------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Form | React Hook Form, Zod, @hookform/resolvers |
| Export | jsPDF, html-to-image |
| UI | Lucide React, react-day-picker, date-fns |
| Analytics (optional) | Vercel Analytics, Vercel Speed Insights |

---

## Author

**Mehadi Hasan**

- Email: [bdmehadih@gmail.com](mailto:bdmehadih@gmail.com)
- Website: [www.mehadi.me](https://www.mehadi.me)