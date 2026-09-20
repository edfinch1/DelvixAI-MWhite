import { useState } from 'react';
import { Check } from 'lucide-react';
import type { TeamMember, WorklistBlock, WorkTask, Tone } from '../types';
import { C, S, T, RADIUS, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: WorklistBlock;
  team: TeamMember[];
  onOpenCampaign: (id: string) => void;
}

const URGENCY_TONE: Record<WorkTask['urgency'], Tone> = {
  now: 'bad',
  today: 'warn',
  week: 'neutral',
};

const toneColor = (tone: Tone) =>
  tone === 'bad' ? C.bad : tone === 'warn' ? C.warn : tone === 'good' ? C.good : C.textMuted;

type SendState = 'idle' | 'sending' | 'sent' | 'unavailable';

function NotifyButton({ task, member, prefix }: { task: WorkTask; member: TeamMember; prefix: string }) {
  const [state, setState] = useState<SendState>('idle');

  const send = async () => {
    if (state === 'sending' || state === 'sent') return;
    setState('sending');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignee: member.name,
          action: task.action,
          detail: task.detail,
          campaign: task.campaignAddress,
          evidence: task.evidence,
          rule: task.rule,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok && !body?.simulated) {
        setState('sent');
      } else {
        setState('unavailable');
      }
    } catch {
      setState('unavailable');
    }
  };

  const label =
    state === 'sending'
      ? 'Sending'
      : state === 'sent'
        ? `Emailed to ${member.firstName}`
        : state === 'unavailable'
          ? 'Email delivery not set up'
          : `${prefix} ${member.firstName}`;

  const disabled = state === 'sending' || state === 'sent' || state === 'unavailable';

  return (
    <button
      onClick={send}
      disabled={disabled}
      style={{
        ...T.caption,
        fontWeight: 500,
        display: 'inline-flex',
        alignItems: 'center',
        gap: S.xs + 2,
        padding: `${S.s - 1}px ${S.m}px`,
        borderRadius: RADIUS,
        border: state === 'sent' ? `1px solid ${C.ink}` : `1px solid ${C.lineStrong}`,
        background: state === 'sent' ? C.ink : C.paper,
        color:
          state === 'sent' ? C.onInk : state === 'unavailable' ? C.textFaint : C.text,
        cursor: disabled ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {state === 'sent' && <Check size={13} strokeWidth={2.5} />}
      {label}
    </button>
  );
}

function TaskRow({
  task,
  member,
  data,
  onOpenCampaign,
  isMobile,
}: {
  task: WorkTask;
  member: TeamMember;
  data: WorklistBlock;
  onOpenCampaign: (id: string) => void;
  isMobile: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'flex-start',
        gap: isMobile ? S.m : S.l,
        padding: `${S.base + S.xs}px ${S.base}px`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: S.m, flexWrap: 'wrap' }}>
          <span style={{ ...T.label, color: toneColor(URGENCY_TONE[task.urgency]) }}>
            {task.urgencyLabel}
          </span>
          <button
            onClick={() => onOpenCampaign(task.campaignId)}
            style={{
              ...T.label,
              color: C.textMuted,
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationColor: C.lineStrong,
              textUnderlineOffset: 3,
            }}
          >
            {task.campaignAddress}
          </button>
        </div>

        <div style={{ ...T.body, fontWeight: 500, color: C.text, marginTop: S.xs + 2 }}>
          {task.action}
        </div>
        <div style={{ ...T.caption, color: C.textMuted, marginTop: 2 }}>{task.detail}</div>

        <div style={{ marginTop: S.m }}>
          {task.evidence.map((e) => (
            <div key={e.fact} style={{ ...T.caption, color: C.textMuted, marginTop: 2 }}>
              <span style={{ fontWeight: 500, color: C.text }}>{e.system}</span>
              {': '}
              {e.fact}
            </div>
          ))}
          <div style={{ ...T.caption, color: C.textFaint, marginTop: S.s }}>
            {task.rule} {task.raised}.
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          justifyContent: isMobile ? 'space-between' : 'flex-start',
          gap: S.s,
          flexShrink: 0,
          minWidth: isMobile ? undefined : 200,
        }}
      >
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <div style={{ ...T.caption, fontWeight: 500, color: C.text }}>{member.name}</div>
          <div style={{ ...T.label, color: C.textFaint }}>{member.patch}</div>
        </div>
        <NotifyButton task={task} member={member} prefix={data.notifyPrefix} />
      </div>
    </div>
  );
}

export default function Worklist({ data, team, onOpenCampaign }: Props) {
  const { isMobile } = useViewport();
  const [filter, setFilter] = useState<string>('all');

  const members = new Map(team.map((m) => [m.id, m]));
  const tasks = filter === 'all' ? data.tasks : data.tasks.filter((t) => t.assigneeId === filter);

  const filterButton = (id: string, label: string, count: number) => {
    const active = filter === id;
    return (
      <button
        key={id}
        onClick={() => setFilter(id)}
        style={{
          ...T.caption,
          fontWeight: 500,
          padding: `${S.xs + 2}px ${S.m}px`,
          borderRadius: RADIUS,
          border: active ? `1px solid ${C.ink}` : `1px solid ${C.line}`,
          background: active ? C.ink : C.paper,
          color: active ? C.onInk : C.textMuted,
          cursor: 'pointer',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {label} ({count})
      </button>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: S.s, flexWrap: 'wrap', marginBottom: S.base }}>
        {filterButton('all', data.allLabel, data.tasks.length)}
        {team.map((m) =>
          filterButton(
            m.id,
            m.firstName,
            data.tasks.filter((t) => t.assigneeId === m.id).length,
          ),
        )}
      </div>

      <div style={{ border: hairline, borderRadius: RADIUS }}>
        {tasks.map((task, i) => {
          const member = members.get(task.assigneeId);
          if (!member) return null;
          return (
            <div key={task.id} style={{ borderTop: i > 0 ? hairline : 'none' }}>
              <TaskRow
                task={task}
                member={member}
                data={data}
                onOpenCampaign={onOpenCampaign}
                isMobile={isMobile}
              />
            </div>
          );
        })}
      </div>

      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.m }}>{data.caption}</p>
    </div>
  );
}
