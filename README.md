# CarbonWise: Carbon Footprint Awareness Platform

CarbonWise is a lightweight web platform built for Google PromptWars. It helps individuals understand, track, and reduce their carbon footprint through simple lifestyle inputs, personalized insights, and practical action recommendations.

Live deployment: [https://carbon-footprint-582676425041.us-central1.run.app](https://carbon-footprint-582676425041.us-central1.run.app)

Repository: [https://github.com/sri-esa/carbon-footprint](https://github.com/sri-esa/carbon-footprint)

## Problem Statement

Design a solution that helps individuals understand, track, and reduce their carbon footprint through simple actions and personalized insights.

CarbonWise directly addresses this by giving users a clear monthly footprint estimate, showing which parts of their lifestyle contribute the most, and recommending realistic actions based on their own highest-impact categories.

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
- `tests/carbon.test.js` validates the core logic.
- `server.mjs` serves static files with minimal production headers.

The carbon calculation logic is separated from the UI, making the app easier to test, review, and extend. Emission factors are named constants instead of unexplained magic numbers.

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
- The static server blocks path traversal by checking resolved paths.
- The server adds `X-Content-Type-Options: nosniff` and `Referrer-Policy: no-referrer`.
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
├── index.html              # Semantic app shell
├── styles.css              # Responsive visual design
├── app.js                  # Browser UI and state management
├── carbon.js               # Pure footprint logic
├── tests/
│   └── carbon.test.js      # Node-based logic tests
├── server.mjs              # Minimal static server
├── Dockerfile              # Cloud Run container
├── .dockerignore           # Clean deployment context
└── package.json            # Scripts and metadata
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
