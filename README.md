# CarbonWise: Carbon Footprint Awareness Platform

CarbonWise is a dependency-free web app for Google PromptWars. It helps individuals understand, track, and reduce their carbon footprint through monthly lifestyle inputs, category breakdowns, and personalized action recommendations.

## Step-by-Step Build Plan

1. Define the user journey: enter monthly habits, see footprint, understand top drivers, choose simple actions.
2. Keep the architecture small and reviewable: static HTML, CSS, browser JavaScript, pure calculation functions, and a tiny local server.
3. Implement safe input handling: clamp numeric values, validate diet options, avoid raw HTML injection, and store data only in local browser storage.
4. Calculate emissions across transport, home energy, food, shopping, and waste using named emission factors.
5. Show personalized insights: monthly total, yearly estimate, top category, visual breakdown, and reduction gap against a 2 t yearly target.
6. Recommend actions based on the highest-emission categories so advice is connected to each user.
7. Add lightweight tests for calculation behavior, sanitization, recommendation ordering, and target logic.
8. Document setup, testing, accessibility, and alignment with the challenge.

## Run Locally

```bash
npm start
```

Then open [http://localhost:4173](http://localhost:4173).

The app has no external package dependencies.

## Test

```bash
npm test
```

## Rubric Alignment

- **Code quality:** Separate files for structure, styles, UI behavior, pure calculations, tests, and server code.
- **Security:** Inputs are sanitized and clamped, user data stays in `localStorage`, static server blocks path traversal, and UI rendering uses DOM APIs instead of raw HTML injection.
- **Efficiency:** Calculations are small, synchronous, and dependency-free. UI updates only replace the relevant chart and action nodes.
- **Testing:** Core carbon calculations and sanitization are covered by Node's built-in assertion library.
- **Accessibility:** Semantic landmarks, labels, fieldsets, focus states, skip link, responsive layout, and high-contrast controls are included.
- **Problem statement alignment:** The app directly supports awareness, tracking, personalized insights, and simple reduction actions.

## Notes on Emission Factors

The included factors are simplified estimates for awareness and educational comparison, not a certified greenhouse-gas inventory. A production version should connect factors to region-specific verified datasets and explain uncertainty ranges.
