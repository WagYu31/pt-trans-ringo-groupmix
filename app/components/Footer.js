'use client';

import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { href: '#beranda', label: 'Beranda' },
    { href: '#tentang', label: 'Tentang Kami' },
    { href: '#visi-misi', label: 'Visi & Misi' },
    { href: '#layanan', label: 'Layanan' },
    { href: '#tim', label: 'Tim Kami' },
    { href: '#kontak', label: 'Kontak' },
  ];

  const services = [
    'Beton ReadyMix',
    'Supplier Material',
    'Kontraktor',
    'Batching Plant',
  ];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div style={{ marginBottom: '8px' }}>
              <Image
                src="/images/logo.jpeg"
                alt="Logo TRGMIX"
                width={160}
                height={60}
                style={{ objectFit: 'contain', height: '50px', width: 'auto' }}
              />
            </div>
            <p className="footer-brand-desc">
              Perusahaan yang bergerak di bidang supplier material alam, kontraktor,
              dan beton ReadyMix siap jadi. Didukung oleh batching plant modern dan
              grup perusahaan berpengalaman.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Menu</h4>
            {quickLinks.map((link) => (
              <a href={link.href} className="footer-link" key={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 className="footer-title">Layanan</h4>
            {services.map((service) => (
              <span className="footer-link" key={service}>
                {service}
              </span>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} <span className="footer-copy-highlight">PT. Trans Ringo Groupmix</span>. All rights reserved.
          </p>
          <p className="footer-copy">
            Kab. Bekasi, Jawa Barat — Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
