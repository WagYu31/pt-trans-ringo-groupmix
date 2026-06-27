'use client';

import Image from 'next/image';

export default function Clients() {
  const BumnClients = [
    { name: 'WASKITA KARYA', tag: 'BUMN Konstruksi', src: '/images/logos/waskita.svg' },
    { name: 'ADHI KARYA', tag: 'BUMN Konstruksi', src: '/images/logos/adhi.png' },
    { name: 'WIJAYA KARYA', tag: 'BUMN Konstruksi', src: '/images/logos/wika.svg' },
    { name: 'PP KONTRAKTOR', tag: 'BUMN API', src: '/images/logos/pp.svg' },
    { name: 'HUTAMA KARYA', tag: 'BUMN Infrastruktur', src: '/images/logos/hutama.svg' },
    { name: 'BRANTAS ABIPRAYA', tag: 'BUMN Sumber Daya', src: '/images/logos/brantas.jpg' },
  ];

  const PrivateClients = [
    { name: 'ARTHA GRAHA', tag: 'Developer Swasta', src: '/images/logos/arthagraha.png' },
    { name: 'CIPUTRA GROUP', tag: 'Developer Swasta', src: '/images/logos/ciputra.svg' },
    { name: 'LIPPO LAND', tag: 'Developer Swasta', src: '/images/logos/lippo.svg' },
    { name: 'SUMMARECON', tag: 'Developer Swasta', src: '/images/logos/summarecon.svg' },
    { name: 'SAYAP MAS UTAMA', tag: 'Klien Industri', src: '/images/logos/sayapmas.svg' },
    { name: 'SINAR MAS LAND', tag: 'Developer Swasta', src: '/images/logos/sinarmas.png' },
  ];

  return (
    <section className="section section-dark px-glow" id="klien-mitra" style={{ padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      
      {/* Dynamic Glowing Accents behind cards */}
      <div className="clients-glow-left"></div>
      <div className="clients-glow-right"></div>

      <div className="container">
        <div className="section-header" style={{ marginBottom: '50px' }}>
          <span className="section-label">✦ Kolaborasi Strategis</span>
          <h2 className="section-title text-larger">Klien &amp; Mitra Terpercaya</h2>
          <p className="section-subtitle subtitle-wider">
            Berkomitmen penuh menyediakan mutu beton ReadyMix terbaik serta ketersediaan material alam berkualitas tinggi 
            untuk menyukseskan berbagai proyek konstruksi BUMN maupun Swasta di seluruh Indonesia.
          </p>
        </div>

        {/* Row 1: BUMN Clients (Scroll Left) */}
        <div className="marquee-label-row">
          <span className="marquee-group-label">🏛️ INFRASTRUKTUR BUMN</span>
        </div>
        <div className="partner-marquee-wrapper wrapper-left">
          <div className="partner-marquee-track track-left">
            {/* First Set */}
            {BumnClients.map((partner, index) => (
              <div className="partner-logo-card glass-card card-large" key={`bumn-1-${index}`}>
                <div className="partner-logo-icon icon-large logo-real-container">
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="partner-logo-info">
                  <span className="partner-logo-name name-large">{partner.name}</span>
                  <span className="partner-logo-tag tag-large">{partner.tag}</span>
                </div>
              </div>
            ))}
            {/* Duplicated Set for Seamless Loop */}
            {BumnClients.map((partner, index) => (
              <div className="partner-logo-card glass-card card-large" key={`bumn-2-${index}`}>
                <div className="partner-logo-icon icon-large logo-real-container">
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="partner-logo-info">
                  <span className="partner-logo-name name-large">{partner.name}</span>
                  <span className="partner-logo-tag tag-large">{partner.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Private/Developer Clients (Scroll Right) */}
        <div className="marquee-label-row" style={{ marginTop: '30px' }}>
          <span className="marquee-group-label">🏙️ DEVELOPER &amp; SEKTOR SWASTA</span>
        </div>
        <div className="partner-marquee-wrapper wrapper-right">
          <div className="partner-marquee-track track-right">
            {/* First Set */}
            {PrivateClients.map((partner, index) => (
              <div className="partner-logo-card glass-card card-large" key={`pvt-1-${index}`}>
                <div className="partner-logo-icon icon-large logo-real-container">
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="partner-logo-info">
                  <span className="partner-logo-name name-large">{partner.name}</span>
                  <span className="partner-logo-tag tag-large">{partner.tag}</span>
                </div>
              </div>
            ))}
            {/* Duplicated Set for Seamless Loop */}
            {PrivateClients.map((partner, index) => (
              <div className="partner-logo-card glass-card card-large" key={`pvt-2-${index}`}>
                <div className="partner-logo-icon icon-large logo-real-container">
                  <Image
                    src={partner.src}
                    alt={`${partner.name} logo`}
                    width={40}
                    height={40}
                    style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                  />
                </div>
                <div className="partner-logo-info">
                  <span className="partner-logo-name name-large">{partner.name}</span>
                  <span className="partner-logo-tag tag-large">{partner.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subtext info */}
        <div className="partner-notes" style={{ textAlign: 'center', marginTop: '45px' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '14px', fontStyle: 'italic', letterSpacing: '0.5px' }}>
            * Koordinasi pengiriman beton ReadyMix &amp; supply material terintegrasi 24 jam dengan sistem K3 &amp; jaminan kualitas mutu di setiap lokasi batching plant.
          </p>
        </div>
      </div>
    </section>
  );
}
