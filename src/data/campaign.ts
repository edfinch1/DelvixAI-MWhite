import type {
  BenchmarkMetric,
  CampaignRecord,
  CampaignTimeline,
  FixtureData,
  Tone,
} from '../types';

// ALL demo content lives here. Components render this and nothing else.
//
// Provenance key. See README.md and the data connections screen:
//   [REA-weekly]   REA report, week of 20–26 Jul 2026. Real.
//   [REA-campaign] REA report, campaign to date. Real.
//   [REA-dated]    REA report, dated snapshot. Real, carries its own date.
//   [deck]         Pitch deck slide 7 benchmark figures.
//   [modelled]     Illustrative. No Box+Dice / Red HQ data exists yet.
//
// 102/380 Albert Street is the worked example on real REA figures. Every
// other campaign is entirely illustrative and says so in its own header,
// so it can never be presented as a real reading.
//
// Never mix time windows in one sentence. Real zeros stay; modelled figures
// are never round.

const ILLUSTRATIVE_WINDOW = 'Illustrative campaign, sample data';

// The moment the read was last pulled from the connected systems. One stamp for
// the whole demonstration, refreshed on screen when the agent asks for it.
const LAST_SYNC = '2:14pm 03/08/2026';

const STANDARD_CAMPAIGN_DAYS = 35;

// Milestone pacing. The share of the full-campaign benchmark that above-reserve
// campaigns have usually reached by each milestone day, modelled on the
// analysed Marshall White set. Front-loaded, because the launch fortnight
// carries the enquiry spike.
const PACE = [
  { label: 'Day 10', day: 10, share: 0.34 },
  { label: 'Day 15', day: 15, share: 0.52 },
  { label: 'Day 20', day: 20, share: 0.68 },
  { label: 'Day 25', day: 25, share: 0.83 },
  { label: 'Full campaign', day: STANDARD_CAMPAIGN_DAYS, share: 1 },
] as const;

// Straight-line read between milestones, clamped at both ends.
function expectedShare(day: number): number {
  if (day <= PACE[0].day) return (day / PACE[0].day) * PACE[0].share;
  for (let i = 1; i < PACE.length; i += 1) {
    const prev = PACE[i - 1];
    const next = PACE[i];
    if (day <= next.day) {
      const progress = (day - prev.day) / (next.day - prev.day);
      return prev.share + progress * (next.share - prev.share);
    }
  }
  return 1;
}

function paceTone(actual: number, expected: number, betterIsLower = false): Tone {
  const ratio = betterIsLower
    ? actual === 0
      ? 1
      : expected / actual
    : expected === 0
      ? 1
      : actual / expected;
  if (ratio >= 0.95) return 'good';
  if (ratio >= 0.8) return 'warn';
  return 'bad';
}

function paceVerdict(tone: Tone): string {
  if (tone === 'good') return 'On pace';
  if (tone === 'warn') return 'Just short of pace';
  return 'Behind pace';
}

interface CumulativeInput {
  label: string;
  value: number;
  valueDisplay: string;
  full: number;
  day: number;
  unit?: string;
  windowNote: string;
}

// A metric that accumulates across the campaign, so the expectation moves with
// the day the campaign is on.
function cumulativeMetric(input: CumulativeInput): BenchmarkMetric {
  const unit = input.unit ?? '';
  const past = input.day >= STANDARD_CAMPAIGN_DAYS;
  const expected = Math.round(input.full * expectedShare(input.day));
  const expectedText = `${expected}${unit}`;
  const tone = paceTone(input.value, expected);
  const dayRef = past
    ? `the end of a standard ${STANDARD_CAMPAIGN_DAYS}-day campaign`
    : `day ${input.day}`;

  // The milestone the campaign has most recently passed, so the ladder shows
  // where it is standing rather than only where it is heading.
  const passed = PACE.filter((p) => input.day >= p.day);
  const currentDay = passed.length ? passed[passed.length - 1].day : -1;

  return {
    label: input.label,
    campaignValue: input.value,
    campaignDisplay: input.valueDisplay,
    benchmarkValue: input.full,
    benchmarkDisplay: `Full-campaign benchmark ${input.full}${unit}`,
    expectedValue: expected,
    expectedDisplay: past
      ? `Full-campaign expectation ${expectedText}`
      : `Expected by day ${input.day}: ${expectedText}`,
    paceNote: `${paceVerdict(tone)}. Above-reserve campaigns reach ${expectedText} by ${dayRef}, and this campaign is at ${input.valueDisplay}.`,
    paceTone: tone,
    stages: PACE.map((p) => {
      const value = Math.round(input.full * p.share);
      return {
        label: p.label,
        day: p.day,
        value,
        display: `${value}${unit}`,
        isPast: input.day > p.day,
        isCurrent: p.day === currentDay,
      };
    }),
    windowNote: input.windowNote,
  };
}

interface RateInput {
  label: string;
  value: number;
  valueDisplay: string;
  benchmark: number;
  benchmarkDisplay: string;
  benchmarkPhrase: string;
  stageSentence: string;
  betterIsLower?: boolean;
  windowNote: string;
}

// A rate rather than a running total, so the same benchmark applies at day 10
// and at the close.
function rateMetric(input: RateInput): BenchmarkMetric {
  const tone = paceTone(input.value, input.benchmark, input.betterIsLower);
  return {
    label: input.label,
    campaignValue: input.value,
    campaignDisplay: input.valueDisplay,
    benchmarkValue: input.benchmark,
    benchmarkDisplay: input.benchmarkDisplay,
    expectedValue: input.benchmark,
    expectedDisplay: input.benchmarkDisplay,
    paceNote: `${paceVerdict(tone)}. The benchmark is ${input.benchmarkPhrase}, and this campaign is running at ${input.valueDisplay}.`,
    paceTone: tone,
    stages: [
      {
        label: 'Every stage',
        day: 0,
        value: input.benchmark,
        display: input.stageSentence,
        isCurrent: true,
      },
    ],
    flatBenchmark: true,
    betterIsLower: input.betterIsLower,
    windowNote: input.windowNote,
  };
}

const FOLLOW_UP_BENCHMARK = {
  benchmark: 1,
  benchmarkDisplay: 'Benchmark under 24 hours',
  benchmarkPhrase: 'a first reply inside 24 hours',
  stageSentence: 'A rate, not a running total, so this benchmark holds at every milestone.',
  betterIsLower: true,
};

