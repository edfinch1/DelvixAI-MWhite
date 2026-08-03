import { useState } from 'react';
import { fixture } from './data/campaign';
import type { CampaignRecord } from './types';
import { C, S, T, hairline } from './tokens';
import { useViewport } from './hooks/useViewport';
import Picker from './components/Picker';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
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
import PhotoRail from './components/PhotoRail';

function MetaStrip({ record }: { record: CampaignRecord }) {
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
      {record.header.meta.map((m, i) => (
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

function CampaignScreen({ record, section }: { record: CampaignRecord; section: string }) {
  switch (section) {
    case 'overview':
      return (
        <>
          <h1 style={{ ...T.sectionHeading, fontSize: 28, color: C.text, marginBottom: S.l }}>
            {record.header.address}
          </h1>
          <MetaStrip record={record} />
          <Section title={record.portal.title} subtitle={record.portal.subtitle}>
            <StatRow data={record.portal} />
          </Section>
          <Section title={record.diagnosis.title}>
            <Diagnosis data={record.diagnosis} />
          </Section>
          <Section title={record.health.title} subtitle={record.health.subtitle}>
            <HealthScore data={record.health} />
          </Section>
        </>
      );
    case 'benchmarks':
      return (
        <Section title={record.benchmark.title} subtitle={record.benchmark.subtitle}>
          <BenchmarkChart data={record.benchmark} />
        </Section>
      );
    case 'feedback':
      return (
        <Section title={record.feedback.title} subtitle={record.feedback.subtitle}>
          <BuyerFeedback data={record.feedback} />
        </Section>
      );
    case 'spend':
      return (
        <>
          <Section title={record.spend.title} subtitle={record.spend.subtitle}>
            <SpendGaps data={record.spend} />
          </Section>
          <Section
            title={record.recommendations.title}
            subtitle={record.recommendations.subtitle}
          >
            <Recommendations data={record.recommendations} />
          </Section>
        </>
      );
    case 'actions':
      return (
        <Section title={record.actions.title} subtitle={record.actions.subtitle}>
          <ActionList data={record.actions} />
        </Section>
      );
    case 'connections':
      return (
        <Section title={fixture.sources.title} subtitle={fixture.sources.subtitle}>
          <Sources data={fixture.sources} />
        </Section>
      );
    default:
      return null;
  }
}

// Below this the page is not wide enough to carry a gallery beside the
// campaign, so the rail moves under the content instead.
const RAIL_MIN_WIDTH = 1360;

export default function App() {
  const { width, isNarrow, isMobile } = useViewport();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [section, setSection] = useState('overview');

  const record = activeId ? fixture.campaigns[activeId] : null;

  const goPicker = () => {
    setActiveId(null);
    window.scrollTo(0, 0);
  };
  const openCampaign = (id: string) => {
    setActiveId(id);
    setSection('overview');
    window.scrollTo(0, 0);
  };
  const goSection = (id: string) => {
    setSection(id);
    window.scrollTo(0, 0);
  };

  const showRail = !record?.gallery || section !== 'overview'
    ? 'none'
    : width >= RAIL_MIN_WIDTH
      ? 'beside'
      : 'below';

  if (!record) {
    return (
      <Picker
        chrome={fixture.app}
        portfolio={fixture.portfolio}
        footer={fixture.footer}
        onOpen={openCampaign}
      />
    );
  }

  return (
    <div style={{ display: 'flex', background: C.paper, minHeight: '100vh' }}>
      {!isNarrow && (
        <Sidebar
          chrome={fixture.app}
          route="campaign"
          section={section}
          campaignAddress={record.header.address}
          footer={fixture.footer}
          onPortfolio={goPicker}
          onSection={goSection}
        />
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <TopBar
          chrome={fixture.app}
          route="campaign"
          section={section}
          campaignAddress={record.header.address}
          reportWindow={record.header.reportWindow}
          timeline={record.timeline}
          onPortfolio={goPicker}
          onSection={goSection}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: S.xl,
            padding: `${isMobile ? S.l : S.xl}px ${isMobile ? S.base : S.xl}px ${S.xxl}px`,
          }}
        >
          <main style={{ flex: 1, minWidth: 0, maxWidth: 1024 }}>
            <CampaignScreen record={record} section={section} />
            {showRail === 'below' && record.gallery && (
              <div style={{ marginTop: S.xl }}>
                <PhotoRail gallery={record.gallery} variant="below" />
              </div>
            )}
          </main>
          {showRail === 'beside' && record.gallery && (
            <PhotoRail gallery={record.gallery} />
          )}
        </div>
      </div>
    </div>
  );
}
