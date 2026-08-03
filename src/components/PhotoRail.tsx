import type { PhotoGallery } from '../types';
import { C, S, hairline } from '../tokens';

interface Props {
  gallery: PhotoGallery;
  variant?: 'beside' | 'below'; // beside the campaign, or stacked under it
}

// Clears the sticky top bar (identity row plus progress strip, about 141px on
// desktop) so the reel parks just under it as the page scrolls.
const RAIL_TOP = 156;

export default function PhotoRail({ gallery, variant = 'beside' }: Props) {
  const beside = variant === 'beside';
  return (
    <aside
      style={
        beside
          ? {
              position: 'sticky',
              top: RAIL_TOP,
              width: 'clamp(240px, 22vw, 340px)',
              flex: '0 0 auto',
            }
          : { width: '100%', maxWidth: 480 }
      }
    >
      <div
        style={{
          border: hairline,
          borderRadius: 4,
          padding: S.m,
          display: 'flex',
          flexDirection: 'column',
          gap: S.m,
          maxHeight: beside ? `calc(100vh - ${RAIL_TOP + 48}px)` : '60vh',
          overflowY: 'auto',
          background: C.paper,
        }}
      >
        {gallery.photos.map((p) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            loading="lazy"
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: p.fit === 'contain' ? '3 / 4' : '3 / 2',
              objectFit: p.fit === 'contain' ? 'contain' : 'cover',
              background: C.paper,
            }}
          />
        ))}
      </div>
    </aside>
  );
}
