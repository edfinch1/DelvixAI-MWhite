import type { FeedbackBlock } from '../types';
import { C, S, T } from '../tokens';

interface Props {
  data: FeedbackBlock;
}

export default function BuyerFeedback({ data }: Props) {
  return (
    <div>
      <p style={{ ...T.caption, color: C.textMuted }}>{data.basis}</p>
      {data.themes.map((theme) => (
        <div key={theme.label} style={{ marginTop: S.l }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              marginBottom: S.xs,
            }}
          >
            <span style={{ ...T.body, color: C.text }}>{theme.label}</span>
            <span style={{ ...T.dataInline, color: C.text }}>{theme.pct}%</span>
          </div>
          <svg width="100%" height="10" style={{ display: 'block' }}>
            <rect x="0" y="0" width="100%" height="10" fill={C.gridline} />
            <rect x="0" y="0" width={`${theme.pct}%`} height="10" fill={C.ink} />
          </svg>
          <p style={{ ...T.caption, color: C.textMuted, marginTop: S.xs }}>
            {theme.note}
          </p>
        </div>
      ))}
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.l, maxWidth: 720 }}>
        {data.caption}
      </p>
    </div>
  );
}
