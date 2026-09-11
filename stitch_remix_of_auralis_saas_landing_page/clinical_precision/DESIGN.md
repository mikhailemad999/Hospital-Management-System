---
name: Clinical Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#42474f'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#727780'
  outline-variant: '#c2c7d1'
  surface-tint: '#2d6197'
  primary: '#00355f'
  on-primary: '#ffffff'
  primary-container: '#0f4c81'
  on-primary-container: '#8ebdf9'
  inverse-primary: '#a0c9ff'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fd'
  on-secondary-container: '#57657b'
  tertiary: '#003756'
  on-tertiary: '#ffffff'
  tertiary-container: '#004e78'
  on-tertiary-container: '#74c1ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4ff'
  primary-fixed-dim: '#a0c9ff'
  on-primary-fixed: '#001c37'
  on-primary-fixed-variant: '#07497d'
  secondary-fixed: '#d5e3fd'
  secondary-fixed-dim: '#b9c7e0'
  on-secondary-fixed: '#0d1c2f'
  on-secondary-fixed-variant: '#3a485c'
  tertiary-fixed: '#cce5ff'
  tertiary-fixed-dim: '#93ccff'
  on-tertiary-fixed: '#001d31'
  on-tertiary-fixed-variant: '#004b73'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  title-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  tabular-vitals:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-dense: 0.5rem
  margin: 1.5rem
  margin-compact: 0.75rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

This design system delivers an enterprise-grade clinical environment optimized for high cognitive workloads, mission-critical accuracy, and rapid decision-making across clinical and administrative workflows. The aesthetic balances **Corporate / Modern** reliability with clinical ergonomics: deliberate whitespace, high information density without visual noise, and unambiguous data hierarchy.

### Brand Personality & Emotional Impact
- **Absolute Authority & Reliability:** The interface projects institutional stability, patient safety, and medical diligence.
- **Calm Under Pressure:** Visual cues prioritize critical anomalies without creating panic; routine data remains quiet, legible, and structured.
- **Micro-Precision:** Every pixel, baseline, and divider enforces order, minimizing cognitive fatigue for physicians, nurses, and hospital administrators during 12-hour shifts.

### Target Audience
Chief medical officers, attending physicians, triage nurses, clinical pharmacists, lab technicians, and hospital administrators operating across intensive care units, emergency departments, inpatient wards, and administrative suites.

## Colors

The palette is engineered around high contrast, strict WCAG 2.1 AA compliance, and medical classification standards. 

### Foundation Palette
- **Primary (`#0F4C81`):** Deep Medical Sapphire. Communicates institutional authority; applied to primary navigation surfaces, active clinical states, high-priority interactive elements, and focused headers.
- **Secondary (`#334155`):** Tech Slate. Used for core structural chrome, subheadings, key metadata anchors, and interactive borders.
- **Tertiary (`#0284C7`):** Clinical Cyan. Provides visual lift for links, active tabs, inline filter pills, and focused form outlines.
- **Neutral (`#64748B`):** Cool Slate. Drives secondary copy, inactive states, column headers, and structural grid rules.

### Surfaces & Tokens
- **Canvas / Root Background:** `#F8FAFC` (Sterile Off-White). Minimizes eye strain compared to blinding pure white during sustained screen time.
- **Surface / Card Background:** `#FFFFFF` (Pure Clinical White).
- **Subtle Containers / Read-only Fields:** `#F1F5F9`.
- **Divider & Border Rules:** `#E2E8F0` (Default), `#CBD5E1` (Input/Action borders).

### Emergency Severity Index (ESI) & Triage Tokens
- **Level 1 (Resuscitation / Immediate):** Text `#DC2626`, Tint Surface `#FEF2F2`, Border `#FCA5A5`
- **Level 2 (Emergent):** Text `#EA580C`, Tint Surface `#FFF7ED`, Border `#FDBA74`
- **Level 3 (Urgent):** Text `#D97706`, Tint Surface `#FEFCE8`, Border `#FDE047`
- **Level 4 (Less Urgent):** Text `#16A34A`, Tint Surface `#F0FDF4`, Border `#86EFAC`
- **Level 5 (Non-Urgent):** Text `#2563EB`, Tint Surface `#EFF6FF`, Border `#93C5FD`

Triage colors must never be used decoratively. They are reserved strictly for clinical priority states, allergy flags, and critical diagnostic alerts.

## Typography

The typographical hierarchy is engineered for scanning density, readability at arm's length (bedside monitors, wall-mount stations), and strict alignment.

- **Primary UI (`Inter`):** Applied across global controls, headers, body prose, labels, and table cells. `Inter` must enforce tabular numbers globally (`font-feature-settings: "tnum" 1, "cv05" 1`) across all metric, dosing, time, and numeric columns to ensure values do not jitter or misalign across vertical rows.
- **Technical & Clinical Identifiers (`JetBrains Mono`):** Applied exclusively for Medical Record Numbers (MRNs), Patient IDs, Rx/NDC codes, ICD-10 diagnostic codes, CPT procedure codes, and laboratory batch numbers. Monospaced character widths eliminate misread numbers (`8` vs `B`, `0` vs `O`).

## Layout & Spacing

