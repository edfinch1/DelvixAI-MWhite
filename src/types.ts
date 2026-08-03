export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export interface HeaderMeta {
  label: string;
  value: string;
}

export interface PropertyHeader {
  address: string;
  meta: HeaderMeta[];
  reportWindow: string;
}

export interface TimelineMark {
  label: string;
  day: number;
  kind: 'start' | 'today' | 'end';
}

// The persistent strip above every campaign screen: where the campaign sits in
// its own length, and how fresh the read is.
export interface CampaignTimeline {
  label: string; // 'Campaign progress'
  currentDay: number;
  totalDays: number;
  positionLabel: string; // 'Day 18 of 35'
  remainingLabel: string; // '17 days until auction'
  marks: TimelineMark[];
  liveLabel: string; // 'Live'
  updatedPrefix: string; // 'Updated as of'
  updatedAt: string; // '2:14pm 03/08/2026'
  refreshLabel: string;
}

export interface Stat {
  value: string;
  label: string;
  context: string;
  highlight?: boolean;
}

export interface PortalStats {
  title: string;
  subtitle: string;
  stats: Stat[];
  windowCaption: string;
}

export interface DiagnosisSegment {
  text: string;
  strong?: boolean;
}

export interface Diagnosis {
  title: string;
  kicker: string;
  paragraphs: DiagnosisSegment[][];
  systems: string;
  caption: string;
}

export interface SubScore {
  label: string;
  score: number; // out of 100
  weightNote: string;
}

export interface HealthScore {
  title: string;
  subtitle: string;
  score: string;
  outOf: string;
  verdict: string;
  summary: string;
  subScores: SubScore[];
  caption: string;
}

// One milestone in the pacing ladder: what an above-reserve campaign has
// usually reached by this day.
export interface BenchmarkStage {
  label: string; // 'Day 15'
  day: number;
  value: number;
  display: string;
  isCurrent?: boolean; // the milestone this campaign is standing on
  isPast?: boolean;
}

export interface BenchmarkMetric {
  label: string;
  campaignValue: number;
  campaignDisplay: string;
  benchmarkValue: number; // full-campaign median
  benchmarkDisplay: string;
  expectedValue: number; // what the cohort has reached by today
  expectedDisplay: string; // 'Expected by day 18: 20'
  paceNote: string; // plain-sentence read of campaign against today
  paceTone: Tone;
  stages: BenchmarkStage[];
  flatBenchmark?: boolean; // a rate, so the expectation does not accumulate
  betterIsLower?: boolean;
  windowNote: string;
}

export interface BenchmarkBlock {
  title: string;
  subtitle: string;
  cohortNote: string;
  stageHeading: string;
  metrics: BenchmarkMetric[];
}

export interface FeedbackTheme {
  label: string;
  pct: number;
  countNote: string;
  note: string;
}

export interface FeedbackBlock {
  title: string;
  subtitle: string;
  basis: string;
  themes: FeedbackTheme[];
  caption: string;
}

export interface SpendItem {
  label: string;
  note: string;
}

export interface SpendBlock {
  title: string;
  subtitle: string;
  purchasedHeading: string;
  notPurchasedHeading: string;
  purchased: SpendItem[];
  notPurchased: SpendItem[];
  caption: string;
}

export interface Recommendation {
  action: string;
  evidence: string;
  impact: string;
  cost: string;
}

export interface BudgetTier {
  id: string;
  label: string;
  recommendations: Recommendation[];
}

export interface RecommendationsBlock {
  title: string;
  subtitle: string;
  tiers: BudgetTier[];
}

export interface ActionItem {
  id: string;
  label: string;
  detail: string;
}

export interface ActionsBlock {
  title: string;
  subtitle: string;
  items: ActionItem[];
}

export interface SourceRow {
  source: string;
  provides: string;
  status: string;
  tone: Tone;
}

export interface SourcesBlock {
  title: string;
  subtitle: string;
  columns: [string, string, string];
  rows: SourceRow[];
}

export interface ListingPhoto {
  src: string;
  label: string;
  alt: string;
  fit?: 'cover' | 'contain'; // floorplans are drawings, never cropped
}

// The listing gallery, read the way an agent reads it on the portal: a
// scrollable column beside the campaign, photography first, floorplan last.
export interface PhotoGallery {
  title: string;
  countLabel: string;
  caption: string;
  photos: ListingPhoto[];
}

export interface NavSection {
  id: string;
  label: string;
}

export interface AppChrome {
  wordmark: string;
  wordmarkShort: string;
  productName: string;
  portfolioLabel: string;
  backLabel: string;
  navSections: NavSection[];
  agentLine: string;
  officeLine: string;
}

export interface PortfolioRow {
  id: string;
  address: string;
  daysOnSite: string;
  enquiriesWeek: string;
  healthDisplay: string;
  health: number;
  status: string;
  tone: Tone;
  isWorkedExample?: boolean;
}

export interface PortfolioBlock {
  title: string;
  subtitle: string;
  columns: string[];
  rows: PortfolioRow[];
  caption: string;
}

export interface CampaignRecord {
  id: string;
  header: PropertyHeader;
  timeline: CampaignTimeline;
  gallery?: PhotoGallery;
  portal: PortalStats;
  diagnosis: Diagnosis;
  health: HealthScore;
  benchmark: BenchmarkBlock;
  feedback: FeedbackBlock;
  spend: SpendBlock;
  recommendations: RecommendationsBlock;
  actions: ActionsBlock;
}

export interface FixtureData {
  app: AppChrome;
  portfolio: PortfolioBlock;
  campaigns: Record<string, CampaignRecord>;
  sources: SourcesBlock;
  footer: string;
}
