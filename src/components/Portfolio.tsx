import { ChevronRight } from 'lucide-react';
import type { PortfolioBlock, PortfolioRow, Tone } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: PortfolioBlock;
  onOpen: (id: string) => void;
}

function toneColor(tone: Tone): string {
  if (tone === 'good') return C.good;
  if (tone === 'warn') return C.warn;
  if (tone === 'bad') return C.bad;
  return C.neutral;
}

function StatusMark({ tone }: { tone: Tone }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        background: toneColor(tone),
        marginRight: S.s,
        flexShrink: 0,
      }}
    />
  );
}

function HealthCell({ row }: { row: PortfolioRow }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: S.m, minWidth: 120 }}>
      <span style={{ ...T.dataInline, fontSize: 17, color: C.text }}>
        {row.healthDisplay}
      </span>
      <svg width="72" height="8" style={{ display: 'block', flexShrink: 0 }}>
        <rect x="0" y="0" width="72" height="8" fill={C.gridline} />
        <rect x="0" y="0" width={(row.health / 100) * 72} height="8" fill={C.ink} />
      </svg>
    </div>
  );
}

export default function Portfolio({ data, onOpen }: Props) {
  const { isNarrow } = useViewport();

  if (isNarrow) {
    return (
      <div>
        <h1 style={{ ...T.sectionHeading, color: C.text }}>{data.title}</h1>
        <p style={{ ...T.body, color: C.textMuted, marginTop: S.s, maxWidth: 620 }}>
          {data.subtitle}
        </p>
        <div style={{ marginTop: S.l }}>
          {data.rows.map((row) => {
            return (
              <div
                key={row.id}
                onClick={() => onOpen(row.id)}
                style={{
                  border: hairline,
                  borderRadius: RADIUS,
                  padding: S.base,
                  marginBottom: S.m,
                  cursor: 'pointer',
                  background: C.paper,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: S.m,
                  }}
                >
                  <span style={{ ...T.body, fontWeight: 550, color: C.text }}>
                    {row.address}
                  </span>
                  <ChevronRight size={16} color={C.textMuted} />
                </div>
                <div style={{ ...T.caption, color: C.textMuted, marginTop: S.xs }}>
                  {row.daysOnSite} days on site · {row.enquiriesWeek} enquiries this week
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: S.s,
                  }}
                >
                  <StatusMark tone={row.tone} />
                  <span style={{ ...T.caption, color: C.textMuted }}>{row.status}</span>
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ ...T.caption, color: C.textFaint, marginTop: S.base, maxWidth: 720 }}>
          {data.caption}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ ...T.sectionHeading, fontSize: 28, color: C.text }}>{data.title}</h1>
      <p style={{ ...T.body, color: C.textMuted, marginTop: S.s, maxWidth: 620 }}>
        {data.subtitle}
      </p>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: hairline,
          marginTop: S.l,
        }}
      >
        <thead>
          <tr>
            {data.columns.map((col, i) => (
              <th
                key={col}
                style={{
                  ...T.label,
                  color: C.textMuted,
                  textAlign: i === 1 || i === 2 ? 'right' : 'left',
                  padding: `${S.m}px ${S.base}px`,
                  borderBottom: `1px solid ${C.lineStrong}`,
                  background: C.paperAlt,
                  whiteSpace: 'nowrap',
                }}
              >
                {col}
              </th>
            ))}
            <th style={{ background: C.paperAlt, borderBottom: `1px solid ${C.lineStrong}` }} />
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => {
            return (
              <tr
                key={row.id}
                onClick={() => onOpen(row.id)}
                style={{
                  cursor: 'pointer',
                  background: C.paper,
                }}
              >
                <td
                  style={{
                    ...T.body,
                    fontWeight: 550,
                    color: C.text,
                    padding: `${S.base}px ${S.base}px`,
                    borderTop: i > 0 ? hairline : 'none',
                  }}
                >
                  {row.address}
                </td>
                <td
                  style={{
                    ...T.dataInline,
                    color: C.text,
                    textAlign: 'right',
                    padding: `${S.base}px ${S.base}px`,
                    borderTop: i > 0 ? hairline : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.daysOnSite}
                </td>
                <td
                  style={{
                    ...T.dataInline,
                    color: C.text,
                    textAlign: 'right',
                    padding: `${S.base}px ${S.base}px`,
                    borderTop: i > 0 ? hairline : 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {row.enquiriesWeek}
                </td>
                <td
                  style={{
                    padding: `${S.base}px ${S.base}px`,
                    borderTop: i > 0 ? hairline : 'none',
                  }}
                >
                  <HealthCell row={row} />
                </td>
                <td
                  style={{
                    ...T.body,
                    color: C.textMuted,
                    padding: `${S.base}px ${S.base}px`,
                    borderTop: i > 0 ? hairline : 'none',
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <StatusMark tone={row.tone} />
                    {row.status}
                  </span>
                </td>
                <td
                  style={{
                    padding: `${S.base}px ${S.base}px ${S.base}px 0`,
                    borderTop: i > 0 ? hairline : 'none',
                    width: 32,
                  }}
                >
                  <ChevronRight size={16} color={C.textMuted} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.s, maxWidth: 720 }}>
        {data.caption}
      </p>
    </div>
  );
}
