import type { AppChrome, PortfolioBlock } from '../types';
import { C, S, T, MAX_WIDTH } from '../tokens';
import { useViewport } from '../hooks/useViewport';
import Portfolio from './Portfolio';

interface Props {
  chrome: AppChrome;
  portfolio: PortfolioBlock;
  footer: string;
  onOpen: (id: string) => void;
}

export default function Picker({ chrome, portfolio, footer, onOpen }: Props) {
  const { isMobile } = useViewport();
  const gutter = isMobile ? S.l : S.xl;

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

      <main
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${isMobile ? S.l : S.xl}px ${gutter}px ${S.xxl}px`,
        }}
      >
        <Portfolio data={portfolio} onOpen={onOpen} />
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
