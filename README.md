# gunaangs.github.io

Personal site for **Gunaseelan** — Android developer, Chennai.

Live at **<https://gunaangs.github.io>**.

## What this is

One static page: a short intro, the three apps I've launched, and a way to get
in touch. No framework, no build step, no dependencies.

```
index.html             markup + all copy
styles.css             design tokens, layout, light/dark themes
script.js              theme toggle, scroll reveals, active nav link
404.html               fallback page
icon-securenotes.png   real app icon, 192px, transparent corners
icon-appshield.png     real app icon, 192px, transparent corners
icon-pixelsqueeze.png  real app icon, 192px, transparent corners
qr-securenotes.svg     Play Store QR — com.angs.securenotes
qr-appshield.svg       Play Store QR — com.angs.appshield
qr-pixelsqueeze.svg    Play Store QR — com.angs.pixelsqueeze
.nojekyll              tells GitHub Pages to serve files as-is
```

The whole site is about 117 KB.

## Running it locally

Open `index.html` in a browser. That's genuinely it.

To serve it over HTTP instead (closer to how Pages behaves):

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Deploying

The `master` branch is the site. Push, and GitHub Pages publishes it:

```bash
git push origin master
```

One-time setup: **Settings → Pages → Source → Deploy from a branch**, then
pick `master` / `/ (root)`. The first build takes a minute or two.

## Editing content

All copy lives in `index.html` as plain markup. Sections are marked with
comment banners — `Hero`, `About`, `Apps`, `Contact` — so search for the banner
and edit in place.

To add a third app, copy an `<article class="appcard">` block inside
`.app-grid` and change the text; the grid reflows on its own. You'll also want
a QR for it — see below.

### Regenerating the app icons

`icon-*.png` are the real store icons, downscaled to 192px (3× the 64px
display size) from the source apps:

- `secure-notes/assets/images/icon.png`
- `app-shield/assets/icon.png`

The Secure Notes source already has transparent corners. **The AppShield
source does not** — it's RGB with an opaque white background, so dropping it
in as-is produces a light-grey outline on the dark card. To fix it, flood-fill
the background inward from the four corners using a *generous* luminance
threshold (~140, not ~240) so the anti-aliased grey ramp is caught too, then
recolour those pixels to the icon's own dark navy before downscaling —
otherwise LANCZOS blends the discarded white back in around the edge.

A geometric rounded-rect mask does **not** work here: the source corner isn't
a true circular arc, so the mask diverges from it and leaks white at the arcs.

### Regenerating the QR codes

Each QR encodes a Play Store listing URL. They're plain SVG, black on white so
they scan in either theme. If a package name changes, regenerate with
[segno](https://pypi.org/project/segno/):

```bash
pip install segno
```

Then generate the matrix and write it out as one SVG path per code. The
existing files were produced at error-correction level M with a 3-module quiet
zone, and both were verified to decode back to their exact Play Store URL.

## Notes on the implementation

- **Themes** — every colour is a CSS custom property, redefined under
  `:root[data-theme="light"]`. An inline script in `<head>` resolves the theme
  before first paint so light-mode visitors never see a dark flash. Without
  JavaScript the page falls back to `prefers-color-scheme`.
- **Contrast** — every text/background pair was measured in both themes and
  clears WCAG AA (4.5:1). The `--text-dim` token sits right at the edge in both
  directions; the comments next to it say which way not to move it.
- **Touch targets** — all links and buttons are at least 44×44.
- **Progressive enhancement** — `script.js` only adds the theme toggle, scroll
  reveals and active-nav highlighting. With JS off the page is fully readable.
- **Accessibility** — skip link, visible focus rings, semantic landmarks,
  `aria-current` on the active nav item, and a `prefers-reduced-motion` branch
  that disables all animation.
- **No external requests** — system font stack, inline SVG icons, local QR
  files, data-URI favicon. Nothing to block and nothing to wait for.
- **Print** — there's a print stylesheet, so the page prints cleanly.
