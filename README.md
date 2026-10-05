# Castelzor Patient Safety Demo

A mobile-first Vue 3 + TypeScript prototype for a patient or caregiver to describe a possible experience while taking Castelzor, a fictional prescription medicine. The six-step flow demonstrates patient-centered safety reporting; it is not an operational reporting service.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Create a production build with `npm run build`, then preview it with `npm run preview`.

## Safety and data boundaries

- Castelzor and all requested example details are fictional. Enter made-up information only.
- No answers are sent to a server, analytics service, or the FDA. The report exists only in Vue memory and clears on reload or Start over.
- The experience does not provide medical advice or urgent care. An emergency notice remains available near the event and outcome questions.
- A completed flow means only that the demonstration ended. It is not a filed report, case confirmation, or promise of follow-up.

See [content and safety decisions](docs/content-and-safety-decisions.md), [project context](docs/context.md), and [requirements](docs/requirements.md). The original case-study specification is in [BRIEF.md](BRIEF.md).
