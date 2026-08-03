import type { ListingPhoto, PhotoGallery } from '../types';
import { C, S, T, hairline } from '../tokens';

interface Props {
  gallery: PhotoGallery;
  variant?: 'beside' | 'below'; // beside the campaign, or stacked under it
}

// Clears the sticky top bar (identity row plus progress strip, about 141px on
// desktop) so the rail parks just under it as the page scrolls.
const RAIL_TOP = 156;

function Tile({ photo }: { photo: ListingPhoto }) {
  const contain = photo.fit === 'contain';
  return (
    <figure style={{ margin: 0 }}>
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        style={{
          display: 'block',
          width: '100%',
          aspectRatio: contain ? '3 / 4' : '3 / 2',
          objectFit: contain ? 'contain' : 'cover',
          background: C.paper,
        }}
      />
      <figcaption
        style={{
          ...T.label,
          fontSize: 11,
          color: C.textMuted,
          padding: `${S.xs + 1}px 0 ${S.m}px`,
        }}
      >
        {photo.label}
      </figcaption>
    </figure>
  );
}

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
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: S.s,
          paddingBottom: S.s,
        }}
      >
        <span style={{ ...T.label, color: C.text }}>{gallery.title}</span>
        <span style={{ ...T.label, fontSize: 11, color: C.textFaint }}>
          {gallery.countLabel}
        </span>
      </div>

      <div
        style={{
          border: hairline,
          borderRadius: 4,
          padding: `${S.m}px ${S.m}px 0`,
          maxHeight: beside ? `calc(100vh - ${RAIL_TOP + 96}px)` : '60vh',
          overflowY: 'auto',
          background: C.paper,
        }}
      >
        {gallery.photos.map((p) => (
          <Tile key={p.src} photo={p} />
        ))}
      </div>

      <p style={{ ...T.caption, fontSize: 12, color: C.textFaint, marginTop: S.s }}>
        {gallery.caption}
      </p>
    </aside>
  );
}
