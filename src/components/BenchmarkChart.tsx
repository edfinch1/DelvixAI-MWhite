import type { BenchmarkBlock, BenchmarkMetric, Tone } from '../types';
import { C, S, T, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: BenchmarkBlock;
}

const toneColour: Record<Tone, string> = {
  good: C.good,
  warn: C.warn,
  bad: C.bad,
  neutral: C.neutral,
};

// The pacing ladder: what the cohort has reached by each milestone day, with
// the milestone this campaign is standing on carried in ink.
function StageLadder({ metric, label }: { metric: BenchmarkMetric; label: string }) {
  const { isMobile } = useViewport();

  return (
    <div style={{ marginTop: S.m }}>
      <div style={{ ...T.label, fontSize: 11, color: C.textFaint, marginBottom: S.xs }}>
        {label}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile
            ? 'repeat(2, 1fr)'
            : `repeat(${metric.stages.length}, 1fr)`,
          border: hairline,
          borderRadius: 4,
        }}
      >
        {metric.stages.map((stage, i) => (
          <div
            key={stage.label}
            style={{
              padding: `${S.s}px ${S.m}px`,
              borderLeft: isMobile ? (i % 2 === 1 ? hairline : 'none') : i > 0 ? hairline : 'none',
              borderTop: isMobile && i > 1 ? hairline : 'none',
              borderBottom: stage.isCurrent ? `2px solid ${C.ink}` : '2px solid transparent',
              background: stage.isCurrent ? C.paperAlt : C.paper,
            }}
          >
            <div
              style={{
                ...T.label,
                fontSize: 11,
                color: stage.isCurrent ? C.text : C.textFaint,
              }}
            >
              {stage.isCurrent ? `${stage.label} · passed` : stage.label}
            </div>
            <div
              style={{
                ...T.dataInline,
                fontSize: 14,
                marginTop: 1,
                color: stage.isPast || stage.isCurrent ? C.text : C.textMuted,
                fontWeight: stage.isCurrent ? 600 : 500,
              }}
            >
              {stage.display}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ metric, ladderLabel }: { metric: BenchmarkMetric; ladderLabel: string }) {
  const max = Math.max(metric.campaignValue, metric.benchmarkValue, metric.expectedValue) * 1.14;
  const barPct = (metric.campaignValue / max) * 100;
  const expectedPct = (metric.expectedValue / max) * 100;
  const fullPct = (metric.benchmarkValue / max) * 100;
  const labelOnRight = expectedPct > 55;

  return (
    <div style={{ marginTop: S.xl }}>
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
        <div style={{ ...T.label, color: C.textMuted, position: 'relative', height: 18 }}>
          <span
            style={{
              position: 'absolute',
              ...(labelOnRight
                ? { right: `${100 - expectedPct}%`, paddingRight: 6 }
                : { left: `${expectedPct}%`, paddingLeft: 6 }),
              whiteSpace: 'nowrap',
            }}
          >
            {metric.expectedDisplay}
          </span>
        </div>
        <svg width="100%" height="24" style={{ display: 'block' }}>
          <rect x="0" y="14" width="100%" height="10" fill={C.gridline} />
          <rect
            x="0"
            y="14"
            width={`${barPct}%`}
            height="10"
            fill={toneColour[metric.paceTone]}
          />
          {!metric.flatBenchmark && (
            <line
              x1={`${fullPct}%`}
              x2={`${fullPct}%`}
              y1="8"
              y2="24"
              stroke={C.lineStrong}
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          )}
          <line
            x1={`${expectedPct}%`}
            x2={`${expectedPct}%`}
            y1="0"
            y2="24"
            stroke={C.ink}
            strokeWidth="1"
          />
        </svg>
      </div>

      <p style={{ ...T.caption, color: toneColour[metric.paceTone], marginTop: S.s }}>
        {metric.paceNote}
      </p>

      {metric.flatBenchmark ? (
        <p style={{ ...T.caption, color: C.textFaint, marginTop: 2 }}>
          {metric.stages[0].display}
        </p>
      ) : (
        <StageLadder metric={metric} label={ladderLabel} />
      )}
    </div>
  );
}

export default function BenchmarkChart({ data }: Props) {
  return (
    <div>
      <p style={{ ...T.caption, color: C.textMuted, maxWidth: 720 }}>{data.stageHeading}</p>
      {data.metrics.map((m) => (
        <MetricRow key={m.label} metric={m} ladderLabel={data.ladderLabel} />
      ))}
      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.xl, maxWidth: 720 }}>
        {data.cohortNote}
      </p>
    </div>
  );
}
