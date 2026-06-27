'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Brochures() {
  const [activeImage, setActiveImage] = useState(null);

  const brochures = [
    {
      id: 'main',
      title: 'Pamflet Resmi ReadyMix',
      desc: 'Brosur utama profil pelayanan beton ReadyMix PT. Trans Ringo Groupmix.',
      src: '/images/aset-trg/brochure-main.jpeg',
    },
    {
      id: 'grades-horizontal',
      title: 'Tabel Mutu Beton (Landscape)',
      desc: 'Panduan klasifikasi mutu beton beserta rekomendasi penggunaan konstruksi.',
      src: '/images/aset-trg/brochure-grade-horizontal.jpeg',
    },
    {
      id: 'grades-vertical',
      title: 'Spesifikasi & Mutu (Portrait)',
      desc: 'Daftar lengkap 19 klasifikasi mutu beton ReadyMix dan slump standard.',
      src: '/images/aset-trg/brochure-grade-vertical.jpeg',
    },
  ];

  return (
    <section className="section section-dark" id="brosur">
      {/* Decorative gradient overlay */}
      <div className="legality-bg-gradient"></div>
      
      <div className="container">
        <div className="section-header">
          <span className="section-label">📂 Media & Brosur</span>
          <h2 className="section-title">Dokumen & Brosur Resmi</h2>
          <p className="section-subtitle">
            Lihat dan unduh brosur resmi kami untuk panduan lengkap pemesanan ReadyMix, tabel mutu beton, dan informasi teknis lainnya.
          </p>
        </div>

        <div className="brochures-grid">
          {brochures.map((item) => (
            <div 
              className="brochure-card glass-card" 
              key={item.id}
              onClick={() => setActiveImage(item)}
            >
              <div className="brochure-preview-img">
                <Image
                  src={item.src}
                  alt={item.title}
                  width={380}
                  height={500}
                  style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                />
                <div className="brochure-hover-overlay">
                  <span className="zoom-icon">🔍</span>
                  <span className="zoom-text">Buka Dokumen</span>
                </div>
              </div>
              <div className="brochure-body">
                <h3 className="brochure-title">{item.title}</h3>
                <p className="brochure-desc">{item.desc}</p>
                <div className="brochure-action-link">
                  Lihat Detail Dokumen →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Lightbox Modal */}
      {activeImage && (
        <div className="lightbox-overlay" onClick={() => setActiveImage(null)}>
          <div className="lightbox-content-card" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setActiveImage(null)}>
              ✕
            </button>
            <div className="lightbox-image-container">
              <img 
                src={activeImage.src} 
                alt={activeImage.title} 
                className="lightbox-main-img"
              />
            </div>
            <div className="lightbox-footer">
              <div>
                <h4 className="lightbox-title">{activeImage.title}</h4>
                <p className="lightbox-desc">{activeImage.desc}</p>
              </div>
              <a 
                href={activeImage.src} 
                download={`PT-TRGMIX-${activeImage.id}.jpeg`}
                className="btn btn-primary lightbox-download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                📥 Unduh Gambar
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
