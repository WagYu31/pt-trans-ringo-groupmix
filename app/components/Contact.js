'use client';

import { useState } from 'react';

export default function Contact() {
  const [activeBranch, setActiveBranch] = useState('bekasi'); // 'bekasi' | 'bandung'

  const branches = {
    bekasi: {
      name: 'Plant Bekasi (Pusat)',
      address: 'Kp. Mareleng, Desa Bojongsari, Kec. Kedungwaringin, Kab. Bekasi, Jawa Barat',
      mapUrl: 'https://maps.google.com/maps?q=-6.2681537,107.2562497+(PT.%20Trans%20Ringo%20Group)&t=&z=17&ie=UTF8&iwloc=&output=embed',
      shareUrl: 'https://share.google/RWjTc3gG7EA65Pan5',
    },
    bandung: {
      name: 'Plant Bandung (Cabang)',
      address: 'Jl. Bojong Cibodas, Tanjunglaya, Kec. Rancaekek, Kab. Bandung, Jawa Barat, 40390',
      mapUrl: 'https://maps.google.com/maps?q=-6.9910863,107.8216306+(PT.%20Trans%20Ringo%20Group%202)&t=&z=17&ie=UTF8&iwloc=&output=embed',
      shareUrl: 'https://share.google/OF1r9GxCg4xPLqSbf',
    },
    cianjur: {
      name: 'Plant Cianjur (Cabang)',
      address: 'Jl. Raya Bandung-Cianjur, Kec. Karangtengah, Kab. Cianjur, Jawa Barat, 43281',
      mapUrl: 'https://maps.google.com/maps?q=-6.8057818,107.1652396+(PT.%20TRANS%20RINGO%20GROUP)&t=&z=17&ie=UTF8&iwloc=&output=embed',
      shareUrl: 'https://share.google/D1pcEc3GOV2HVKGJI',
    }
  };

  const currentBranch = branches[activeBranch];

  const globalContact = [
    {
      icon: '📧',
      label: 'Email Resmi',
      value: 'pttransringogroupmix@gmail.com',
      link: 'mailto:pttransringogroupmix@gmail.com',
    },
    {
      icon: '📞',
      label: 'Telepon & WhatsApp',
      value: '0821-2292-5850',
      link: 'https://api.whatsapp.com/send?phone=6282122925850',
    },
    {
      icon: '📸',
      label: 'Instagram',
      value: '@transringogroup',
      link: 'https://www.instagram.com/transringogroup',
    },
    {
      icon: '🎵',
      label: 'TikTok',
      value: '@transringogroup',
      link: 'https://www.tiktok.com/@transringogroup',
    },
  ];

  return (
    <section className="section section-light" id="kontak">
      <div className="container">
        <div className="section-header reveal reveal-fade-up">
          <span className="section-label section-label-dark">📬 Kontak & Lokasi</span>
          <h2 className="section-title section-title-dark">Hubungi Kami</h2>
          <p className="section-subtitle section-subtitle-dark">
            Kami siap melayani kebutuhan beton ReadyMix dan material alam untuk proyek Anda. Hubungi tim marketing kami atau kunjungi Batching Plant terdekat.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel reveal reveal-fade-right">
            {/* Cabang Selector */}
            <div className="branch-selector-container">
              <h4 className="branch-title">Lokasi Batching Plant / Cabang:</h4>
              <div className="branch-tabs">
                <button
                  className={`branch-tab-btn ${activeBranch === 'bekasi' ? 'active' : ''}`}
                  onClick={() => setActiveBranch('bekasi')}
                >
                  📍 Cabang Bekasi
                </button>
                <button
                  className={`branch-tab-btn ${activeBranch === 'bandung' ? 'active' : ''}`}
                  onClick={() => setActiveBranch('bandung')}
                >
                  📍 Cabang Bandung
                </button>
                <button
                  className={`branch-tab-btn ${activeBranch === 'cianjur' ? 'active' : ''}`}
                  onClick={() => setActiveBranch('cianjur')}
                >
                  📍 Cabang Cianjur
                </button>
              </div>

              {/* Active Branch Address Card */}
              <div className="active-branch-card">
                <h5 className="active-branch-name">{currentBranch.name}</h5>
                <p className="active-branch-address">{currentBranch.address}</p>
                <a 
                  href={currentBranch.shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="branch-maps-link"
                >
                  🗺️ Buka di Google Maps ↗
                </a>
              </div>
            </div>

            {/* Hubungi Kami Section */}
            <div className="global-contact-list">
              <h4 className="branch-title">Saluran Komunikasi Resmi:</h4>
              <div className="contact-info-cards">
                {globalContact.map((info, index) => (
                  <a 
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-info-card interactive-contact-card" 
                    key={index}
                  >
                    <div className="contact-info-icon">{info.icon}</div>
                    <div>
                      <div className="contact-info-label">{info.label}</div>
                      <div className="contact-info-value">{info.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-map reveal reveal-fade-left">
            <div className="map-badge">Live Map: {currentBranch.name}</div>
            <iframe
              src={currentBranch.mapUrl}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Lokasi PT. Trans Ringo Groupmix - ${currentBranch.name}`}
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
