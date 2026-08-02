import { useState } from 'react';
import { Check } from 'lucide-react';
import type { ActionsBlock } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';

interface Props {
  data: ActionsBlock;
}

export default function ActionList({ data }: Props) {
  const [done, setDone] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  return (
    <div style={{ border: hairline, borderRadius: RADIUS }}>
      {data.items.map((item, i) => {
        const isDone = !!done[item.id];
        return (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            aria-pressed={isDone}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: S.m,
              width: '100%',
              textAlign: 'left',
              padding: S.base,
              border: 'none',
              borderTop: i > 0 ? hairline : 'none',
              background: 'transparent',
              minHeight: 48,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                marginTop: 2,
                flexShrink: 0,
                borderRadius: RADIUS,
                border: isDone ? `1px solid ${C.ink}` : `1px solid ${C.lineStrong}`,
                background: isDone ? C.ink : C.paper,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isDone && <Check size={12} color={C.onInk} strokeWidth={2.5} />}
            </span>
            <span>
              <span
                style={{
                  ...T.body,
                  display: 'block',
                  color: isDone ? C.textFaint : C.text,
                  textDecoration: isDone ? 'line-through' : 'none',
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  ...T.caption,
                  display: 'block',
                  color: C.textFaint,
                  marginTop: 2,
                }}
              >
                {item.detail}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
