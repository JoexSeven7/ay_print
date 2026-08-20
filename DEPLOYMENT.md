# AY PRINT — Deployment Guide

This project is a **fully static website** (HTML + CSS + vanilla JS). There is no
backend, database, or build server required. That means you can host it on **any**
static host: Netlify, GitHub Pages, Cloudflare Pages, Vercel, or a traditional
shared/cPanel host. No server-side code, no Node runtime needed in production.

---

## 1. Pre‑Deployment Checklist (do these BEFORE going live)

- [x] **CSP allows Formspree** — `connect-src` and `form-action` permit
      `https://formspree.io` in all HTML pages.
- [x] **Quote form `id="quoteForm"`** present in `contact.html`.
- [x] **Broken image fallback** — every `<img>` uses
      `onerror="this.src='images/placeholder.svg'"`.
- [ ] **[YOU MUST DO] Set your Formspree endpoint** in `data/config.json`:
      ```json
      "formspree": {
          "id": "your-formspree-id",
          "endpoint": "https://formspree.io/f/your-formspree-id"
      }
      ```
      Go to https://formspree.io → create a form → copy the ID → paste it here.
      The JS (`js/main.js` and `js/contact.js`) reads it from config at runtime.
- [ ] **[YOU MUST DO] Update site configuration** in `data/config.json`:
      - `contact` — your real address, phone, WhatsApp, email, hours
      - `social` — your real social media URLs
      - `stats` — your real business statistics
- [ ] **[RECOMMENDED] Rebuild Tailwind CSS** so `css/output.css` is current:
      `npm install` then `npm run build:css`.
- [ ] **Add real images.** Supply product photos in `images/products/`, portfolio
      shots in `images/portfolio/`, and replace `images/ay_logo.png` + favicons.
- [ ] **Verify all image paths** referenced in `data/products.json` exist (or rely on
      the `placeholder.svg` fallback).
- [ ] **Verify all JSON data files** (`data/*.json`) are valid JSON.

### How the site loads data (important)
`js/main.js`, `js/products.js`, `js/product-detail.js`, `js/blog.js`,
`js/blog-post.js`, and `js/gallery.js` all call `fetch('data/*.json')`.
This **requires a web server** (HTTP), not opening the file directly (`file://`).
All the hosts below serve over HTTP, so this works. If a fetch fails, the page
shows an empty state or error in the console.

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
4. **Quote form**: submit → success alert + email via Formspree (fails if
   `data/config.json` has no real Formspree endpoint).
5. **Icons** render (Font Awesome from local `css/fontawesome.min.css`).
6. Open DevTools → Console → no red CSP/404 errors.
7. **Contact info, copyright year, and WhatsApp link** populate automatically from
   `data/config.json`.

---

## 6. Configuration Reference (`data/config.json`)

| Section       | Key              | Description                              |
|---------------|------------------|------------------------------------------|
| `company`     | `name`           | Brand name shown in footer & meta        |
| `company`     | `logo`           | Logo image path                          |
| `company`     | `since`          | Year founded (shown on about page)       |
| `contact`     | `address`        | Physical address                         |
| `contact`     | `phone`          | Phone number                             |
| `contact`     | `whatsapp`       | WhatsApp display number                  |
| `contact`     | `whatsappLink`   | Full WhatsApp URL (wa.me link)           |
| `contact`     | `email`          | Contact email                            |
| `contact`     | `hours`          | Business hours                           |
| `social`      | `facebook` etc.  | Social media profile URLs               |
| `stats`       | `itemsPrinted`   | Counter value for items printed          |
| `stats`       | `happyClients`   | Counter value for happy clients          |
| `stats`       | `yearsExperience`| Counter value for years experience       |
| `stats`       | `satisfaction`   | Counter value for satisfaction %         |
| `formspree`   | `id`             | Formspree form ID                        |
| `formspree`   | `endpoint`       | Full Formspree submission URL            |
| `branding`    | `primaryColor` etc.| Brand color hex values                 |
| `copyright`   | `useCurrentYear` | If `true`, uses JS `new Date().getFullYear()` |
| `copyright`   | `fallbackYear`   | Fallback year if dynamic year fails      |
