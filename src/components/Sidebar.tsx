import type { AppChrome } from '../types';
import { C, S, T } from '../tokens';

interface Props {
  chrome: AppChrome;
  route: 'portfolio' | 'campaign';
  section: string;
  campaignAddress: string;
  footer: string;
  onPortfolio: () => void;
  onSection: (id: string) => void;
}

export const SIDEBAR_WIDTH = 244;

export default function Sidebar({
  chrome,
  route,
  section,
  campaignAddress,
  footer,
  onPortfolio,
  onSection,
}: Props) {
  return (
    <aside
      style={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        background: C.ink,
        color: C.onInk,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div
        style={{
          padding: `${S.l}px ${S.l}px ${S.base}px`,
          borderBottom: `1px solid ${C.inkSoft}`,
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 650, letterSpacing: '0.12em' }}>
          {chrome.wordmark}
        </div>
        <div style={{ ...T.caption, color: C.onInkMuted, marginTop: 2 }}>
          {chrome.productName}
        </div>
      </div>

      <nav style={{ padding: `${S.base}px 0`, flex: 1, overflowY: 'auto' }}>
        <button
          onClick={onPortfolio}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: `${S.s + 2}px ${S.l}px`,
            border: 'none',
            background: 'transparent',
            borderLeft:
              route === 'portfolio' ? `2px solid ${C.onInk}` : '2px solid transparent',
            ...T.body,
            fontWeight: route === 'portfolio' ? 550 : 450,
            color: route === 'portfolio' ? C.onInk : C.onInkMuted,
          }}
        >
          {chrome.portfolioLabel}
        </button>

        {route === 'campaign' && (
          <div style={{ marginTop: S.base }}>
            <div
              style={{
                ...T.label,
                color: C.onInkMuted,
                padding: `0 ${S.l}px`,
                marginBottom: S.s,
              }}
            >
              {campaignAddress}
            </div>
            {chrome.navSections.map((nav) => {
              const active = nav.id === section;
              return (
                <button
                  key={nav.id}
                  onClick={() => onSection(nav.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: `${S.s + 2}px ${S.l}px`,
                    border: 'none',
                    background: active ? C.inkSoft : 'transparent',
                    borderLeft: active ? `2px solid ${C.onInk}` : '2px solid transparent',
                    ...T.body,
                    fontWeight: active ? 550 : 450,
                    color: active ? C.onInk : C.onInkMuted,
                  }}
                >
                  {nav.label}
                </button>
              );
            })}
          </div>
        )}
      </nav>

      <div
        style={{
          padding: S.l,
          borderTop: `1px solid ${C.inkSoft}`,
        }}
      >
        <div style={{ ...T.body, fontWeight: 500, color: C.onInk }}>{chrome.agentLine}</div>
        <div style={{ ...T.caption, color: C.onInkMuted, marginTop: 2 }}>
          {chrome.officeLine}
        </div>
        <div style={{ ...T.caption, color: C.onInkMuted, marginTop: S.base }}>{footer}</div>
      </div>
    </aside>
  );
}
