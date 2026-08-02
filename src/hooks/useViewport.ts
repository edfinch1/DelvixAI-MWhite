import { useEffect, useState } from 'react';

export function useViewport() {
  const [width, setWidth] = useState<number>(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return { width, isMobile: width < 768, isNarrow: width < 1024 };
}
