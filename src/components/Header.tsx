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
          padding: `${S.base + S.xs}px ${gutter}px`,
          borderBottom: `1px solid ${C.inkSoft}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: S.m,
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 650, letterSpacing: '0.14em' }}>
          {data.wordmark}
        </span>
        <span style={{ ...T.caption, color: C.onInkMuted }}>{data.productName}</span>
      </div>

      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${isMobile ? S.xl : S.xxl}px ${gutter}px 0`,
        }}
      >
        <h1
          style={{
            ...T.display,
            fontSize: isMobile ? 30 : 42,
            color: C.onInk,
            maxWidth: 820,
          }}
        >
          {data.address}
        </h1>
        <p style={{ ...T.caption, color: C.onInkMuted, marginTop: S.m }}>
          {data.reportWindow}
        </p>
      </div>

      <div
        style={{
          maxWidth: MAX_WIDTH,
          margin: '0 auto',
          padding: `${S.xl}px ${gutter}px ${isMobile ? S.l : S.xl}px`,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            borderTop: `1px solid ${C.inkSoft}`,
          }}
        >
          {data.meta.map((m, i) => (
            <div
              key={m.label}
              style={{
                paddingTop: S.base,
                paddingRight: S.base,
                paddingBottom: isMobile && i < 2 ? S.base : 0,
                borderLeft:
                  (isMobile && i % 2 === 1) || (!isMobile && i > 0)
                    ? `1px solid ${C.inkSoft}`
                    : 'none',
                paddingLeft: (isMobile && i % 2 === 1) || (!isMobile && i > 0) ? S.base : 0,
                borderTop: isMobile && i > 1 ? `1px solid ${C.inkSoft}` : 'none',
              }}
            >
              <div style={{ ...T.label, color: C.onInkMuted }}>{m.label}</div>
              <div style={{ ...T.body, fontWeight: 500, color: C.onInk, marginTop: 2 }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