const INSPECTION_ACTION_BENCHMARK = {
  benchmark: 2.7,
  benchmarkDisplay: 'Benchmark 2.7 per week',
  benchmarkPhrase: '2.7 inspection actions a week',
  stageSentence: 'A weekly rate, not a running total, so this benchmark holds at every milestone.',
};

const LADDER_LABEL = 'Successful campaigns';

const STAGE_HEADING =
  'Read against where above-reserve campaigns sit on the same day, not only against the finished campaign. The solid rule on each bar is today’s expectation, the dashed rule is the full-campaign median, and the ladder below shows the milestones either side.';

// The persistent strip. Auction campaigns run to auction day; campaigns past a
// standard cycle are measured against that cycle instead.
function auctionTimeline(opts: {
  currentDay: number;
  auctionDay: number;
  auctionNote: string;
}): CampaignTimeline {
  return {
    label: 'Campaign progress',
    currentDay: opts.currentDay,
    totalDays: opts.auctionDay,
    positionLabel: `Day ${opts.currentDay} of ${opts.auctionDay}`,
    remainingLabel: `${opts.auctionDay - opts.currentDay} days until auction, ${opts.auctionNote}`,
    marks: [
      { label: 'Day 1', day: 1, kind: 'start' },
      { label: `Day ${opts.currentDay} (today)`, day: opts.currentDay, kind: 'today' },
      { label: 'Auction day', day: opts.auctionDay, kind: 'end' },
    ],
    liveLabel: 'Live',
    updatedPrefix: 'Updated as of',
    updatedAt: LAST_SYNC,
    refreshLabel: 'Refresh',
  };
}

function extendedTimeline(currentDay: number): CampaignTimeline {
  return {
    label: 'Campaign progress',
    currentDay,
    totalDays: currentDay,
    positionLabel: `Day ${currentDay}`,
    remainingLabel: `${currentDay - STANDARD_CAMPAIGN_DAYS} days past a standard ${STANDARD_CAMPAIGN_DAYS}-day campaign`,
    marks: [
      { label: 'Day 1', day: 1, kind: 'start' },
      { label: `Day ${STANDARD_CAMPAIGN_DAYS} (standard cycle)`, day: STANDARD_CAMPAIGN_DAYS, kind: 'start' },
      { label: `Day ${currentDay} (today)`, day: currentDay, kind: 'today' },
    ],
    liveLabel: 'Live',
    updatedPrefix: 'Updated as of',
    updatedAt: LAST_SYNC,
    refreshLabel: 'Refresh',
  };
}

