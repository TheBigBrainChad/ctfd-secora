# Secora CTFd Theme

Custom CTFd theme and plugins for Secora CTF competition with Among Us / "The Skeld" theming.

## What's Included

### Theme: atr25-theme
Custom CTFd theme with:
- **Among Us / The Skeld aesthetic** — Reactor meltdown HUD, card swipe login, ship's crest
- **Custom landing page** — Animated stars, flying crewmates, role reveal loader
- **Sound effects** — Intro music, click sounds, background music
- **Dark space theme** — Transparent navbar, starfield background

### Plugins

#### secora_theme
Custom plugin for the root "/" route to serve the custom landing page.

#### ctfd-event-countdown
Event countdown plugin for CTF timing.

## Installation

1. Clone CTFd:
```bash
git clone https://github.com/CTFd/CTFd.git
cd CTFd
```

2. Copy the theme:
```bash
cp -r themes/atr25-theme CTFd/themes/
```

3. Copy the plugins:
```bash
cp -r plugins/secora_theme CTFd/plugins/
cp -r plugins/ctfd-event-countdown CTFd/plugins/
```

4. Configure via CTFd admin panel:
- Theme: atr25-theme
- Enable secora_theme plugin
- Set up pages and challenges

## Customization

### CTF Times (in index.html)
Edit the JavaScript timestamp:
```javascript
const CTF_START_TIME = 1772668800; // Unix timestamp
const CTF_END_TIME = 1777590000;
```

### Challenge Locations (Map Coordinates)
Edit challenge tags in database:
- x:X coordinate
- y:Y coordinate

## Credits

- Base theme: [atr25-theme](https://github.com/s3ansh33p/atr25-theme)
- CTFd: https://github.com/CTFd/CTFd
- Among Us assets © Innersloth

---

**Secora CTF** — "Identify the Impostor. Secure the Systems."
