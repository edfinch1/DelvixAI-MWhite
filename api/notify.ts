// Vercel serverless function: sends a task from the Today queue to the
// assigned agent. Delivery uses the demo owner's Gmail over SMTP.
//
// Environment variables (Vercel project settings):
//   GMAIL_USER          the sending Gmail address
//   GMAIL_APP_PASSWORD  a Gmail app password (requires 2FA on the account)
//   NOTIFY_TO           where task emails land; defaults to GMAIL_USER
//   SLACK_WEBHOOK_URL   optional; posts the same task to a Slack channel
//
// With none of these set the endpoint answers { ok: true, simulated: true }
// and the UI reports that delivery is not set up.
//
// What the agent gets is deliberately not what the office sees. The office
// screen carries the evidence and the rule; the agent gets two lines and the
// actual list of people, because an agent who has to open a CRM to find the
// names will not make the calls.

import nodemailer from 'nodemailer';

interface Evidence {
  system: string;
  fact: string;
}

interface Contact {
  name: string;
  line: string;
}

interface Budget {
  band: 'none' | 'mid' | 'high';
  cost: string;
  note: string;
}

interface NotifyPayload {
  assignee: string;
  action: string;
  detail: string;
  campaign: string;
  evidence: Evidence[];
  rule: string;
  budget?: Budget;
  contacts?: Contact[];
  contactsSource?: string;
  urgencyLabel?: string;
}

function isPayload(body: unknown): body is NotifyPayload {
  const b = body as NotifyPayload;
  return (
    !!b &&
    typeof b.assignee === 'string' &&
    typeof b.action === 'string' &&
    typeof b.campaign === 'string' &&
    typeof b.rule === 'string' &&
    Array.isArray(b.evidence)
  );
}

const firstName = (full: string) => full.split(' ')[0];

// Anything with a dollar figure on it cannot be actioned without the vendor,
// so the agent is told that in the same breath as the task.
function budgetLine(p: NotifyPayload): string | null {
  if (!p.budget || p.budget.band === 'none') return null;
  return `${p.budget.cost}. Needs vendor sign-off before you book it.`;
}

export function subject(p: NotifyPayload): string {
  const urgency = p.urgencyLabel ? `${p.urgencyLabel}: ` : '';
  return `${urgency}${p.action} — ${p.campaign.split(',')[0]}`;
}

export function textBody(p: NotifyPayload): string {
  const out: string[] = [`${firstName(p.assignee)} — ${p.action}.`, p.detail, ''];

  const money = budgetLine(p);
  if (money) out.push(money, '');

  if (p.contacts?.length) {
    out.push(
      `${p.contacts.length} ${p.contacts.length === 1 ? 'person' : 'people'}${
        p.contactsSource ? `, from ${p.contactsSource}` : ''
      }:`,
      '',
    );
    p.contacts.forEach((c, i) => out.push(`${i + 1}. ${c.name} — ${c.line}`));
    out.push('');
  }

  out.push(p.campaign, `${p.rule}`, 'Marshall White campaign intelligence');
  return out.join('\n');
}

export function htmlBody(p: NotifyPayload): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const money = budgetLine(p);

  // The list is stamped with the system it came out of, so the agent can trust
  // it without going to look.
  const contacts = p.contacts?.length
    ? `
    <div style="border:1px solid #E3E6E9;border-radius:4px;overflow:hidden;margin:0 0 20px">
      <div style="background:#C8102E;color:#fff;font-size:12px;font-weight:600;padding:7px 14px">
        ${esc(p.contactsSource || 'CRM')}
      </div>
      <table style="width:100%;border-collapse:collapse">
        ${p.contacts
          .map(
            (c, i) => `
        <tr style="${i > 0 ? 'border-top:1px solid #EDEFF1' : ''}">
          <td style="padding:9px 14px;font-size:14px;font-weight:600;color:#0B1B2B;white-space:nowrap;vertical-align:top">${esc(
            c.name,
          )}</td>
          <td style="padding:9px 14px 9px 0;font-size:13px;color:#5A6672;vertical-align:top">${esc(
            c.line,
          )}</td>
        </tr>`,
          )
          .join('')}
      </table>
    </div>`
    : '';

  return `
  <div style="font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0B1B2B;max-width:580px">
    ${
      p.urgencyLabel
        ? `<p style="font-size:13px;font-weight:600;color:#A32B2B;margin:0 0 6px">${esc(
            p.urgencyLabel,
          )}</p>`
        : ''
    }
    <p style="font-size:20px;font-weight:600;line-height:1.3;margin:0 0 6px">${esc(
      firstName(p.assignee),
    )} — ${esc(p.action)}.</p>
    <p style="font-size:15px;color:#5A6672;margin:0 0 ${money ? '12' : '20'}px">${esc(
      p.detail,
    )}</p>
    ${
      money
        ? `<p style="font-size:14px;font-weight:600;color:#B07A1E;margin:0 0 20px">${esc(
            money,
          )}</p>`
        : ''
    }
    ${contacts}
    <p style="font-size:13px;color:#8A939C;margin:0;border-top:1px solid #E3E6E9;padding-top:10px">
      ${esc(p.campaign)}<br />
      <span style="font-size:12px">${esc(p.rule)}</span>
    </p>
  </div>`;
}

export function slackBody(p: NotifyPayload): string {
  const out = [`*${p.urgencyLabel ? `${p.urgencyLabel}: ` : ''}${firstName(p.assignee)} — ${p.action}.*`, p.detail];
  const money = budgetLine(p);
  if (money) out.push(`:warning: ${money}`);
  if (p.contacts?.length) {
    out.push('', `*${p.contacts.length} from ${p.contactsSource || 'CRM'}:*`);
    p.contacts.forEach((c) => out.push(`• *${c.name}* — ${c.line}`));
  }
  out.push('', `_${p.campaign}_`);
  return out.join('\n');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'POST only' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  if (!isPayload(body)) {
    res.status(400).json({ ok: false, error: 'Bad payload' });
    return;
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const slack = process.env.SLACK_WEBHOOK_URL;

  if (!(user && pass) && !slack) {
    res.status(200).json({ ok: true, simulated: true });
    return;
  }

  const channels: string[] = [];

  try {
    if (user && pass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `Marshall White campaign intelligence <${user}>`,
        to: process.env.NOTIFY_TO || user,
        subject: subject(body),
        text: textBody(body),
        html: htmlBody(body),
      });
      channels.push('email');
    }

    if (slack) {
      const slackRes = await fetch(slack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: slackBody(body) }),
      });
      if (slackRes.ok) channels.push('slack');
    }

    res.status(200).json({ ok: channels.length > 0, channels });
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}
