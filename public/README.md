# Public Assets

Place your static assets here:

## Logo
- **File**: `countrydatingapp-high-resolution-logo.png` (or `logo.png`/`logo.svg` as fallback)
- **Recommended size**: 200x200px or larger (will be scaled down)
- **Format**: PNG (with transparency) or SVG
- **Location**: `/public/countrydatingapp-high-resolution-logo.png` (or `/public/logo.png`/`/public/logo.svg` as fallback)

## Favicon Files (Required)
Place these files in the `/public` folder:

1. **favicon.ico** - Main favicon (ICO format)
2. **favicon-96x96.png** - 96x96 PNG favicon
3. **apple-touch-icon.png** - Apple touch icon (180x180px recommended)
4. **web-app-manifest-192x192.png** - PWA icon 192x192
5. **web-app-manifest-512x512.png** - PWA icon 512x512
6. **site.webmanifest** - Web app manifest (already created)

## File Structure
```
public/
  ├── countrydatingapp-high-resolution-logo.png (or logo.png/logo.svg as fallback)
  ├── favicon.ico
  ├── favicon-96x96.png
  ├── apple-touch-icon.png
  ├── web-app-manifest-192x192.png
  ├── web-app-manifest-512x512.png
  └── site.webmanifest
```

## Usage
- **Favicon**: Automatically appears in browser tabs
- **Logo**: Appears on login, register, and dashboard pages
- **PWA Icons**: Used when installing the app as a Progressive Web App

If the logo file is not found, a text fallback will be displayed.

