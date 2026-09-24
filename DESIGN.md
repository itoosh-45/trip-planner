---
name: מתכנן הטיול
description: A Hebrew-first trip planner drawn as a watercolor travel sketchbook
colors:
  paper: "#fcfcfa"
  sheet: "#ffffff"
  graphite-heading: "#26282c"
  graphite-ink: "#33353a"
  graphite-soft: "#585a5f"
  graphite-muted: "#6c6e73"
  graphite-faint: "#9c9d9f"
  pencil-dash: "#cbcbc7"
  hairline: "#e4e4e0"
  hairline-soft: "#f0f0ed"
  ultramarine: "#4861ae"
  ultramarine-deep: "#3b4f8f"
  ultramarine-ink: "#28355c"
  ultramarine-focus: "#7892d3"
  ultramarine-wash: "#c0cdee"
  ultramarine-tint: "#dde5f6"
  ultramarine-mist: "#eef2fb"
  pigment-accommodation: "#a6a6db"
  pigment-flights: "#8ac3dc"
  pigment-food: "#e8a57f"
  pigment-attractions: "#e297aa"
  pigment-shopping: "#be9fd3"
  pigment-transport: "#84c1b1"
  pigment-other: "#a8b2bd"
  sap-wash: "#97c586"
  sap-ink: "#3a6030"
  ochre-wash: "#e2bd62"
  ochre-ink: "#7e5a1f"
  crimson-wash: "#e18e83"
  crimson-ink: "#a04135"
  crimson-tint: "#fbeeec"
typography:
  display:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.025em"
    fontFeature: "\"tnum\""
  headline:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 500
    lineHeight: 1.33
    letterSpacing: "0"
  title:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    fontFeature: "\"tnum\""
  caption:
    fontFamily: "Noto Sans Hebrew, -apple-system, SF Hebrew, system-ui, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  full: "9999px"
spacing:
  gutter: "16px"
  gutter-wide: "24px"
  row-y: "14px"
  row-x: "20px"
  stack: "20px"
  section: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.full}"
    padding: "10px 20px"
    typography: "{typography.body}"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine-deep}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ultramarine-deep}"
    rounded: "{rounded.full}"
    padding: "8px 14px"
    typography: "{typography.label}"
  button-outline-hover:
    backgroundColor: "{colors.ultramarine-mist}"
  button-secondary:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.graphite-soft}"
    rounded: "{rounded.full}"
    padding: "12px 20px"
  button-fab:
    backgroundColor: "{colors.ultramarine-wash}"
    textColor: "{colors.ultramarine-ink}"
    rounded: "{rounded.full}"
    padding: "12px 20px 12px 16px"
    typography: "{typography.body}"
  input-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.graphite-heading}"
    rounded: "{rounded.xl}"
    padding: "10px 14px"
    typography: "{typography.body}"
  input-filter:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.graphite-soft}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
    typography: "{typography.label}"
  card-sheet:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.2xl}"
    padding: "14px 20px"
  modal-panel:
    backgroundColor: "{colors.sheet}"
    rounded: "{rounded.2xl}"
    padding: "16px 24px"
  nav-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.graphite-muted}"
    height: "64px"
  nav-tab-active:
    textColor: "{colors.ultramarine-deep}"
---

# Design System: מתכנן הטיול

## Overview

**Creative North Star: "The Watercolor Travel Sketchbook"**

The trip is kept like a sketchbook carried in a day bag, not a finance dashboard. The ground is bright cold-press paper (a near-white with a faint fractal-noise grain baked into the body background). All structure is drawn in graphite: warm grays for ink, hairline 1px rules for divisions, dashed pencil lines for anything editable or approximate. Color arrives only as transparent pigment washes: soft, irregular-edged shapes that carry meaning (a budget category, a budget status, the one action color), never decoration.

Density is calm but full. Screens open on a single ledger line (the remaining amount, large and light, with a watercolor stroke showing utilization) and then a page of content in one white sheet divided by hairlines. There are no KPI card grids, no gradients, no glass, and no shadows. The interface is Hebrew and right-to-left by construction: `html` is `direction: rtl`, bars grow from the right, timelines hang on the right edge.

The wash is the signature. Every pigment shape passes through one shared SVG filter (`#wash`): a turbulence displacement for the wobbly paper-soaked edge, grain granulation, and a darker pooled rim where the water dried, composited with `multiply` so overlapping washes deepen the way glazes do.

**Key Characteristics:**
- Bright paper ground with grain; white sheets bounded by hairlines, never lifted by shadow.
- Graphite-gray type and rules; color only as pigment washes that each mean something.
- One action color (ultramarine); seven category pigments; three status pigments (sap, ochre, crimson).
- One quiet Hebrew sans (Noto Sans Hebrew) for everything, headings stepped up by weight, tabular numerals everywhere money appears.
- One authored motion: a page settling in.