const albert: CampaignRecord = {
  id: 'albert',
  header: {
    address: '102/380 Albert Street, East Melbourne',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Premiere tier' }, // [REA-campaign]
      { label: 'Listed', value: '10 September 2025' },
      { label: 'On site', value: '322 days' }, // [REA-campaign]
    ],
    reportWindow: 'Latest portal report: week of 20–26 July 2026',
  },
  timeline: extendedTimeline(322),
  gallery: {
    photos: [
      { src: '/photos/albert/01-living.jpg', alt: '102/380 Albert Street, living' },
      { src: '/photos/albert/02-kitchen-dining.jpg', alt: '102/380 Albert Street, kitchen and dining' },
      { src: '/photos/albert/03-study-dining.jpg', alt: '102/380 Albert Street, study and dining' },
      { src: '/photos/albert/04-main-bedroom.jpg', alt: '102/380 Albert Street, main bedroom' },
      { src: '/photos/albert/05-terrace-city-view.jpg', alt: '102/380 Albert Street, terrace and city outlook' },
      { src: '/photos/albert/06-entry-study.jpg', alt: '102/380 Albert Street, entry' },
      { src: '/photos/albert/07-floorplan.jpg', alt: 'Floorplan for 102/380 Albert Street', fit: 'contain' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      // [REA-weekly]. Conversion contexts computed within the same week
      { value: '5,020', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '138', label: 'Listing views', context: '2.7% of exposure clicked through' },
      { value: '8', label: 'Enquiries', context: '5.8% of views enquired' },
      {
        value: '0',
        label: 'Inspection actions',
        context: 'None of the 8 enquiries went further',
        highlight: true, // the load-bearing number, a real zero
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
          text: 'Across the campaign, buyers have opened the photos 2,942 times, and saved the listing twice.',
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
      'Portal figures are taken directly from the campaign’s REA report. The Box+Dice and Red HQ layers are modelled. See data connections.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '39',
    outOf: '/ 100',
    verdict: 'Well below the above-reserve band',
    summary:
      'Traffic is doing its job. The score is dragged down by inspection intent, with zero actions last week, and by a database that has stopped responding.',
    subScores: [
      { label: 'Traffic', score: 78, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 44, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 9, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 31, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 38, weightNote: 'Weighted 15%' },
    ],
    caption:
      'Weighting is modelled on the Marshall White historical cohort. See data connections.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Drawn from 2,800 analysed Marshall White apartment campaigns. Benchmarks are medians for comparable listings that sold above reserve, matched on suburb, price band and product tier, with the milestone figures taken at the same day of those campaigns. Campaign-side values are modelled pending Box+Dice access, except inspection actions, which are from the REA report.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 6,
        valueDisplay: '6',
        full: 32, // [deck]
        day: 322,
        windowNote: 'Campaign to date, modelled',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 11,
        valueDisplay: '11 groups',
        full: 24, // [deck]
        unit: ' groups',
        day: 322,
        windowNote: 'Campaign to date, modelled',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 1,
        valueDisplay: '1',
        full: 8, // [deck]
        day: 322,
        windowNote: 'Campaign to date, modelled',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 3.4,
        valueDisplay: '3.4 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, modelled',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 0,
        valueDisplay: '0',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'Week of 20–26 July 2026, REA report',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
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
      'Illustrative. This layer is modelled pending Box+Dice access. The note count and proportions show how the connected product reads, not a real measurement.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
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
      'Purchase status is modelled pending Red HQ access. Only the Premiere tier is confirmed by the REA report. The zero view counts are real REA figures and are consistent with those assets never being produced.',
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
              'REA, campaign to date: 2,942 photo views and 266 floorplan views against 2 saves. Buyers study the listing and rule it out, and Box+Dice feedback (modelled) names price in 62% of notes.',
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
};

// ---------------------------------------------------------------------------
// Illustrative campaigns. Entirely sample data, marked as such on screen.
// ---------------------------------------------------------------------------

const moorhouse: CampaignRecord = {
  id: 'moorhouse',
  header: {
    address: '7 Moorhouse Street, Armadale',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Highlight tier' },
      { label: 'Listed', value: '9 June 2026' },
      { label: 'On site', value: '47 days' },
    ],
    reportWindow: ILLUSTRATIVE_WINDOW,
  },
  timeline: auctionTimeline({
    currentDay: 47,
    auctionDay: 53,
    auctionNote: 'Saturday 1 August',
  }),
  gallery: {
    photos: [
      { src: '/photos/moorhouse/01.jpg', alt: '7 Moorhouse Street, listing photograph 1' },
      { src: '/photos/moorhouse/02.jpg', alt: '7 Moorhouse Street, listing photograph 2' },
      { src: '/photos/moorhouse/03.jpg', alt: '7 Moorhouse Street, listing photograph 3' },
      { src: '/photos/moorhouse/04.jpg', alt: '7 Moorhouse Street, listing photograph 4' },
      { src: '/photos/moorhouse/05.jpg', alt: '7 Moorhouse Street, listing photograph 5' },
      { src: '/photos/moorhouse/06.jpg', alt: '7 Moorhouse Street, listing photograph 6' },
      { src: '/photos/moorhouse/07-plan.jpg', alt: 'Floorplan for 7 Moorhouse Street', fit: 'contain' },
      { src: '/photos/moorhouse/08-plan.jpg', alt: 'Site plan for 7 Moorhouse Street', fit: 'contain' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      { value: '3,410', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '217', label: 'Listing views', context: '6.4% of exposure clicked through' },
      { value: '9', label: 'Enquiries', context: '4.1% of views enquired' },
      { value: '4', label: 'Inspection actions', context: 'Added to plan or registered' },
    ],
    windowCaption: 'Week of 20–26 July 2026 · illustrative sample.',
  },
  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 47 · Read across five systems',
    paragraphs: [
      [
        { text: 'The campaign is generating demand faster than it is being answered. ' },
        {
          text: '9 enquiries this week, and the median first response is running at 2.9 days.',
          strong: true,
        },
        { text: ' Warm buyers are cooling in the queue, not in the market.' },
      ],
      [
        { text: 'At day 47 that is the difference between a second-weekend result and a drift past auction: ' },
        { text: 'the interest is there; the follow-up isn’t keeping pace', strong: true },
        { text: '.' },
      ],
    ],
    systems:
      'REA and Domain both show healthy traffic, which is why nothing looks wrong from the portal side. Box+Dice response timestamps show 6 of this week’s 9 enquiries waited more than 48 hours for a first reply. That is where the leak is.',
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '57',
    outOf: '/ 100',
    verdict: 'Inside the watch band',
    summary:
      'Demand inputs are healthy. The score is held down by follow-up speed and a database that hasn’t been re-engaged since launch.',
    subScores: [
      { label: 'Traffic', score: 71, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 63, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 58, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 31, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 52, weightNote: 'Weighted 15%' },
    ],
    caption: 'Illustrative. Weighting shaped like the connected product.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Illustrative sample. In the connected product each milestone is the above-reserve median at the same day of those campaigns, matched on suburb, price band and product tier.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 28,
        valueDisplay: '28',
        full: 32,
        day: 47,
        windowNote: 'Campaign to date at day 47, illustrative',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 22,
        valueDisplay: '22 groups',
        full: 24,
        unit: ' groups',
        day: 47,
        windowNote: 'Campaign to date at day 47, illustrative',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 3,
        valueDisplay: '3',
        full: 8,
        day: 47,
        windowNote: 'Campaign to date at day 47, illustrative',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 2.9,
        valueDisplay: '2.9 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, illustrative',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 4,
        valueDisplay: '4',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'This week, illustrative',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 31 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Positive on schools and family fit',
        pct: 52,
        countNote: '16 of 31 notes',
        note: 'The dominant drawcard for the Armadale catchment.',
      },
      {
        label: 'Price expectation',
        pct: 26,
        countNote: '8 of 31 notes',
        note: 'Present but not the blocker at this stage.',
      },
      {
        label: 'Timing and finance',
        pct: 19,
        countNote: '6 of 31 notes',
        note: 'Several buyers are between pre-approvals.',
      },
      {
        label: 'Presentation and styling',
        pct: 13,
        countNote: '4 of 31 notes',
        note: 'Two notes mention the rear rooms photographing dark.',
      },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: 'Day and twilight set' },
      { label: 'Floorplan', note: 'With land dimensions' },
      { label: 'REA Highlight tier', note: 'Runs to auction week' },
      { label: 'Local press print', note: 'Two insertions' },
    ],
    notPurchased: [
      { label: 'Property video', note: 'Not on the campaign record' },
      { label: '3D tour', note: 'Not on the campaign record' },
      { label: 'Social retargeting', note: 'Not on the campaign record' },
      { label: 'Database blast', note: 'Beyond standard portal notifications' },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
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
            action: 'Answer the six unanswered enquiries today',
            evidence:
              'Box+Dice: 6 of this week’s 9 enquiries have waited more than 48 hours for a first reply.',
            impact: 'Recovers buyers who are still in the market',
            cost: 'No cost',
          },
          {
            action: 'Set a same-day response rule on this campaign',
            evidence:
              'The campaign’s median first response is 2.9 days against a cohort benchmark of under 24 hours.',
            impact: 'Stops the leak rather than patching it weekly',
            cost: 'No cost',
          },
          {
            action: 'Send inspection follow-up notes within 24 hours of each OFI',
            evidence:
              '22 groups have attended and fewer than half have a follow-up logged in Box+Dice.',
            impact: 'Converts attendance into second inspections',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Reshoot the rear rooms in natural light',
            evidence:
              'Presentation notes flag the rear rooms photographing dark, and the photo set is the first thing every buyer studies.',
            impact: 'Removes a stated objection before auction marketing peaks',
            cost: 'Estimated $520',
          },
          {
            action: 'Commission a property video for the final fortnight',
            evidence:
              'No video is on the campaign record, and the auction run-in is when reach compounds fastest.',
            impact: 'Widens the final-fortnight audience',
            cost: 'Estimated $1,400',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Hold: no case for larger spend',
            evidence:
              'Demand is healthy; the constraint is response speed, which money doesn’t fix. Revisit only if enquiry volume softens after the follow-up fix.',
            impact: 'Protects the vendor relationship',
            cost: 'Nothing to spend',
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
        id: 'reply',
        label: 'Reply to the six unanswered enquiries',
        detail: 'Oldest first. Two are past four days.',
      },
      {
        id: 'rule',
        label: 'Turn on same-day response alerts',
        detail: 'Applies to this campaign only.',
      },
      {
        id: 'ofi-notes',
        label: 'Log follow-up notes for Saturday’s OFI',
        detail: '9 groups attended; 4 have notes.',
      },
      {
        id: 'vendor-update',
        label: 'Send the vendor the week-7 update',
        detail: 'Lead with enquiry volume, name the follow-up fix.',
      },
    ],
  },
};

