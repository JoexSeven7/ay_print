# AY PRINT — Local Development Setup

## Quick Start (Windows)

1. **Double-click `setup.bat`** to install dependencies and build CSS
2. **Download Font Awesome** (see below)
3. **Configure your Formspree ID** (see below)
4. **Deploy!**

---

## Manual Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Build Tailwind CSS
```bash
npm run build:css
```

### Step 3: Download Font Awesome
1. Go to: https://fontawesome.com/download
2. Download "Free Web" package
3. Extract to temporary folder
4. Copy `webfonts/` folder to project root
5. Copy `css/all.min.css` to `css/fontawesome.min.css`

### Step 4: Configure Formspree ID
Edit **`data/config.json`** and update the `formspree` object:
```json
"formspree": {
    "id": "your-formspree-id-here",
    "endpoint": "https://formspree.io/f/your-formspree-id-here",
    "connectSrc": "https://formspree.io"
}
```
Get your free form ID at: https://formspree.io

### Step 5: Update Site Configuration
All site-wide settings live in **`data/config.json`**. Edit:
- `contact` — address, phone, WhatsApp, email, hours
- `social` — social media profile URLs
- `stats` — business statistics for counters
- `branding` — color values (also in `css/input.css` as CSS variables)
- `copyright.fallbackYear` — fallback year if dynamic year fails
- `company` — company name, logo, since year, description

---

## Adding Your Products & Images

- Product catalogue lives in **`data/products.json`**. Edit titles, prices, categories,
  sizes, finishes, images, etc.
- Drop real product photos into **`images/products/`** (and portfolio shots into
  `images/portfolio/`). Missing images fall back to `images/placeholder.svg`.
- Replace `images/ay_logo.png`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png`
  and `favicon.ico` with your real brand assets.

---

## Development

### Watch mode (auto-rebuild on changes)
```bash
npm run watch:css
```

### Run local server
```bash
npx serve
```
Then open: http://localhost:3000

> The site fetches JSON files over HTTP, so you must use a server
> (`npx serve`), not open the file directly (`file://`). If the fetch fails,
> pages show an empty state instead of falling back to embedded data.

---

## Production Checklist

- [ ] Run `npm install`
- [ ] Run `npm run build:css`
- [ ] Download & setup Font Awesome
- [ ] Set your Formspree ID in `data/config.json`
- [ ] Update contact info, social links, and stats in `data/config.json`
- [ ] Add real product images + logo/favicons
- [ ] Test all forms work
- [ ] Deploy to hosting provider

---

## Troubleshooting

### "npm is not recognized"
Install Node.js from: https://nodejs.org

### "Cannot find module 'tailwindcss'"
Run: `npm install`

### Forms not working
Make sure you set your real Formspree endpoint in the `formspree` section of
`data/config.json`.

### Icons not showing
Download Font Awesome webfonts folder and place in project root.

### Products not loading
You must serve over HTTP (`npx serve`). Opening `index.html` directly via `file://`
will show empty states instead of loading `data/products.json`.
