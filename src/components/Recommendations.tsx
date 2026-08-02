import { useState } from 'react';
import type { RecommendationsBlock } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';

interface Props {
  data: RecommendationsBlock;
}

export default function Recommendations({ data }: Props) {
  const [activeId, setActiveId] = useState(data.tiers[0].id);
  const active = data.tiers.find((t) => t.id === activeId) ?? data.tiers[0];

  return (
    <div>
      <div style={{ display: 'flex', gap: S.s, flexWrap: 'wrap' }}>
        {data.tiers.map((tier) => {
          const isActive = tier.id === activeId;
          return (
            <button
              key={tier.id}
              onClick={() => setActiveId(tier.id)}
              style={{
                ...T.body,
                fontWeight: 500,
                padding: `${S.s}px ${S.base}px`,
                borderRadius: RADIUS,
                border: isActive ? `1px solid ${C.ink}` : hairline,
                background: isActive ? C.ink : C.paper,
                color: isActive ? C.onInk : C.textMuted,
              }}
            >
              {tier.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          border: hairline,
          borderRadius: RADIUS,
          marginTop: S.base,
        }}
      >
        {active.recommendations.map((rec, i) => (
          <div
            key={rec.action}
            style={{
              padding: S.l,
              borderTop: i > 0 ? hairline : 'none',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: S.base,
                flexWrap: 'wrap',
              }}
            >
              <h3 style={{ fontSize: 17, fontWeight: 550, letterSpacing: '-0.01em', color: C.text }}>
                {rec.action}
              </h3>
              <span style={{ ...T.dataInline, color: C.text, whiteSpace: 'nowrap' }}>
                {rec.cost}
              </span>
            </div>
            <p style={{ ...T.body, color: C.textMuted, marginTop: S.xs, maxWidth: 760 }}>
              {rec.evidence}
            </p>
            <p style={{ ...T.caption, color: C.textFaint, marginTop: S.xs }}>
              {rec.impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
