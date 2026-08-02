import type { CampaignData } from '../types';

// ALL demo content lives here. Components render this and nothing else.
//
// Provenance key — see README.md and the sources section:
//   [REA-weekly]   REA report, week of 20–26 Jul 2026. Real.
//   [REA-campaign] REA report, campaign to date. Real.
//   [REA-dated]    REA report, dated snapshot. Real, carries its own date.
//   [deck]         Pitch deck slide 7 benchmark figures.
//   [modelled]     Illustrative. No Box+Dice / Red HQ data exists yet.
//
// Never mix time windows in one sentence. Real zeros stay; modelled figures
// are never round.

export const campaign: CampaignData = {
  header: {
    wordmark: 'MARSHALL WHITE',
    productName: 'Campaign intelligence',
    address: '102/380 Albert Street, East Melbourne',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Premiere tier' }, // [REA-campaign]
      { label: 'Listed', value: '10 September 2025' },
      { label: 'On site', value: '322 days' }, // [REA-campaign]
    ],
    reportWindow: 'Latest portal report: week of 20–26 July 2026',
  },

  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      // [REA-weekly] — conversion contexts computed within the same week
      { value: '5,020', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '138', label: 'Listing views', context: '2.7% of exposure clicked through' },
      { value: '8', label: 'Enquiries', context: '5.8% of views enquired' },
      {
        value: '0',
        label: 'Inspection actions',
        context: 'None of the 8 enquiries went further',
        highlight: true, // the load-bearing number — real zero
      },
    ],
    windowCaption: 'Week of 20–26 July 2026, realestate.com.au.',
  },

  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 322 · Read across five systems',
    paragraphs: [
      [
        { text: 'This listing gets found and studied, and then nothing happens. ' },
        {
          text: 'Across the campaign, buyers have opened the photos 2,942 times — and saved the listing twice.',
          strong: true,
        },
        {
          text: ' Last week the pattern held: 8 enquiries, and not one inspection action. Nobody added it to a plan, nobody registered to inspect.',
        },
      ],
      [
        { text: 'After 322 days on a Premiere listing, that reads as a ' },
        { text: 'price-expectation problem', strong: true },
        {
          text: ': buyers reach the listing in volume, look closely, decide it isn’t worth an inspection, and move on.',
        },
      ],
    ],
    systems:
      'No single system shows this. The portal report holds the traffic and the zero inspection intent, but the reason sits elsewhere: buyer feedback logged in Box+Dice names price as the dominant objection, and Red HQ shows no video or 3D tour has been purchased to shift the first impression. The pattern only becomes visible when those records are read together.',
    caption:
      'Portal figures are taken directly from the campaign’s REA report. The Box+Dice and Red HQ layers are modelled — see sources below.',
  },

  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '39',
    outOf: '/ 100',
    verdict: 'Well below the above-reserve band',
    summary:
      'Traffic is doing its job. The score is dragged down by inspection intent — zero actions last week — and a database that has stopped responding.',
    subScores: [
      { label: 'Traffic', score: 78, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 44, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 9, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 31, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 38, weightNote: 'Weighted 15%' },
    ],
    caption:
      'Weighting is modelled on the Marshall White historical cohort — see sources.',
  },

  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Drawn from 2,800 analysed Marshall White apartment campaigns. Benchmark is the median for comparable listings that sold above reserve, matched on suburb, price band and product tier. Campaign-side values are modelled pending Box+Dice access, except inspection actions, which are from the REA report.',
    metrics: [
      {
        label: 'Qualified enquiries',
        campaignValue: 6,
        campaignDisplay: '6',
        benchmarkValue: 32, // [deck]
        benchmarkDisplay: 'Benchmark 32',
        windowNote: 'Campaign to date, modelled',
      },
      {
        label: 'Open-for-inspection attendance',
        campaignValue: 11,
        campaignDisplay: '11 groups',
        benchmarkValue: 24, // [deck]
        benchmarkDisplay: 'Benchmark 24 groups',
        windowNote: 'Campaign to date, modelled',
      },
      {
        label: 'Contract requests',
        campaignValue: 1,
        campaignDisplay: '1',
        benchmarkValue: 8, // [deck]
        benchmarkDisplay: 'Benchmark 8',
        windowNote: 'Campaign to date, modelled',
      },
      {
        label: 'Follow-up speed',
        campaignValue: 3.4,
        campaignDisplay: '3.4 days',
        benchmarkValue: 1,
        benchmarkDisplay: 'Benchmark under 24 hours',
        betterIsLower: true,
        windowNote: 'Median across campaign, modelled',
      },
      {
        label: 'Inspection actions',
        campaignValue: 0,
        campaignDisplay: '0',
        benchmarkValue: 2.7,
        benchmarkDisplay: 'Benchmark 2.7 per week',
        windowNote: 'Week of 20–26 July 2026, REA report',
      },
    ],
  },

  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain can’t see this — it only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 47 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Price expectation',
        pct: 62,
        countNote: '29 of 47 notes',
        note: 'The most cited objection across enquiry and inspection notes.',
      },
      {
        label: 'Positive on location',
        pct: 43,
        countNote: '20 of 47 notes',
        note: 'The East Melbourne position is a consistent drawcard.',
      },
      {
        label: 'Layout and size concerns',
        pct: 17,
        countNote: '8 of 47 notes',
        note: 'Raised occasionally; not the primary blocker.',
      },
      {
        label: 'Timing and finance',
        pct: 11,
        countNote: '5 of 47 notes',
        note: 'A small number of buyers are waiting on approvals.',
      },
    ],
    caption:
      'Illustrative. This layer is modelled pending Box+Dice access — the note count and proportions show how the connected product reads, not a real measurement.',
  },

  spend: {
    title: 'What the campaign has bought — and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: '2,942 photo views campaign to date' },
      { label: 'Floorplan', note: '266 floorplan views campaign to date' },
      { label: 'REA Premiere tier', note: 'Confirmed by the REA report' },
      { label: 'eBrochure', note: '156 sent, 17 clicked, as at 29 Oct 2025' },
    ],
    notPurchased: [
      { label: 'Property video', note: 'Zero video views recorded across the campaign' },
      { label: '3D tour', note: 'Zero 3D tour views recorded across the campaign' },
      { label: 'Social retargeting', note: 'No retargeting product on the campaign record' },
      { label: 'Database blast', note: 'Beyond standard portal notifications' },
    ],
    caption:
      'Purchase status is modelled pending Red HQ access — only the Premiere tier is confirmed by the REA report. The zero view counts are real REA figures and are consistent with those assets never being produced.',
  },

  recommendations: {
    title: 'Recommended levers, by budget',
    subtitle:
      'Built from what has been purchased, what is missing, and what similar campaigns did next.',
    tiers: [
      {
        id: 'none',
        label: 'No additional budget',
        recommendations: [
          {
            action: 'Take the price conversation to the vendor, with evidence',
            evidence:
              'REA, campaign to date: 2,942 photo views and 266 floorplan views against 2 saves. Buyers study the listing and rule it out — and Box+Dice feedback (modelled) names price in 62% of notes.',
            impact: 'Repositions the campaign rather than re-marketing it',
            cost: 'No cost',
          },
          {
            action: 'Call every warm enquirer with the repositioned pitch',
            evidence:
              'Box+Dice (modelled): 11 contacts enquired but never booked an inspection, and none have been called since their first contact.',
            impact: 'Estimated 2–3 inspections rebooked',
            cost: 'No cost',
          },
          {
            action: 'Send a segmented buyer alert to the matched database',
            evidence:
              'REA, campaign to date: 3,620 buyers notified, 59 clicked through (1.6%). A price-led alert to matched buyers outperforms the generic notification in the Marshall White cohort (modelled).',
            impact: 'Estimated 1–2 additional enquiries',
            cost: 'No cost',
          },
          {
            action: 'Rewrite the listing copy to lead with location',
            evidence:
              'Box+Dice (modelled): 43% of feedback notes praise the East Melbourne position, but the copy currently leads with apartment specifications.',
            impact: 'Reframes the first impression for new and returning viewers',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Commission a property video',
            evidence:
              'REA records zero video engagement across the campaign because there is no video to watch. In the Marshall White above-reserve cohort (modelled), campaigns that added video mid-campaign lifted view-to-inspection conversion by 1.7 times.',
            impact: 'Moves inspection actions off zero',
            cost: 'Estimated $1,400',
          },
          {
            action: 'Refresh the hero photograph for search results',
            evidence:
              'REA, last week: 93 of 138 listing views (67%) arrived from search results, where only the hero image and price do the selling.',
            impact: 'Lifts search click-through on the highest-traffic surface',
            cost: 'Estimated $480',
          },
          {
            action: 'Retarget campaign viewers on social',
            evidence:
              'The campaign’s 2,942 photo views are a warm audience no one has spoken to again; no retargeting product has been purchased (Red HQ, modelled).',
            impact: 'Estimated 1–2 enquiries from re-engaged viewers',
            cost: 'Estimated $850',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Produce a 3D tour and walkthrough',
            evidence:
              'REA records zero engagement on 3D and walkthrough formats because neither exists. In the Marshall White cohort (modelled), apartment campaigns carrying a 3D tour averaged 1.4 times the inspection attendance.',
            impact: 'Opens the listing to time-poor and interstate buyers',
            cost: 'Estimated $3,200',
          },
          {
            action: 'Relaunch with new creative and a repositioned guide',
            evidence:
              'After 322 days (REA), the listing is stale in every saved search. Relaunched campaigns with repositioned guides in the Marshall White cohort (modelled) reached contract in a median of 62 days.',
            impact: 'Resets the campaign rather than extending it',
            cost: 'Estimated $3,800 plus agency time',
          },
        ],
      },
    ],
  },

  actions: {
    title: 'Immediate actions',
    subtitle: 'No cost and no vendor sign-off required. Tick items off as they are done.',
    items: [
      {
        id: 'call-warm',
        label: 'Call the 11 warm enquirers in Box+Dice',
        detail: 'Priority: enquired, never inspected.',
      },
      {
        id: 'db-alert',
        label: 'Send the segmented buyer alert',
        detail: 'Segment by price band and suburb preference.',
      },
      {
        id: 'copy',
        label: 'Rewrite the listing copy to lead with location',
        detail: 'Draft for agent sign-off.',
      },
      {
        id: 'vendor',
        label: 'Book the vendor meeting for the price conversation',
        detail: 'Bring the saves-to-views evidence.',
      },
    ],
  },

  sources: {
    title: 'Sources',
    subtitle:
      'Five external systems, plus Marshall White’s own campaign history. “Available now” means integrable on Marshall White’s authority — nothing in this demonstration is connected yet, and every modelled layer above is marked against its source here.',
    columns: ['Source', 'Provides', 'Status'],
    rows: [
      {
        source: 'Box+Dice CRM',
        provides: 'Enquiries, inspection logs, buyer feedback, follow-up timing',
        status: 'Available now — REST API. Feedback layer above is modelled.',
        tone: 'neutral',
      },
      {
        source: 'Domain Skylight',
        provides: 'Views, saves, impressions, enquiries, suburb benchmarks',
        status: 'Available now — partner API',
        tone: 'neutral',
      },
      {
        source: 'Google Analytics',
        provides: 'Marshall White site sessions and dwell time',
        status: 'Available now — GA4',
        tone: 'neutral',
      },
      {
        source: 'Red HQ',
        provides: 'Spend by channel, product tier purchased',
        status: 'Available now — read confirmed, write to be confirmed. Purchase layer above is modelled.',
        tone: 'neutral',
      },
      {
        source: 'REA Ignite',
        provides: 'Views, impressions, enquiries, session duration',
        status: 'Access pending — no public API; weekly PDF export today',
        tone: 'warn',
      },
      {
        source: 'Marshall White historical',
        provides: 'Benchmark cohort from past Marshall White campaigns',
        status: 'Internal. Benchmarks above are modelled from the deck’s analysed set.',
        tone: 'neutral',
      },
    ],
  },

  footer: 'Built by W.',
};
