# Design Brief

## Direction

**Neon Şev** (نیۆن شەو) — a Kurdish school management system that runs like a late-night control room: deep near-black canvas, cyan and magenta neon rails, glass panels.

## Tone

Retro-futuristic control-room — executed with conviction so the admin feels they are operating a live system, not filling in a spreadsheet.

## Differentiation

Every surface is a dark glass slab lit from one edge by a cyan or magenta hairline, so hierarchy is read as *light*, not as boxes — unmistakably neon without becoming garish.

## Color Palette

| Token      | OKLCH        | Role                                            |
| ---------- | ------------ | ----------------------------------------------- |
| background | 0.13 0.018 265 | Deep near-black canvas with faint cool cast   |
| foreground | 0.94 0.012 250 | Primary text, high contrast on dark           |
| card       | 0.17 0.022 265 | Elevated glass panels, tables, dialogs        |
| primary    | 0.78 0.15 195  | Glowing cyan — CTAs, active nav, focus rings  |
| accent     | 0.72 0.24 330  | Glowing magenta — secondary highlights, badges |
| muted      | 0.22 0.024 265 | Inset wells, table stripes, disabled surfaces |
| destructive| 0.62 0.24 22   | Errors, delete actions                        |
| success    | 0.72 0.17 158  | Positive status, present markers              |
| warning    | 0.8 0.16 82    | Pending / attention states                    |

## Typography

- Display: **Space Grotesk** — headings, stat values, nav labels, wordmark; geometric and techy.
- Body: **Nunito** — paragraphs, form labels, table cells; rounded and highly legible.
- Arabic (Kurdish Sorani): system Naskh stack (`Noto Naskh Arabic` → `Segoe UI` → `Tahoma`) applied via `[dir="rtl"]` / `[lang="ckb"]`.
- Mono: **JetBrains Mono** — IDs, counts, timestamps, tabular numbers.
- Scale: hero `text-4xl md:text-6xl font-bold tracking-tight`, h2 `text-2xl md:text-3xl font-bold tracking-tight`, label `text-xs font-semibold tracking-widest uppercase text-muted-foreground`, body `text-base`.

## Elevation & Depth

Three tiers only: `background` canvas → `card` glass panel with `shadow-elevated` → `popover` dialog with `shadow-glow-soft`; neon glow shadows are reserved for interactive/active elements, never ambient chrome.

## Structural Zones

| Zone    | Background              | Border                    | Notes                                              |
| ------- | ----------------------- | ------------------------- | -------------------------------------------------- |
| Login   | `bg-background` + neon orbs | —                     | Centered glass card, cyan-on-magenta gradient CTA  |
| Header  | `bg-card/80` + blur     | `border-b border-border`  | Sticky, holds wordmark, user avatar, lang toggle   |
| Sidebar | `bg-sidebar`            | `border-e border-sidebar-border` | Active item = cyan rail + glow, RTL flips to right |
| Content | `bg-background`         | —                         | Stat row, then table/form on `bg-card` panels      |
| Footer  | `bg-muted/40`           | `border-t border-border`  | Version + school name, low emphasis                |

## Spacing & Rhythm

Sections breathe at `gap-6`/`py-8` on desktop and tighten to `gap-4`/`py-5` on mobile; stat cards use `p-5`, tables `px-4 py-3` rows, and forms `space-y-4` with `gap-2` label-to-input.

## Component Patterns

- Buttons: `rounded-lg`, cyan `bg-primary` with `shadow-glow-cyan` on hover; secondary = transparent + `border-neon`; destructive = solid red.
- Cards: `rounded-xl` (`--radius` 0.75rem), `bg-card/80` glass, `border border-border`, `shadow-elevated`, hover lifts to `shadow-glow-soft`.
- Inputs: `rounded-lg bg-muted/50 border-input`, focus → `focus-neon` cyan ring, RTL text right-aligned.
- Badges: pill `rounded-full`, tinted `bg-primary/15 text-primary` (or accent/success/warning variants).
- Tables: header `text-xs uppercase tracking-widest text-muted-foreground`, rows separated by `border-border`, hover row `bg-muted/40`.

## Motion

- Entrance: `animate-fade-in-up` staggered 60ms per card/section, 0.5s ease-out.
- Hover: `transition-smooth` 0.3s on color, border, and glow shadow; nav items slide a 2px cyan rail in.
- Decorative: `animate-neon-pulse` on live status dots; `animate-glow-drift` on login background orbs.

## Constraints

- Dark-only theme — no light mode; `:root` mirrors `.dark` so neon renders before class application.
- Tokens only in components: no hex/rgb literals, no arbitrary `bg-[#...]` classes.
- Glow shadows stay on interactive/active elements; body copy keeps AA+ contrast on dark.
- `doNotBuild` honored: no attendance-tracking or grades/exam-results surfaces are designed or reserved.

## Signature Detail

A cyan-to-magenta gradient "light rail" — a 1px glowing edge on the active sidebar item, focused input, and primary CTA — ties every interactive state to the same neon signature.
