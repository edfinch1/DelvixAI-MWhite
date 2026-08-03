import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import type { CampaignTimeline } from '../types';
import { C, S, T, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  timeline: CampaignTimeline;
}

// '2:14pm 03/08/2026'. The format the strip ships with, so a refresh reads
// like the same clock rather than a different one.
function stamp(date: Date): string {
  const hour24 = date.getHours();
  const hour = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minute = String(date.getMinutes()).padStart(2, '0');
  const suffix = hour24 < 12 ? 'am' : 'pm';
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${hour}:${minute}${suffix} ${day}/${month}/${date.getFullYear()}`;
}

function LivePill({ label }: { label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '3px 8px',
        borderRadius: 4,
        border: `1px solid ${C.good}`,
        color: C.good,
        ...T.label,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: C.good,
          display: 'inline-block',
        }}
      />
      {label}
    </span>
  );
}

export default function CampaignProgress({ timeline }: Props) {
  const { isMobile } = useViewport();
  const [updatedAt, setUpdatedAt] = useState(timeline.updatedAt);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    window.setTimeout(() => {
      setUpdatedAt(stamp(new Date()));
      setRefreshing(false);
    }, 700);
  };

  const pct = Math.min(100, (timeline.currentDay / timeline.totalDays) * 100);

  return (
    <div
      style={{
        borderTop: hairline,
        padding: `${S.s + 2}px ${isMobile ? S.base : S.l}px ${S.m}px`,
        background: C.paperAlt,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: S.s,
          marginBottom: S.s,
        }}
      >
        <span style={{ ...T.label, color: C.textFaint }}>{timeline.label}</span>
        <span style={{ ...T.label, color: C.text, fontWeight: 550 }}>
          {timeline.positionLabel}
        </span>
        {!isMobile && (
          <span style={{ ...T.label, color: C.textMuted }}>{timeline.remainingLabel}</span>
        )}

        <span
          style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: S.s,
          }}
        >
          <LivePill label={timeline.liveLabel} />
          {!isMobile && (
            <span style={{ ...T.label, color: C.textMuted, whiteSpace: 'nowrap' }}>
              {refreshing ? 'Refreshing' : `${timeline.updatedPrefix} ${updatedAt}`}
            </span>
          )}
          <button
            onClick={refresh}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              ...T.label,
              color: C.text,
              background: C.paper,
              border: hairline,
              borderRadius: 4,
              padding: '4px 10px',
            }}
          >
            <RotateCw
              size={13}
              color={C.textMuted}
              className={refreshing ? 'is-spinning' : undefined}
            />
            {timeline.refreshLabel}
          </button>
        </span>
      </div>

      {isMobile && (
        <div style={{ ...T.label, color: C.textMuted, marginBottom: S.s }}>
          {timeline.remainingLabel} · {timeline.updatedPrefix} {updatedAt}
        </div>
      )}

      <div style={{ position: 'relative', height: 6 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: C.gridline,
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: `${pct}%`,
            background: C.ink,
            borderRadius: 1,
          }}
        />
        {timeline.marks.map((mark) => {
          const at = Math.min(100, (mark.day / timeline.totalDays) * 100);
          const isToday = mark.kind === 'today';
          return (
            <span
              key={mark.label}
              style={{
                position: 'absolute',
                top: isToday ? -3 : 0,
                left: `${at}%`,
                width: isToday ? 12 : 1,
                height: isToday ? 12 : 6,
                marginLeft: isToday ? -6 : at >= 100 ? -1 : 0,
                borderRadius: isToday ? '50%' : 0,
                background: isToday ? C.ink : C.lineStrong,
                border: isToday ? `2px solid ${C.paperAlt}` : 'none',
              }}
            />
          );
        })}
      </div>

      {/* On a phone the line above already names the day, so the tick labels
          come off rather than stack the sticky header any higher. */}
      {!isMobile && (
        <div style={{ position: 'relative', height: 18, marginTop: S.xs }}>
          {timeline.marks.map((mark) => {
            const at = Math.min(100, (mark.day / timeline.totalDays) * 100);
            const alignRight = at > 88;
            return (
              <span
                key={mark.label}
                style={{
                  position: 'absolute',
                  ...(alignRight ? { right: `${100 - at}%` } : { left: `${at}%` }),
                  transform: alignRight ? 'none' : at > 4 ? 'translateX(-50%)' : 'none',
                  ...T.label,
                  fontSize: 11,
                  whiteSpace: 'nowrap',
                  color: mark.kind === 'today' ? C.text : C.textFaint,
                  fontWeight: mark.kind === 'today' ? 550 : 400,
                }}
              >
                {mark.label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
