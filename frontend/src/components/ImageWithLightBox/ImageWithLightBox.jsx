import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';

export default function ImageWithLightbox({ src, alt }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        style={{
          cursor: 'zoom-in',
          maxWidth: '100%',
          borderRadius: 4,
        }}
        onClick={() => setOpen(true)}
      />
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src }]}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 2 }}
      />
    </>
  );
}