## Colors

A graphite-and-paper neutral base with a box of transparent watercolor pigments; the stock Tailwind palettes are re-pigmented in `src/index.css`, so every `gray-*`, `blue-*`, `orange-*` class draws from the same paint box.

### Primary
- **Ultramarine** (`ultramarine`): the one action color. Solid fills on primary buttons (add day, add expense, submit), text on outline and ghost actions, active tab text on mobile. Deepens to **Deep Ultramarine** (`ultramarine-deep`) on hover and for link-weight text.
- **Ultramarine Wash** (`ultramarine-wash`, `ultramarine-tint`): the same pigment thinned with water. The floating add-expense button, the plane mark behind the trip name, the active-tab stroke under desktop tabs, day-number discs, and the daily-spending bars. `ultramarine-tint` also colors text selection.
- **Ultramarine Focus** (`ultramarine-focus`): the 2px focus-visible outline and the focused border of every field.

### Secondary: Category Pigments
Seven washes, one per budget category, used at the same step everywhere (timeline dots, ledger dots, allocation strip, category discs, analytics bars):
- **Indigo** (`pigment-accommodation`): accommodation.
- **Cerulean** (`pigment-flights`): flights.
- **Burnt Sienna** (`pigment-food`): food.
- **Alizarin Rose** (`pigment-attractions`): attractions.
- **Violet** (`pigment-shopping`): shopping.
- **Viridian** (`pigment-transport`): local transport.
- **Payne's Gray** (`pigment-other`): other.

Activity categories on the day timeline borrow the pigment of the budget category they cost against: attraction rose, restaurant sienna, transport viridian, accommodation indigo, shopping violet, free time sap green, other Payne's gray. In the analytics comparison the planned bar uses the pigment one step lighter (the `-200` step of the same ramp) and spent glazes over it at the listed step.

### Tertiary: Budget Status
- **Sap Green** (`sap-wash`, text `sap-ink`): on track, utilization below 85%. Also the done-state wash on a completed activity check.
- **Yellow Ochre** (`ochre-wash`, text `ochre-ink`): near the limit, utilization at or above 85%. Also the first-tap state of the load-sample confirmation.
- **Crimson** (`crimson-wash`, text `crimson-ink`, ground `crimson-tint`): over budget, destructive actions, delete confirmation rows.

### Neutral
- **Cold-Press Paper** (`paper`): the page ground and the sticky top and bottom bars, with the grain texture on `body`.
- **Sheet White** (`sheet`): content sheets, modals, fields, dropdown menus.
- **Graphite Heading** (`graphite-heading`): headings and primary values (amounts, titles).
- **Graphite Ink** (`graphite-ink`): body text.
- **Soft Graphite** (`graphite-soft`): field labels, quiet toolbar buttons, secondary-button text.
- **Muted Graphite** (`graphite-muted`): metadata lines, captions, inactive tabs, icon buttons at rest.
- **Faint Graphite** (`graphite-faint`): decorative icons inside labels and fields only; never for text.
- **Pencil Dash** (`pencil-dash`): dashed lines (timeline spine, editable-value underline, unallocated budget), unchecked activity rings, the thin scrollbar.
- **Hairline** (`hairline`) and **Soft Hairline** (`hairline-soft`): sheet borders, bar borders, dividers between rows; `hairline-soft` is also the empty track under every progress wash.

### Named Rules
**The Pigment Means Something Rule.** Color appears only as a wash that encodes a category, a budget status, or the action. A wash with no meaning does not ship.

**The One Paint Box Rule.** New colors are added by re-pigmenting a Tailwind ramp in `src/index.css`, never by hard-coding a hex in a component. `emerald` mirrors `green`, `rose` mirrors `red`, `violet` mirrors `purple`, so stray classes still land in the box.

**The Same Pigment Everywhere Rule.** A category keeps one pigment across every tab; a pigment is never reused for a second category.

## Typography

**Display Font:** Noto Sans Hebrew (with -apple-system, SF Hebrew, system-ui, Segoe UI)
**Heading Font:** Noto Sans Hebrew, weight 500
**Body Font:** Noto Sans Hebrew

**Character:** One face, user-pinned: Noto Sans Hebrew (`--font-app`) carries headings, names, and everything read or tapped, quietly, with tabular numerals so amounts line up like a ledger. Headings step up by weight (500) and size, not by a second family; the sketchbook character lives in the paper and the washes, not in lettering.

