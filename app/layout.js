import './globals.css';

export const metadata = {
  metadataBase: new URL('https://trgmix.com'),
  title: 'PT. Trans Ringo Groupmix — Supplier, Kontraktor & Beton ReadyMix',
  description: 'PT. Trans Ringo Groupmix adalah perusahaan yang bergerak di bidang Supplier Material, Kontraktor, dan Beton ReadyMix dengan Batching Plant berkapasitas 90M³/jam. Melayani kebutuhan beton siap pakai untuk proyek BUMN maupun Swasta.',
  keywords: 'beton readymix, batching plant, supplier material, kontraktor, bekasi, jawa barat, beton siap pakai',
  openGraph: {
    title: 'PT. Trans Ringo Groupmix',
    description: 'Supplier Material, Kontraktor & Beton ReadyMix Terpercaya',
    type: 'website',
    images: [
      {
        url: '/images/logo.jpeg',
        width: 400,
        height: 400,
        alt: 'PT. Trans Ringo Groupmix Logo',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
