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
        gridTemplateColumns: isMobile ? '1fr' : '320px 1fr',
      }}
    >
      <div
        style={{
          padding: isMobile ? S.l : S.xl,
          borderRight: isMobile ? 'none' : hairline,
          borderBottom: isMobile ? hairline : 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.m }}>
          <span
            style={{ ...T.scoreLarge, fontSize: isMobile ? 64 : 84, color: C.text }}
          >
            {data.score}
          </span>
          <span style={{ ...T.body, color: C.textFaint }}>{data.outOf}</span>
        </div>
        <p style={{ ...T.body, fontWeight: 500, color: C.text, marginTop: S.m }}>
          {data.verdict}
        </p>
        <p style={{ ...T.body, color: C.textMuted, marginTop: S.s }}>{data.summary}</p>
      </div>

      <div style={{ padding: isMobile ? S.l : S.xl }}>
        {data.subScores.map((sub, i) => (
          <div key={sub.label} style={{ marginTop: i === 0 ? 0 : S.base + S.xs }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: S.xs,
              }}
            >
              <span style={{ ...T.body, fontWeight: 500, color: C.text }}>
                {sub.label}
              </span>
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
        <p style={{ ...T.caption, color: C.textFaint, marginTop: S.l }}>
          {data.caption}
        </p>
      </div>
    </div>
  );
}
