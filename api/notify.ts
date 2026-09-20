// Vercel serverless function: emails a task from the Today queue to the
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

import nodemailer from 'nodemailer';

interface Evidence {
  system: string;
  fact: string;
}

interface NotifyPayload {
  assignee: string;
  action: string;
  detail: string;
  campaign: string;
  evidence: Evidence[];
  rule: string;
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

function textBody(p: NotifyPayload): string {
  const evidence = p.evidence
    .map((e) => `- ${e.system}: ${e.fact}`)
    .join('\n');
  return [
    p.campaign,
    '',
    p.action,
    p.detail,
    '',
    'Why this fired:',
    evidence,
    '',
    p.rule,
    '',
    'Marshall White campaign intelligence',
  ].join('\n');
}

function htmlBody(p: NotifyPayload): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const evidence = p.evidence
    .map(
      (e) =>
        `<li style="margin:2px 0"><strong>${esc(e.system)}:</strong> ${esc(e.fact)}</li>`,
    )
    .join('');
  return `
  <div style="font-family:Inter,-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#0B1B2B;max-width:560px">
    <p style="font-size:13px;color:#5A6672;margin:0 0 4px">${esc(p.campaign)}</p>
    <p style="font-size:17px;font-weight:600;margin:0">${esc(p.action)}</p>
    <p style="font-size:14px;color:#5A6672;margin:4px 0 16px">${esc(p.detail)}</p>
    <p style="font-size:13px;font-weight:600;margin:0 0 4px">Why this fired</p>
    <ul style="font-size:13px;color:#5A6672;margin:0;padding-left:18px">${evidence}</ul>
    <p style="font-size:12px;color:#8A939C;margin:16px 0 0">${esc(p.rule)}</p>
    <p style="font-size:12px;color:#8A939C;margin:16px 0 0;border-top:1px solid #E3E6E9;padding-top:8px">
      Marshall White campaign intelligence
    </p>
  </div>`;
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
        subject: `Task for ${body.assignee}: ${body.action}`,
        text: textBody(body),
        html: htmlBody(body),
      });
      channels.push('email');
    }

    if (slack) {
      const evidence = body.evidence
        .map((e: Evidence) => `• ${e.system}: ${e.fact}`)
        .join('\n');
      const slackRes = await fetch(slack, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*Task for ${body.assignee}: ${body.action}*\n${body.campaign}\n${evidence}\n_${body.rule}_`,
        }),
      });
      if (slackRes.ok) channels.push('slack');
    }

    res.status(200).json({ ok: channels.length > 0, channels });
  } catch (err) {
    res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}
