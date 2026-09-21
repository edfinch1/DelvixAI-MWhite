import { ChevronLeft } from 'lucide-react';
import type { AppChrome, CampaignTimeline, NavSection } from '../types';
import { C, S, T, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';
import CampaignProgress from './CampaignProgress';

interface Props {
  chrome: AppChrome;
  route: 'portfolio' | 'campaign';
  section: string;
  campaignAddress: string;
  reportWindow: string;
  timeline?: CampaignTimeline;
  onPortfolio: () => void;
  onSection: (id: string) => void;
}

function MobileTabs({
  sections,
  section,
  onSection,
}: {
  sections: NavSection[];
  section: string;
  onSection: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: S.xs,
        overflowX: 'auto',
        padding: `0 ${S.base}px ${S.m}px`,
      }}
    >
      {sections.map((nav) => {
        const active = nav.id === section;
        return (
          <button
            key={nav.id}
            onClick={() => onSection(nav.id)}
            style={{
              ...T.caption,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              padding: `${S.xs + 2}px ${S.m}px`,
              borderRadius: 4,
              border: active ? `1px solid ${C.ink}` : hairline,
              background: active ? C.ink : C.paper,
              color: active ? C.onInk : C.textMuted,
            }}
          >
            {nav.label}
          </button>
        );
      })}
    </div>
  );
}

function SyncBadge({ chrome }: { chrome: AppChrome }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: S.s }}>
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          ...T.label,
          color: C.good,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: C.good,
            display: 'inline-block',
          }}
        />
        {chrome.syncedLabel}
      </span>
      <span style={{ ...T.caption, color: C.textFaint }}>{chrome.syncLine}</span>
    </span>
  );
}

export default function TopBar({
  chrome,
  route,
  section,
  campaignAddress,
  reportWindow,
  timeline,
  onPortfolio,
  onSection,
}: Props) {
  const { isNarrow, isMobile } = useViewport();

  return (
    <div
      style={{
        background: C.paper,
        borderBottom: hairline,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: S.m,
          padding: `${S.m}px ${isMobile ? S.base : S.l}px`,
          minHeight: 56,
        }}
      >
        {isNarrow && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 650,
              letterSpacing: '0.1em',
              color: C.text,
              marginRight: S.s,
            }}
          >
            {chrome.wordmarkShort}
          </span>
        )}
        {route === 'campaign' ? (
          <>
            <button
              onClick={onPortfolio}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                border: 'none',
                background: 'transparent',
                padding: 0,
                ...T.body,
                color: C.textMuted,
              }}
            >
              <ChevronLeft size={16} color={C.textMuted} />
              {chrome.backLabel}
            </button>
            <span style={{ color: C.line }}>|</span>
            <span
              style={{
                ...T.body,
                fontWeight: 550,
                color: C.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {campaignAddress}
            </span>
            {!isNarrow && (
              <span style={{ ...T.caption, color: C.textFaint, marginLeft: 'auto' }}>
                {reportWindow}
              </span>
            )}
          </>
        ) : (
          <>
            <span style={{ ...T.body, fontWeight: 550, color: C.text }}>
              {chrome.portfolioLabel}
            </span>
            <span style={{ marginLeft: 'auto' }}>
              <SyncBadge chrome={chrome} />
            </span>
          </>
        )}
      </div>
      {isNarrow && route === 'campaign' && (
        <MobileTabs sections={chrome.navSections} section={section} onSection={onSection} />
      )}
      {route === 'campaign' && timeline && <CampaignProgress timeline={timeline} />}
    </div>
  );
}
