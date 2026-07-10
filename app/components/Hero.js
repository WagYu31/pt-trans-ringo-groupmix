'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const images = [
    '/images/hero-bg.png',
    '/images/aset-trg/fleet-trucks.jpeg',
  ];

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section className="hero" id="beranda">
      <div className="hero-bg">
        {images.map((src, idx) => (
          <div
            key={src}
            className={`hero-bg-slide ${idx === currentIdx ? 'active' : ''}`}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentIdx ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <Image
              src={src}
              alt={`Batching Plant PT. Trans Ringo Groupmix - Slide ${idx + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={idx === 0}
              quality={85}
            />
          </div>
        ))}
      </div>
      <div className="hero-overlay"></div>

      {/* Ambient lights for deep glowing design */}
      <div className="ambient-glow gold-glow"></div>
      <div className="ambient-glow blue-glow"></div>

      <div className="container">
        <div className="hero-content-executive">
          <div className="hero-brand-label" style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span>
              <span style={{ color: '#2c935c', fontWeight: '900' }}>PT. TRANS</span>{' '}
              <span style={{ color: '#206db5', fontWeight: '900' }}>RINGO</span>{' '}
              <span style={{ color: '#db5665', fontWeight: '900' }}>GROUPMIX</span>
            </span>
            <span style={{ fontSize: '13px', background: 'rgba(212, 160, 41, 0.15)', border: '1px solid var(--gold-400)', color: 'var(--gold-300)', padding: '5px 14px', borderRadius: '100px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
              ★ ISO 9001 &amp; SNI Certified
            </span>
          </div>

          <h1 className="hero-title-modern">
            Penyedia Beton ReadyMix<br />
            &amp; Kontraktor Terpercaya
          </h1>

          <div className="hero-slogan">
            <span className="slogan-line"></span>
            Tepat Waktu, Tepat Kualitas
          </div>

          <p className="hero-description-executive">
            Perusahaan terpercaya yang bergerak di bidang supplier material alam, kontraktor,
            dan beton ReadyMix siap jadi. Didukung oleh batching plant modern berkapasitas tinggi
            dan grup perusahaan berpengalaman.
          </p>

          <div className="hero-actions-executive">
            <a href="#kontak" className="btn btn-primary btn-glow">
              ✉ Hubungi Kami
            </a>
            <a href="#tentang" className="btn btn-outline btn-glass-outline">
              Pelajari Lebih Lanjut →
            </a>
          </div>
        </div>

        {/* Horizontal Stats Ribbon at the Bottom of Hero */}
        <div className="hero-stats-horizontal">
          <div className="hero-stat-col">
            <div className="hero-stat-val">90 M³</div>
            <div className="hero-stat-lbl">Kapasitas / Jam</div>
          </div>
          <div className="hero-stat-col">
            <div className="hero-stat-val">Hino, Isuzu & FAW</div>
            <div className="hero-stat-lbl">Armada Truk Mixer</div>
          </div>
          <div className="hero-stat-col">
            <div className="hero-stat-val">3 Cabang</div>
            <div className="hero-stat-lbl">Bekasi, Bandung & Cianjur</div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span>Scroll</span>
        <div className="hero-scroll-line"></div>
      </div>
    </section>
  );
}