const mathoura: CampaignRecord = {
  id: 'mathoura',
  header: {
    address: '4/27 Mathoura Road, Toorak',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Premiere tier' },
      { label: 'Listed', value: '26 May 2026' },
      { label: 'On site', value: '61 days' },
    ],
    reportWindow: ILLUSTRATIVE_WINDOW,
  },
  timeline: extendedTimeline(61),
  gallery: {
    photos: [
      { src: '/photos/mathoura/01.jpg', alt: '4/27 Mathoura Road, listing photograph 1' },
      { src: '/photos/mathoura/02.jpg', alt: '4/27 Mathoura Road, listing photograph 2' },
      { src: '/photos/mathoura/03.jpg', alt: '4/27 Mathoura Road, listing photograph 3' },
      { src: '/photos/mathoura/04.jpg', alt: '4/27 Mathoura Road, listing photograph 4' },
      { src: '/photos/mathoura/05.jpg', alt: '4/27 Mathoura Road, listing photograph 5' },
      { src: '/photos/mathoura/06-plan.jpg', alt: 'Floorplan for 4/27 Mathoura Road', fit: 'contain' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      { value: '4,180', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '341', label: 'Listing views', context: '8.2% of exposure clicked through' },
      { value: '11', label: 'Enquiries', context: '3.2% of views enquired' },
      { value: '2', label: 'Inspection actions', context: 'Added to plan or registered' },
    ],
    windowCaption: 'Week of 20–26 July 2026 · illustrative sample.',
  },
  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 61 · Read across five systems',
    paragraphs: [
      [
        { text: 'Buyers click through in volume, but few raise their hand: ' },
        { text: '341 views this week converted to 11 enquiries', strong: true },
        {
          text: ', well under the cohort rate for Toorak apartments. The listing attracts lookers; the guide and the copy aren’t converting them into conversations.',
        },
      ],
      [
        { text: 'Feedback points at the guide sitting above two recent comparable sales, and ' },
        { text: 'the enquiry-form drop-off says the interest is real', strong: true },
        { text: ': buyers start the form and stop at the price conversation.' },
      ],
    ],
    systems:
      'The portals show strong traffic and would call this campaign healthy. Google Analytics shows buyers stalling on the enquiry form, and Box+Dice notes name the two comparable sales buyers are quoting. Together they say the demand is priced out, not absent.',
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '64',
    outOf: '/ 100',
    verdict: 'Watch: conversion is the drag',
    summary:
      'Traffic and media are strong. Enquiry conversion is running at roughly half the cohort rate and is the single number holding the campaign back.',
    subScores: [
      { label: 'Traffic', score: 81, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 42, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 66, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 58, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 79, weightNote: 'Weighted 15%' },
    ],
    caption: 'Illustrative. Weighting shaped like the connected product.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Illustrative sample. In the connected product each milestone is the above-reserve median at the same day of those campaigns, matched on suburb, price band and product tier.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 21,
        valueDisplay: '21',
        full: 32,
        day: 61,
        windowNote: 'Campaign to date at day 61, illustrative',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 26,
        valueDisplay: '26 groups',
        full: 24,
        unit: ' groups',
        day: 61,
        windowNote: 'Campaign to date at day 61, illustrative',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 4,
        valueDisplay: '4',
        full: 8,
        day: 61,
        windowNote: 'Campaign to date at day 61, illustrative',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 0.9,
        valueDisplay: '0.9 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, illustrative',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 2,
        valueDisplay: '2',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'This week, illustrative',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 38 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Guide versus comparable sales',
        pct: 47,
        countNote: '18 of 38 notes',
        note: 'Buyers quote two recent sales on Mathoura and Grange Roads.',
      },
      {
        label: 'Positive on position',
        pct: 42,
        countNote: '16 of 38 notes',
        note: 'Village-side Toorak reads as the premium it is.',
      },
      {
        label: 'Owners-corporation queries',
        pct: 21,
        countNote: '8 of 38 notes',
        note: 'Fees and works schedule, answerable in the listing copy.',
      },
      {
        label: 'Layout',
        pct: 11,
        countNote: '4 of 38 notes',
        note: 'Second bedroom size raised twice.',
      },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: 'Full set with twilight hero' },
      { label: 'Floorplan', note: 'With private-terrace dimensions' },
      { label: 'REA Premiere tier', note: 'Runs to mid-August' },
      { label: 'Property video', note: '48-second walkthrough cut' },
    ],
    notPurchased: [
      { label: '3D tour', note: 'Not on the campaign record' },
      { label: 'Social retargeting', note: 'Not on the campaign record' },
      { label: 'Database blast', note: 'Beyond standard portal notifications' },
      { label: 'Print', note: 'Not used on this campaign' },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
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
            action: 'Review the guide against the two quoted comparable sales',
            evidence:
              '18 of 38 feedback notes quote the same two sales. When buyers do the agent’s comparable analysis for them, the guide conversation is already happening, without the agent in it.',
            impact: 'Brings the pricing conversation back inside the campaign',
            cost: 'No cost',
          },
          {
            action: 'Answer the owners-corporation questions in the listing copy',
            evidence:
              '8 of 38 notes ask about fees and the works schedule, friction that sits directly in front of the enquiry form.',
            impact: 'Removes a stated reason buyers stop at the form',
            cost: 'No cost',
          },
          {
            action: 'Call the 26 OFI groups with a guide-context script',
            evidence:
              'Attendance is above benchmark while enquiries lag. The buyers exist and have already walked through.',
            impact: 'Converts attendance into offers conversation',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Retarget the campaign’s viewers with the video',
            evidence:
              'The video exists and the viewer pool is large; no retargeting product is on the record.',
            impact: 'Second exposure for buyers who stalled at the form',
            cost: 'Estimated $850',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Hold: spend won’t fix a conversion problem',
            evidence:
              'Traffic is above benchmark and media is complete. Until the guide question is answered, additional reach amplifies the same objection.',
            impact: 'Keeps the budget for the relaunch case if the guide holds',
            cost: 'Nothing to spend',
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
        id: 'comparables',
        label: 'Pull the two quoted comparable sales for the vendor meeting',
        detail: 'Mathoura Road and Grange Road results.',
      },
      {
        id: 'oc-copy',
        label: 'Add owners-corporation answers to the listing copy',
        detail: 'Fees, works schedule, pet policy.',
      },
      {
        id: 'ofi-calls',
        label: 'Call Saturday’s OFI groups',
        detail: '26 groups attended campaign to date.',
      },
      {
        id: 'guide',
        label: 'Book the guide review with the vendor',
        detail: 'Bring the feedback-note evidence.',
      },
    ],
  },
};

