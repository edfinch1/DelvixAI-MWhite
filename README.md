# Marshall White Campaign Intelligence — demo

A demonstration built for the Marshall White meeting, presented as the
operating system an agent would live in: a morning work queue ("Today"), a
portfolio of campaigns, and each campaign opened as a workspace (Overview,
Benchmarks, Buyer feedback, Spend and levers, Actions, Data connections).
Static apart from one serverless endpoint (`api/notify.ts`) — every figure
and sentence lives in `src/data/campaign.ts` and `src/data/worklist.ts`.

The landing screen is the **Today queue**: the tasks the five systems raised
overnight, each with an assignee, the evidence lines that fired it (tagged by
source system), the rule that raised it, and an "Email this to <agent>"
button that delivers the task as a real email via `api/notify.ts`. Figures in
the queue never introduce new numbers; each one already appears inside its
campaign workspace. The team is illustrative apart from the signed-in agent.

The worked example is **102/380 Albert Street, East Melbourne**, built on its
real REA report. Every other campaign opens the same workspace on entirely
illustrative data, and each says so in its own header.

Every campaign screen carries a persistent progress strip: where the campaign
sits in its own length, a Live marker, the time the read was last pulled, and
a Refresh control that restamps it.

## What is real

Taken directly from the campaign's REA report (each carries its window on screen):

- **Week of 20–26 Jul 2026:** 5,020 campaign exposure · 138 listing views
  (93, or 67%, from search results) · 8 enquiries · **0 inspection actions**
- **Campaign to date:** 2,942 photo views · 266 floorplan views · 2 saves ·
  1 share · 322 days on site · Premiere tier · notifications 3,620 sent /
  59 clicked · zero recorded views on video, 3D tour and walkthrough
- **Dated snapshot:** eBrochure 156 sent / 17 clicked (as at 29 Oct 2025)
- Benchmark figures 32 qualified enquiries / 8 contract requests / 24 OFI
  groups are from the pitch deck (slide 7). They are full-campaign medians;
  the day 10 / 15 / 20 / 25 milestones shown on the benchmarks screen are
  modelled shares of those medians (`PACE` in `src/data/campaign.ts`), so a
  campaign is read against the same day of the cohort rather than against a
  finished campaign.

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
npm run dev      # local UI; /api/notify is not served (button reports "not set up")
npm run build    # outputs dist/
```

Deployed on **Vercel** (project `delvix-ai-m-white`, scope `edfinch1s-projects`),
Production auto-deploys from `main`. `api/notify.ts` ships as a Vercel
serverless function.

### Notification delivery

`POST /api/notify` emails a Today-queue task. Configure in the Vercel
project's environment variables:

| Variable | Purpose |
|---|---|
| `GMAIL_USER` | Sending Gmail address |
| `GMAIL_APP_PASSWORD` | Gmail app password (account needs 2FA) |
| `NOTIFY_TO` | Recipient; defaults to `GMAIL_USER` |
| `SLACK_WEBHOOK_URL` | Optional; also posts the task to a Slack channel |

With nothing configured the endpoint answers `{ ok: true, simulated: true }`
and the UI shows "Email delivery not set up" instead of failing.

Stack: React 18 + Vite + TypeScript, inline styles from `src/tokens.ts`,
Inter via Fontsource, hand-rolled SVG charts, `useState` only.
`DESIGN.md` is binding.
