import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'PT. Trans Ringo Groupmix — Supplier, Kontraktor & Beton ReadyMix',
  description: 'PT. Trans Ringo Groupmix adalah perusahaan yang bergerak di bidang Supplier Material, Kontraktor, dan Beton ReadyMix dengan Batching Plant berkapasitas 90M³/jam. Melayani kebutuhan beton siap pakai untuk proyek BUMN maupun Swasta.',
  keywords: 'beton readymix, batching plant, supplier material, kontraktor, bekasi, jawa barat, beton siap pakai',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/images/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  alternates: {
    canonical: 'https://trgmix.com',
  },
  openGraph: {
    title: 'PT. Trans Ringo Groupmix',
    description: 'Supplier Material, Kontraktor & Beton ReadyMix Terpercaya',
    url: 'https://trgmix.com',
    siteName: 'PT. Trans Ringo Groupmix',
    images: [
      {
        url: 'https://trgmix.com/images/logo.jpeg',
        width: 400,
        height: 400,
        alt: 'PT. Trans Ringo Groupmix Logo',
      },
    ],
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {/* Google Analytics 4 (GA4) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PHW684H4L4"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PHW684H4L4');
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
