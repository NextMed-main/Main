#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates PWA icons in required sizes (192x192 and 512x512)
 *
 * This script creates simple placeholder icons with the NextMed branding.
 * For production, replace these with professionally designed icons.
 */

const fs = require("fs");
const path = require("path");

const sizes = [192, 512];
const iconsDir = path.join(__dirname, "../public/icons");

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate SVG icons
sizes.forEach((size) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#6366f1"/>
  
  <!-- Medical Cross -->
  <g transform="translate(${size / 2}, ${size / 2})">
    <rect x="${-size * 0.08}" y="${-size * 0.25}" width="${size * 0.16}" height="${size * 0.5}" fill="white" rx="${size * 0.02}"/>
    <rect x="${-size * 0.25}" y="${-size * 0.08}" width="${size * 0.5}" height="${size * 0.16}" fill="white" rx="${size * 0.02}"/>
  </g>
  
  <!-- Shield outline for security/privacy -->
  <path d="M ${size * 0.5} ${size * 0.15} 
           L ${size * 0.7} ${size * 0.25} 
           L ${size * 0.7} ${size * 0.55} 
           Q ${size * 0.7} ${size * 0.75} ${size * 0.5} ${size * 0.85}
           Q ${size * 0.3} ${size * 0.75} ${size * 0.3} ${size * 0.55}
           L ${size * 0.3} ${size * 0.25} Z" 
        fill="none" 
        stroke="white" 
        stroke-width="${size * 0.015}" 
        opacity="0.3"/>
</svg>`;

  const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`✓ Generated ${size}x${size} SVG icon`);
});

console.log("\n✓ PWA icons generated successfully!");
console.log("\nNote: These are placeholder icons. For production, consider:");
console.log("  1. Using professional design tools (Figma, Adobe Illustrator)");
console.log("  2. Converting SVG to PNG with proper anti-aliasing");
console.log("  3. Testing icons on various devices and backgrounds");
console.log("  4. Ensuring icons meet maskable icon requirements\n");