const huntingtower: CampaignRecord = {
  id: 'huntingtower',
  header: {
    address: '12 Huntingtower Road, Armadale',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Premiere tier' },
      { label: 'Listed', value: '22 June 2026' },
      { label: 'On site', value: '34 days' },
    ],
    reportWindow: ILLUSTRATIVE_WINDOW,
  },
  timeline: auctionTimeline({
    currentDay: 34,
    auctionDay: 47,
    auctionNote: 'Saturday 8 August',
  }),
  gallery: {
    photos: [
      { src: '/photos/huntingtower/01.jpg', alt: '12 Huntingtower Road, listing photograph 1' },
      { src: '/photos/huntingtower/02.jpg', alt: '12 Huntingtower Road, listing photograph 2' },
      { src: '/photos/huntingtower/03.jpg', alt: '12 Huntingtower Road, listing photograph 3' },
      { src: '/photos/huntingtower/04.jpg', alt: '12 Huntingtower Road, listing photograph 4' },
      { src: '/photos/huntingtower/05.jpg', alt: '12 Huntingtower Road, listing photograph 5' },
      { src: '/photos/huntingtower/06-plan.jpg', alt: 'Basement plan for 12 Huntingtower Road', fit: 'contain' },
      { src: '/photos/huntingtower/07-plan.jpg', alt: 'Floorplan for 12 Huntingtower Road', fit: 'contain' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      { value: '6,240', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '384', label: 'Listing views', context: '6.2% of exposure clicked through' },
      { value: '14', label: 'Enquiries', context: '3.6% of views enquired' },
      { value: '6', label: 'Inspection actions', context: 'Added to plan or registered' },
    ],
    windowCaption: 'Week of 20–26 July 2026 · illustrative sample.',
  },
  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 34 · Read across five systems',
    paragraphs: [
      [
        { text: 'This is what a healthy campaign looks like at day 34: ' },
        {
          text: '14 enquiries and 6 inspection actions this week, with OFI groups sitting level with the cohort median for day 34',
          strong: true,
        },
        { text: '. Nothing needs rescuing; the job is to protect momentum into auction.' },
      ],
      [
        { text: 'One early signal is worth a decision this week: ' },
        { text: 'two buyers have queried the auction date against the school holidays', strong: true },
        { text: ', and both are among the strongest attendees.' },
      ],
    ],
    systems:
      'The portals agree with the CRM on this one, so the value of the cross-read is confidence, not correction. Box+Dice adds the auction-date signal that no portal can see.',
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '78',
    outOf: '/ 100',
    verdict: 'Tracking with the above-reserve band',
    summary:
      'Every input is at or near the cohort median. Database activity is the softest line and the cheapest to lift.',
    subScores: [
      { label: 'Traffic', score: 84, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 76, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 78, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 69, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 83, weightNote: 'Weighted 15%' },
    ],
    caption: 'Illustrative. Weighting shaped like the connected product.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Illustrative sample. In the connected product each milestone is the above-reserve median at the same day of those campaigns, matched on suburb, price band and product tier.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 30,
        valueDisplay: '30',
        full: 32,
        day: 34,
        windowNote: 'Campaign to date at day 34, illustrative',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 23,
        valueDisplay: '23 groups',
        full: 24,
        unit: ' groups',
        day: 34,
        windowNote: 'Campaign to date at day 34, illustrative',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 7,
        valueDisplay: '7',
        full: 8,
        day: 34,
        windowNote: 'Campaign to date at day 34, illustrative',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 0.8,
        valueDisplay: '0.8 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, illustrative',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 6,
        valueDisplay: '6',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'This week, illustrative',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 26 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Positive on the renovation',
        pct: 58,
        countNote: '15 of 26 notes',
        note: 'The kitchen and rear extension carry the inspections.',
      },
      {
        label: 'Positive on location',
        pct: 46,
        countNote: '12 of 26 notes',
        note: 'School catchment and village proximity.',
      },
      {
        label: 'Price expectation',
        pct: 12,
        countNote: '3 of 26 notes',
        note: 'Low for this stage, which says the guide is landing.',
      },
      {
        label: 'Auction timing',
        pct: 8,
        countNote: '2 of 26 notes',
        note: 'Both query the date against school holidays.',
      },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: 'Day and twilight set' },
      { label: 'Floorplan', note: 'With land dimensions' },
      { label: 'REA Premiere tier', note: 'Runs to auction' },
      { label: 'Property video', note: '60-second family-led cut' },
      { label: 'Social launch boost', note: 'Week one' },
    ],
    notPurchased: [
      { label: '3D tour', note: 'Not on the campaign record' },
      { label: 'Social retargeting', note: 'Not on the campaign record' },
      { label: 'Database blast', note: 'Beyond standard portal notifications' },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
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
            action: 'Resolve the auction date question this week',
            evidence:
              'Two of the strongest attendees have queried the date against school holidays. A decision now costs nothing; a decision in week six costs momentum.',
            impact: 'Removes the one live risk in a healthy campaign',
            cost: 'No cost',
          },
          {
            action: 'Run the pre-auction call-down of all 30 qualified enquirers',
            evidence:
              'Follow-up speed is beating benchmark, so the discipline exists. This points it at auction registration.',
            impact: 'Converts a strong funnel into registered bidders',
            cost: 'No cost',
          },
          {
            action: 'Send the matched-buyer alert before the final fortnight',
            evidence: 'Database activity is the softest sub-score and the cheapest to lift.',
            impact: 'Backfills the auction crowd',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Retarget engaged viewers for the final fortnight',
            evidence:
              'The launch boost built a large viewer pool that has not been re-touched; the video asset already exists.',
            impact: 'Compounds reach exactly when auction campaigns need it',
            cost: 'Estimated $850',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Hold: no case for additional spend at day 34',
            evidence:
              'Every demand input is at or ahead of the cohort. Additional product here is margin for the vendor, not momentum for the campaign.',
            impact: 'Protects the vendor relationship',
            cost: 'Nothing to spend',
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
        id: 'date',
        label: 'Take the auction-date question to the vendor',
        detail: 'Two strong buyers affected; decide this week.',
      },
      {
        id: 'calldown',
        label: 'Start the pre-auction call-down',
        detail: '30 qualified enquirers on the list.',
      },
      {
        id: 'alert',
        label: 'Schedule the matched-buyer alert',
        detail: 'Land it before the final fortnight.',
      },
    ],
  },
};

