import type { ReactNode } from 'react';
import { C, S, T } from '../tokens';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Section({ title, subtitle, children }: Props) {
  return (
    <section style={{ marginBottom: S.xxl }}>
      <div style={{ borderTop: `1px solid ${C.line}`, paddingTop: S.l }}>
        <h2 style={{ ...T.sectionHeading, color: C.text }}>{title}</h2>
        {subtitle && (
          <p style={{ ...T.body, color: C.textMuted, marginTop: S.xs, maxWidth: 640 }}>
            {subtitle}
          </p>
        )}
      </div>
      <div style={{ marginTop: S.l }}>{children}</div>
    </section>
  );
}
