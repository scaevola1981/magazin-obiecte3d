import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BLOOMFORM • Print 3D Pro',
    short_name: 'BloomForm',
    description: 'Marketplace de printare 3D cu modele, materiale și comandă rapidă prin WhatsApp.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#a855f7',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
