# AY PRINT — Deployment Guide

This project is a **fully static website** (HTML + CSS + vanilla JS). There is no
backend, database, or build server required. That means you can host it on **any**
static host: Netlify, GitHub Pages, Cloudflare Pages, Vercel, or a traditional
shared/cPanel host. No server-side code, no Node runtime needed in production.

---

## 1. Pre‑Deployment Checklist (do these BEFORE going live)

- [x] **CSP allowed Formspree** — `connect-src` and `form-action` permit
      `https://formspree.io` in all HTML pages.
- [x] **Quote form `id="quoteForm"`** present in `contact.html`.
- [x] **Broken image fallback** — every `<img>` uses
      `onerror="this.src='images/placeholder.svg'"`.
- [ ] **[YOU MUST DO] Replace the remaining `FORMSPREE_ID` placeholders** with your
      real Formspree form ID:
        - `index.html` → newsletter form (`id="newsletterForm"`)
        - `contact.html` → quote/order form (`id="quoteForm"`)
        - `product-detail.html` → request-quote modal (if enabled)
      Go to https://formspree.io → create a form → copy the ID → replace each
      `FORMSPREE_ID` with it.
- [ ] **[RECOMMENDED] Rebuild Tailwind CSS** so `css/output.css` is current:
      `npm install` then `npm run build:css`.
- [ ] **Add real images.** Supply product photos in `images/products/`, portfolio
      shots in `images/portfolio/`, and replace `images/logo.png` + favicons.
- [ ] **Verify all image paths** referenced in `data/products.json` exist (or rely on
      the `placeholder.svg` fallback).
- [ ] **Set a real domain / business emails** in the footer & contact page.

### How the site loads data (important)
`js/main.js`, `js/products.js`, `js/product-detail.js` call `fetch('data/products.json')`.
This **requires a web server** (HTTP), not opening the file directly (`file://`).
All the hosts below serve over HTTP, so this works. If the fetch ever fails, the pages
fall back to embedded data in the JS — but keep `data/products.json` as the single
source of truth and keep it in sync with the embedded copies when you edit products.

---

## 2. Build (optional but recommended)

```bash
npm install
npm run build:css      # regenerates css/output.css from css/input.css
```

You do **not** need Node.js on the server — only on your machine to build CSS.

---

## 3. Deployment Options

Pick ONE. All of them just need the project folder's contents (the HTML/CSS/JS/
images/data files). Do **not** upload `node_modules/` or `package-lock.json`.

### Option A — Netlify Drag & Drop (fastest, no Git account needed)
1. Go to https://app.netlify.com/drop
2. Drag the **whole project folder** onto the page.
3. Netlify gives you a `*.netlify.app` URL instantly. Done.
4. To use your domain later: Site settings → Domain management → Add custom domain.

### Option B — Netlify via Git (recommended for ongoing updates)
1. Push this folder to a GitHub/GitLab repo.
2. Netlify → "Add new site" → import the repo.
3. Build command: `npm run build:css`  •  Publish directory: `.` (the root)
4. Every `git push` redeploys automatically.

### Option C — GitHub Pages (free, needs Git)
1. Push to a GitHub repo.
2. Repo Settings → Pages → Source: `main` branch, folder `/ (root)`.
3. Site goes live at `https://<user>.github.io/<repo>/`. Relative links already work
   from a sub‑path, so no changes needed.

### Option D — Cloudflare Pages
1. Dashboard → Pages → Create a project → connect Git.
2. Build command: `npm run build:css`  •  Build output: `.`
3. Free SSL, global CDN.

### Option E — Traditional cPanel / shared hosting (e.g. Namecheap, Hostinger)
1. In cPanel open **File Manager** → `public_html`.
2. Upload all project files/folders into `public_html` (keep the same structure).
3. Visit your domain. Done. (Most hosts serve `.json` with the right MIME type; if
   products don't load, ask support to enable `application/json`.)

---

## 4. Domain & HTTPS
- Add your domain in the host's dashboard (Options A–D handle SSL automatically).
- For cPanel, install a free **Let's Encrypt** certificate in cPanel → SSL/TLS.
- Your CSP uses `https://` CDN sources, so HTTPS is required for icons to load
  consistently — always serve the site over HTTPS.

---

## 5. Post‑Deploy Verification
Open the live URL and check:
1. Homepage hero + stats counters animate.
2. **Products page** loads listings from `data/products.json` (DevTools → Network →
   confirm `products.json` returns 200).
3. **Product detail** page opens via `product-detail.html?id=1`.
4. **Quote form**: submit → success alert + email via Formspree (fails if `FORMSPREE_ID`
   placeholders remain).
5. **Icons** render (Font Awesome from cdnjs).
6. Open DevTools → Console → no red CSP/404 errors.

---

## 6. Known Limitations / Future Work
- Products live in `data/products.json` + duplicated embedded copies in `js/products.js`.
  Editing one without the other causes drift. Centralise later (or generate JSON at
  build time).
- The "Add to Quote" shortlist uses `localStorage` (per‑device only) — fine for a
  brochure site.
- Sample copy/prices are placeholders — replace with real catalogue data.
