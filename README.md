# Marshall White Campaign Intelligence — demo

A fully static demonstration built for the Tuesday Marshall White meeting,
presented as the operating system an agent would live in: a portfolio of
campaigns, one campaign opened as a workspace (Overview, Benchmarks, Buyer
feedback, Spend and levers, Actions, Data connections). No backend, no auth,
no API calls — every figure and sentence lives in `src/data/campaign.ts`.

The worked example is **102/380 Albert Street, East Melbourne**, built on its
real REA report. The other portfolio rows are illustrative and labelled as
such on screen — only the worked example opens.

## What is real

Taken directly from the campaign's REA report (each carries its window on screen):

- **Week of 20–26 Jul 2026:** 5,020 campaign exposure · 138 listing views
  (93, or 67%, from search results) · 8 enquiries · **0 inspection actions**
- **Campaign to date:** 2,942 photo views · 266 floorplan views · 2 saves ·
  1 share · 322 days on site · Premiere tier · notifications 3,620 sent /
  59 clicked · zero recorded views on video, 3D tour and walkthrough
- **Dated snapshot:** eBrochure 156 sent / 17 clicked (as at 29 Oct 2025)
- Benchmark figures 32 qualified enquiries / 8 contract requests / 24 OFI
  groups are from the pitch deck (slide 7)

## What is modelled

Everything we have no system access for yet, marked as such on screen and in
the sources table:

- All Box+Dice content: buyer feedback themes, the 47-note count, warm-lead
  counts, follow-up timing
- All Red HQ content: purchased / not-purchased status (only the Premiere
  tier is confirmed by the REA report — the zero video/3D figures are zero
  *views*, not purchase records)
- The campaign health score, its weights, and all cohort comparisons
  ("1.7×", "62 days", etc.)
- Campaign-side benchmark values except inspection actions (REA-real)

Nothing on the page is connected to anything. "Available now" in the sources
table means integrable on Marshall White's authority, not integrated.

## Known data traps (do not "fix" these)

- Weekly and campaign-to-date figures must never share a sentence.
- The 903-enquiry demographic report covers the whole building
  (380 Albert Street), not this unit. It is deliberately excluded.
- `0 inspection actions` is genuine REA data — the load-bearing number.

## Run

```
npm install
npm run dev      # local
npm run build    # outputs dist/ — deployed to Netlify from main
```

Stack: React 18 + Vite + TypeScript, inline styles from `src/tokens.ts`,
Inter via Fontsource, hand-rolled SVG charts, `useState` only.
`DESIGN.md` is binding.
