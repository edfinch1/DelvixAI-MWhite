import type { PortalStats } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: PortalStats;
}

export default function StatRow({ data }: Props) {
  const { isMobile } = useViewport();

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          border: hairline,
          borderRadius: RADIUS,
          overflow: 'hidden',
        }}
      >
        {data.stats.map((stat, i) => {
          const dark = !!stat.highlight;
          return (
            <div
              key={stat.label}
              style={{
                padding: S.l,
                minHeight: isMobile ? 132 : 168,
                display: 'flex',
                flexDirection: 'column',
                background: dark ? C.ink : C.paper,
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
              <div
                style={{
                  ...T.statLarge,
                  fontSize: isMobile ? 36 : 48,
                  color: dark ? C.onInk : C.text,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  ...T.body,
                  fontWeight: 500,
                  color: dark ? C.onInk : C.text,
                  marginTop: S.s,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  ...T.caption,
                  color: dark ? C.onInkMuted : C.textMuted,
                  marginTop: 'auto',
                  paddingTop: S.s,
                }}
              >
                {stat.context}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.s }}>
        {data.windowCaption}
      </p>
    </div>
  );
}