### Hierarchy
- **Display** (Noto Sans Hebrew 300, 1.875rem rising to 2.25rem from 640px, tight tracking, tabular): the remaining-budget amount on the ledger line and the editable total budget. Large and light, never bold.
- **Headline** (Noto Sans Hebrew 500, 1.5rem): tab headings ("ימי הטיול", "הוצאות") and empty-state headings. All `h1`–`h3` default to weight 500 with balanced wrapping.
- **Title** (Noto Sans Hebrew 500, 1.125rem to 1.25rem): the trip name in the bar, day titles, modal titles, analytics section headings.
- **Body** (Noto Sans Hebrew 400, 1rem, line-height 1.55): row titles, amounts in rows, form input text (always 1rem, which also prevents iOS zoom).
- **Label** (Noto Sans Hebrew 400, 0.875rem, tabular): metadata lines, field labels, status text, filter controls.
- **Caption** (Noto Sans Hebrew 400, 0.75rem): mobile bottom-tab labels and chart value labels only.

Weight is used sparingly: 600 on button labels, 500 on headings and names, 300 on display amounts, 400 everywhere else. No uppercase and no letter-spaced labels.

### Named Rules
**The One Face Rule.** Noto Sans Hebrew is the only family (user-pinned). Hierarchy comes from size and weight (300 display, 500 headings, 600 buttons), never from a second typeface.

**The Ledger Numerals Rule.** Every amount, date, time, and count uses tabular figures (inputs, tables, and anything marked `.tabular`).

## Layout

A single centered column, max 64rem (`max-w-5xl`), with 16px side gutters rising to 24px from 640px. The order is fixed: sticky top bar, the budget ledger line, then the active tab's page. Pages stack vertically with 20px between blocks (32px on the analytics page) and hold their rows inside one white sheet rather than a grid of cards. Rows pad 16px on phones and 20px on wider screens, 14px to 16px vertically, separated by hairlines.

Phone-first. Below 1024px the tabs move to a fixed four-column bottom bar that respects the safe-area inset, the settings actions fold into a sheet under the top bar, and a floating add-expense button sits above the bottom bar on the left (the thumb side in RTL). Page bottom padding is 96px on phones and 48px on desktop to clear them. Modals rise as bottom sheets on phones and center from 640px. Forms use a single column that becomes two from 640px.

The day page is a timeline: a dashed pencil spine on the right edge, times hung outside it in a 48px to 56px column, and a 14px wash dot on the spine for each activity.

## Elevation & Depth

This system is flat. No `box-shadow` is used anywhere. Depth comes from the paper-versus-sheet contrast (grained paper ground, white sheets), 1px hairline borders, and a 25% graphite scrim (`gray-900` at 25%) behind modals. Washes overlap with `multiply`, so layering reads as glazing, not as elevation.

### Named Rules
**The Paper Doesn't Float Rule.** Surfaces are separated by hairlines and tone, never by shadow or blur. A new surface gets a 1px `hairline` border and a white or paper fill.

## Shapes

Round is the pigment shape; the fully round pill and disc (9999px) are the dominant form. Every wash is a pill or a disc: progress strokes, the allocation strip, timeline and ledger dots, icon discs, the active-tab stroke, the floating button. Buttons and filter controls are pills too. Containers soften to gently curved corners: 16px on sheets and modals (top corners only for the phone bottom sheet), 12px on form fields and dropdown menus, 8px on quiet toolbar buttons and small inline editors. Daily-spending bars are the one exception: 8px on top and 2px at the base, like a brush stroke set down on the baseline.

Lines carry meaning: a solid 1px hairline divides, a dashed pencil line marks something editable, approximate, or not yet allocated (the underline under an editable amount, the timeline spine, the unallocated slot of the budget strip, the average line on the daily chart).

## Components

### Buttons
Quiet and round; the only solid color on the page is the primary action.
- **Shape:** full pill (9999px).
- **Primary:** Ultramarine fill, white semibold label, 10px by 20px (16px by 20px `py-3` for full-width form submits); hover deepens to Deep Ultramarine. Used once per view for the main add or submit.
- **Outline:** Ultramarine Wash border (`blue-200`), Deep Ultramarine text, 14px label; hover fills with Ultramarine Mist. For secondary adds beside a heading ("+ יום").
- **Ghost:** Deep Ultramarine text with no border; Ultramarine Mist on hover ("+ פעילות").
- **Secondary:** white with a hairline border and Soft Graphite text; hover `gray-50`. Cancel in forms and confirmations.
- **Destructive:** Crimson Ink fill with a white label, only inside a confirmation row on a Crimson Tint ground.
- **Icon buttons:** 8px padding, Muted Graphite at rest, round hit area; hover goes to Graphite Ink, or to Crimson Ink for delete.
- **Focus:** the global 2px Ultramarine Focus outline at a 2px offset.

