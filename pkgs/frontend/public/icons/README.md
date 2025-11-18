# PWA Icons

## Current Status
SVG icons have been generated. PNG conversion is required for full PWA compatibility.

## Manual Conversion Steps

### Option 1: Using Online Tools
1. Visit https://svgtopng.com/ or similar service
2. Upload each SVG file from this directory
3. Download as PNG with the same dimensions
4. Save as `icon-192x192.png` and `icon-512x512.png`

### Option 2: Using ImageMagick (Command Line)
```bash
convert icon-192x192.svg icon-192x192.png
convert icon-512x512.svg icon-512x512.png
```

### Option 3: Using Node.js with Sharp
```bash
npm install sharp
node -e "const sharp = require('sharp'); sharp('icon-192x192.svg').png().toFile('icon-192x192.png');"
node -e "const sharp = require('sharp'); sharp('icon-512x512.svg').png().toFile('icon-512x512.png');"
```

### Option 4: Using Inkscape
```bash
inkscape icon-192x192.svg --export-type=png --export-filename=icon-192x192.png
inkscape icon-512x512.svg --export-type=png --export-filename=icon-512x512.png
```

## Icon Requirements
- **192x192**: Used for app icon on home screen
- **512x512**: Used for splash screen and high-res displays
- **Format**: PNG with transparency
- **Purpose**: "any maskable" (safe zone for maskable icons)

## Design Notes
Current icons feature:
- Primary color: #6366f1 (Indigo)
- Medical cross symbol
- Shield outline (representing security/privacy)
- Suitable for both light and dark backgrounds

For production, consider professional design with:
- Brand consistency
- Accessibility (sufficient contrast)
- Recognizability at small sizes
- Maskable icon safe zone (80% of icon area)
