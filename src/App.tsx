import { campaign } from './data/campaign';
import { C, S, T, MAX_WIDTH } from './tokens';
import { useViewport } from './hooks/useViewport';
import Header from './components/Header';
import Section from './components/Section';
import StatRow from './components/StatRow';
import Diagnosis from './components/Diagnosis';
import HealthScore from './components/HealthScore';
import BenchmarkChart from './components/BenchmarkChart';
import BuyerFeedback from './components/BuyerFeedback';
import SpendGaps from './components/SpendGaps';
import Recommendations from './components/Recommendations';
import ActionList from './components/ActionList';
import Sources from './components/Sources';

export default function App() {
  const { isMobile } = useViewport();
  const gutter = isMobile ? S.l : S.xl;

  return (
    <div style={{ background: C.paper, minHeight: '100vh' }}>
      <Header data={campaign.header} />

      <main
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.xxl}px ${gutter}px 0`,
        }}
      >
        <Section title={campaign.portal.title} subtitle={campaign.portal.subtitle}>
          <StatRow data={campaign.portal} />
        </Section>

        <Section title={campaign.diagnosis.title}>
          <Diagnosis data={campaign.diagnosis} />
        </Section>

        <Section title={campaign.health.title} subtitle={campaign.health.subtitle}>
          <HealthScore data={campaign.health} />
        </Section>

        <Section title={campaign.benchmark.title} subtitle={campaign.benchmark.subtitle}>
          <BenchmarkChart data={campaign.benchmark} />
        </Section>

        <Section title={campaign.feedback.title} subtitle={campaign.feedback.subtitle}>
          <BuyerFeedback data={campaign.feedback} />
        </Section>

        <Section title={campaign.spend.title} subtitle={campaign.spend.subtitle}>
          <SpendGaps data={campaign.spend} />
        </Section>

        <Section
          title={campaign.recommendations.title}
          subtitle={campaign.recommendations.subtitle}
        >
          <Recommendations data={campaign.recommendations} />
        </Section>

        <Section title={campaign.actions.title} subtitle={campaign.actions.subtitle}>
          <ActionList data={campaign.actions} />
        </Section>

        <Section title={campaign.sources.title} subtitle={campaign.sources.subtitle}>
          <Sources data={campaign.sources} />
        </Section>
      </main>

      <footer
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.l}px ${gutter}px ${S.xl}px`,
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <p style={{ ...T.caption, color: C.textFaint }}>{campaign.footer}</p>
      </footer>
    </div>
  );
}
