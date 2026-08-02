export type Tone = 'good' | 'warn' | 'bad' | 'neutral';

export interface PropertyHeader {
  wordmark: string;
  productName: string;
  address: string;
  agentName: string;
  agentOffice: string;
  tier: string;
  listed: string;
  daysOnSite: string;
  reportWindow: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface PortalStats {
  title: string;
  subtitle: string;
  stats: Stat[];
  windowCaption: string;
}

export interface Diagnosis {
  title: string;
  paragraphs: string[];
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
  summary: string;
  subScores: SubScore[];
  caption: string;
}

export interface BenchmarkMetric {
  label: string;
  campaignValue: number;
  campaignDisplay: string;
  benchmarkValue: number;
  benchmarkDisplay: string;
  betterIsLower?: boolean;
  windowNote: string;
}

export interface BenchmarkBlock {
  title: string;
  subtitle: string;
  cohortNote: string;
  metrics: BenchmarkMetric[];
}

export interface FeedbackTheme {
  label: string;
  pct: number;
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

export interface CampaignData {
  header: PropertyHeader;
  portal: PortalStats;
  diagnosis: Diagnosis;
  health: HealthScore;
  benchmark: BenchmarkBlock;
  feedback: FeedbackBlock;
  spend: SpendBlock;
  recommendations: RecommendationsBlock;
  actions: ActionsBlock;
  sources: SourcesBlock;
  footer: string;
}
