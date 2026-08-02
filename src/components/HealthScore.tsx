import type { HealthScore as HealthData } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: HealthData;
}

export default function HealthScore({ data }: Props) {
  const { isMobile } = useViewport();

  return (
    <div
      style={{
        border: hairline,
        borderRadius: RADIUS,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '280px 1fr',
      }}
    >
      <div
        style={{
          padding: S.l,
          borderRight: isMobile ? 'none' : hairline,
          borderBottom: isMobile ? hairline : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.s }}>
          <span style={{ ...T.statLarge, fontSize: 48, color: C.text }}>
            {data.score}
          </span>
          <span style={{ ...T.body, color: C.textFaint }}>{data.outOf}</span>
        </div>
        <p style={{ ...T.body, color: C.textMuted, marginTop: S.m }}>{data.summary}</p>
      </div>

      <div style={{ padding: S.l }}>
        {data.subScores.map((sub, i) => (
          <div key={sub.label} style={{ marginTop: i === 0 ? 0 : S.base }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: S.xs,
              }}
            >
              <span style={{ ...T.caption, color: C.text }}>{sub.label}</span>
              <span style={{ ...T.dataInline, fontSize: 13, color: C.textMuted }}>
                {sub.score} · {sub.weightNote}
              </span>
            </div>
            <svg width="100%" height="10" style={{ display: 'block' }}>
              <rect x="0" y="0" width="100%" height="10" fill={C.gridline} />
              <rect x="0" y="0" width={`${sub.score}%`} height="10" fill={C.ink} />
            </svg>
          </div>
        ))}
        <p style={{ ...T.caption, color: C.textFaint, marginTop: S.base }}>
          {data.caption}
        </p>
      </div>
    </div>
  );
}
