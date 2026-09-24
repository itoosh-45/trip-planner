# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
A traveler (the owner and their family) planning and running a trip. The most common scene is **on the phone, during the trip**: logging an expense at a café counter, ticking off today's activities, checking how much budget is left, often one-handed and on the move. Pre-trip planning on a larger screen also happens.

## Product Purpose
Plan the trip day by day and keep the budget honest while travelling: a daily itinerary with activities and estimated costs, a planned budget split into categories, a log of actual expenses, and an analysis of planned versus actual. Success means the traveler knows at a glance what's next today and whether they're on budget, and can log an expense in seconds.

## Positioning
A personal, Hebrew-first (RTL) planner that joins the itinerary and the money in one place: every expense can be tied to a trip day, and every day shows its estimated cost. No account and no server; the data lives in the browser.

## Operating Context
- Four tabs: Days, Budget plan, Expenses, Analysis. Summary figures (total budget, spent, remaining, utilization) sit above the tabs.
- Modals to add or edit a day, an activity, or an expense.
- Export to JSON (backup) and CSV (Excel), import from a JSON backup, sample data (Italy, 5 days), and reset.
- Currencies ₪ $ € £.

## Capabilities and Constraints
- React 19 + TypeScript + Vite + Tailwind CSS 4, lucide-react icons. Data in localStorage.
- The whole UI is Hebrew and right-to-left.
- The tab structure and content must be preserved in a redesign; only the look changes.
- Each budget category keeps its own identifying color (seven categories: accommodation, flights, food, attractions, shopping, local transport, other). Softer tones are fine.

## Brand Commitments
- Name: "מתכנן הטיול" (Trip Planner).
- The user asked for a quiet, calm, bright minimalist look with different, calmer fonts. It must not feel cold or office-like, and must not feel empty.

## Evidence on Hand
Sample trip data in `src/utils/sampleData.ts` (Italy, 5 days, 23 expenses). No logos, photos, or testimonials exist.

## Product Principles
1. Phone-first during the trip: the most frequent actions (log an expense, tick an activity, see the remaining budget) are the easiest to reach.
2. Calm, not sterile: quiet surfaces with warmth, so money tracking never feels like accounting software.
3. Status at a glance: on/over budget and today's plan are legible without reading.
4. Hebrew is native: typography, direction, and numbers are designed for RTL, not flipped.
