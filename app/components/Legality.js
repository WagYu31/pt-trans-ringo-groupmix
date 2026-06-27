'use client';

export default function Legality() {
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
        <div className="section-header">
          <span className="section-label">📄 Legalitas</span>
          <h2 className="section-title">Dokumen Legal &<br />Sertifikasi</h2>
          <p className="section-subtitle">
            PT. Trans Ringo Groupmix telah memenuhi seluruh persyaratan legalitas dan sertifikasi
            sebagai perusahaan yang terpercaya dan bertanggung jawab.
          </p>
        </div>

        <div className="legality-grid">
          {documents.map((doc, index) => (
            <div className="legality-card" key={index}>
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
