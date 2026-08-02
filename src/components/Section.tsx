import type { ReactNode } from 'react';
import { C, S, T } from '../tokens';
import { useViewport } from '../hooks/useViewport';

interface Props {
  number: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function Section({ number, title, subtitle, children }: Props) {
  const { isMobile } = useViewport();

  return (
    <section style={{ marginBottom: isMobile ? S.xxl : S.xxxl }}>
      <div
        style={{
          borderTop: `1px solid ${C.lineStrong}`,
          paddingTop: S.l,
          display: isMobile ? 'block' : 'grid',
          gridTemplateColumns: '72px 1fr',
          columnGap: S.l,
        }}
      >
        <div
          style={{
            ...T.sectionNumber,
            color: C.textFaint,
            marginBottom: isMobile ? S.s : 0,
            paddingTop: isMobile ? 0 : 5,
          }}
        >
          {number}
        </div>
        <div>
          <h2
            style={{
              ...T.sectionHeading,
              fontSize: isMobile ? 21 : 24,
              color: C.text,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ ...T.body, color: C.textMuted, marginTop: S.s, maxWidth: 620 }}>
              {subtitle}
            </p>
          )}
          <div style={{ marginTop: S.l }}>{children}</div>
        </div>
      </div>
    </section>
  );
}
