import type { SourcesBlock } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: SourcesBlock;
}

export default function Sources({ data }: Props) {
  const { isMobile } = useViewport();

  if (isMobile) {
    return (
      <div style={{ border: hairline, borderRadius: RADIUS }}>
        {data.rows.map((row, i) => (
          <div
            key={row.source}
            style={{ padding: S.base, borderTop: i > 0 ? hairline : 'none' }}
          >
            <div style={{ ...T.body, fontWeight: 500, color: C.text }}>{row.source}</div>
            <div style={{ ...T.caption, color: C.textMuted, marginTop: 2 }}>
              {row.provides}
            </div>
            <div
              style={{
                ...T.caption,
                color: row.tone === 'warn' ? C.warn : C.textMuted,
                marginTop: S.xs,
              }}
            >
              {row.status}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: hairline,
        borderRadius: RADIUS,
      }}
    >
      <thead>
        <tr>
          {data.columns.map((col) => (
            <th
              key={col}
              style={{
                ...T.label,
                color: C.textMuted,
                textAlign: 'left',
                padding: `${S.m}px ${S.base}px`,
                borderBottom: `1px solid ${C.lineStrong}`,
                background: C.paperAlt,
              }}
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.rows.map((row, i) => (
          <tr key={row.source}>
            <td
              style={{
                ...T.body,
                fontWeight: 500,
                color: C.text,
                padding: `${S.m}px ${S.base}px`,
                borderTop: i > 0 ? hairline : 'none',
                verticalAlign: 'top',
                whiteSpace: 'nowrap',
              }}
            >
              {row.source}
            </td>
            <td
              style={{
                ...T.body,
                color: C.textMuted,
                padding: `${S.m}px ${S.base}px`,
                borderTop: i > 0 ? hairline : 'none',
                verticalAlign: 'top',
              }}
            >
              {row.provides}
            </td>
            <td
              style={{
                ...T.body,
                color: row.tone === 'warn' ? C.warn : C.text,
                padding: `${S.m}px ${S.base}px`,
                borderTop: i > 0 ? hairline : 'none',
                verticalAlign: 'top',
              }}
            >
              {row.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
