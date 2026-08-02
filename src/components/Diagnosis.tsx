import type { Diagnosis as DiagnosisData } from '../types';
import { C, S, T, RADIUS } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: DiagnosisData;
}

export default function Diagnosis({ data }: Props) {
  const { isMobile } = useViewport();

  return (
    <div
      style={{
        background: C.ink,
        color: C.onInk,
        borderRadius: RADIUS,
        padding: isMobile ? S.l : S.xxl,
      }}
    >
      <p style={{ ...T.label, color: C.onInkMuted }}>{data.kicker}</p>
      <div style={{ marginTop: isMobile ? S.base : S.l }}>
        {data.paragraphs.map((para, i) => (
          <p
            key={i}
            style={{
              ...T.pull,
              fontSize: isMobile ? 19 : 26,
              color: 'rgba(255,255,255,0.84)',
              marginTop: i === 0 ? 0 : S.l,
              maxWidth: 780,
            }}
          >
            {para.map((seg, j) =>
              seg.strong ? (
                <strong key={j} style={{ fontWeight: 600, color: C.onInk }}>
                  {seg.text}
                </strong>
              ) : (
                <span key={j}>{seg.text}</span>
              ),
            )}
          </p>
        ))}
      </div>
      <div
        style={{
          borderTop: `1px solid ${C.inkSoft}`,
          marginTop: isMobile ? S.l : S.xl,
          paddingTop: S.l,
        }}
      >
        <p style={{ ...T.body, color: C.onInkMuted, maxWidth: 760 }}>{data.systems}</p>
        <p style={{ ...T.caption, color: C.onInkMuted, marginTop: S.base }}>
          {data.caption}
        </p>
      </div>
    </div>
  );
}
