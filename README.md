# CityOS AI — Urban Intelligence Operating System

CityOS AI is an AI operating system for modern cities. It reframes civic
management from reactive complaint tracking into a proactive, autonomous, and
intelligent workflow. Instead of a dashboard of tickets, the operator works
inside a living city: the map is the application, a workforce of specialized AI
agents processes every incident, and a predictive digital twin surfaces failures
before they happen.

The product is designed to feel less like software that collects information and
more like a calm, capable operating system working alongside the operator.

---

## Overview

When a citizen reports an issue, CityOS AI does not simply log it. A coordinated
set of AI agents springs into action to:

1. Understand the issue from photos, voice, and text.
2. Deduplicate it against existing reports.
3. Assess severity by cross-referencing weather and nearby infrastructure.
4. Plan the repair and route a work order to the correct department.
5. Predict downstream failures and recommend preventive action.

The operator observes and directs this through a set of focused workspaces, each
with its own atmosphere and purpose, all sharing one design language.

---

## Key capabilities

- Multi-agent workforce. A coordinator orchestrates eight specialist agents
  (vision, risk, planning, routing, prediction, communication, deduplication,
  memory) built around a LangGraph execution graph.
- Map-first operations. The city map is the primary interface. Incidents,
  missions, predictions, heatmaps, routes, crews, and department coverage are
  visualized as toggleable layers.
- Predictive digital twin. A scrubbable timeline projects infrastructure risk
  across Today through 30 days, with a what-if simulation mode.
- Guided incident reporting. A four-step wizard (capture, AI analysis, review,
  submit) minimizes typing and lets the operator confirm AI-generated
  understanding rather than fill out forms.
- Adaptive intelligence panel. A single right-hand panel changes its content
  based on what is selected on the map — issue, mission, prediction, agent, or
  department — without navigating away.
- Command palette. A keyboard-first search (Cmd/Ctrl+K) that searches missions,
  issues, agents, predictions, and workspaces, and accepts natural-language
  prompts.

---

## Architecture

CityOS AI is a monorepo with a Python backend and a Next.js frontend.

```text
Citizen / Operator
        |
        v
Next.js frontend  ---->  FastAPI backend
                              |
              +---------------+----------------+
              |                                |
        AI workforce (LangGraph)        Data layer
        coordinator                     Firebase Firestore
        vision / risk / planning        Google Gemini
        routing / prediction
        communication / duplicate / memory
```

The frontend is fully implemented as an interactive experience that currently
runs on representative in-app data, with a clean integration layer so backend
endpoints can replace that data without changing the UI.

---

## Design system

The frontend is built on a dedicated internal design system, treated as an
isolated UI library rather than ad-hoc page styling. Every screen consumes the
same source of truth, which is how the product stays visually consistent and
premium across workspaces.

Location: `frontend/packages/cityos-design-system`, imported throughout the app
via the `@ds` path alias.

Structure:

- `tokens/` — spacing, radius, typography scale, font weights, motion durations
  and easing, blur, opacity, z-index ladder, and borders, expressed as a single
  TypeScript source of truth.
- `themes/` — `theme.css`, the single home for all color and elevation CSS
  variables, with complete light and dark themes and a full semantic token set
  (background, surface, primary, secondary, success, warning, danger, info,
  overlay, glass, focus, selection, hover, pressed, disabled).
- `motion/` — reusable Framer Motion presets (fade, rise, scale, slide, swap,
  stagger) and shared transitions.
- `animations/` — canonical CSS animation classes and timing.
- `hooks/` — theme, media query, reduced motion, disclosure, and scroll-lock.
- `icons/` — a standardized icon wrapper and size tokens, using Lucide only.
- `utils/` — class merging and small formatting helpers.
- `components/` — the component library.

Component library highlights:

- Core: Button, IconButton, Card, Badge, Tag, Avatar, Divider, Kbd, Tooltip,
  Skeleton.
- Inputs and forms: Input, Textarea (auto-grow), Search, Select, Switch,
  Checkbox, Radio, Slider, Field, ValidationMessage, ErrorBanner.
- Surfaces: Modal (three sizes), Drawer, Panel, EmptyState, ErrorState, Portal.
- AI: a shared explanation system (reasoning, confidence, sources,
  recommendation) and a streaming analysis panel.
- Information architecture: Mission, Issue, AI Insight, Prediction, Department,
  Statistic, Notification, Context, and Executive cards, plus StatusDot,
  ProgressBar, CircularProgress, Hero, Timeline, and DetailsDrawer.
- Capture and wizard: ProgressStepper, FileUploader with lightbox,
  VideoPreview, VoiceRecorder, LocationPicker, ReviewCard, SuccessScreen.

