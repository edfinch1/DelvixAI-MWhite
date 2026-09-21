import { useMemo, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import type {
  BudgetBand,
  CampaignRecord,
  ListingPhoto,
  SentRecord,
  TeamMember,
  WorklistBlock,
  WorkTask,
  Tone,
} from '../types';
import { C, S, T, RADIUS, RAIL_WIDTH, RAIL_GUTTER, hairline } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  data: WorklistBlock;
  team: TeamMember[];
  campaignRecords: Record<string, CampaignRecord>;
  onOpenCampaign: (id: string) => void;
}

// The queue is a list of properties before it is a list of tasks, and this is
// a business that sells on photography. The gallery orders photography first
// and plans last, so the first frame is always a room, never a drawing.
//
// The row draws a 200px thumbnail rather than the listing photograph itself:
// the full frames run a third of a megabyte each, which is a slow first paint
// to paint eighty pixels with. Alt text still comes from the gallery, so the
// description stays tied to the real photograph.
const THUMB_W = 80;
const THUMB_H = 56;
const thumbFor = (campaignId: string) => `/photos/thumbs/${campaignId}.jpg`;

const URGENCY_TONE: Record<WorkTask['urgency'], Tone> = {
  now: 'bad',
  today: 'warn',
  week: 'neutral',
};

const toneColor = (tone: Tone) =>
  tone === 'bad' ? C.bad : tone === 'warn' ? C.warn : tone === 'good' ? C.good : C.textMuted;

// '102/380 Albert Street, East Melbourne' -> 'Albert Street'. The filter chips
// have to fit on one line; the full address stays on the task row.
function shortAddress(address: string): string {
  const street = address.split(',')[0].trim();
  const [first, ...rest] = street.split(' ');
  return /\d/.test(first) && rest.length ? rest.join(' ') : street;
}

// Most evidence lines open on their figure — "8 enquiries", "0 inspection
// actions", "29 of 47 logged feedback notes". Those figures are the argument;
// the rest of the line is context for it. Lines that do not open on a number
// are left exactly as they are rather than having emphasis invented for them.
const LEADING_FIGURE = /^(\d[\d,]*(?:\s+of\s+\d[\d,]*)?)\s+([\s\S]*)$/;

function Fact({ text }: { text: string }) {
  const m = text.match(LEADING_FIGURE);
  if (!m) return <span style={{ ...T.caption, color: C.text }}>{text}</span>;
  return (
    <span style={{ ...T.caption, color: C.text }}>
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.015em',
        }}
      >
        {m[1]}
      </span>{' '}
      {m[2]}
    </span>
  );
}

type SendState = 'idle' | 'sending' | 'sent' | 'unavailable';

function NotifyButton({
  task,
  member,
  prefix,
  onSent,
}: {
  task: WorkTask;
  member: TeamMember;
  prefix: string;
  onSent: (task: WorkTask, member: TeamMember) => void;
}) {
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
          budget: task.budget,
          contacts: task.contacts,
          contactsSource: task.contactsSource,
          urgencyLabel: task.urgencyLabel,
        }),
      });
      const body = await res.json().catch(() => null);
      if (res.ok && body?.ok && !body?.simulated) {
        setState('sent');
        onSent(task, member);
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
        ? `Sent to ${member.firstName}`
        : state === 'unavailable'
          ? 'Delivery not set up'
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
        color: state === 'sent' ? C.onInk : state === 'unavailable' ? C.textFaint : C.text,
        cursor: disabled ? 'default' : 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {state === 'sent' && <Check size={13} strokeWidth={2.5} />}
      {label}
    </button>
  );
}

