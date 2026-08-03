import type { CSSProperties } from 'react';

// Marshall White design tokens. See DESIGN.md, which is binding.
// Navy sampled from the REA report header bar; confirm against MW brand guide.

export const C = {
  // Surfaces
  ink: '#0B1B2B',
  inkSoft: '#152A3D',
  paper: '#FFFFFF',
  paperAlt: '#F7F8F9',
  line: '#E3E6E9',
  lineStrong: '#C9CFD5',
  gridline: '#EDEFF1',

  // Type
  text: '#0B1B2B',
  textMuted: '#5A6672',
  textFaint: '#8A939C',
  onInk: '#FFFFFF',
  onInkMuted: 'rgba(255,255,255,0.68)',

  // Signal. Data state only, never decoration.
  good: '#1F6F43',
  warn: '#B07A1E',
  bad: '#A32B2B',
  neutral: '#8A939C',

  // Accent. Navy, same as ink. No gold, no teal.
  accent: '#0B1B2B',
} as const;

export const FONT =
  "'Inter Variable', 'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

// 8px base grid
export const S = {
  xs: 4,
  s: 8,
  m: 12,
  base: 16,
  l: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const MAX_WIDTH = 1120;
export const RADIUS = 4; // maximum

export const T: Record<string, CSSProperties> = {
  display: {
    fontSize: 42,
    fontWeight: 550,
    letterSpacing: '-0.025em',
    lineHeight: 1.12,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 500,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },
  sectionHeading: {
    fontSize: 24,
    fontWeight: 550,
    letterSpacing: '-0.02em',
    lineHeight: 1.25,
  },
  pull: {
    fontSize: 26,
    fontWeight: 450,
    letterSpacing: '-0.015em',
    lineHeight: 1.42,
  },
  body: {
    fontSize: 15,
    fontWeight: 400,
    lineHeight: 1.55,
  },
  caption: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  statLarge: {
    fontSize: 48,
    fontWeight: 550,
    letterSpacing: '-0.025em',
    lineHeight: 1.05,
    fontVariantNumeric: 'tabular-nums',
  },
  scoreLarge: {
    fontSize: 84,
    fontWeight: 550,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    fontVariantNumeric: 'tabular-nums',
  },
  dataInline: {
    fontSize: 15,
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.01em',
    lineHeight: 1.4,
  },
  sectionNumber: {
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.02em',
    fontVariantNumeric: 'tabular-nums',
  },
};

export const hairline = `1px solid ${C.line}`;