const williams: CampaignRecord = {
  id: 'williams',
  header: {
    address: '3/158 Williams Road, Prahran',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Highlight tier' },
      { label: 'Listed', value: '8 July 2026' },
      { label: 'On site', value: '18 days' },
    ],
    reportWindow: ILLUSTRATIVE_WINDOW,
  },
  timeline: auctionTimeline({
    currentDay: 18,
    auctionDay: 38,
    auctionNote: 'Saturday 15 August',
  }),
  gallery: {
    photos: [
      { src: '/photos/williams/01.jpg', alt: '3/158 Williams Road, listing photograph 1' },
      { src: '/photos/williams/02.jpg', alt: '3/158 Williams Road, listing photograph 2' },
      { src: '/photos/williams/03.jpg', alt: '3/158 Williams Road, listing photograph 3' },
      { src: '/photos/williams/04-plan.jpg', alt: 'Floorplan for 3/158 Williams Road', fit: 'contain' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      { value: '2,960', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '236', label: 'Listing views', context: '8.0% of exposure clicked through' },
      { value: '6', label: 'Enquiries', context: '2.5% of views enquired' },
      { value: '3', label: 'Inspection actions', context: 'Added to plan or registered' },
    ],
    windowCaption: 'Week of 20–26 July 2026 · illustrative sample.',
  },
  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 18 · Read across five systems',
    paragraphs: [
      [
        { text: 'Eighteen days in, the launch has done its job: ' },
        {
          text: 'strong first OFIs, same-day follow-up, and a database that is responding',
          strong: true,
        },
        { text: '. Every early line is at or ahead of where above-reserve campaigns sit at this point.' },
      ],
      [
        { text: 'The one thing to steer early: ' },
        { text: 'the enquiry mix skews to investors asking about yield', strong: true },
        {
          text: ', while the copy sells the renovation. The owner-occupier angle is underweighted, and it is where Prahran results are made.',
        },
      ],
    ],
    systems:
      'The mix signal comes from Box+Dice enquiry tagging. The portals count enquiries but cannot tell an investor from an owner-occupier. Catching it at day 18 is the point of the cross-read.',
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '82',
    outOf: '/ 100',
    verdict: 'Ahead of the above-reserve band at this stage',
    summary:
      'A clean launch across every input. Media is the only line below 80 and the gap is one asset.',
    subScores: [
      { label: 'Traffic', score: 86, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 79, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 81, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 84, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 81, weightNote: 'Weighted 15%' },
    ],
    caption: 'Illustrative. Weighting shaped like the connected product.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Illustrative sample. At day 18 the full-campaign median is the wrong test, so each metric is read against the day-18 milestone of the same cohort, with the later milestones shown so the trajectory is visible.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 21,
        valueDisplay: '21',
        full: 32,
        day: 18,
        windowNote: 'Campaign to date at day 18, illustrative',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 16,
        valueDisplay: '16 groups',
        full: 24,
        unit: ' groups',
        day: 18,
        windowNote: 'Campaign to date at day 18, illustrative',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 5,
        valueDisplay: '5',
        full: 8,
        day: 18,
        windowNote: 'Campaign to date at day 18, illustrative',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 0.7,
        valueDisplay: '0.7 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, illustrative',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 3,
        valueDisplay: '3',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'This week, illustrative',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 14 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Investor yield questions',
        pct: 43,
        countNote: '6 of 14 notes',
        note: 'Rental appraisal and body-corporate costs.',
      },
      {
        label: 'Positive on the renovation',
        pct: 36,
        countNote: '5 of 14 notes',
        note: 'Bathroom and courtyard called out.',
      },
      {
        label: 'Parking',
        pct: 21,
        countNote: '3 of 14 notes',
        note: 'Single space queried by two families.',
      },
      {
        label: 'Price expectation',
        pct: 14,
        countNote: '2 of 14 notes',
        note: 'Low, which says the guide is landing at this stage.',
      },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: 'Day set with courtyard hero' },
      { label: 'Floorplan', note: 'With courtyard dimensions' },
      { label: 'REA Highlight tier', note: 'Runs to late August' },
    ],
    notPurchased: [
      { label: 'Property video', note: 'Not on the campaign record' },
      { label: '3D tour', note: 'Not on the campaign record' },
      { label: 'Social retargeting', note: 'Not on the campaign record' },
      { label: 'Twilight photography', note: 'Not on the campaign record' },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
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
            action: 'Rebalance the copy toward owner-occupiers',
            evidence:
              'Box+Dice tags 6 of 14 early notes as investor enquiries while the copy leads with the renovation spec. Prahran results at this price point are set by owner-occupier competition.',
            impact: 'Steers the buyer mix while the campaign is still forming',
            cost: 'No cost',
          },
          {
            action: 'Publish the rental appraisal with the listing',
            evidence: 'The most common question in early enquiries. Answer it once, publicly.',
            impact: 'Keeps investor interest warm without more agent time',
            cost: 'No cost',
          },
          {
            action: 'Hold the follow-up cadence',
            evidence: 'Median first response is 0.7 days, ahead of benchmark. Protect it as volume grows.',
            impact: 'Maintains the launch advantage',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Add a twilight hero for week four',
            evidence:
              'Search-result click-through is strong; a hero refresh at mid-campaign holds it as the listing ages in saved searches.',
            impact: 'Defends click-through into the second month',
            cost: 'Estimated $480',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Hold: the launch is carrying itself',
            evidence: 'Every input is ahead of the band at day 18. Reassess at day 40 with the mix data.',
            impact: 'Keeps powder dry for the campaigns that need it',
            cost: 'Nothing to spend',
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
        id: 'copy-mix',
        label: 'Redraft the copy with an owner-occupier lead',
        detail: 'Courtyard and village lifestyle first, spec second.',
      },
      {
        id: 'appraisal',
        label: 'Attach the rental appraisal to the listing',
        detail: 'Answers 6 of 14 early enquiries at once.',
      },
      {
        id: 'saturday',
        label: 'Confirm Saturday OFI staffing',
        detail: 'Two OFIs; last week ran 8 groups.',
      },
    ],
  },
};

