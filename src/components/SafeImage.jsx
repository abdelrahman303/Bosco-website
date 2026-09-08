import { useState } from 'react';
import { FALLBACK_IMAGE, catalogImage } from '../utils/media';

export default function SafeImage({ src, alt = '', className = '', width = 800 }) {
  const [url, setUrl] = useState(() => catalogImage(src, width));

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (url !== FALLBACK_IMAGE) setUrl(FALLBACK_IMAGE);
      }}
    />
  );
}
