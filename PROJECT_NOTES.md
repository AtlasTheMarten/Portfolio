# Portfolio — Companion Notes

Reference for Claude sessions. Update as the site changes.

## Overview
- Static personal engineering portfolio for Ethan Wheeler (UTK Biomedical Engineering, Neuroscience minor).
- Hosted on GitHub Pages (`AtlasTheMarten/Portfolio`), custom domain via `CNAME` → `engineeringmarten.com`.
- No build step, no JS framework. Previously edited with Gemini; most commits are GitHub web uploads.

## Files
| File | Role |
|---|---|
| `index.html` | Live site (single page) |
| `Base Site.html` | Older near-duplicate of `index.html` (no favicon); likely a backup |
| `Atlas (2).png` | Favicon |
| `photo_2026-02-18_11-21-31.jpg` | Hero headshot |
| `Axial flux motor cad.png` | Featured project image |
| `Bottom banner.png` | Footer background banner |
| `Ethan Wheeler resume feb 2026.pdf` | Resume download |
| `teleopsimgif.gif` (6.9 MB) | **Unused** in `index.html` |
| `Screenshot 2026-09-01 163245.png` | **Unused** in `index.html` |

## Stack
- Tailwind via CDN (`cdn.tailwindcss.com`), Font Awesome 6 (cdnjs), Google Fonts (Inter, JetBrains Mono).
- Custom CSS in `<style>`: `.glass`, `.gradient-text`, `.video-placeholder`, `.video-container`, `.status-pulse`.
- Dark theme only (`--bg-dark: #0f172a`, accent `#3b82f6`).

## Page sections (`index.html`)
1. Nav (fixed, glass) + resume download button
2. `#home` hero — intro + headshot
3. `#experience` "01. Professional Journey" timeline — USPHS/IHS, Kelvion, Karolinska, UT NIMBioS
4. `#projects` "02. Personal Projects"
   - Featured "Currently Working On": Axial Flux Motor
   - "02.1 Past Projects": Resumé Arm (YouTube embed), Electric Bike Conversions (icon placeholder, no media)
5. Skills (3 cards, no id / not in nav)
6. `#contact` footer — email, phone, LinkedIn, site link, banner

## Conventions / gotchas
- Assets referenced by **absolute** URLs `https://AtlasTheMarten.github.io/Portfolio/<file with spaces>` rather than relative paths.
- Filenames contain spaces (unencoded in `src`/`href`).
- Phone number is visible in footer (an earlier commit had commented it out).
- Mobile nav: links hidden below `md`, no hamburger menu.

## Log
- 2026-09-28: Initial repo review by Claude; notes created.