const daly: CampaignRecord = {
  id: 'daly',
  header: {
    address: '216/8 Daly Street, South Yarra',
    meta: [
      { label: 'Agent', value: 'Ranko Cvjeticanin, Stonnington' },
      { label: 'Listing', value: 'Highlight tier' },
      { label: 'Listed', value: '21 April 2026' },
      { label: 'On site', value: '96 days' },
    ],
    reportWindow: ILLUSTRATIVE_WINDOW,
  },
  timeline: extendedTimeline(96),
  gallery: {
    photos: [
      { src: '/photos/daly/01.jpg', alt: '216/8 Daly Street, listing photograph 1' },
    ],
  },
  portal: {
    title: 'What the portals already show you',
    subtitle: 'Accurate, and this is where those reports stop.',
    stats: [
      { value: '2,140', label: 'Campaign exposure', context: 'Search, email and app reach' },
      { value: '122', label: 'Listing views', context: '5.7% of exposure clicked through' },
      { value: '4', label: 'Enquiries', context: '3.3% of views enquired' },
      { value: '2', label: 'Inspection actions', context: 'Added to plan or registered' },
    ],
    windowCaption: 'Week of 20–26 July 2026 · illustrative sample.',
  },
  diagnosis: {
    title: 'Campaign assessment',
    kicker: 'Day 96 · Read across five systems',
    paragraphs: [
      [
        { text: 'The campaign still converts. The buyers who arrive keep enquiring and inspecting, but ' },
        { text: 'weekly reach has roughly halved since the launch month', strong: true },
        { text: ', and the listing is ageing in saved searches.' },
      ],
      [
        { text: 'On today’s numbers this is on track. ' },
        { text: 'On the trend line, it needs a refresh before it stalls', strong: true },
        { text: '. The cheapest moment to act is before the drop shows up in enquiries.' },
      ],
    ],
    systems:
      'The portals report each week in isolation, so the slide only shows up when the weeks are laid side by side. Google Analytics confirms returning-visitor share is rising: the same buyers circling, fewer new ones arriving.',
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  health: {
    title: 'Campaign health',
    subtitle:
      'One number for the vendor conversation, decomposed into the five inputs that separate above-reserve campaigns from the rest.',
    score: '71',
    outOf: '/ 100',
    verdict: 'On track, with reach fading',
    summary:
      'Conversion inputs are holding. Traffic is the weak line and it is trending down, which is what the refresh recommendation is priced against.',
    subScores: [
      { label: 'Traffic', score: 58, weightNote: 'Weighted 20%' },
      { label: 'Enquiry conversion', score: 74, weightNote: 'Weighted 25%' },
      { label: 'Inspection intent', score: 73, weightNote: 'Weighted 25%' },
      { label: 'Database activity', score: 66, weightNote: 'Weighted 15%' },
      { label: 'Media completeness', score: 84, weightNote: 'Weighted 15%' },
    ],
    caption: 'Illustrative. Weighting shaped like the connected product.',
  },
  benchmark: {
    title: 'Benchmarked against campaigns that sold above reserve',
    subtitle:
      'This campaign against the median for comparable listings that closed above reserve.',
    cohortNote:
      'Illustrative sample. In the connected product each milestone is the above-reserve median at the same day of those campaigns, matched on suburb, price band and product tier.',
    stageHeading: STAGE_HEADING,
    ladderLabel: LADDER_LABEL,
    metrics: [
      cumulativeMetric({
        label: 'Qualified enquiries',
        value: 29,
        valueDisplay: '29',
        full: 32,
        day: 96,
        windowNote: 'Campaign to date at day 96, illustrative',
      }),
      cumulativeMetric({
        label: 'Open-for-inspection attendance',
        value: 22,
        valueDisplay: '22 groups',
        full: 24,
        unit: ' groups',
        day: 96,
        windowNote: 'Campaign to date at day 96, illustrative',
      }),
      cumulativeMetric({
        label: 'Contract requests',
        value: 5,
        valueDisplay: '5',
        full: 8,
        day: 96,
        windowNote: 'Campaign to date at day 96, illustrative',
      }),
      rateMetric({
        label: 'Follow-up speed',
        value: 1.4,
        valueDisplay: '1.4 days',
        ...FOLLOW_UP_BENCHMARK,
        windowNote: 'Median across campaign, illustrative',
      }),
      rateMetric({
        label: 'Inspection actions',
        value: 2,
        valueDisplay: '2',
        ...INSPECTION_ACTION_BENCHMARK,
        windowNote: 'This week, illustrative',
      }),
    ],
  },
  feedback: {
    title: 'What buyers are actually saying',
    subtitle:
      'REA and Domain cannot see this. It only exists in agent notes from inspections and enquiries.',
    basis: 'Share of 33 logged feedback notes mentioning each theme.',
    themes: [
      {
        label: 'Positive on outlook and light',
        pct: 45,
        countNote: '15 of 33 notes',
        note: 'The north-facing aspect carries inspections.',
      },
      {
        label: 'Price expectation',
        pct: 30,
        countNote: '10 of 33 notes',
        note: 'Rising slowly as the campaign ages.',
      },
      {
        label: 'Waiting on finance',
        pct: 18,
        countNote: '6 of 33 notes',
        note: 'Two buyers are close and worth a weekly touch.',
      },
      {
        label: 'Traffic noise question',
        pct: 12,
        countNote: '4 of 33 notes',
        note: 'Answered well at inspections; not in the copy.',
      },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
  },
  spend: {
    title: 'What the campaign has bought, and what it hasn’t',
    subtitle:
      'Knowing what is still on the table turns a concern into a specific, fundable next step.',
    purchasedHeading: 'Purchased',
    notPurchasedHeading: 'Not purchased',
    purchased: [
      { label: 'Photography', note: 'Original set, April' },
      { label: 'Floorplan', note: 'With balcony dimensions' },
      { label: 'REA Highlight tier', note: 'Renewed in June' },
      { label: 'Property video', note: '45-second cut, April' },
    ],
    notPurchased: [
      { label: 'Photography refresh', note: 'Set is 96 days old' },
      { label: '3D tour', note: 'Not on the campaign record' },
      { label: 'Social retargeting', note: 'Not on the campaign record' },
      { label: 'Database blast', note: 'Beyond standard portal notifications' },
    ],
    caption: 'Illustrative campaign. Sample data, shaped like the connected product.',
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
            action: 'Re-send the matched-buyer alert with a new lead line',
            evidence:
              'The database hasn’t been touched since launch month, and reach is the fading input.',
            impact: 'Cheapest available reach recovery',
            cost: 'No cost',
          },
          {
            action: 'Answer the traffic-noise question in the copy',
            evidence:
              '4 of 33 notes raise it, and it is being answered well in person. Put the answer where new buyers read first.',
            impact: 'Removes a quiet objection for buyers who never enquire',
            cost: 'No cost',
          },
          {
            action: 'Weekly touch on the two finance-pending buyers',
            evidence: 'Both are close, and ageing campaigns are won from the existing funnel.',
            impact: 'Protects the two most likely buyers',
            cost: 'No cost',
          },
        ],
      },
      {
        id: 'mid',
        label: '$1,000–$2,000',
        recommendations: [
          {
            action: 'Refresh the hero photography for spring light',
            evidence:
              'The set is 96 days old and saved-search buyers have seen it for three months; a new hero re-triggers attention.',
            impact: 'Re-enters saved searches as a fresh listing',
            cost: 'Estimated $520',
          },
          {
            action: 'Retarget past viewers with the video',
            evidence: 'The video exists; the viewer pool from three months of traffic has never been re-touched.',
            impact: 'Recovers lapsed lookers at low cost',
            cost: 'Estimated $850',
          },
        ],
      },
      {
        id: 'high',
        label: '$3,000+',
        recommendations: [
          {
            action: 'Relaunch package for spring',
            evidence:
              'If the refresh doesn’t move reach within three weeks, a coordinated relaunch, with new creative, a new lead line and a repositioned guide, beats a slow fade on every cohort read.',
            impact: 'Resets the campaign ahead of the spring market',
            cost: 'Estimated $3,400 plus agency time',
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
        id: 'alert',
        label: 'Re-send the matched-buyer alert',
        detail: 'New lead line; segment by price band.',
      },
      {
        id: 'noise',
        label: 'Add the traffic-noise answer to the copy',
        detail: 'Use the line that works at inspections.',
      },
      {
        id: 'finance',
        label: 'Call the two finance-pending buyers',
        detail: 'Set a weekly touch until approval.',
      },
      {
        id: 'vendor-trend',
        label: 'Send the vendor the reach trend line',
        detail: 'Sets up the refresh conversation.',
      },
    ],
  },
};

