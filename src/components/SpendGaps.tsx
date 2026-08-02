import type { SpendBlock, SpendItem } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: SpendBlock;
}

function Column({
  heading,
  items,
  alt,
}: {
  heading: string;
  items: SpendItem[];
  alt?: boolean;
}) {
  return (
    <div style={{ padding: S.l, flex: 1, minWidth: 0, background: alt ? C.paperAlt : C.paper }}>
      <h3 style={{ ...T.label, color: C.textMuted }}>{heading}</h3>
      {items.map((item) => (
        <div
          key={item.label}
          style={{ marginTop: S.base, paddingTop: S.base, borderTop: hairline }}
        >
          <div style={{ ...T.body, fontWeight: 500, color: C.text }}>{item.label}</div>
          <div style={{ ...T.caption, color: C.textMuted, marginTop: 2 }}>
            {item.note}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SpendGaps({ data }: Props) {
  const { isMobile } = useViewport();

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          border: hairline,
          borderRadius: RADIUS,
          overflow: 'hidden',
        }}
      >
        <Column heading={data.purchasedHeading} items={data.purchased} />
        <div
          style={{
            borderLeft: isMobile ? 'none' : hairline,
            borderTop: isMobile ? hairline : 'none',
          }}
        />
        <Column heading={data.notPurchasedHeading} items={data.notPurchased} alt />
      </div>
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.s, maxWidth: 720 }}>
        {data.caption}
      </p>
    </div>
  );
}
