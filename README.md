# JW Therapeutics — React Remap

A React + Vite + Tailwind CSS remap of the JW Therapeutics homepage at
[jwtherapeutics.com/en](https://www.jwtherapeutics.com/en/). Built as a
single-route SPA with the full homepage rebuilt component-by-component using
real content and images scraped from the live site.

## Tech stack

- [Vite 5](https://vitejs.dev/) + React 18
- [Tailwind CSS 3](https://tailwindcss.com/) (utility-first styling with a
  custom `brand` color palette)
- [React Router v6](https://reactrouter.com/) (single `/` route, ready to
  expand for sub-pages later)

## Getting started

Prerequisites: Node.js 18+ (tested on Node 22), npm 9+.

```bash
npm install
npm run dev      # starts Vite dev server at http://127.0.0.1:5173
npm run build    # production build into dist/
npm run preview  # serves the production build locally
npm run scrape   # re-downloads images from jwtherapeutics.com into public/images/
```

## Project structure

```text
.
├── public/
│   └── images/                  # scraped logo, hero slides, section art, tiles
├── scripts/
│   └── scrape.mjs               # one-shot image downloader (safe to re-run)
├── src/
│   ├── components/
│   │   ├── Header.jsx           # nav + EN/简 + search + mobile menu
│   │   ├── Hero.jsx             # 3-slide auto-rotating banner
│   │   ├── AboutSection.jsx     # tab icons + About JW Therapeutics text
│   │   ├── ResearchHighlight.jsx# RELIANCE / CD19 CAR-T card
│   │   ├── PipelineSection.jsx  # comprehensive pipeline blurb
│   │   ├── NewsCenter.jsx       # 6-card news grid + "View All News"
│   │   ├── NewsCard.jsx
│   │   ├── QuickLinks.jsx       # Products / Process Development / Join Us
│   │   └── Footer.jsx           # legal links, copyright, ICP numbers
│   ├── data/
│   │   ├── nav.js               # primary + dropdown nav, footer links
│   │   └── news.js              # 6 scraped news items
│   ├── pages/
│   │   └── Home.jsx             # composes all sections
│   ├── App.jsx                  # BrowserRouter + single route
│   ├── main.jsx
│   └── index.css                # Tailwind directives + component classes
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Homepage sections

1. **Header** — sticky top bar with logo, primary nav (Home, About Us, R&D
   and Manufacturing, Media, Investor, Career — each with hover dropdowns),
   EN / 简 toggle, search popover, mobile hamburger.
2. **Hero** — full-width auto-rotating carousel of the three official banner
   images with indicator dots.
3. **About JW Therapeutics** — three tab icons (Pipeline, Products, Press
   Release) plus the HKEx:2126 company blurb.
4. **Research Highlight** — large featured card on the RELIANCE Trial /
   CD19 CAR-T (relma-cel) clinical response.
5. **Pipeline Section** — "Comprehensive and differentiated cell therapy
   pipeline..." block with a CTA into the live pipeline page.
6. **News Center** — responsive 3-column grid of the 6 latest press releases
   with "Read More" links, plus a "View All News" CTA.
7. **Quick Links** — three feature tiles for Products, Process Development,
   and Join Us.
8. **Footer** — Forward-Looking Statements / Disclaimer / Privacy Terms
   links, business credentials image, copyright, visitor count, ICP and
   公网安备 numbers.

## Out of scope (v1)

- Sub-pages behind the nav dropdowns (links point at the live `jwtherapeutics.com` site)
- Real i18n (EN / 简 toggle navigates to the live site's Chinese homepage)
- Search backend (form submits to the live `/en/search-result/` endpoint)
- CMS / dynamic news fetching (news data is hard-coded in `src/data/news.js`)

## Asset attribution

All images under `public/images/` and all textual content (company blurb,
research highlight, pipeline description, news headlines) are © JW
Therapeutics (Shanghai) Co., Ltd. They are reproduced here for a
non-commercial remap exercise only. Original source:
<https://www.jwtherapeutics.com/en/>.