The layout is built on a compact, fluid 12-column grid system tuned for high information density without visual crowding.

### Screen Adaptations & Layout Hierarchy
- **Desktop (>= 1280px):**
  - Persistent, collapsible two-tier sidebar: Navigation dock (64px collapsed, 240px expanded).
  - Main operational viewport: 12-column layout with 16px (`gutter`) gutters and 24px (`margin`) outer margins.
  - Optional right contextual drawer (360px) for quick patient vitals, telemetry streams, or order tray.
- **Tablet / Clinical Cart (768px – 1279px):**
  - Navigation contracts to icon-only rail (64px).
  - Data grids transition to card-split views or horizontally scrollable containers with frozen first columns (Patient Name / MRN).
  - Outer margins reduce to 16px (`gutter`).
- **Mobile Handheld (< 768px):**
  - Single column reflow with sticky header and bottom sheet trays for actions.
  - Margins contract to 12px (`margin-compact`).

### Spacing Principles
- Multiples of 4px govern all layout increments.
- In dense views (e.g., ICU charts, MAR - Medication Administration Records), use `gutter-dense` (8px) and `space-xs` (4px) or `space-sm` (8px) padding to maximize the viewable clinical matrix.

## Elevation & Depth

This system avoids heavy, atmospheric dropshadows in favor of sharp, functional hierarchy driven by **crisp outlines and tonal containment**. Medical workflows require unambiguous bounding boxes to distinguish between adjacent data sets.

### Elevation Levels
- **Base Level (Canvas):** Flat `#F8FAFC`, zero elevation.
- **Level 1 (Clinical Cards & Data Rows):** `#FFFFFF` fill with a continuous 1px solid border in `#E2E8F0` and micro-shadow (`0 1px 2px 0 rgba(15, 23, 42, 0.05)`). Hover states on interactive rows elevate via border transition to `#CBD5E1`.
- **Level 2 (Flyouts, Popovers, Dropdowns):** `#FFFFFF` fill, 1px border in `#CBD5E1`, with shadow `0 4px 12px -2px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Emergency Modals, Telemetry Alarms):** Sharp separation using a backdrop scrim (`rgba(15, 23, 42, 0.5)`) and a shadow profile of `0 12px 28px -4px rgba(15, 23, 42, 0.16)`. Urgent Level 1 / 2 alerts inject a 2px top accent bar rather than thick drop shadows.

## Shapes

The design system adopts **Soft (Level 1)** geometry. 

- Core interactive elements (buttons, text inputs, dropdown triggers, table containers) use standard 4px (`0.25rem`) radius.
- Cards, summary panels, and dialog sheets use 8px (`0.5rem`) radius (`rounded-lg`).
- Triage pills, live vitals badges, and count indicators use full pill profiles (`9999px`) to immediately distinguish classification metadata from rectangular data input controls.

## Components

### Buttons
- **Primary:** Deep medical sapphire background (`#0F4C81`), crisp white text, 4px radius, 32px height in standard density, 36px in roomy contexts. Hover: `#0369A1`. Focus: 2px offset ring in `#0284C7`.
- **Secondary / Outline:** Pure white background, 1px border (`#CBD5E1`), text `#1E293B`. Hover: `#F1F5F9`.
- **Emergency / Destructive:** Crimson fill (`#DC2626`) for irreversible orders; tint fill (`#FEF2F2`) with red text (`#DC2626`) for standard danger alerts.

### Input Fields & Controls
- **Text Inputs:** 32px standard height, `#FFFFFF` background, 1px border in `#CBD5E1`, 4px radius, typography in `Inter` 13px (`body-md`). Placeholder text in `#94A3B8`. Active focus triggers a 1px border `#0284C7` and 2px ring in `rgba(2, 132, 199, 0.15)`.
- **Checkboxes & Radios:** High-contrast 16x16px targets with 1.5px border (`#64748B`). Checked state uses `#0F4C81` with white checkmark. Indeterminate states supported for batch lab selections.

### Triage Pills & Micro-Indicators
- Compact status badges (height 20px, font `JetBrains Mono` 11px uppercase bold).
- Background uses 10% tint of the respective severity color; border is 1px matching the mid-tone; text uses the dark triage token.
- Immediate/Level 1 badges incorporate a pulsing 6px radial dot indicator.

### Clinical Data Tables
- **Header:** Sticky `#F8FAFC` row, 32px height, 1px bottom divider (`#CBD5E1`), uppercase 11px font with 0.05em tracking in `#475569`.
- **Data Rows:** Alternate or clean white rows with 1px border-bottom (`#F1F5F9`). Row height is compact (36px for dense lists, 44px for patient cards).
- **Frozen Columns:** Patient identifier (Name, MRN) pinned with subtle border-right (`#E2E8F0`).
- **Cells:** Numeric values align right and utilize `tabular-vitals`. Codes and identifiers utilize `label-code-md`.

### Critical Alert Banner & Ticker
- Docked directly below the global top bar.
- Uses Level 1 Red or Level 2 Orange background with high-contrast text, displaying real-time patient distress, code notifications, and critical lab values (panic labs).
- Dismiss actions require deliberate confirmation; alerts never fade automatically.