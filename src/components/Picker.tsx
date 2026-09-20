import { useState } from 'react';
import type { AppChrome, PortfolioBlock, TeamMember, WorklistBlock } from '../types';
import { C, S, T, MAX_WIDTH } from '../tokens';
import { useViewport } from '../hooks/useViewport';
import Portfolio from './Portfolio';
import Worklist from './Worklist';

interface Props {
  chrome: AppChrome;
  portfolio: PortfolioBlock;
  worklist: WorklistBlock;
  team: TeamMember[];
  footer: string;
  onOpen: (id: string) => void;
}

export default function Picker({ chrome, portfolio, worklist, team, footer, onOpen }: Props) {
  const { isMobile } = useViewport();
  const [view, setView] = useState<'today' | 'campaigns'>('today');
  const gutter = isMobile ? S.l : S.xl;

  const tab = (id: 'today' | 'campaigns', label: string) => {
    const active = view === id;
    return (
      <button
        key={id}
        onClick={() => setView(id)}
        style={{
          ...T.body,
          fontWeight: 500,
          padding: `${S.m}px 0 ${S.m - 2}px`,
          border: 'none',
          borderBottom: active ? `2px solid ${C.ink}` : '2px solid transparent',
          background: 'transparent',
          color: active ? C.text : C.textMuted,
          cursor: 'pointer',
        }}
      >
        {label}
      </button>
    );
  };

  return (
    <div style={{ background: C.paper, minHeight: '100vh' }}>
      <header style={{ background: C.ink, color: C.onInk }}>
        <div
          style={{
            maxWidth: MAX_WIDTH,
            margin: '0 auto',
            padding: `${S.base + S.xs}px ${gutter}px`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: S.m,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'baseline', gap: S.m, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 16, fontWeight: 650, letterSpacing: '0.14em' }}>
              {chrome.wordmark}
            </span>
            <span style={{ ...T.caption, color: C.onInkMuted }}>{chrome.productName}</span>
          </span>
          <span style={{ ...T.caption, color: C.onInkMuted }}>
            {chrome.agentLine} · {chrome.officeLine}
          </span>
        </div>
      </header>

      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <nav
          style={{
            maxWidth: MAX_WIDTH,
            margin: '0 auto',
            padding: `0 ${gutter}px`,
            display: 'flex',
            gap: S.l,
          }}
        >
          {tab('today', worklist.title)}
          {tab('campaigns', chrome.portfolioLabel)}
        </nav>
      </div>

      <main
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${isMobile ? S.l : S.xl}px ${gutter}px ${S.xxl}px`,
        }}
      >
        {view === 'today' ? (
          <div>
            <h1 style={{ ...T.sectionHeading, color: C.text }}>{worklist.title}</h1>
            <p style={{ ...T.body, color: C.textMuted, marginTop: S.s, maxWidth: 620 }}>
              {worklist.subtitle}
            </p>
            <div style={{ marginTop: S.l }}>
              <Worklist data={worklist} team={team} onOpenCampaign={onOpen} />
            </div>
          </div>
        ) : (
          <Portfolio data={portfolio} onOpen={onOpen} />
        )}
      </main>

      <footer
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.l}px ${gutter}px ${S.xl}px`,
          borderTop: `1px solid ${C.line}`,
        }}
      >
        <p style={{ ...T.caption, color: C.textFaint }}>{footer}</p>
      </footer>
    </div>
  );
}
