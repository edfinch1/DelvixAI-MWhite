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
        padding: isMobile ? S.l : S.xl,
      }}
    >
      {data.paragraphs.map((p, i) => (
        <p
          key={i}
          style={{
            fontSize: isMobile ? 17 : 19,
            fontWeight: 400,
            lineHeight: 1.55,
            letterSpacing: '-0.005em',
            color: C.onInk,
            marginTop: i === 0 ? 0 : S.base,
            maxWidth: 760,
          }}
        >
          {p}
        </p>
      ))}
      <div
        style={{
          borderTop: `1px solid ${C.inkSoft}`,
          marginTop: S.l,
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