A live gallery of the entire system is available in the app at `/design-system`.

Design principles enforced across the system:

- One hero, one supporting section, one context section per screen. No wall of
  equal cards.
- Color communicates state, never decoration. The interface is roughly 95
  percent neutral.
- Typography and whitespace create hierarchy instead of borders and shadows.
- Motion is restrained and purposeful, at 150, 250, and 350 millisecond
  durations with natural easing.
- Loading is shown with skeletons and streaming, never spinners.

---

## Workspaces

- Mission Control (`/`). The command center. A dominant city canvas with a live
  health indicator, a today mission queue, and the adaptive context panel.
- Digital Twin (`/digital-twin`). The signature experience. A near full-screen
  map with custom pins, prediction zones, heatmaps, animated routes, moving
  crews, department coverage, a time slider, a what-if simulation toggle, a
  collapsible legend, and floating search and controls.
- Operations (`/operations`). Missions, not tickets, presented as cards with a
  vertical detail view and an expandable history timeline.
- AI Workforce (`/ai-workforce`). The agent network rendered as a living graph
  with animated connections; selecting a node opens its workspace with prompt,
  reasoning, confidence, and logs.
- Simulation (`/simulation`). A current-versus-projected city comparison with
  live what-if controls for rainfall, traffic, budget, crews, and events.
- Analytics (`/analytics`). An executive briefing that leads with a single hero
  insight, supported by minimal charts, an AI insight, and an executive brief.
- Community (`/community`). Map-centric citizen reports with verification and
  discussion, opened in a details drawer.
- Settings (`/settings`). Apple-style categories with generous spacing.
- Report (`/report`). The four-step guided incident reporting wizard.

---

## Tech stack

Frontend:

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, with a token-driven theme
- Framer Motion for animation
- Zustand for state
- Lucide for iconography

Backend:

- Python, FastAPI, Uvicorn, Pydantic
- LangChain and LangGraph for multi-agent orchestration
- Google Gemini
- Firebase Firestore and Firebase Authentication

---

## Repository structure

```text
City-OS/
  backend/                      FastAPI application
    app/
      agents/                   LangGraph multi-agent system
        coordinator/            orchestration graph
        vision/ risk/ planning/
        routing/ prediction/
        communication/ duplicate/ memory/
      api/v1/                   REST endpoints
      core/                     configuration, firebase, security
      models/                   domain models
      schemas/                  request and response schemas
      services/                 business logic
    requirements.txt
  frontend/                     Next.js application
    packages/
      cityos-design-system/     internal design system (imported as @ds)
    src/
      app/                      App Router routes and workspaces
      components/               shell, workspace, and map components
      hooks/                    state stores
      lib/                      utilities and demo data
  README.md
```

---

## Getting started

Prerequisites:

- Node.js 18 or newer
- Python 3.11 or newer
- A Google Gemini API key
- A Firebase project with Firestore enabled

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate            # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # then add your keys
uvicorn app.main:app --reload        # http://localhost:8000
```

For Firebase, either place a service account JSON at
`backend/firebase-adminsdk.json` or configure the equivalent environment
variables in `backend/.env`.

### Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local     # then add your values
npm run dev                          # http://localhost:3000
```

---

## Environment variables

Frontend (`frontend/.env.local`):

- `NEXT_PUBLIC_API_BASE_URL` — backend base URL.
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — optional. When set, the Digital Twin can
  swap its abstract canvas for live styled map tiles. Without it, the app uses
  the built-in abstract city canvas.
- `NEXT_PUBLIC_FIREBASE_*` — Firebase web app configuration.

Backend (`backend/.env`):

- `GEMINI_API_KEY` — Google Gemini key.
- Firebase service account or equivalent configuration.

---

## Available scripts (frontend)

- `npm run dev` — start the development server.
- `npm run build` — create a production build.
- `npm run start` — serve the production build.
- `npm run lint` — run linting.
- `npm run typecheck` — run the TypeScript compiler with no emit.

---

## Project status

- The frontend experience is implemented end to end across all workspaces, the
  design system, the reporting wizard, and the command palette. It currently
  runs on representative in-app data.
- The map experience runs on a self-contained abstract city canvas. Live Google
  Maps tiles activate when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is provided.
- Voice capture and AI analysis in the reporting wizard are realistic
  simulations on the client, structured so live device capture and Gemini calls
  can be connected without changing the surrounding UI.
- The backend provides the agent and API scaffolding; connecting the frontend
  data layer to live endpoints is the next integration step.

---

## License

This project is licensed under the MIT License. See the LICENSE file for
details.
