# ATHARRYS PROPERTIES - Local Development Setup

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
- `contact.html`
- `index.html`  
- `property-detail.html`

Get your free form ID at: https://formspree.io

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

---

## File Changes Summary

| File | Change |
|------|--------|
| `css/input.css` | Tailwind input (source) |
| `css/output.css` | Tailwind compiled (generated) |
| `css/fontawesome.min.css` | Font Awesome styles |
| `tailwind.config.js` | Tailwind configuration |
| `package.json` | npm dependencies |
| `setup.bat` | Windows setup script |
| All `.html` files | Changed from CDN to local CSS |

---

## Production Checklist

- [ ] Run `npm install`
- [ ] Run `npm run build:css`
- [ ] Download & setup Font Awesome
- [ ] Replace `FORMSPREE_ID` with actual Formspree ID
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
