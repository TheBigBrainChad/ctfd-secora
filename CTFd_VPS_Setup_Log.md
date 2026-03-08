# CTFd VPS Setup Log

## Overview
Setup a CTFd instance on VPS (164.90.231.249) with Among Us theme for Secora CTF competition.

---

## 1. Initial SSH Connection
```bash
ssh root@164.90.231.249
```

---

## 2. Install Docker on VPS
```bash
apt update && apt install -y docker.io docker-compose && systemctl enable docker && systemctl start docker
```

---

## 3. Clone CTFd and Theme
```bash
mkdir -p /opt/ctfd
cd /opt/ctfd
git clone https://github.com/CTFd/CTFd.git .
git clone https://github.com/s3ansh33p/atr25-theme.git ./themes/atr25-theme
git clone https://github.com/s3ansh33p/ctfd-event-countdown.git ./plugins/ctfd-event-countdown
```

---

## 4. Fix Volume Mount (Read-Only Issue)
The docker-compose.yml had `:ro` (read-only) mount. Fixed by editing:
```bash
# Changed from:
- .:/opt/CTFd:ro
# To:
- .:/opt/CTFd
```

---

## 5. Copy Theme to Correct Location
```bash
cp -r /opt/ctfd/themes/atr25-theme /opt/ctfd/CTFd/themes/atr25-theme
cp -r /opt/ctfd/plugins/ctfd-event-countdown /opt/ctfd/CTFd/plugins/ctfd-event-countdown
```

---

## 6. Start CTFd
```bash
cd /opt/ctfd
docker-compose up -d --build
```

---

## 7. Theme Configuration (Database)
Updated theme via direct SQL (ctf_theme config):
- Theme set to: `atr25-theme`

---

## 8. Challenge Tags Format Fix
Theme expects separate x/y tags, not combined. Fixed via Python:
```python
# Added separate tags for each challenge:
Tags(challenge_id=1, value="x:150")
Tags(challenge_id=1, value="y:100")
# Repeat for all challenges
```

---

## 9. Add Test Challenges
Created 5 challenges with map coordinates:
| Challenge | Category | Points | X | Y |
|-----------|----------|--------|---|---|
| Scan the Network | EASY | 100 | 150 | 100 |
| Decode This | EASY | 100 | 363 | 100 |
| SQL Injection | MEDIUM | 200 | 560 | 100 |
| Buffer Overflow | HARD | 300 | 753 | 100 |
| Hidden Door | MEDIUM | 250 | 350 | 380 |

Flags format: `secora{challenge_name}` (e.g., `secora{scan_the_network}`)

---

## 10. Add Click Sound
Uploaded sound file and modified base.html:
- Sound file: `/themes/atr25-theme/static/sounds/click.mp3`
- Modified: `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html`

Added JavaScript for click sounds:
```javascript
<script>
  const clickSound = new Audio('/themes/atr25-theme/static/sounds/click.mp3');
  clickSound.volume = 0.3;
  
  document.addEventListener('click', function(e) {
    const tag = e.target.tagName;
    if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT') {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  }, true);
</script>
```

Added sound on challenge modal open:
```javascript
<script>
  document.addEventListener('shown.bs.modal', function(e) {
    if (e.target.querySelector('[x-ref="challengeWindow"]') || e.target.classList.contains('modal')) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {});
    }
  });
</script>
```

---

## 11. Custom Landing Page
Copied from local NAS CTFd. Created page in database with route 'index':
- Title: "Secora CTF"
- Theme: Among Us styled with Fredoka One & Kanit fonts
- Button: "START TASK" linking to /login

---

## 12. Nginx Configuration Fix
The docker-compose nginx config was incorrect. Fixed:
- Original (broken): Mounted to `/etc/nginx/nginx.conf` but nginx:stable expects `/etc/nginx/conf.d/default.conf`
- Fixed: Created proper `/opt/ctfd/conf/nginx/nginx.conf` with correct structure

---

## 13. Theme Settings (Admin Panel JSON)
```json
{
  "challenge_window_size": "xl",
  "challenge_category_order": "function compare(a, b) { const order = [\"EASY\", \"MEDIUM\", \"HARD\"]; return order.indexOf(a.toUpperCase()) - order.indexOf(b.toUpperCase()); }",
  "challenge_order": "",
  "use_builtin_code_highlighter": true
}
```

