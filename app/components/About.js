'use client';

import Image from 'next/image';

export default function About() {
  return (
    <section className="section section-gradient" id="tentang">
      <div className="container">
        <div className="section-header reveal reveal-fade-up">
          <span className="section-label">✦ Tentang Kami</span>
          <h2 className="section-title">Mitra Terpercaya Anda dalam<br />Industri Beton & Konstruksi</h2>
          <p className="section-subtitle">
            Berdiri sejak 2024, kami berkomitmen menyediakan produk beton berkualitas tinggi
            dengan layanan yang handal dan profesional.
          </p>
        </div>

        <div className="about-grid">
          <div className="about-image-wrapper reveal reveal-fade-right">
            <div className="about-image">
              <Image
                src="/images/batching-plant.jpeg"
                alt="Batching Plant PT. Trans Ringo Groupmix"
                width={600}
                height={400}
                style={{ objectFit: 'cover', width: '100%' }}
              />
            </div>
            <div className="about-badge-float">
              <div className="about-badge-float-number">90</div>
              <div className="about-badge-float-text">M³ / Jam</div>
            </div>
          </div>

          <div className="about-content reveal reveal-fade-left">
            <h3>Berawal dari Supplier Material, Kini Menjadi Produsen Beton ReadyMix</h3>
            <p>
              PT. Trans Ringo Groupmix bergerak di bidang Supplier, Kontraktor, dan Beton ReadyMix (Beton Siap Jadi).
              Kami berawal dari supplier material alam yang telah mensupply material ke beberapa Batching Plant
              dan project baik BUMN maupun Swasta.
            </p>
            <p>
              Saat ini kami mendirikan Batching Plant dengan kapasitas 90M³ per jam, didukung oleh grup perusahaan
              yang berpengalaman. Manajemen kami memastikan operasional berjalan sesuai standar keamanan dan
              keselamatan dalam pelayanan kebutuhan konsumen.
            </p>

            <div className="about-features">
              <div className="about-feature">
                <div className="about-feature-icon">🏗️</div>
                <span className="about-feature-text">Batching Plant Modern</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🛡️</div>
                <span className="about-feature-text">Standar K3 Terjamin</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">🚚</div>
                <span className="about-feature-text">Armada Siap Kirim</span>
              </div>
              <div className="about-feature">
                <div className="about-feature-icon">⭐</div>
                <span className="about-feature-text">Grup Berpengalaman</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
