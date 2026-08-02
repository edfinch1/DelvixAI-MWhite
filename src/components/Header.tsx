import type { PropertyHeader } from '../types';
import { C, S, T, MAX_WIDTH } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: PropertyHeader;
}

export default function Header({ data }: Props) {
  const { isMobile } = useViewport();
  const gutter = isMobile ? S.l : S.xl;

  return (
    <header style={{ background: C.ink, color: C.onInk }}>
      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.base}px ${gutter}px`,
          borderBottom: `1px solid ${C.inkSoft}`,
          display: 'flex',
          alignItems: 'baseline',
          gap: S.m,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '0.08em' }}>
          {data.wordmark}
        </span>
        <span style={{ ...T.caption, color: C.onInkMuted }}>{data.productName}</span>
      </div>

      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.xl}px ${gutter}px ${S.xl + S.s}px`,
        }}
      >
        <h1 style={{ ...T.pageTitle, color: C.onInk }}>{data.address}</h1>
        <p style={{ ...T.body, color: C.onInkMuted, marginTop: S.s }}>
          {data.agentName} · {data.agentOffice}
        </p>
        <p style={{ ...T.caption, color: C.onInkMuted, marginTop: S.xs }}>
          {data.tier} · {data.listed} · {data.daysOnSite}
        </p>
        <p style={{ ...T.caption, color: C.onInkMuted, marginTop: S.base }}>
          {data.reportWindow}
        </p>
      </div>
    </header>
  );
}
