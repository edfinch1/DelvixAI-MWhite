import type { BenchmarkBlock, BenchmarkMetric } from '../types';
import { C, S, T } from '../tokens';

interface Props {
  data: BenchmarkBlock;
}

function meetsBenchmark(m: BenchmarkMetric): boolean {
  return m.betterIsLower
    ? m.campaignValue <= m.benchmarkValue
    : m.campaignValue >= m.benchmarkValue;
}

function MetricRow({ metric }: { metric: BenchmarkMetric }) {
  const max = Math.max(metric.campaignValue, metric.benchmarkValue) * 1.3;
  const barPct = (metric.campaignValue / max) * 100;
  const rulePct = (metric.benchmarkValue / max) * 100;
  const ruleOnRight = rulePct > 55;

  return (
    <div style={{ marginTop: S.l }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          gap: S.base,
          marginBottom: S.xs,
        }}
      >
        <div>
          <span style={{ ...T.body, color: C.text }}>{metric.label}</span>
          <span style={{ ...T.caption, color: C.textFaint, marginLeft: S.s }}>
            {metric.windowNote}
          </span>
        </div>
        <span style={{ ...T.dataInline, color: C.text, whiteSpace: 'nowrap' }}>
          {metric.campaignDisplay}
        </span>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={{
            ...T.label,
            color: C.textMuted,
            position: 'relative',
            height: 18,
          }}
        >
          <span
            style={{
              position: 'absolute',
              ...(ruleOnRight
                ? { right: `${100 - rulePct}%`, paddingRight: 6 }
                : { left: `${rulePct}%`, paddingLeft: 6 }),
              whiteSpace: 'nowrap',
            }}
          >
            {metric.benchmarkDisplay}
          </span>
        </div>
        <svg width="100%" height="24" style={{ display: 'block' }}>
          <rect x="0" y="14" width="100%" height="10" fill={C.gridline} />
          <rect
            x="0"
            y="14"
            width={`${barPct}%`}
            height="10"
            fill={meetsBenchmark(metric) ? C.good : C.bad}
          />
          <line
            x1={`${rulePct}%`}
            x2={`${rulePct}%`}
            y1="0"
            y2="24"
            stroke={C.ink}
            strokeWidth="1"
          />
        </svg>
      </div>
    </div>
  );
}

export default function BenchmarkChart({ data }: Props) {
  return (
    <div>
      {data.metrics.map((m) => (
        <MetricRow key={m.label} metric={m} />
      ))}
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.l, maxWidth: 720 }}>
        {data.cohortNote}
      </p>
    </div>
  );
}
