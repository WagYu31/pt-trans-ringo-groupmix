'use client';

export default function Legality() {
  const certifications = [
    {
      badge: 'ISO 9001:2015',
      title: 'Sistem Manajemen Mutu',
      detail: 'Standardisasi Internasional (Quality Management)',
      number: 'Sertifikasi Konsistensi Mutu & Layanan',
      icon: '🏆',
    },
    {
      badge: 'ISO 14001:2015',
      title: 'Manajemen Lingkungan',
      detail: 'Pencegahan Polusi & Aspek Dampak Lingkungan',
      number: 'Sertifikasi Operasional Ramah Lingkungan',
      icon: '🍃',
    },
    {
      badge: 'ISO 45001:2018',
      title: 'Sistem K3 Konstruksi',
      detail: 'Sistem Manajemen Keselamatan & Kesehatan Kerja',
      number: 'Sertifikasi Keamanan & Keselamatan Kerja',
      icon: '🛡️',
    },
    {
      badge: 'SNI B1',
      title: 'Standar Nasional Indonesia',
      detail: 'Spesifikasi Teknis Beton Struktural & Mutu Khusus',
      number: 'SNI 2847:2019 & SNI 1974:2011',
      icon: '🇮🇩',
    },
  ];

  const documents = [
    {
      icon: '📜',
      title: 'Akta Pendirian',
      detail: 'Notaris: Sheila Qurrotul Aini, S.H., M.Kn',
      number: 'No. 10 — 24 Oktober 2024',
    },
    {
      icon: '🏛️',
      title: 'Pencatatan Sipil',
      detail: 'Kementerian Hukum dan HAM RI',
      number: 'AHU-0085005.AH.01.01.TAHUN 2024',
    },
    {
      icon: '📋',
      title: 'NIB',
      detail: 'Nomor Induk Berusaha',
      number: '2810240112244',
    },
    {
      icon: '💰',
      title: 'NPWP',
      detail: 'Nomor Pokok Wajib Pajak',
      number: '12.486.727.6-414.000',
    },
    {
      icon: '📍',
      title: 'Surat Domisili',
      detail: 'Kp. Mareleng, Bojongsari, Kedungwaringin, Bekasi',
      number: 'Terdaftar & Terverifikasi',
    },
    {
      icon: '🏅',
      title: 'Sertifikat TKDN',
      detail: 'Tingkat Komponen Dalam Negeri',
      number: 'Tersertifikasi',
    },
  ];

  return (
    <section className="section section-dark" id="legalitas">
      <div className="container">
        
        {/* ISO & SNI Certification Grid */}
        <div className="section-header reveal reveal-fade-up">
          <span className="section-label">★ Standarisasi Mutu</span>
          <h2 className="section-title">Sertifikasi &amp; Standar ISO / SNI</h2>
          <p className="section-subtitle">
            Seluruh operasional Batching Plant dan manajemen PT. Trans Ringo Groupmix diproduksi dengan standar mutu internasional guna menjamin kepuasan mitra kerja.
          </p>
        </div>

        <div className="certifications-grid" style={{ marginBottom: '64px' }}>
          {certifications.map((cert, index) => (
            <div className={`legality-card cert-card reveal reveal-fade-up reveal-delay-${(index % 4) * 100 + 100}`} key={index}>
              <div className="legality-card-icon" style={{ background: 'rgba(212, 160, 41, 0.12)', color: 'var(--gold-500)' }}>{cert.icon}</div>
              <span className="cert-badge-tag">{cert.badge}</span>
              <h3 className="legality-card-title">{cert.title}</h3>
              <p className="legality-card-detail">{cert.detail}</p>
              <span className="legality-card-number">{cert.number}</span>
            </div>
          ))}
        </div>

        {/* Legal Izin & Documents Grid */}
        <div className="section-header reveal reveal-fade-up" style={{ marginTop: '30px' }}>
          <span className="section-label">📄 Legalitas Hukum</span>
          <h2 className="section-title">Dokumen Legal &amp; Izin Usaha</h2>
          <p className="section-subtitle">
            Kepatuhan hukum terhadap seluruh izin usaha dan regulasi pemerintah Indonesia untuk kemitraan bisnis yang aman, profesional, dan tepercaya.
          </p>
        </div>

        <div className="legality-grid">
          {documents.map((doc, index) => (
            <div className={`legality-card reveal reveal-fade-up reveal-delay-${(index % 3) * 100 + 100}`} key={index}>
              <div className="legality-card-icon">{doc.icon}</div>
              <h3 className="legality-card-title">{doc.title}</h3>
              <p className="legality-card-detail">{doc.detail}</p>
              <span className="legality-card-number">{doc.number}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
