# Styleco working agreement

- Follow the living requirements in docs/COPILOT_LIVING_REQUIREMENTS.md.
- Work only on the requested increment. Do not advance phases automatically.
- AIDOS: IDEA → DISCOVERY → REQUIREMENTS → PLANNING → DESIGN (D1–D9) → DESIGN FREEZE → IMPLEMENTATION → FUNCTIONAL TESTING → VISUAL QA → RESPONSIVE/ACCESSIBILITY QA → RELEASE.
- Update living requirements when prompts change scope. Record superseded decisions explicitly in architecture; keep plan and handoff current.
- Storefront only. Do not build or plan Admin until explicitly requested.
- Keep UI → services → repository contracts → infrastructure. No Appwrite SDK calls in components.
- Prefer Server Components and pnpm. No deployment or external service dependency in the foundation.
- Run relevant lint, typecheck, tests, and build before declaring an implementation complete.