---

## Files Modified/Created
- `/opt/ctfd/docker-compose.yml` - Fixed volume mount
- `/opt/ctfd/conf/nginx/nginx.conf` - Created proper nginx config
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added sound scripts
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/click.mp3` - Uploaded sound
- Database: Pages, Challenges, Tags, Flags, Configs

---

## URLs
- CTFd: http://164.90.231.249
- Admin: http://164.90.231.249/admin

---

---

## 14. Custom Landing Page Overhaul (2026-03-06)

### Overview
Redesigned the main landing page with a custom theme using the Secora badge logo.

### Backup
Before making changes, backed up the original theme:
```bash
mkdir -p /opt/ctfd/backups/20260306
cp -r /opt/ctfd/CTFd/themes/atr25-theme /opt/ctfd/backups/20260306_theme
cp /opt/ctfd/CTFd/themes/atr25-theme/templates/index.html /opt/ctfd/backups/20260306_index_backup.html
```

### Badge Image Upload
Uploaded the Secora badge image (from Discord attachments):
- Saved to: `/opt/ctfd/CTFd/themes/atr25-theme/static/img/secora-badge.png`

### New index.html Template
Created a completely new custom landing page at:
`/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html`

Features added:
- **Animated star background** - 100 floating stars with twinkle animation
- **Hero section** with:
  - Floating badge logo with purple glow effect
  - "SECORA CTF" title using Orbitron font with gradient
  - Tagline: "Identify the Impostor. Secure the Systems."
  - Red "START TASK" emergency button with hover effects
- **Stats section** showing:
  - Teams count (live API fetch)
  - 5 Challenges
  - 48h Remaining
- **Challenge category cards** - Easy/Medium/Hard with color coding
- **Floating crewmate mascot** (SVG inline) in bottom-right corner
- **Click sound effects** on all buttons
- **Fully responsive** design for mobile

### Fonts Used
- Orbitron (titles)
- Fredoka One (buttons/headings)
- Kanit (body text)

### Colors
- Primary Purple: #6B21A8
- Primary Purple Light: #9333EA
- Accent Green: #22C55E
- Accent Red: #EF4444
- Dark Background: #0a0a0f
- Card Background: #12121a

### Plugin for Custom Route
Created a CTFd plugin to override the root route:
- Plugin path: `/opt/ctfd/CTFd/plugins/secora_theme/`
- Files created:
  - `__init__.py` - Plugin with custom "/" route
  - `config.json` - Plugin configuration (fixed JSON syntax)

### page.html Template Override
Modified `/opt/ctfd/CTFd/themes/atr25-theme/templates/page.html` to detect the index route and render the custom template:
```jinja2
{% if request.path == '/' or request.path == '/index' %}
    {% include "index.html" %}
{% else %}
  <div class="container">
    {{ content | safe }}
  </div>
{% endif %}
```

### Database Entry
Inserted marker in database to trigger custom template:
```sql
INSERT INTO pages (title, route, content, draft, hidden, auth_required, format) 
VALUES ('Secora CTF', 'index', 'CUSTOM', 0, 0, 0, 'html');
```

### Fixes Applied
1. **Plugin JSON syntax error** - Fixed config.json (missing quotes around property names)
2. **Volume mount** - docker-compose.yml had `:ro` removed for write access
3. **Setup flag** - Database setup=1 confirmed working

### Files Modified/Created
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - NEW custom landing page
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/page.html` - Modified for route detection
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/secora-badge.png` - Badge logo image
- `/opt/ctfd/CTFd/plugins/secora_theme/__init__.py` - NEW plugin
- `/opt/ctfd/CTFd/plugins/secora_theme/config.json` - NEW plugin config
- `/opt/ctfd/backups/20260306_index_backup.html` - Backup of original index

### URLs
- CTFd: http://164.90.231.249
- Admin: http://164.90.231.249/admin

---

---

## 15. Live Countdown Timer

### Overview
Replaced static "48h" with dynamic countdown from CTF start/end times.

### Implementation
- Modified `index.html` to use CTF metadata (`start_in`, `ends_in` meta tags)
- JavaScript calculates remaining time and displays:
  - "Until Start" label before CTF begins
  - "Remaining" countdown during CTF
  - "LIVE" in green when CTF starts
  - "Ended" when CTF finishes

### CTF Times (Current Settings)
- Start: March 31, 2026 at 11:00 PM UTC (Unix: 1774998000)
- End: Not set yet

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Added countdown JavaScript

---

## 16. Background Music (All Pages)

### Overview
Added background music that plays on all pages at 30% volume.

### Implementation
- Uploaded BGM file: `/themes/atr25-theme/static/sounds/bgm.mp3`
- Added audio element in base.html with loop
- Volume set to 0.3 (30%)
- Auto-play attempt on page load (may require user interaction due to browser policies)

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added audio player
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/bgm.mp3` - NEW

