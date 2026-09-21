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
  ladderLabel: string; // names whose figures the milestone ladder carries
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

export interface TeamMember {
  id: string;
  name: string;
  firstName: string;
  patch: string; // 'Armadale and Kooyong'
}

// One line of evidence behind a task: which system saw it, and what it saw.
export interface TaskEvidence {
  system: string; // 'Box+Dice CRM', 'REA Ignite', ...
  fact: string;
}

export type TaskUrgency = 'now' | 'today' | 'week';

// What a task costs the vendor. The office sorts the queue by this before it
// sorts by anything else: a no-budget item can go straight to the agent,
// anything with spend needs the vendor conversation first. The bands match the
// tiers on each campaign's recommendations, so both screens speak one language.
export type BudgetBand = 'none' | 'mid' | 'high';

export interface TaskBudget {
  band: BudgetBand;
  cost: string; // 'No cost', 'Estimated $1,880'
  note: string; // what the money buys, or why none is needed
}

// One named person behind a task, carried so the agent's message can list them
// instead of pointing at a system to go and look them up in.
export interface TaskContact {
  name: string;
  line: string; // the one fact that tells the agent why they are calling
}

export interface WorkTask {
  id: string;
  campaignId: string;
  campaignAddress: string;
  assigneeId: string;
  urgency: TaskUrgency;
  urgencyLabel: string; // 'Do now', 'Today', 'This week'
  budget: TaskBudget;
  action: string;
  detail: string;
  evidence: TaskEvidence[];
  contacts?: TaskContact[];
  contactsSource?: string; // 'Box+Dice CRM', so the list can carry its origin
  rule: string; // the trigger, written as a plain sentence
  raised: string; // 'Raised by the 6:00am read'
}

export interface BudgetBandMeta {
  id: BudgetBand;
  label: string; // 'No additional budget', '$1,000-$2,000', '$3,000+'
  short: string; // the filter chip: 'No budget', '$1-2k', '$3k+'
  note: string; // the sign-off consequence, shown under the group heading
}

export interface WorklistBlock {
  title: string;
  subtitle: string;
  allLabel: string; // filter label for the whole team
  allCampaignsLabel: string; // filter label for every campaign
  teamFilterLabel: string;
  campaignFilterLabel: string;
  budgetFilterLabel: string;
  budgetBands: BudgetBandMeta[];
  raisedNote: string;
  tasks: WorkTask[];
  caption: string;
  notifyPrefix: string; // 'Email this to'
  emptyLabel: string; // shown when a filter combination has no work in it
  campaignRailTitle: string;
  sentLog: SentLogCopy;
}

// The record of what actually went out. It matters twice: the office can see
// what it has already sent, and if the send step is ever handed to the model
// outright, this is the surface that shows what it did.
export interface SentLogCopy {
  title: string;
  subtitle: string;
  empty: string;
}

export interface SentRecord {
  taskId: string;
  action: string;
  memberName: string;
  campaignAddress: string;
  at: string; // '9:47 pm'
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
  alt: string;
  fit?: 'cover' | 'contain'; // plans are drawings, never cropped
}

// The listing reel: a scrollable column of the listing images beside the
// campaign, photography first, plans last.
export interface PhotoGallery {
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
  officeLine: string;
  // The header carried the signed-in agent's name, which was wrong on every
  // campaign but their own. The sync state is true on all of them.
  syncLine: string;
  syncedLabel: string;
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
  team: TeamMember[];
  worklist: WorklistBlock;
  campaigns: Record<string, CampaignRecord>;
  sources: SourcesBlock;
  footer: string;
}