// The named people behind a task. The office can open it to check the list the
// agent is about to be handed; the agent gets the names in the message itself
// and never has to open the CRM to find them.
function ContactList({ task }: { task: WorkTask }) {
  const [open, setOpen] = useState(false);
  if (!task.contacts?.length) return null;

  return (
    <div style={{ marginTop: S.m }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          ...T.caption,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          border: 'none',
          background: 'transparent',
          padding: 0,
          color: C.textMuted,
          cursor: 'pointer',
        }}
      >
        <ChevronDown
          size={13}
          style={{
            transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 120ms',
          }}
        />
        {open ? 'Hide' : 'Show'} the {task.contacts.length} names
        {task.contactsSource ? ` from ${task.contactsSource}` : ''}
      </button>

      {open && (
        <div
          style={{
            marginTop: S.s,
            border: hairline,
            borderRadius: RADIUS,
            background: C.paperAlt,
          }}
        >
          {task.contacts.map((contact, i) => (
            <div
              key={contact.name}
              style={{
                display: 'flex',
                gap: S.m,
                padding: `${S.s}px ${S.m}px`,
                borderTop: i > 0 ? hairline : 'none',
              }}
            >
              <span
                style={{
                  ...T.caption,
                  fontWeight: 500,
                  color: C.text,
                  minWidth: 132,
                  flexShrink: 0,
                }}
              >
                {contact.name}
              </span>
              <span style={{ ...T.caption, color: C.textMuted }}>{contact.line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TaskRow({
  task,
  member,
  data,
  hero,
  onOpenCampaign,
  onSent,
  isMobile,
}: {
  task: WorkTask;
  member: TeamMember;
  hero?: ListingPhoto;
  data: WorklistBlock;
  onOpenCampaign: (id: string) => void;
  onSent: (task: WorkTask, member: TeamMember) => void;
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
      {hero && !isMobile && (
        <button
          onClick={() => onOpenCampaign(task.campaignId)}
          style={{
            width: THUMB_W,
            height: THUMB_H,
            flexShrink: 0,
            padding: 0,
            border: hairline,
            borderRadius: RADIUS,
            overflow: 'hidden',
            background: C.paperAlt,
            cursor: 'pointer',
            marginTop: 2,
          }}
        >
          <img
            src={thumbFor(task.campaignId)}
            alt={hero.alt}
            loading="lazy"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </button>
      )}

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

        <div
          style={{
            fontSize: 17,
            fontWeight: 550,
            letterSpacing: '-0.01em',
            lineHeight: 1.35,
            color: C.text,
            marginTop: S.xs + 2,
          }}
        >
          {task.action}
        </div>
        <div style={{ ...T.caption, color: C.textMuted, marginTop: 2 }}>{task.detail}</div>

        <div style={{ marginTop: S.m }}>
          {task.evidence.map((e) => (
            <div
              key={e.fact}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? 0 : S.m,
                marginTop: isMobile ? S.s : 3,
              }}
            >
              <span
                style={{
                  ...T.label,
                  color: C.textFaint,
                  width: isMobile ? undefined : 108,
                  flexShrink: 0,
                  paddingTop: isMobile ? 0 : 1,
                }}
              >
                {e.system}
              </span>
              <Fact text={e.fact} />
            </div>
          ))}
          <div style={{ ...T.caption, color: C.textFaint, marginTop: S.s }}>{task.rule}</div>
        </div>

        <ContactList task={task} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'row' : 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          justifyContent: isMobile ? 'space-between' : 'flex-start',
          gap: S.s,
          flexShrink: 0,
          minWidth: isMobile ? undefined : 208,
        }}
      >
        <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
          <div style={{ ...T.caption, fontWeight: 500, color: C.text }}>{member.name}</div>
          <div style={{ ...T.label, color: C.textFaint }}>{member.patch}</div>
          {task.budget.band !== 'none' && (
            <div
              style={{
                ...T.label,
                color: C.text,
                marginTop: S.s,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {task.budget.cost}
            </div>
          )}
        </div>
        <NotifyButton
          task={task}
          member={member}
          prefix={data.notifyPrefix}
          onSent={onSent}
        />
      </div>
    </div>
  );
}

// One labelled row of filter chips. Three of these stack above the queue:
// agent, campaign, budget.
function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string; count: number }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: S.m,
        flexWrap: 'wrap',
        marginBottom: S.s,
      }}
    >
      <span
        style={{
          ...T.label,
          color: C.textFaint,
          minWidth: 62,
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <div style={{ display: 'flex', gap: S.s, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const active = opt.id === value;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              disabled={opt.count === 0 && !active}
              style={{
                ...T.caption,
                fontWeight: 500,
                padding: `${S.xs + 2}px ${S.m}px`,
                borderRadius: RADIUS,
                border: active ? `1px solid ${C.ink}` : `1px solid ${C.line}`,
                background: active ? C.ink : C.paper,
                color: active ? C.onInk : opt.count === 0 ? C.textFaint : C.textMuted,
                cursor: opt.count === 0 && !active ? 'default' : 'pointer',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {opt.label} ({opt.count})
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Ed's ask from the call: the campaigns move to a rail on the left so the
// queue reads as "this campaign's work", and the filter chrome above the list
// gets shorter. Below 1024px there is no room for a rail, so it collapses back
// into the chip row.

// The left column is a filter panel, not just a campaign list. It holds all
// three groups, which is what makes it tall enough to sit beside the queue
// instead of leaving a dead column under it, and it takes the two chip rows
// off the top of the list. Ed asked for the campaigns on the left and for the
// filter chrome above the queue to take less room; this is both.
function FilterGroup({
  title,
  options,
  value,
  onChange,
  last,
}: {
  title: string;
  options: { id: string; label: string; count: number }[];
  value: string;
  onChange: (id: string) => void;
  last?: boolean;
}) {
  return (
    <div style={{ marginBottom: last ? 0 : S.l }}>
      <div
        style={{
          ...T.label,
          color: C.textFaint,
          paddingBottom: S.s,
          borderBottom: `1px solid ${C.lineStrong}`,
        }}
      >
        {title}
      </div>
      <div style={{ marginTop: S.xs }}>
        {options.map((opt) => {
          const active = opt.id === value;
          const empty = opt.count === 0 && !active;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              disabled={empty}
              style={{
                ...T.caption,
                fontWeight: active ? 550 : 400,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: S.s,
                width: '100%',
                textAlign: 'left',
                padding: `${S.s - 1}px ${S.s}px`,
                border: 'none',
                borderLeft: active ? `2px solid ${C.ink}` : '2px solid transparent',
                background: active ? C.paperAlt : 'transparent',
                color: empty ? C.textFaint : active ? C.text : C.textMuted,
                cursor: empty ? 'default' : 'pointer',
              }}
            >
              <span>{opt.label}</span>
              <span style={{ ...T.label, color: C.textFaint, fontVariantNumeric: 'tabular-nums' }}>
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SentLog({ copy, records }: { copy: WorklistBlock['sentLog']; records: SentRecord[] }) {
  return (
    <section style={{ marginTop: S.xl }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: S.m,
          flexWrap: 'wrap',
          paddingBottom: S.s,
          borderBottom: `1px solid ${C.lineStrong}`,
        }}
      >
        <h2 style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.02em', color: C.text }}>
          {copy.title}
        </h2>
        <span style={{ ...T.label, color: C.textFaint, fontVariantNumeric: 'tabular-nums' }}>
          {records.length} {records.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <p style={{ ...T.caption, color: C.textMuted, marginTop: S.s, maxWidth: 640 }}>
        {copy.subtitle}
      </p>

      {records.length === 0 ? (
        <p style={{ ...T.caption, color: C.textFaint, marginTop: S.m }}>{copy.empty}</p>
      ) : (
        <div style={{ border: hairline, borderRadius: RADIUS, marginTop: S.m }}>
          {records.map((r, i) => (
            <div
              key={`${r.taskId}-${r.at}`}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: S.m,
                flexWrap: 'wrap',
                padding: `${S.m}px ${S.base}px`,
                borderTop: i > 0 ? hairline : 'none',
              }}
            >
              <span
                style={{
                  ...T.label,
                  color: C.textFaint,
                  fontVariantNumeric: 'tabular-nums',
                  minWidth: 62,
                }}
              >
                {r.at}
              </span>
              <span style={{ ...T.caption, color: C.text, flex: 1, minWidth: 220 }}>
                {r.action}
              </span>
              <span style={{ ...T.caption, fontWeight: 500, color: C.text }}>{r.memberName}</span>
              <span style={{ ...T.label, color: C.textFaint, width: '100%' }}>
                {r.campaignAddress}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


export default function Worklist({ data, team, campaignRecords, onOpenCampaign }: Props) {
  const { isMobile, isNarrow } = useViewport();
  const [agent, setAgent] = useState('all');
  const [campaign, setCampaign] = useState('all');
  const [budget, setBudget] = useState('all');
  const [sent, setSent] = useState<SentRecord[]>([]);

  const recordSend = (task: WorkTask, member: TeamMember) => {
    const at = new Date()
      .toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })
      .toLowerCase();
    setSent((prev) => [
      { taskId: task.id, action: task.action, memberName: member.name, campaignAddress: task.campaignAddress, at },
      ...prev,
    ]);
  };

  const members = useMemo(() => new Map(team.map((m) => [m.id, m])), [team]);

  const campaigns = useMemo(() => {
    const seen = new Map<string, string>();
    for (const t of data.tasks) {
      if (!seen.has(t.campaignId)) seen.set(t.campaignId, shortAddress(t.campaignAddress));
    }
    return [...seen].map(([id, label]) => ({ id, label }));
  }, [data.tasks]);

  // Each filter counts against the other two, so a count is always the number
  // of rows that option would actually show.
  const matches = (t: WorkTask, skip: 'agent' | 'campaign' | 'budget' | null) =>
    (skip === 'agent' || agent === 'all' || t.assigneeId === agent) &&
    (skip === 'campaign' || campaign === 'all' || t.campaignId === campaign) &&
    (skip === 'budget' || budget === 'all' || t.budget.band === budget);

  const visible = data.tasks.filter((t) => matches(t, null));

  const agentOptions = [
    { id: 'all', label: data.allLabel, count: data.tasks.filter((t) => matches(t, 'agent')).length },
    ...team.map((m) => ({
      id: m.id,
      label: m.firstName,
      count: data.tasks.filter((t) => matches(t, 'agent') && t.assigneeId === m.id).length,
    })),
  ];

  const campaignOptions = [
    {
      id: 'all',
      label: data.allCampaignsLabel,
      count: data.tasks.filter((t) => matches(t, 'campaign')).length,
    },
    ...campaigns.map((c) => ({
      id: c.id,
      label: c.label,
      count: data.tasks.filter((t) => matches(t, 'campaign') && t.campaignId === c.id).length,
    })),
  ];

  const budgetOptions = [
    { id: 'all', label: 'All', count: data.tasks.filter((t) => matches(t, 'budget')).length },
    ...data.budgetBands.map((b) => ({
      id: b.id,
      label: b.short,
      count: data.tasks.filter((t) => matches(t, 'budget') && t.budget.band === b.id).length,
    })),
  ];

  // Budget is the client's primary cut, so the queue is always grouped by it:
  // the filter narrows which bands are on screen, never how they are read.
  const bands = data.budgetBands.filter((b) => budget === 'all' || b.id === budget);
  const grouped = bands.map((band) => ({
    band,
    tasks: visible.filter((t) => t.budget.band === (band.id as BudgetBand)),
  }));
  const anyVisible = grouped.some((g) => g.tasks.length > 0);

  const queue = (
    <div style={{ flex: 1, minWidth: 0 }}>
      {isNarrow && (
        <div style={{ marginBottom: S.base }}>
          <FilterRow
            label={data.campaignFilterLabel}
            options={campaignOptions}
            value={campaign}
            onChange={setCampaign}
          />
          <FilterRow
            label={data.teamFilterLabel}
            options={agentOptions}
            value={agent}
            onChange={setAgent}
          />
          <FilterRow
            label={data.budgetFilterLabel}
            options={budgetOptions}
            value={budget}
            onChange={setBudget}
          />
        </div>
      )}

      {!anyVisible && (
        <div
          style={{
            border: hairline,
            borderRadius: RADIUS,
            padding: S.l,
            ...T.body,
            color: C.textMuted,
          }}
        >
          {data.emptyLabel}
        </div>
      )}

      {grouped.map(({ band, tasks }, gi) => {
        if (!tasks.length) return null;
        return (
          <section key={band.id} style={{ marginBottom: S.xl, marginTop: gi === 0 ? 0 : undefined }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: S.m,
                flexWrap: 'wrap',
                paddingBottom: S.s,
                borderBottom: `1px solid ${C.lineStrong}`,
              }}
            >
              <h2 style={{ fontSize: 23, fontWeight: 600, letterSpacing: '-0.02em', color: C.text }}>
                {band.label}
              </h2>
              <span style={{ ...T.label, color: C.textFaint, fontVariantNumeric: 'tabular-nums' }}>
                {tasks.length} {tasks.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p style={{ ...T.caption, color: C.textMuted, marginTop: S.s, maxWidth: 640 }}>
              {band.note}
            </p>

            <div style={{ border: hairline, borderRadius: RADIUS, marginTop: S.m }}>
              {tasks.map((task, i) => {
                const member = members.get(task.assigneeId);
                if (!member) return null;
                return (
                  <div key={task.id} style={{ borderTop: i > 0 ? hairline : 'none' }}>
                    <TaskRow
                      task={task}
                      member={member}
                      data={data}
                      hero={campaignRecords[task.campaignId]?.gallery?.photos[0]}
                      onOpenCampaign={onOpenCampaign}
                      onSent={recordSend}
                      isMobile={isMobile}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <SentLog copy={data.sentLog} records={sent} />

      <p style={{ ...T.caption, color: C.textFaint, marginTop: S.m }}>{data.caption}</p>
    </div>
  );

  if (isNarrow) return queue;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: RAIL_GUTTER }}>
      <aside
        style={{
          width: RAIL_WIDTH,
          flexShrink: 0,
          position: 'sticky',
          top: S.l,
          alignSelf: 'flex-start',
        }}
      >
        <FilterGroup
          title={data.campaignFilterLabel}
          options={campaignOptions}
          value={campaign}
          onChange={setCampaign}
        />
        <FilterGroup
          title={data.teamFilterLabel}
          options={agentOptions}
          value={agent}
          onChange={setAgent}
        />
        <FilterGroup
          title={data.budgetFilterLabel}
          options={budgetOptions}
          value={budget}
          onChange={setBudget}
          last
        />
      </aside>
      {queue}
    </div>
  );
}
