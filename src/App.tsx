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

  const sections: Array<{
    title: string;
    subtitle?: string;
    content: JSX.Element;
  }> = [
    {
      title: campaign.portal.title,
      subtitle: campaign.portal.subtitle,
      content: <StatRow data={campaign.portal} />,
    },
    {
      title: campaign.diagnosis.title,
      content: <Diagnosis data={campaign.diagnosis} />,
    },
    {
      title: campaign.health.title,
      subtitle: campaign.health.subtitle,
      content: <HealthScore data={campaign.health} />,
    },
    {
      title: campaign.benchmark.title,
      subtitle: campaign.benchmark.subtitle,
      content: <BenchmarkChart data={campaign.benchmark} />,
    },
    {
      title: campaign.feedback.title,
      subtitle: campaign.feedback.subtitle,
      content: <BuyerFeedback data={campaign.feedback} />,
    },
    {
      title: campaign.spend.title,
      subtitle: campaign.spend.subtitle,
      content: <SpendGaps data={campaign.spend} />,
    },
    {
      title: campaign.recommendations.title,
      subtitle: campaign.recommendations.subtitle,
      content: <Recommendations data={campaign.recommendations} />,
    },
    {
      title: campaign.actions.title,
      subtitle: campaign.actions.subtitle,
      content: <ActionList data={campaign.actions} />,
    },
    {
      title: campaign.sources.title,
      subtitle: campaign.sources.subtitle,
      content: <Sources data={campaign.sources} />,
    },
  ];

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
        {sections.map((s, i) => (
          <Section
            key={s.title}
            number={String(i + 1).padStart(2, '0')}
            title={s.title}
            subtitle={s.subtitle}
          >
            {s.content}
          </Section>
        ))}
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
