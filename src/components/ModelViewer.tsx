'use client';

import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  src: string;
  iosSrc?: string;
  alt: string;
  poster?: string;
}

export default function ModelViewer({ src, iosSrc, alt, poster }: ModelViewerProps) {
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import the model-viewer script on the client side
    import('@google/model-viewer').catch((error) => {
      console.error('Error loading @google/model-viewer:', error);
    });
  }, []);

  return (
    <div className="relative w-full aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
      {/* @ts-ignore */}
      <model-viewer
        ref={viewerRef}
        src={src}
        ios-src={iosSrc}
        alt={alt}
        poster={poster}
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        loading="lazy"
        style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
      >
        <div slot="progress-bar" className="absolute inset-0 flex items-center justify-center bg-white/50">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      {/* @ts-ignore */}
      </model-viewer>
    </div>
  );
}
