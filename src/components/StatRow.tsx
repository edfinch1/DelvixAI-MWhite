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
          background: C.paper,
        }}
      >
        {data.stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              padding: S.l,
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
            <div style={{ ...T.statLarge, color: C.text }}>{stat.value}</div>
            <div style={{ ...T.caption, color: C.textMuted, marginTop: S.xs }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.s }}>
        {data.windowCaption}
      </p>
    </div>
  );
}
