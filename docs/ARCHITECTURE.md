# Architecture

CarbonWise uses a small modular architecture so the project stays readable and testable.

## Modules

- `index.html`: semantic app shell and form structure.
- `styles.css`: responsive styling and accessible visual states.
- `app.js`: browser event handling and DOM rendering.
- `carbon.js`: pure footprint calculations and public domain API.
- `emission-model.js`: input defaults, limits, category labels, and emission factors.
- `recommendation-model.js`: recommendation text mapped to footprint categories.
- `storage.js`: browser persistence helpers and stored-data sanitization.
- `server.mjs`: minimal static server for local use and Cloud Run.

## Data Flow

1. User enters monthly lifestyle inputs.
2. `app.js` reads form values.
3. `carbon.js` sanitizes inputs and calculates category emissions.
4. `app.js` renders totals, progress indicators, and recommendations.
5. `storage.js` saves sanitized values locally for the next visit.

## Design Choices

- No frontend framework is used because the app has a small interaction surface.
- Pure domain functions are separated from DOM code so they can be tested directly.
- Static hosting keeps the attack surface low.
- Server hardening is handled in one place through `server.mjs`.
