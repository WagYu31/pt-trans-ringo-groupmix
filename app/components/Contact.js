'use client';

import { useState } from 'react';

export default function Contact() {
  const [activeBranch, setActiveBranch] = useState('bekasi'); // 'bekasi' | 'bandung'

  const branches = {
    bekasi: {
      name: 'Plant Bekasi (Pusat)',
      address: 'Kp. Mareleng, Desa Bojongsari, Kec. Kedungwaringin, Kab. Bekasi, Jawa Barat',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15861.851694040508!2d107.24!3d-6.28!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e698fd447ec153f%3A0xc4805bb5f92ff48f!2sKedungwaringin%2C%20Bekasi%20Regency%2C%20West%20Java!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    },
    bandung: {
      name: 'Plant Bandung (Cabang)',
      address: 'Jl. Bojong Cibodas, Tanjunglaya, Kec. Rancaekek, Kab. Bandung, Jawa Barat, 40390',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15842.12351239841!2d107.78!3d-6.95!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c26fc49f506b%3A0x6bde1c713b190f84!2sRancaekek%2C%20Bandung%20Regency%2C%20West%20Java!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
    },
    cianjur: {
      name: 'Plant Cianjur (Cabang)',
      address: 'Jl. Raya Bandung-Cianjur, Kec. Karangtengah, Kab. Cianjur, Jawa Barat, 43281',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15849.791244342735!2d107.14!3d-6.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e6840d216f457ff%3A0x401e8f1fc28da70!2sCianjur%2C%20Cianjur%20Regency%2C%20West%20Java!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid',
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
      value: '0852-8328-1858',
      link: 'https://api.whatsapp.com/send?phone=6285283281858',
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
        <div className="section-header">
          <span className="section-label section-label-dark">📬 Kontak & Lokasi</span>
          <h2 className="section-title section-title-dark">Hubungi Kami</h2>
          <p className="section-subtitle section-subtitle-dark">
            Kami siap melayani kebutuhan beton ReadyMix dan material alam untuk proyek Anda. Hubungi tim marketing kami atau kunjungi Batching Plant terdekat.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-info-panel">
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
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentBranch.address)}`}
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

          <div className="contact-map">
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
