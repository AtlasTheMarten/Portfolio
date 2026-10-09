# Portfolio site notes

Working notes for engineeringmarten.com. This folder starts with `_`, so GitHub Pages does not publish it, but anyone can read it on GitHub. Keep it free of anything private. A fuller private copy is kept as a Claude Doc.

## How it works
- `main` = the live site (GitHub Pages, custom domain set by `CNAME`).
- `working` = where every change lands first. Publish = merge `working` into `main`.
- Same files serve both. `assets/js/site.js` adds `html.draft` unless the host is engineeringmarten.com or *.github.io. Without `.draft`, write-up boxes containing `.placeholder` are hidden, and a write-up row whose three boxes are all placeholders (`.write-up.all-placeholder`) is hidden too.

## Structure
| Path | What it is |
| --- | --- |
| `index.html` | Home: hero, project cards, experience, toolbox, contact + marten banner |
| `projects/*.html` | Detail pages (generated, see below) |
| `assets/css/site.css` | All styles and colour tokens |
| `assets/js/dust.js` | Dust particles, drawn only inside the footer (around the marten); the rest of the page has none (circuit-trace experiment parked on the `dust-circuit` branch) |
| `assets/js/site.js` | Card tilt/glow, phone menu, live-vs-working switch |
| `assets/img/`, `assets/video/` | Media |
| `_tools/gen_pages.py`, `_tools/page_tpl.html` | Page generator: edit the data, then `python3 _tools/gen_pages.py` |

## Rules
- Project pages: change the data in `_tools/gen_pages.py` and re-run it rather than hand-editing `projects/*.html`.
- Resume: replace both `Ethan_Wheeler_Resume_SEP_2026.pdf` and the old-URL copy `Ethan Wheeler resume feb 2026.pdf`.
- Videos under about 20 MB can live in `assets/video/`; longer ones go on YouTube.

## Content source
- Site text follows Ethan's CV reference (Oct 2026). Don't add claims it flags as "do not claim" (e.g. the 80% overlap figure, dense cerebellum signal, any NEUROD6–seizure link). The poster image still shows its original May 2024 wording.
- No phone number, GPA or recommenders on the site.

## To-do
- [ ] Review the drafted write-ups (third arm, LED tissue sealer, Resumé Arm, e-bike, Karolinska); the motor's "The build" and "What I'm learning" are still empty
- [ ] CAD or photos for the LED tissue sealing device (placeholder for now)
- [ ] Confirm captions: worm-gear joint drive, servo-driven gripper linkage, 12 stator coils
- [ ] Delete the stale `redesign-soft-blueprint` branch on GitHub