---

## 17. Stars Background (All Pages)

### Overview
Added animated twinkling stars background to all pages (not just landing page).

### Implementation
- Added CSS for `.stars-bg` and `.star` elements
- 80 stars with random positions and twinkle animation
- Dark background (#0a0a0f)
- Applied to base.html so it appears on every page

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added stars CSS/HTML/JS

---

## 18. Flying Crewmates (All Pages)

### Overview
Added flying crewmate characters that fly across all pages (ejected animation).

### Implementation
- Initially created SVG-based crewmates with random colors
- Later replaced with custom PNG images uploaded by user:
  - `/themes/atr25-theme/static/img/crew-green.png` (lime green)
  - `/themes/atr25-theme/static/img/crew-red.png` (red)
  - `/themes/atr25-theme/static/img/crew-purple.png` (purple)

### CSS Configuration
```css
.ejected-crew {
    position: fixed;
    width: 80px;
    height: 90px;
    z-index: 9999 !important;
    opacity: 1 !important;
    filter: drop-shadow(0 0 10px rgba(255,255,255,0.5));
    animation: flyEjected linear infinite;
}
```

### JavaScript
- 8 crewmates spawn immediately on page load
- Random selection from 3 color images
- Random vertical positions (10-90% of viewport height)
- Animation duration: 15-35 seconds per pass
- Continuous loop (respawns after exiting screen)

### Issue: Crewmates Not Visible
**Problem:** User reported not seeing the flying crewmates.

**Troubleshooting attempts:**
1. Increased z-index to 9999 (above all other elements)
2. Increased size from 50x60px to 80x90px
3. Changed opacity from 0.7 to 1.0
4. Added drop-shadow glow effect
5. Reduced spawn delay from 20s to 5s
6. Changed from delayed spawn to immediate (8 crewmates on load)

**Status:** Issue persists - may be browser-specific or require further debugging via DevTools Console.

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added flying crewmates
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-green.png` - NEW (user uploaded)
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-red.png` - NEW (user uploaded)
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-purple.png` - NEW (user uploaded)

---

## Current Issues

1. **Flying crewmates not visible** - Troubleshooting in progress
   - May need browser console debugging
   - Could be JavaScript error preventing execution
   - May need to verify image paths are accessible

---

---

## 19. Flying Crewmates (Ejection Animation)

### Overview
Added animated flying crewmates that fly across the screen with realistic ejection physics.

### Implementation
- Created crewmate images in `/themes/atr25-theme/static/img/`:
  - `crew-orange.png` - Orange crewmate
  - `crew-red.png` - Red crewmate  
  - `crew-pink.png` - Pink crewmate

### Animation System (CSS + JavaScript)

#### CSS Keyframes
```css
@keyframes eject {
    0% { transform: translate(-20vw, 0) rotate(0deg); }
    100% { transform: translate(120vw, var(--drift)) rotate(var(--spin)); }
}
```

#### JavaScript (Randomized Physics)
- **Y-Axis Drift:** Random between -20vh and +20vh
- **Rotation:** Random between 720deg and 1440deg (2-4 full spins)
- **Duration:** Random between 8-12 seconds
- **Spawn Rate:** 1 crewmate at a time, respawns after exiting

### Features
- Smooth linear animation (zero-gravity feel)
- Random starting vertical position (20-80% of viewport)
- Crewmates fly behind content (z-index: -1)
- Random color selection from 3 options

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added animation CSS + JS
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-orange.png` - NEW
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-red.png` - NEW
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-pink.png` - NEW

---

## 20. Background Music

### Overview
Added background music that plays on user interaction.

### Implementation
- Uploaded BGM file: `/themes/atr25-theme/static/sounds/bgm.mp3`
- Added audio element in base.html
- Volume set to 0.3 (30%)
- Requires user click to start (browser autoplay policy)

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added audio player
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/bgm.mp3` - NEW

---

## Summary of All Modified Files

### Theme Templates
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Main theme template (multiple additions)
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Custom landing page
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/page.html` - Page template override

### Plugin
- `/opt/ctfd/CTFd/plugins/secora_theme/__init__.py` - Custom route plugin
- `/opt/ctfd/CTFd/plugins/secora_theme/config.json` - Plugin config

### Static Assets
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/secora-badge.png` - Main badge logo
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-green.png` - Flying crewmate green
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-red.png` - Flying crewmate red
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-purple.png` - Flying crewmate purple
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/click.mp3` - Click sound effect
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/bgm.mp3` - Background music

### Backups
- `/opt/ctfd/backups/20260306_index_backup.html` - Original landing page backup

---

## Credentials
- Admin account: bigbrainchad
- Email: chadbigbrain@gmail.com

---

## 21. Role Reveal Loading Screen

### Overview
Added a full-screen "Role Reveal" loading screen that plays on page load with crewmate animation and typewriter effect.

### Implementation
- Created self-contained JavaScript that injects scoped CSS and DOM elements
- Shows crewmate image with fade-in animation
- "SECORA CTF" title with red glow effect
- Typewriter effect: "There are 45 Flags among us..."
- Auto-removes itself after 7 seconds

### CSS Features
- All classes prefixed with `.secora-loader-` to prevent CSS bleed
- Fade-in/fade-out animations
- Glowing red title (#C51111)
- Blinking cursor effect

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added role reveal JS
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/role-reveal.png` - NEW (custom image)

---

## 22. Intro Sound

### Overview
Added intro sound that plays with the role reveal loading screen.

### Implementation
- Uploaded intro MP3: `/themes/atr25-theme/static/sounds/intro.mp3`
- Plays automatically with loading screen
- Volume: 50%

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/intro.mp3` - NEW

---

## 23. Click Sound Effects

### Overview
Added click sound that plays when clicking buttons, links, or interacting with modals.

### Implementation
- Click sound: `/themes/atr25-theme/static/sounds/click.mp3`
- Plays on: A, BUTTON, INPUT, SELECT elements
- Also plays on modal open/close events
- Volume: default (100%)

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added click sound JS
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/click.mp3` - NEW

---

## Summary of All Modified Files

### Theme Templates
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Main theme template (multiple additions)
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Custom landing page
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/page.html` - Page template override

### Plugin
- `/opt/ctfd/CTFd/plugins/secora_theme/__init__.py` - Custom route plugin
- `/opt/ctfd/CTFd/plugins/secora_theme/config.json` - Plugin config

### Static Assets
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/secora-badge.png` - Main badge logo
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-red.png` - Flying crewmate red
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-orange.png` - Flying crewmate orange
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/crew-pink.png` - Flying crewmate pink
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/role-reveal.png` - Role reveal loading image
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/click.mp3` - Click sound effect
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/bgm.mp3` - Background music
- `/opt/ctfd/CTFd/themes/atr25-theme/static/sounds/intro.mp3` - Intro sound

### Backups
- `/opt/ctfd/backups/20260306_index_backup.html` - Original landing page backup

---

## 24. New Hero Section (March 6, 2026)

### Overview
Replaced the old hero section with a new Among Us styled hero with interactive buttons.

### Changes
- Removed badge logo and emergency button
- Added new title with heavy black outline (Among Us style)
- New subtitle: "The Skeld is under attack. Secure the mainframe before the Impostors patch the vulnerabilities."
- Floating crewmate background images with CSS animations

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Completely redesigned hero section

---

## 25. Loading Screen (Role Reveal)

### Overview
Added a role reveal loading screen that shows on the main page only.

### Features
- Full-screen black overlay
- Crewmate image with fade-in animation
- "SECORA CTF" title with red glow
- Typewriter effect: "There are X Flags among us..."
- Dynamically fetches challenge count from API
- Auto-dismisses after 7 seconds

### Implementation
- Added JavaScript to base.html
- Path check: `if (window.location.pathname === "/" || window.location.pathname === "/index")`
- Fetches from `/api/v1/challenges` to get real challenge count

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added loader script

---

## 26. Card Swipe Login (March 6, 2026)

### Overview
Replaced the "Swipe ID Card" button with an interactive card reader component.

### Features
- Heavy dark grey console with thick borders (Skeld task panel style)
- Digital screen showing "PLEASE SWIPE CARD" (green glowing text)
- Draggable ID card with magnetic stripe
- Touch and mouse support (mobile-friendly)
- Swipe 85% to unlock → redirects to /login
- Shows "BAD SWIPE. TRY AGAIN." if not far enough

### Asset Uploaded
- `/opt/ctfd/CTFd/themes/atr25-theme/static/img/secora_id_card.png` - ID card image

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Added card reader HTML/CSS/JS

---

## 27. Ship's Crest Logo (March 6, 2026)

### Overview
Added holographic ship's crest above the main title.

### Features
- Uses secora-badge.png as the crest
- Purple glow effect with floating animation
- Responsive: scales to 120px on mobile

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Added crest image and CSS

---

## 28. Reactor Meltdown HUD (March 6, 2026)

### Overview
Replaced CTFd statistics boxes with an Among Us themed HUD.

### Features
- Flashing red "REACTOR MELTDOWN" timer with countdown
- Shows "CREWMATES ABOARD: X | VULNERABILITIES: Y" from API
- Task progress bar that fills based on challenge count
- Fetches data from CTFd APIs:
  - `/api/v1/statistics/teams` for team count
  - `/api/v1/challenges` for challenge count

### CTF Time Configuration
- CTF Start: 1772668800 (February 2, 2026)
- CTF End: 1777590000 (March 31, 2026)
- Countdown JavaScript uses hardcoded Unix timestamp

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Added HUD section
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added CTF_END_TIME variable

---

## 29. Global Starfield & Transparent Navbar (March 6, 2026)

### Overview
Added global CSS for transparent navbar and starfield background on ALL pages.

### Features
- Transparent navbar with backdrop blur
- Deep space black background (#03040b)
- 80+ animated stars using box-shadow
- Slow 100s drift animation

### Files Modified
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Added global CSS

---

## 30. Additional Challenges Deployed (March 8, 2026)

### Challenge 1: ENIAD Calculator
- **Name:** a7san-calc
- **Port:** 8001
- **URL:** http://164.90.231.249:8001
- **Type:** Python eval() bypass
- **Flag:** Secora{f4k3_fl4g} (placeholder - check source)
- **Location:** `/opt/ctfd/challenges/a7san-calc/`
- **Description:** Moroccan-styled calculator with blacklist bypass. Players need to bypass the word blacklist to read `/flag.txt`.

### Challenge 2: Warmup (Cookie Manipulation)
- **Name:** warmup
- **Port:** 5000
- **URL:** http://164.90.231.249:5000
- **Type:** Cookie manipulation / Base64
- **Flag:** Secora{C00k13_M4n1pul4t10n_Is_Fun}
- **Location:** `/opt/ctfd/challenges/warmup/`
- **Description:** Register a user, decode cookie, modify to role:admin, id:0, name:admin, access /admin

### Challenge 3: Flask Cookie (Session Forgery)
- **Name:** flask-cookie
- **Port:** 5002
- **URL:** http://164.90.231.249:5002
- **Type:** Flask session forgery
- **Secret Key:** theninho!
- **Flag:** Secora{n1nh0_1s_th3_b3st_53cur1ty_3ng1n33r}
- **Location:** `/opt/ctfd/challenges/flask-cookie/`
- **Description:** Forge Flask session cookie with role:admin using known secret key

### Challenge 4: Serial (PHP Object Injection)
- **Name:** serial
- **Port:** 5003
- **URL:** http://164.90.231.249:5003
- **Type:** PHP deserialization / Object Injection
- **Flag:** Secora{1ns3cur3_D3s3r14l1z4710n_0bj3ct_1nj3cti0n_PHP_W1n}
- **Location:** `/opt/ctfd/challenges/serial/`
- **Description:** PHP unserialize() with FileHandler gadget. Craft serialized object to read /flag.txt

---

## 31. GitHub Repository Created (March 8, 2026)

### Overview
Created a public GitHub repository with the custom CTFd theme and plugins (pulled from VPS).

### Action
- Pulled all modified files from VPS to local workspace (theme, plugins)
- Created GitHub repo: `TheBigBrainChad/ctfd-secora`
- Pushed all files to: https://github.com/TheBigBrainChad/ctfd-secora

### Files Included
- `themes/atr25-theme/` — Full custom Among Us themed CTFd theme
- `plugins/secora_theme/` — Custom plugin for root route
- `plugins/ctfd-event-countdown/` — Event countdown plugin
- `README.md` — Installation instructions

### Status: ✅ SUCCESS (Working)
- Repository created and pushed successfully
- User confirmed working

---

## Deployed Challenges Summary

| # | Name | Port | Type | Flag |
|---|------|------|------|------|
| 1 | a7san-calc | 8001 | Python eval bypass | Secora{f4k3_fl4g} |
| 2 | warmup | 5000 | Cookie manipulation | Secora{C00k13_M4n1pul4t10n_Is_Fun} |
| 3 | flask-cookie | 5002 | Flask session forgery | Secora{n1nh0_1s_th3_b3st_53cur1ty_3ng1n33r} |
| 4 | serial | 5003 | PHP Object Injection | Secora{1ns3cur3_D3s3r14l1z4710n_0bj3ct_1nj3cti0n_PHP_W1n} |

---

### Files for Each Challenge
- `/opt/ctfd/challenges/a7san-calc/` - docker-compose.yml, Dockerfile, app.py, flag.txt
- `/opt/ctfd/challenges/warmup/` - docker-compose.yml, Dockerfile, app.py, templates/, static/
- `/opt/ctfd/challenges/flask-cookie/` - docker-compose.yml, Dockerfile, app.py, requirements.txt
- `/opt/ctfd/challenges/serial/` - docker-compose.yml, Dockerfile, index.php, FileHandler.php, flag.txt

| Setting | Value |
|---------|-------|
| CTF Start | 1772668800 (Feb 2, 2026) |
| CTF End | 1777590000 (Mar 31, 2026) |
| Challenges | 5 |
| Theme | atr25-theme |
| Custom Plugin | secora_theme |

### URLs
- CTFd: http://164.90.231.249
- Admin: http://164.90.231.249/admin

### Credentials
- Admin: bigbrainchad / (your password)

---

## Complete File List

### Theme Templates
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/base.html` - Main template (loader, global CSS, sounds)
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/index.html` - Landing page (hero, HUD, card reader)
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/page.html` - Page template override
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/challenge.html` - Challenge page
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/challenges.html` - Challenges list
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/login.html` - Login page
- `/opt/ctfd/CTFd/themes/atr25-theme/templates/register.html` - Registration page

### Static Assets
- `static/img/secora-badge.png` - Main logo
- `static/img/secora_id_card.png` - ID card for swipe reader
- `static/img/crew-red.png` - Flying crewmate red
- `static/img/crew-orange.png` - Flying crewmate orange
- `static/img/crew-pink.png` - Flying crewmate pink
- `static/img/crew-purple.png` - Flying crewmate purple
- `static/img/crew-green.png` - Flying crewmate green
- `static/img/role-reveal.png` - Loading screen image
- `static/sounds/click.mp3` - Click sound effect
- `static/sounds/bgm.mp3` - Background music
- `static/sounds/intro.mp3` - Intro sound

### Plugins
- `/opt/ctfd/CTFd/plugins/secora_theme/` - Custom index route plugin
- `/opt/ctfd/CTFd/plugins/ctfd-event-countdown/` - Event countdown plugin

### Backups
- `/opt/ctfd/backups/20260306_index_backup.html` - Original index backup
- `/opt/ctfd/backups/20260306_theme/` - Theme backup

