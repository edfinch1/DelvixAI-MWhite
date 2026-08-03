# Marshall White Campaign Intelligence — Design System Spec

**Purpose:** stop the build looking generated. This is the token sheet and the anti-slop rulebook. Conductor must treat this as binding.

---

## 0. The core decision: this is MW's brand, not W.'s

The current demo uses the **W. house style** — eggshell `#F5F0EB`, Fraunces serif, gold accent, JetBrains Mono micro-labels. That is why it reads as "a template". It's our brand shown to a client who has a very strong one of their own.

**Rule: the demo wears Marshall White's clothes.** Dark navy, white, one restrained accent, editorial sans. W. branding appears once, small, in the footer as "Built by W." — nowhere else.

> ⚠️ **Verify before build:** get MW's brand guide from Benji, or sample directly from `Marshall White - Realestate.com report.pdf` and marshallwhite.com.au. Tokens below are derived from the report header and must be confirmed.

---

## 1. Colour tokens

```js
const C = {
  // Surfaces
  ink:        '#0B1B2B',  // MW navy — headers, dark panels (sampled from REA report bar)
  inkSoft:    '#152A3D',  // raised surfaces on navy
  paper:      '#FFFFFF',  // primary page background — MW is white, not eggshell
  paperAlt:   '#F7F8F9',  // section banding, table zebra
  line:       '#E3E6E9',  // hairlines, 1px only
  lineStrong: '#C9CFD5',

  // Type
  text:       '#0B1B2B',
  textMuted:  '#5A6672',
  textFaint:  '#8A939C',
  onInk:      '#FFFFFF',
  onInkMuted: 'rgba(255,255,255,0.68)',

  // Signal — used ONLY for data state, never decoration
  good:       '#1F6F43',  // at or above benchmark
  warn:       '#B07A1E',  // watch
  bad:        '#A32B2B',  // below benchmark
  neutral:    '#8A939C',

  // Accent — one only
  accent:     '#0B1B2B',  // MW uses navy as its accent; no gold, no teal
};
```

**Hard rules**

- No gold. Gold is W.'s accent and it's the loudest "AI artifact" tell in the current demo.
- No gradients. Anywhere. Not on cards, not on hero panels, not on charts.
- Colour carries meaning only. If a green bar and a red bar sit next to each other, one is beating benchmark and one isn't. Never colour something because it looks nice.
- Max three colours visible in any one viewport, excluding signal colours.

---

## 2. Type

| Role | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| Page title | `Söhne`/`Inter` fallback stack | 28px | 500 | -0.02em |
| Section heading | same | 19px | 500 | -0.015em |
| Body | same | 15px | 400 | 0 |
| Secondary / caption | same | 13px | 400 | 0 |
| Data — large stat | same, tabular figures | 34px | 500 | -0.02em |
| Data — inline | same, tabular figures | 15px | 500 | 0 |
| Label | same | 12px | 500 | 0.01em, **sentence case** |

**Stack:** `'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`, self-hosted via Fontsource. Enable `font-variant-numeric: tabular-nums` on every number.

**Banned outright**

- ❌ **Serif display type.** Fraunces is W.'s voice, not MW's. Kill every serif heading in the current demo.
- ❌ **Monospace micro-labels.** `SYNTHESISED ACROSS 5 SYSTEMS`, `LIVE SYNC STATUS`, `RANKED BY LIKELY IMPACT ON ENQUIRY`, `CLICK TO MARK DONE`. Every one of these is the single strongest AI-generated tell in the demo. Delete them all. If a section needs a qualifier, write it as a normal sentence under the heading.
- ❌ **ALL CAPS anything** except the MW wordmark itself.
- ❌ Emoji, in UI or in button labels.

---

## 3. Layout & spacing

- 8px base grid. Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64`.
- Content max-width **1120px**, centred, 32px gutters. 24px on mobile.
- Section rhythm: 48px between major sections, 24px inside them.
- **Border radius: 4px maximum.** The current 12–16px rounded cards read as generic SaaS. MW is architectural — square, precise.
- Borders: `1px solid ${C.line}`. **No box-shadows.** Elevation is communicated by hairline and background shift only.
- Cards are containers, not decorations. If a card has no border-defining purpose, remove it and use whitespace.

---

## 4. Charts

- Library: hand-rolled SVG or Recharts with all chrome stripped.
- No 3D, no rounded bar caps, no drop shadows, no legends unless genuinely ambiguous.
- Gridlines: one horizontal hairline per axis tick at `#EDEFF1`. No vertical gridlines.
- Benchmark markers: a single 1px vertical rule in `C.ink` with a plain-sentence label above it — not a mono chip.
- Benchmarks are read against the same day of the cohort, never only against the finished campaign. The solid rule is today's expectation, a 1px dashed rule in `C.lineStrong` marks the full-campaign median, and the milestone ladder underneath (day 10 / 15 / 20 / 25 / full) carries the day the campaign has last passed. Bar colour is pace against today, not against the finish.
- The campaign progress strip sits inside the sticky top bar, so it is on screen on every tab of a campaign: position in the campaign length, a Live marker, the time of the last read, and Refresh.
- Bar height 10px, 4px gap. Never gradient-filled.
- Every chart must be readable at a glance without a legend. If it isn't, it's the wrong chart.

---

## 5. Anti-slop checklist

Conductor must self-audit against this before declaring done. Any ✅ found = not done.

