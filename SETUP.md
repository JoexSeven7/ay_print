# AY PRINT — Local Development Setup

## Quick Start (Windows)

1. **Double-click `setup.bat`** to install dependencies and build CSS
2. **Download Font Awesome** (see below)
3. **Replace Formspree ID** (see below)
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

### Step 4: Replace Formspree ID
In these files, replace `FORMSPREE_ID` with your actual Formspree form ID:
- `contact.html` (quote/order form)
- `index.html` (newsletter form)
- `product-detail.html` (request-quote modal, if used)

Get your free form ID at: https://formspree.io

---

## Adding Your Products & Images

- Product catalogue lives in **`data/products.json`**. Edit titles, prices, categories,
  sizes, finishes, images, etc. Keep it in sync with the embedded fallback in `js/products.js`.
- Drop real product photos into **`images/products/`** (and portfolio shots into
  `images/portfolio/`). Missing images fall back to `images/placeholder.svg`.
- Replace `images/logo.png`, `favicon-*.png`, `apple-touch-icon.png`, `android-chrome-*.png`
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

> The site fetches `data/products.json` over HTTP, so you must use a server
> (`npx serve`), not open the file directly (`file://`). If opened via `file://`,
> the pages fall back to embedded sample data.

---

## Production Checklist

- [ ] Run `npm install`
- [ ] Run `npm run build:css`
- [ ] Download & setup Font Awesome
- [ ] Replace `FORMSPREE_ID` with actual Formspree ID
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
Make sure you replaced `FORMSPREE_ID` with your actual Formspree form ID.

### Icons not showing
Download Font Awesome webfonts folder and place in project root.

### Products not loading
You must serve over HTTP (`npx serve`). Opening `index.html` directly via `file://`
will use the embedded fallback data instead of `data/products.json`.