export const fixture: FixtureData = {
  app: {
    wordmark: 'MARSHALL WHITE',
    wordmarkShort: 'MW',
    productName: 'Campaign intelligence',
    portfolioLabel: 'Campaigns',
    backLabel: 'All campaigns',
    navSections: [
      { id: 'overview', label: 'Overview' },
      { id: 'benchmarks', label: 'Benchmarks' },
      { id: 'feedback', label: 'Buyer feedback' },
      { id: 'spend', label: 'Spend and levers' },
      { id: 'actions', label: 'Actions' },
      { id: 'connections', label: 'Data connections' },
    ],
    agentLine: 'Ranko Cvjeticanin',
    officeLine: 'Marshall White Stonnington',
  },

  portfolio: {
    title: 'Campaigns',
    subtitle:
      'Every live listing, read across the five systems. Select a campaign to open its workspace.',
    columns: ['Campaign', 'Days on site', 'Enquiries this week', 'Health', 'Status'],
    rows: [
      {
        id: 'albert',
        address: '102/380 Albert Street, East Melbourne',
        daysOnSite: '322',
        enquiriesWeek: '8', // [REA-weekly]
        healthDisplay: '39',
        health: 39,
        status: 'Needs review: zero inspection actions last week',
        tone: 'bad',
        isWorkedExample: true,
      },
      {
        id: 'moorhouse',
        address: '7 Moorhouse Street, Armadale',
        daysOnSite: '47',
        enquiriesWeek: '9',
        healthDisplay: '57',
        health: 57,
        status: 'Watch: follow-up slipping past 24 hours',
        tone: 'warn',
      },
      {
        id: 'mathoura',
        address: '4/27 Mathoura Road, Toorak',
        daysOnSite: '61',
        enquiriesWeek: '11',
        healthDisplay: '64',
        health: 64,
        status: 'Watch: enquiry conversion below cohort',
        tone: 'warn',
      },
      {
        id: 'huntingtower',
        address: '12 Huntingtower Road, Armadale',
        daysOnSite: '34',
        enquiriesWeek: '14',
        healthDisplay: '78',
        health: 78,
        status: 'On track',
        tone: 'good',
      },
      {
        id: 'williams',
        address: '3/158 Williams Road, Prahran',
        daysOnSite: '18',
        enquiriesWeek: '6',
        healthDisplay: '82',
        health: 82,
        status: 'On track',
        tone: 'good',
      },
      {
        id: 'daly',
        address: '216/8 Daly Street, South Yarra',
        daysOnSite: '96',
        enquiriesWeek: '4',
        healthDisplay: '71',
        health: 71,
        status: 'On track',
        tone: 'good',
      },
    ],
    caption:
      '102/380 Albert Street is the worked example, built on its real REA report. The other campaigns are illustrative. They show how a full portfolio reads once the systems are connected.',
  },

  campaigns: {
    albert,
    moorhouse,
    mathoura,
    huntingtower,
    williams,
    daly,
  },

  sources: {
    title: 'Data connections',
    subtitle:
      'Five external systems, plus Marshall White’s own campaign history. “Available now” means integrable on Marshall White’s authority. Nothing in this demonstration is connected yet, and every modelled layer is marked against its source here.',
    columns: ['Source', 'Provides', 'Status'],
    rows: [
      {
        source: 'Box+Dice CRM',
        provides: 'Enquiries, inspection logs, buyer feedback, follow-up timing',
        status: 'Available now via REST API. Feedback layers are modelled.',
        tone: 'neutral',
      },
      {
        source: 'Domain Skylight',
        provides: 'Views, saves, impressions, enquiries, suburb benchmarks',
        status: 'Available now via a partner API',
        tone: 'neutral',
      },
      {
        source: 'Google Analytics',
        provides: 'Marshall White site sessions and dwell time',
        status: 'Available now via GA4',
        tone: 'neutral',
      },
      {
        source: 'Red HQ',
        provides: 'Spend by channel, product tier purchased',
        status: 'Available now: read confirmed, write to be confirmed. Purchase layers are modelled.',
        tone: 'neutral',
      },
      {
        source: 'REA Ignite',
        provides: 'Views, impressions, enquiries, session duration',
        status: 'Access pending. No public API; weekly PDF export today',
        tone: 'warn',
      },
      {
        source: 'Marshall White historical',
        provides: 'Benchmark cohort from past Marshall White campaigns',
        status: 'Internal. Benchmarks are modelled from the deck’s analysed set.',
        tone: 'neutral',
      },
    ],
  },

  footer: 'Built by W.',
};