### Floating Add-Expense Button
The signature action for mid-trip use, phone only (below 1024px). A pill painted as an Ultramarine Wash (the `#wash` filter at normal blend so it stays opaque over content), Ultramarine Ink semibold label "הוצאה" with a plus, fixed 16px from the left and just above the bottom bar.

### Pigment Wash Discs and Dots
- **Status disc:** 36px to 44px disc of wash behind a graphite icon or a tabular number. Day numbers use Ultramarine Tint, turning Sap Green when every activity is done; budget categories use their pigment at 70% opacity.
- **Dot:** a 14px wash dot beside a ledger row or on the timeline spine, in the category pigment; 40% opacity when the activity is done.
- **Check:** unchecked is a 1.5px Pencil Dash ring; checked is a Sap Green wash disc with a dark green check.

### Progress Washes
A `hairline-soft` pill track (8px to 12px tall) with a wash stroke growing from the right, colored by the status scale: Sap Green below 85%, Yellow Ochre at 85% or more, Crimson over. Width animates over 700ms. The ledger-line version is 10px tall with a minimum 2% stroke so an empty budget still shows paint.

### Cards / Containers
- **Corner Style:** gently curved (16px).
- **Background:** Sheet White on the paper ground.
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** 1px Hairline, with Soft Hairline or Hairline row dividers.
- **Internal Padding:** 16px to 20px horizontal, 14px to 16px vertical per row.

### Inputs / Fields
- **Style:** white field, 1px Hairline border, 12px radius, 10px by 14px padding, 1rem Graphite Heading text. Each field sits under a 14px Soft Graphite label with a small Faint Graphite icon.
- **Filter controls:** the same treatment as a pill with 14px text (search, category filter, sort).
- **Focus:** the border shifts to Ultramarine Focus; the caret is Ultramarine.
- **Inline editing:** editable values show a dashed Pencil Dash underline that turns Ultramarine Focus on hover, and become a bottom-bordered or small bordered input in place.

### Navigation
- **Top bar:** sticky, paper ground, 1px Hairline bottom border, 56px tall (64px from 640px). The plane mark sits on an Ultramarine Wash disc beside the trip name (500 weight), which is editable on tap.
- **Desktop tabs (1024px and up):** 20px outline icons with 15px labels; inactive Muted Graphite, active Graphite Heading with a short Ultramarine Wash stroke painted under it.
- **Mobile bottom bar:** fixed, paper ground, Hairline top border, four equal columns with icon over caption; the active tab is Deep Ultramarine with an Ultramarine Tint wash pill behind the icon.
- **Settings:** quiet 14px toolbar buttons on desktop; on phones a full-width sheet of 16px rows divided by Soft Hairlines. Destructive and replace actions confirm with a second tap, tinting the row Crimson Tint or Ochre.

### Modal
A white sheet with a 1px Hairline border that rises from the bottom edge on phones (16px top corners, max 92vh, safe-area padding) and centers as a 16px-rounded panel from 640px, over a 25% graphite scrim. The title is set in Noto Sans Hebrew 500 at 1.25rem. The action row sticks to the bottom behind a Soft Hairline. Opens with the page-in motion.

### Motion
One authored motion: **page-in**, 450ms `cubic-bezier(0.16, 1, 0.3, 1)`, from 40% opacity and 6px lower. It plays on tab change and modal open and is removed under `prefers-reduced-motion`. Everything else is a plain color transition or the 700ms progress-width transition.

## Do's and Don'ts

### Do:
- **Do** paint every colored shape through the shared `#wash` filter (the `.wash` utility) so edges stay soft and irregular and overlaps glaze.
- **Do** color a category with its one pigment on every tab, and add new pigments by re-pigmenting a ramp in `src/index.css`.
- **Do** color budget status as Sap Green below 85%, Yellow Ochre at 85% or more, and Crimson over budget, the same everywhere.
- **Do** set everything in Noto Sans Hebrew: headings and names at 500, everything read or tapped at 400, tabular numerals on every amount.
- **Do** hold a page's rows in one white 16px sheet divided by hairlines.
- **Do** mark editable or approximate values with a dashed pencil line.
- **Do** keep a single solid Ultramarine action per view; other actions are outline, ghost, or icon buttons.
- **Do** build RTL-first: bars grow from the right, the timeline spine sits on the right, the floating button sits on the left.

### Don't:
- **Don't** add `box-shadow`, glass, or blur to lift a surface; use a hairline and tone.
- **Don't** use gradients, or build the gradient header plus four KPI cards plus shadowed card grid this system was made to replace.
- **Don't** use a pigment wash with no meaning, or reuse one category's pigment for another.
- **Don't** add a second typeface (no handwriting or display face), or bold the display amount.
- **Don't** use Faint Graphite (`graphite-faint`) or Pencil Dash (`pencil-dash`) for text.
- **Don't** add motion beyond page-in and the progress-width transition.
