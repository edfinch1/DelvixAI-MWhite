import { useState } from 'react';
import { campaign } from './data/campaign';
import { C, S, T, hairline } from './tokens';
import { useViewport } from './hooks/useViewport';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Portfolio from './components/Portfolio';
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

type Route = 'portfolio' | 'campaign';

function MetaStrip() {
  const { isMobile } = useViewport();
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
        border: hairline,
        borderRadius: 4,
        marginBottom: S.xl,
      }}
    >
      {campaign.header.meta.map((m, i) => (
        <div
          key={m.label}
          style={{
            padding: S.base,
            borderLeft: isMobile
              ? i % 2 === 1
                ? hairline
                : 'none'
              : i > 0
                ? hairline
                : 'none',
            borderTop: isMobile && i > 1 ? hairline : 'none',
          }}
        >
          <div style={{ ...T.label, color: C.textFaint }}>{m.label}</div>
          <div style={{ ...T.body, fontWeight: 500, color: C.text, marginTop: 2 }}>
            {m.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function CampaignScreen({ section }: { section: string }) {
  switch (section) {
    case 'overview':
      return (
        <>
          <h1 style={{ ...T.sectionHeading, fontSize: 28, color: C.text, marginBottom: S.l }}>
            {campaign.header.address}
          </h1>
          <MetaStrip />
          <Section title={campaign.portal.title} subtitle={campaign.portal.subtitle}>
            <StatRow data={campaign.portal} />
          </Section>
          <Section title={campaign.diagnosis.title}>
            <Diagnosis data={campaign.diagnosis} />
          </Section>
          <Section title={campaign.health.title} subtitle={campaign.health.subtitle}>
            <HealthScore data={campaign.health} />
          </Section>
        </>
      );
    case 'benchmarks':
      return (
        <Section title={campaign.benchmark.title} subtitle={campaign.benchmark.subtitle}>
          <BenchmarkChart data={campaign.benchmark} />
        </Section>
      );
    case 'feedback':
      return (
        <Section title={campaign.feedback.title} subtitle={campaign.feedback.subtitle}>
          <BuyerFeedback data={campaign.feedback} />
        </Section>
      );
    case 'spend':
      return (
        <>
          <Section title={campaign.spend.title} subtitle={campaign.spend.subtitle}>
            <SpendGaps data={campaign.spend} />
          </Section>
          <Section
            title={campaign.recommendations.title}
            subtitle={campaign.recommendations.subtitle}
          >
            <Recommendations data={campaign.recommendations} />
          </Section>
        </>
      );
    case 'actions':
      return (
        <Section title={campaign.actions.title} subtitle={campaign.actions.subtitle}>
          <ActionList data={campaign.actions} />
        </Section>
      );
    case 'connections':
      return (
        <Section title={campaign.sources.title} subtitle={campaign.sources.subtitle}>
          <Sources data={campaign.sources} />
        </Section>
      );
    default:
      return null;
  }
}

export default function App() {
  const { isNarrow, isMobile } = useViewport();
  const [route, setRoute] = useState<Route>('portfolio');
  const [section, setSection] = useState('overview');

  const goPortfolio = () => {
    setRoute('portfolio');
    window.scrollTo(0, 0);
  };
  const openCampaign = () => {
    setRoute('campaign');
    setSection('overview');
    window.scrollTo(0, 0);
  };
  const goSection = (id: string) => {
    setSection(id);
    window.scrollTo(0, 0);
  };

  return (
    <div style={{ display: 'flex', background: C.paper, minHeight: '100vh' }}>
      {!isNarrow && (
        <Sidebar
          chrome={campaign.app}
          route={route}
          section={section}
          campaignAddress={campaign.header.address}
          footer={campaign.footer}
          onPortfolio={goPortfolio}
          onSection={goSection}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar
          chrome={campaign.app}
          route={route}
          section={section}
          campaignAddress={campaign.header.address}
          reportWindow={campaign.header.reportWindow}
          onPortfolio={goPortfolio}
          onSection={goSection}
        />

        <main
          style={{
            maxWidth: 1024,
            padding: `${isMobile ? S.l : S.xl}px ${isMobile ? S.base : S.xl}px ${S.xxl}px`,
          }}
        >
          {route === 'portfolio' ? (
            <Portfolio data={campaign.portfolio} onOpen={openCampaign} />
          ) : (
            <CampaignScreen section={section} />
          )}
        </main>
      </div>
    </div>
  );
}
