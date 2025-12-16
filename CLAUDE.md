# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Christmas advent calendar web application for breast cancer awareness ("Pink Forward．聖誕倒數日曆"). The application displays a calendar for December 2025 where specific dates unlock educational content about breast cancer. The project is a static site built with vanilla HTML, CSS, and JavaScript, requiring no build process.

## Architecture

### Application Structure

This is a single-page application (SPA) with a simple three-file architecture:

- **[index.html](index.html)** - Main HTML structure including the password gate, calendar grid, modal dialog, and decorative elements
- **[script.js](script.js)** - All application logic including password authentication, time-based content unlocking, modal management, and snow animation
- **[styles.css](styles.css)** - Complete styling including calendar layout, animations, responsive design, and Christmas-themed decorations

### Key Features & Implementation

**1. Password Gate System** ([script.js:2-52](script.js#L2-L52))
- Currently bypassed with `unlock()` called directly on line 40
- Password is hardcoded as "pfizertw" (line 3)
- LocalStorage persistence is commented out (lines 30, 42-47)
- When enabled, locks scroll and focuses input field

**2. Time-Based Content Unlocking** ([script.js:54-70](script.js#L54-L70))
- Campaign year: 2025, month: December (lines 58, 61)
- Default unlock time: midnight (00:00) local time for each day
- Individual days can override with `unlockAt` property in `dayContent`
- Time check currently disabled: `const notYet = 0;` (line 119) for testing

**3. Calendar Grid** ([index.html:91-206](index.html#L91-L206))
- 7-column CSS Grid layout (Sun-Sat)
- Three day types:
  - `.locked` (gray/green) - Regular days, disabled buttons with mini lock icon
  - `.pink` - Clickable days (15, 17, 22, 24) with mini bow decoration
  - `.xmas` - Christmas Day (25) with gift icon and special text
- First cell is empty because December 2025 starts on Monday

**4. Content Configuration** ([script.js:74-95](script.js#L74-L95))
- `dayContent` object maps day numbers to content
- Currently configured for days: 15, 17, 22, 24, 25
- Each entry contains `title` and `img` path
- Images located in `./img/` directory (docXX.jpg format)
- Wait state uses `./wait1.jpg` (line 55)

**5. Modal Dialog System** ([script.js:98-206](script.js#L98-L206))
- Custom Bootstrap-style modal implementation
- Features: backdrop click to close, ESC key support, focus trap for accessibility
- Displays either educational content image or wait state based on time check
- Restores focus to triggering button on close

**6. Visual Effects**
- **Snow Animation** ([script.js:208-254](script.js#L208-L254)): Pure CSS snowflakes spawned by JavaScript with randomized size, position, duration, opacity, and horizontal drift
- **Christmas Tree** ([styles.css:172-407](styles.css#L172-L407)): Pure CSS with layered tiers, trunk, star, and animated light bulbs with staggered glow effects
- **Background Decorations** ([styles.css:40-123](styles.css#L40-L123)): Fixed orbs and snowmark elements

### Responsive Design

- Desktop (>768px): "Happy Christmas" text appears inside Day 25 cell
- Mobile (≤768px): Text moves outside to right side of cell (`.xmas-side`) to prevent column width expansion
- Calendar gap reduces from 18px to 10px on screens <720px
- Tree scales to 90% on mobile
- Modal dialog width: `min(96vw, 1100px)` for near-full-width display

## Development Workflow

### Testing the Application

Since this is a static site, simply open [index.html](index.html) in a browser or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server .

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

### Common Configuration Changes

**To enable password protection:**
1. Comment out line 40 in [script.js:40](script.js#L40): `// unlock();`
2. Uncomment lines 42-47 for localStorage persistence (optional)

**To change the password:**
- Modify `ACCESS_PASSWORD` on [script.js:3](script.js#L3)

**To adjust time-based unlocking:**
- Change `CAMPAIGN_YEAR` on [script.js:61](script.js#L61)
- For production, remove the test override on [script.js:119](script.js#L119): change `const notYet = 0;` to `const notYet = now < unlockAt;`

**To add content for a new day:**
1. Change the day's class in [index.html](index.html) from `locked` to `pink` and update its structure
2. Add an entry to `dayContent` object in [script.js:74-95](script.js#L74-L95)
3. Add the corresponding image to `./img/` directory

**To change theme colors:**
- Modify CSS variables in [styles.css:1-14](styles.css#L1-L14):
  - `--green`: locked day background
  - `--pink`: unlockable day background
  - `--bg`: page background
  - `--card`: calendar card background

### Image Assets

All educational content images follow the naming pattern `doc{day}.jpg` and are located in the `img/` directory. Required images:
- doc15.jpg, doc17.jpg, doc22.jpg, doc24.jpg, doc25.jpg
- wait1.jpg (shown before unlock time)

## Important Notes

- **No build process required** - Direct file editing works immediately
- **All dates are in local timezone** - Server location doesn't matter
- **Accessibility features implemented**: ARIA labels, focus management, keyboard navigation, and focus trap in modals
- **Hardcoded password** - Consider environment-based configuration for production
- **Testing mode active** - Time checks are disabled (line 119 in script.js)
