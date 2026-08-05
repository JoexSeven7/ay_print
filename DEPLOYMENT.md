# ATHARRYS PROPERTIES — Deployment Guide

This project is a **fully static website** (HTML + CSS + vanilla JS). There is no
backend, database, or build server required. That means you can host it on **any**
static host: Netlify, GitHub Pages, Cloudflare Pages, Vercel, or a traditional
shared/cPanel host. No server-side code, no Node runtime needed in production.

---

## 1. Pre‑Deployment Checklist (do these BEFORE going live)

I have already fixed the critical blockers below in your code. Items marked
**[YOU MUST DO]** still need your input.

- [x] **CSP allowed Formspree** — `connect-src` and `form-action` now permit
      `https://formspree.io` in all 8 HTML pages. (Without this, every contact /
      newsletter / schedule form silently failed on the live server.)
- [x] **Contact form `id="contactForm"` added** in `contact.html` so the AJAX
      submit handler binds (previously it did a raw page navigation to Formspree).
- [x] **Broken image path `images/.house2.jpeg` → `images/house2.jpeg`** fixed in
      `data/properties.json` and the 3 embedded‑data copies in `js/*.js`.
- [x] **`properties.html` empty `<title>`** fixed.
- [ ] **[YOU MUST DO] Create Formspree forms and replace the remaining
      `FORMSPREE_ID` placeholders.** The live `contact.html` already uses a real
      ID (`xykqypyw`), but these still say `FORMSPREE_ID` and will error on submit:
        - `index.html` → newsletter form (`id="newsletterForm"`)
        - `property-detail.html` → schedule viewing form (`id="scheduleViewingForm"`)
        - `property-detail.html` → contact‑agent modal (`id="contactAgentForm"`)
      Go to https://formspree.io → create a form → copy the ID → replace each
      `FORMSPREE_ID` with it. (You can reuse one form ID for all three if you want
      everything in one inbox, but separate forms are cleaner.)
- [ ] **[RECOMMENDED] Rebuild Tailwind CSS** so `css/output.css` is current:
      `npm install` then `npm run build:css`. The committed `output.css` is
      already present, but rebuild if you edited any classes.
- [ ] **[RECOMMENDED] Optimise the hero videos.** `videos/realestvid2.mp4` (~55 MB)
      and `videos/realestvid3.mp4` (~47 MB) are very large and will slow first
      paint. Compress to H.264 ~2–5 MB each, or move them to a CDN / YouTube embed.
- [ ] **Verify all images exist.** You have 58 images in `images/`. Confirm every
      path referenced in `data/properties.json` and the static HTML cards exists.
      The `onerror` fallbacks point to `images/build1.jpeg`, which exists.
- [ ] **(Optional) Self‑host Font Awesome** instead of the CDN `@import` in
      `css/fontawesome.min.css`. Today icons load from `cdnjs.cloudflare.com`
      (allowed by your CSP). It works, but if you want zero external dependencies,
      download the "Free Web" package, drop `webfonts/` in the project root, and
      replace the `@import` line with the local `all.min.css` content.
- [ ] **Set a real domain / business emails** in the footer & contact page if the
      current `info@atharrysproperties.com` / `atharryshomes@gmail.com` are not live.

### How the site loads data (important)
`js/main.js`, `js/properties.js`, `js/property-detail.js` call
`fetch('data/properties.json')`. This **requires a web server** (HTTP), not opening
the file directly (`file://`). All the hosts below serve over HTTP, so this works.
If the fetch ever fails, the pages fall back to embedded data in the JS — but keep
`data/properties.json` as the single source of truth and keep it in sync with the
embedded copies when you edit listings.

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
images/videos/data files). Do **not** upload `node_modules/` or `package-lock.json`.

### Option A — Netlify Drag & Drop (fastest, no Git account needed)
1. Go to https://app.netlify.com/drop
2. Drag the **whole project folder** onto the page.
3. Netlify gives you a `*.netlify.app` URL instantly. Done.
4. To use your domain later: Site settings → Domain management → Add custom domain.

### Option B — Netlify via Git (recommended for ongoing updates)
1. Push this folder to a GitHub/GitLab repo.
2. Netlify → "Add new site" → import the repo.
3. Build command: `npm run build:css`  •  Publish directory: `.` (the root)
4. Every `git push` redeploys automatically. Add a `_redirects` file only if you
   later add SPA routing (not needed now).

### Option C — GitHub Pages (free, needs Git)
1. Push to a GitHub repo.
2. Repo Settings → Pages → Source: `main` branch, folder `/ (root)`.
3. Site goes live at `https://<user>.github.io/<repo>/`.
   Note: it will be under a sub‑path; all your relative links (`css/...`,
   `js/...`, `images/...`) already work from a sub‑path, so no changes needed.

### Option D — Cloudflare Pages
1. Dashboard → Pages → Create a project → connect Git.
2. Build command: `npm run build:css`  •  Build output: `.`
3. Free SSL, global CDN.

### Option E — Traditional cPanel / shared hosting (e.g. Namecheap, Hostinger)
1. In cPanel open **File Manager** → `public_html`.
2. Upload all project files/folders into `public_html` (keep the same structure).
3. Visit your domain. Done. (Most hosts already serve `.json` with the right MIME
   type; if properties don't load, ask support to enable `application/json`.)

---

## 4. Domain & HTTPS
- Add your domain in the host's dashboard (Options A–D handle SSL automatically).
- For cPanel, install a free **Let's Encrypt** certificate in cPanel → SSL/TLS.
- Your CSP uses `https://` CDN sources, so HTTPS is required for icons to load
  consistently — always serve the site over HTTPS.

---

## 5. Post‑Deploy Verification
Open the live URL and check:
1. Homepage hero video + stats counters animate.
2. **Properties page** loads listings from `data/properties.json` (open DevTools →
   Network → confirm `properties.json` returns 200).
3. **Property detail** page opens via `property-detail.html?id=1`.
4. **Forms**: submit the contact, newsletter, schedule‑viewing, and contact‑agent
   forms → you should get the success alert and receive the email via Formspree.
   (If any fail, the cause is almost always the `FORMSPREE_ID` placeholders above.)
5. **Icons** render (Font Awesome from cdnjs).
6. **Google Maps** iframe shows on contact & property pages.
7. Open DevTools → Console → no red CSP/404 errors.

---

## 6. Known Limitations / Future Work
- Listings live in `data/properties.json` + duplicated embedded copies in `js/*.js`.
  Editing one without the other causes drift. Centralise later (or generate JSON at
  build time).
- `data/properties.json` descriptions are placeholder text for some entries (e.g.
  id 3 says "office space in Abuja" but the title is a Lekki duplex). Clean up copy.
- Favorites use `localStorage` (per‑device only) — fine for a brochure site.
- Videos are large; compress or offload to a CDN for better mobile performance.