| # | Tell | Check |
|---|---|---|
| 1 | Uppercase mono micro-labels | Zero in codebase. Grep for `letterSpacing` + `uppercase`. |
| 2 | Dark gradient "AI assessment" hero panel | Removed. The diagnosis is a plain navy panel, flat fill. |
| 3 | Confidence-score chips (`89% CONFIDENCE`) | Removed. See §6. |
| 4 | Gold/amber accent | Zero. |
| 5 | Serif headings | Zero. |
| 6 | Pill-shaped source tags | Replaced with a plain sources table. |
| 7 | Emoji on buttons | Zero. |
| 8 | Rounded 12px+ cards with shadows | Zero. |
| 9 | Suspiciously round modelled numbers (75, 60%, 45%, 15%) | See §7. Real zeros from REA are fine and must stay. |
| 10 | "Powered by AI" / "AI-generated" copy | Zero. See §6. |
| 11 | Lorem-adjacent filler copy | Every sentence must be defensible to Theo. |
| 12 | Tailwind default greys (`#6B7280`, `#F3F4F6`) | Zero. Use tokens above. |

---

## 6. Voice: never say "AI"

Benji's brief: *"non-Claude-looking"*. That's a copy problem as much as a visual one.

- ❌ "AI assessment", "89% confidence", "Your AI says", "AI-powered"
- ✅ "Campaign assessment", "Based on 2,800 comparable Marshall White campaigns", "What the data shows"

The intelligence should be **evident from the quality of the conclusion**, not announced. An agent doesn't want a robot; they want an analyst. Write every line as though a senior MW data analyst wrote it.

Replace confidence percentages with the actual basis: *"Based on 2,800 comparable Marshall White campaigns"* is more persuasive than *"89% confidence"* and is a real, checkable claim.

**No em dashes in anything the client sees.** Benji asked for this directly. An em dash is almost always a full stop, a comma, a colon or a semicolon doing a clearer job, and a screen full of them reads as machine-written. Use the punctuation the sentence actually needs. En dashes stay where they belong: number and date ranges (`20–26 July`, `$1,000–$2,000`). Grep for `—` before declaring done.

---

## 7. Number discipline

Every number on screen must trace to one of:

**1. The REA report PDF — and mind the time window. This is a trap.**

| Window | Figures |
|---|---|
| Week of 20–26 Jul 2026 | 5,020 campaign exposure · 138 listing views · 8 enquiries · 0 inspection actions · search results 93 (67%) |
| Campaign to date | 2,942 photo views · 266 floorplan views · 2 saves · 1 share · 4 map expands · 1 statement of information · 322 days on site · Premiere tier |
| Dated snapshots | eBrochure 156 sent / 17 clicks (as at 29 Oct 2025) · Notifications 3,620 / 59 clicks (as at 4 Jul 2026) |

**Never mix windows in one sentence.** "2,942 photo views against 138 listing views" is a campaign-to-date number set against a one-week number, and it is the figure most likely to get caught. Every stat on screen carries its window as a caption.

**2. The enquiry demographic PDF — this is the WHOLE BUILDING, not the unit.**
Header reads `380 Albert Street, East Melbourne`, 20 May 2024 – 26 Jul 2026, 903 enquiries. The REA report is for unit `102/380`, 8 enquiries. Showing 903 and 8 as one campaign is an obvious self-contradiction. Either scope this data out entirely, or label it explicitly as *development-level enquiry mix, 2024–2026*. Lead-source split (REA 70% / Project Website 17.9% / Domain 6% / Apartments&Developments 3.4% / Open Home 1.4% / Plezzel 1% / MW site 0.2%) is only usable as a channel-mix illustration, never as this listing's performance.

**3. Media counts of 0 are views, not purchases.** The REA report's `Video 0 / 3D tour 0 / Property walkthrough 0` sit under **Media engagement** — they are zero *views*. Whether those assets were bought is a Red HQ question and we have no Red HQ data. Any "not purchased" claim in the demo is modelled and must be labelled as such.

**4. A clearly-labelled modelled benchmark.**

**No round numbers** *in modelled figures*. `75/100` → `71`. `60%` → `58%`. Real data is lumpy; round numbers announce fabrication. **Exception: real zeros stay.** `0 inspection actions` is genuine REA data and is the load-bearing number in the whole demo.

Every modelled figure gets a source note in the sources table. Nothing floats unattributed.

---

## 8. Source honesty pattern

Replace the "Connected sources — synced 2m ago" pill row with a plain table:

| Source | Provides | Status |
|---|---|---|
| Box+Dice CRM | Enquiries, OFI, buyer feedback, follow-up timing | Available now — REST API |
| Domain Skylight | Views, saves, impressions, enquiries, suburb benchmarks | Available now — partner API |
| Google Analytics | MW site sessions and dwell time | Available now — GA4 |
| Red HQ | Spend by channel, product tier purchased | Available now — read confirmed, write TBC |
| REA Ignite | Views, impressions, enquiries, session duration | **Access pending** — no public API; weekly PDF export today |
| MW historical | Benchmark cohort from past MW campaigns | Internal |

**"Available now" means integrable on MW's own authority — not already integrated.** Nothing in this build is connected to anything. Never write "Connected" or "synced 2m ago"; that's the claim most likely to be tested and it contradicts the demo's own honesty.

REA's row is styled identically to the others but with a `warn`-coloured status. This turns the deck's #1 risk into a controlled talking point instead of a gotcha.

The table has six rows but the pitch says "five systems" — the sixth is MW's own history, which isn't an integration. Make sure Benji's language matches what's on screen: *"five external systems, plus your own history."*

---

## 9. Mobile

Agents work from phones. Single column below 768px, stat cards stack 2×2, charts become horizontal bar lists. The recommendation actions must be tappable and the primary CTA reachable with a thumb.
