# CarbonWise: Carbon Footprint Awareness Platform

CarbonWise is a lightweight web platform built for Google PromptWars. It helps individuals understand, track, and reduce their carbon footprint through simple lifestyle inputs, personalized insights, and practical action recommendations.

Live deployment: [https://carbon-footprint-582676425041.us-central1.run.app](https://carbon-footprint-582676425041.us-central1.run.app)

Repository: [https://github.com/sri-esa/carbon-footprint](https://github.com/sri-esa/carbon-footprint)

## Problem Statement

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

CarbonWise directly addresses this by giving users a clear monthly footprint estimate, showing which parts of their lifestyle contribute the most, and recommending realistic actions based on their own highest-impact categories.

## Chosen Vertical

**Carbon Footprint Awareness Platform**

The solution is designed around an individual climate-awareness persona: a student, professional, or household member who wants to understand their everyday emissions but needs the information to be simple, personal, and action-oriented.

## Approach and Logic

CarbonWise behaves like a lightweight personal sustainability assistant. It does not simply show a static checklist; it reads the user's context from their monthly habits, calculates emissions by category, identifies the highest-impact area, and ranks recommendations based on that context.

The logic follows four steps:

1. Collect practical lifestyle inputs that a normal user can estimate.
2. Sanitize and clamp the values to keep calculations stable.
3. Convert each category into monthly CO2e using named emission factors.
4. Generate insights and actions from the user's largest emission categories.

## How the Solution Works

The app runs fully in the browser. Users enter approximate monthly values for travel, electricity, fuel, diet, shopping, and waste. The calculation module converts those values into category-level emissions, then the UI displays totals, charts, target progress, and personalized actions.

No login or backend is required. The user's latest inputs are saved only in the browser through `localStorage`.

## Core User Flow

1. A user enters monthly lifestyle data across transport, home energy, food, shopping, and waste.
2. The app sanitizes the inputs and calculates category-level carbon emissions.
3. The user sees their monthly footprint, yearly estimate, top emission driver, category breakdown, and reduction target.
4. The app recommends three personalized actions ranked by the user's highest-emission areas.
5. Inputs are saved locally in the browser so the user can revisit and update their progress.

## Features

- Monthly carbon footprint calculator
- Yearly CO2e estimate in tonnes
- Category breakdown for transport, home energy, food, shopping, and waste
- Automatic top-driver detection
- Personalized reduction recommendations
- Reduction gap against a 2 t yearly target
- Local browser persistence with `localStorage`
- Responsive, accessible interface
- Dependency-free frontend and server
- Cloud Run deployment using a small Docker container

## Judging Rubric Alignment

### Code Quality: High Impact

The project is intentionally small, readable, and modular.

- `index.html` contains semantic page structure.
- `styles.css` contains all visual and responsive styling.
- `app.js` handles UI state, rendering, local persistence, and events.
- `carbon.js` contains pure calculation, sanitization, recommendation, and target logic.
- `storage.js` isolates browser persistence and stored-data validation.
- `tests/` validates calculation, storage, and server behavior.
- `server.mjs` serves static files with minimal production headers.

The carbon calculation logic is separated from the UI, making the app easier to test, review, and extend. Emission factors are named constants instead of unexplained magic numbers. Browser storage and HTTP serving are also separated into small modules so each responsibility has clear ownership.

### Problem Statement Alignment: High Impact

CarbonWise focuses on the root challenge: most people do not know which everyday habits drive their footprint or what realistic action to take first.

The app supports all three required outcomes:

- **Understand:** Clear totals, category breakdown, and top-driver detection.
- **Track:** Monthly inputs are saved locally and can be updated over time.
- **Reduce:** Actions are personalized according to the user's largest emission categories.

The experience avoids overwhelming users with complex climate accounting. It gives a practical awareness estimate and turns it into simple next steps.

### Security: Medium Impact

The project follows safe practices for a static personal tracking app.

- No account system or backend database is required.
- User lifestyle data stays in the user's browser through `localStorage`.
- Numeric inputs are clamped to reasonable minimum and maximum values.
- Select values are validated against known diet options.
- UI rendering uses DOM APIs and `textContent`, avoiding raw HTML injection.
- Dynamic charts use native `progress` elements instead of inline style mutation.
- The server only allows `GET` and `HEAD` requests.
- Only known public static files are served.
- The static server blocks path traversal by checking resolved paths.
- Malformed encoded paths return a controlled `400 Bad Request`.
- The server adds a strict Content Security Policy, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy`.
- The Docker image runs only the static Node server needed for the app.

### Efficiency: Medium Impact

CarbonWise is efficient because it avoids unnecessary frameworks, build steps, databases, and network calls.

- No frontend dependencies are downloaded by users.
- Calculations are synchronous and very small.
- UI updates replace only the chart and recommendation nodes that need to change.
- Static assets are minimal.
- Cloud Run serves one small container with a tiny Node HTTP server.

This makes the app fast to load, inexpensive to deploy, and easy to run in low-resource environments.

### Testing: Low Impact

Core logic is testable without a browser.

Current tests cover:

- Baseline footprint calculation
- Yearly estimate calculation
- Input clamping and sanitization
- Invalid diet fallback
- Lower-carbon diet comparison
- Recommendation ordering
- Reduction target logic
- Corrupt or malformed stored browser data
- Storage save, load, and clear behavior
- Security headers on served pages
- Rejection of unsupported HTTP methods
- Blocking non-public files
- `HEAD` request behavior

Run tests with:

```bash
npm test
```

### Accessibility: Low Impact

The interface includes accessibility-focused structure and controls.

- Semantic landmarks: `header`, `nav`, `main`, `section`, `footer`
- Skip link for keyboard users
- Proper labels for form fields
- Grouped inputs with `fieldset` and `legend`
- Keyboard-visible focus states
- Responsive layout for mobile and desktop
- High-contrast text and controls
- Live result area with `aria-live`
- Chart has an accessible label

## Architecture

```text
carbon-footprint/
|-- index.html              # Semantic app shell
|-- styles.css              # Responsive visual design
|-- app.js                  # Browser UI and state management
|-- carbon.js               # Pure footprint logic
|-- storage.js              # Browser persistence helpers
|-- tests/
|   |-- carbon.test.js      # Carbon calculation tests
|   |-- storage.test.js     # Persistence and sanitization tests
|   `-- server.test.js      # Static server security tests
|-- server.mjs              # Minimal static server
|-- Dockerfile              # Cloud Run container
|-- .dockerignore           # Clean deployment context
`-- package.json            # Scripts and metadata
```

## Step-by-Step Build Plan

1. Define the user journey around awareness, tracking, and action.
2. Build a dependency-free static app for reliability and easy judging.
3. Separate calculation logic from UI code for code quality and testability.
4. Add safe input sanitization and validation.
5. Calculate emissions across the most understandable lifestyle categories.
6. Show totals, top contributors, visual breakdown, and target gap.
7. Generate personalized recommendations from the user's highest categories.
8. Persist inputs locally so users can track progress over repeated visits.
9. Add tests around the most important logic.
10. Package with Docker and deploy to Cloud Run.

## Run Locally

```bash
npm start
```

Then open:

[http://localhost:4173](http://localhost:4173)

The app has no external package dependencies.

## Deploy

The project is ready for Google Cloud Run.

```bash
gcloud run deploy carbon-footprint --source . --region us-central1 --allow-unauthenticated
```

Cloud Run is a good fit because the app is containerized, lightweight, public, and stateless. It can scale down when unused and does not require managing a server.

## Emission Factor Notes

The included factors are simplified estimates for awareness and educational comparison. They are not a certified greenhouse-gas inventory.

A production version should use verified regional datasets, document factor sources in detail, and show uncertainty ranges where possible.

## Assumptions

- The app is intended for personal awareness, not official carbon accounting.
- Monthly inputs are approximate because most users do not know exact lifestyle emissions.
- A 2 t CO2e yearly target is used as a simple motivational benchmark.
- Emission factors are simplified so the product remains understandable for a hackathon submission.
- Local browser storage is enough for this version because the challenge focuses on awareness and personalized insight, not account management.

## Future Improvements

- Add weekly or monthly progress history.
- Add user-selected country or electricity grid region.
- Add CSV export for personal tracking.
- Add visual badges for completed reduction actions.
- Add source citations for each emission factor.
- Add end-to-end browser tests.
- Add optional Firebase or Supabase sync for users who want multi-device history.

## Summary

CarbonWise is designed to be simple enough for everyday users and clean enough for technical review. It keeps the core challenge in focus: help people understand their carbon footprint, track it over time, and take realistic steps to reduce it.
