'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Services() {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'concrete'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Kalkulator States
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [thickness, setThickness] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('K-300');
  const [safetyFactor, setSafetyFactor] = useState(10); // default 10% safety margin
  const [customerName, setCustomerName] = useState('');
  const [projectAddress, setProjectAddress] = useState('');
  const [picPhone, setPicPhone] = useState('');

  const services = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <rect x="4" y="3" width="6" height="12" rx="1" />
          <path d="M4 15l3 4v0l3-4M7 19v3" />
          <path d="M10 12l10 6" />
          <circle cx="17" cy="10" r="3" />
          <path d="M14 10h6" />
        </svg>
      ),
      title: 'Beton ReadyMix',
      desc: 'Penyedia beton siap pakai berkualitas tinggi dengan Batching Plant berkapasitas 90M³/jam. Melayani kebutuhan beton untuk proyek BUMN maupun Swasta dengan standar mutu terjamin.',
      image: '/images/truck-mixer.jpeg',
      actionLabel: 'Katalog & Kalkulator',
      actionType: 'tab',
      target: 'concrete',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="M3 13V8h11l2 5H3z" />
          <path d="M14 13h4l3 2v3h-7v-5z" />
          <path d="M2 13a4 4 0 0 1 4-4h2" />
          <circle cx="6.5" cy="18.5" r="2.5" />
          <circle cx="15.5" cy="18.5" r="2.5" />
        </svg>
      ),
      title: 'Supplier Material',
      desc: 'Supplier material alam terpercaya yang telah mensupply ke berbagai Batching Plant dan proyek konstruksi. Menyediakan pasir, batu split, agregat, dan material konstruksi lainnya.',
      image: '/images/fleet.jpeg',
      actionLabel: 'Hubungi Supplier',
      actionType: 'whatsapp',
      message: 'Halo TRGMIX, saya ingin berkonsultasi mengenai supply material alam (pasir, batu, split, dll) untuk proyek saya.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
          <path d="M5 22V2h4" />
          <path d="M2 5h18l2 3H5" />
          <path d="M17 8v5" />
          <path d="M15 13h4l-2 3z" />
          <path d="M9 22v-8h5v8" />
        </svg>
      ),
      title: 'Kontraktor',
      desc: 'Jasa kontraktor profesional untuk berbagai proyek pembangunan. Didukung oleh tim berpengalaman dan peralatan modern untuk hasil konstruksi berkualitas.',
      image: '/images/project-concrete.jpeg',
      actionLabel: 'Konsultasi Jasa',
      actionType: 'whatsapp',
      message: 'Halo TRGMIX, saya ingin berkonsultasi mengenai jasa kontraktor / pengecoran konstruksi untuk proyek saya.',
    },
  ];

  const concreteGrades = [
    // Mutu Ringan
    { no: 1, name: 'B0', fc: '-', slump: '12 ± 2 cm', category: 'ringan', desc: 'Pekerjaan non-struktural seperti lantai kerja (lean concrete), rabat beton, dasaran paving block.' },
    { no: 2, name: 'K-100', fc: '8.13 MPa', slump: '12 ± 2 cm', category: 'ringan', desc: 'Konstruksi non-struktural ringan, perataan lantai dasar, timbunan kembali.' },
    { no: 3, name: 'K-125', fc: '10.17 MPa', slump: '12 ± 2 cm', category: 'ringan', desc: 'Pengecoran lantai dasar, pelindung pipa, pembesian pondasi ringan.' },
    { no: 4, name: 'K-150', fc: '12.20 MPa', slump: '12 ± 2 cm', category: 'ringan', desc: 'Pondasi pagar, lantai kerja garasi, jalan dengan muatan sangat ringan.' },
    { no: 5, name: 'K-175', fc: '14.24 MPa', slump: '12 ± 2 cm', category: 'ringan', desc: 'Pondasi rumah tinggal 1 lantai, cor jalan setapak, pasangan bata.' },
    { no: 6, name: 'K-225', fc: '18.30 MPa', slump: '12 ± 2 cm', category: 'ringan', desc: 'Struktur rumah tinggal 1 lantai (kolom, balok, pelat lantai), jalan lingkungan.' },
    
    // Mutu Menengah
    { no: 7, name: 'K-250', fc: '20.34 MPa', slump: '12 ± 2 cm', category: 'menengah', desc: 'Pengecoran dak rumah tinggal 2 lantai, ruko, kolom struktural, tangga.' },
    { no: 8, name: 'K-275', fc: '22.37 MPa', slump: '12 ± 2 cm', category: 'menengah', desc: 'Struktur beton bertulang sedang, jalan perumahan, area parkir kendaraan sedang.' },
    { no: 9, name: 'K-300', fc: '24.40 MPa', slump: '12 ± 2 cm', category: 'menengah', desc: 'Jalan raya kelas kabupaten, lantai pabrik/gudang beban sedang, pelat jembatan sedang.' },
    { no: 10, name: 'K-325', cy: '26.44 MPa', slump: '12 ± 2 cm', category: 'menengah', fc: '26.44 MPa', desc: 'Kolom & balok bentang panjang, struktur pelabuhan/gudang, slab beton heavy duty.' },
    { no: 11, name: 'K-350', fc: '28.47 MPa', slump: '12 ± 2 cm', category: 'menengah', desc: 'Beton pratekan, struktur rigid pavement jalan provinsi, kolam renang besar.' },

    // Mutu Tinggi
    { no: 12, name: 'K-375', fc: '30.50 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Struktur gedung bertingkat tinggi (high-rise building), jembatan bentang panjang.' },
    { no: 13, name: 'K-400', fc: '32.54 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Struktur jembatan bentang panjang, landasan pacu (runway) bandara, pelabuhan laut.' },
    { no: 14, name: 'K-425', fc: '34.57 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Konstruksi khusus lepas pantai (offshore structure), tiang pancang besar, silo.' },
    { no: 15, name: 'K-450', fc: '36.50 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Struktur heavy-duty penahan beban ekstrim, bendungan air, terowongan bawah tanah.' },
    { no: 16, name: 'K-475', fc: '38.64 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Beton khusus dengan kekuatan sangat tinggi untuk infrastruktur strategis nasional.' },
    { no: 17, name: 'K-500', fc: '40.67 MPa', slump: '12 ± 2 cm', category: 'tinggi', desc: 'Tiang pancang utama jembatan layang (flyover), beton precast mutu tinggi, reaktor.' },

    // Mutu Khusus
    { no: 18, name: 'FS 35', fc: 'Flexural Strength', slump: '12 ± 2 cm', category: 'khusus', desc: 'Beton spesifikasi lentur untuk Rigid Pavement jalan tol dan bandara beban berat.' },
    { no: 19, name: 'FS 45', fc: 'Flexural Strength', slump: '12 ± 2 cm', category: 'khusus', desc: 'Spesifikasi lentur tinggi untuk landasan pesawat militer dan rigid heavy load.' },
  ];

  // Kalkulasi Volume
  const rawVolume = length && width && thickness ? parseFloat(length) * parseFloat(width) * parseFloat(thickness) : 0;
  const calculatedVolume = rawVolume * (1 + parseFloat(safetyFactor) / 100);
  const estTruckLarge = Math.ceil(calculatedVolume / 7); // Truk besar ~7 m3
  const estTruckSmall = Math.ceil(calculatedVolume / 3); // Truk kecil ~3 m3

  const handleSelectGrade = (gradeName) => {
    setSelectedGrade(gradeName);
    // Scroll smoothly to calculator container
    const calcElement = document.getElementById('beton-calculator');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppOrder = () => {
    const message = `Halo TRGMIX, saya tertarik dengan beton ReadyMix Anda.

*Detail Pemesan:*
1. Nama Pemesan: ${customerName || '-'}
2. Alamat Proyek: ${projectAddress || '-'}
3. Nama PIC / No Telf: ${picPhone || '-'}

*Perkiraan Kebutuhan Beton:*
- Mutu Beton: ${selectedGrade}
- Ukuran Proyek: ${length || 0}m x ${width || 0}m x ${thickness || 0}m
- Volume Bersih: ${rawVolume.toFixed(2)} m³
- Kebutuhan Riil (Safety Margin ${safetyFactor}%): *${calculatedVolume.toFixed(2)} m³*
- Estimasi Armada:
  👉 ~${estTruckLarge} Truk Besar (Kapasitas 7m³) atau
  👉 ~${estTruckSmall} Truk Kecil / Minimix (Kapasitas 3m³)

Mohon kirimkan informasi harga terbaik dan jadwal pengiriman untuk lokasi saya.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=6285283281858&text=${encodedMessage}`, '_blank');
  };

  const handleServiceAction = (service) => {
    if (service.actionType === 'tab') {
      setActiveTab(service.target);
      setTimeout(() => {
        const catalogElement = document.querySelector('.concrete-catalog-wrapper');
        if (catalogElement) {
          catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (service.actionType === 'whatsapp') {
      const encodedMessage = encodeURIComponent(service.message);
      window.open(`https://api.whatsapp.com/send?phone=6285283281858&text=${encodedMessage}`, '_blank');
    }
  };

  // Filter grade list
  const filteredGrades = concreteGrades.filter(grade => {
    const matchesCategory = selectedCategory === 'all' || grade.category === selectedCategory;
    const matchesSearch = grade.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          grade.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="section section-light" id="layanan">
      <div className="container">
        <div className="section-header">
          <span className="section-label section-label-dark">★ Layanan Kami</span>
          <h2 className="section-title section-title-dark">Solusi Lengkap untuk<br />Kebutuhan Konstruksi Anda</h2>
          <p className="section-subtitle section-subtitle-dark">
            Kami menyediakan layanan komprehensif dari supply material alam, jasa kontraktor, hingga beton ReadyMix siap pakai.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="tabs-container">
          <div className="services-tabs">
            <button 
              className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
              onClick={() => setActiveTab('services')}
            >
              <svg className="tab-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
              Layanan & Jasa Konstruksi
            </button>
            <button 
              className={`tab-btn ${activeTab === 'concrete' ? 'active' : ''}`}
              onClick={() => setActiveTab('concrete')}
            >
              <svg className="tab-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="9" y1="9" x2="15" y2="9" />
                <line x1="9" y1="13" x2="15" y2="13" />
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              Katalog Mutu Beton & Kalkulator
            </button>
          </div>
        </div>

        {activeTab === 'services' ? (
          /* JASA & LAYANAN TAB */
          <div className="services-grid">
            {services.map((service, index) => (
              <div 
                className="service-card" 
                key={index}
                onClick={() => handleServiceAction(service)}
              >
                <div className="service-card-image">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={400}
                    height={220}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div className="service-card-image-overlay"></div>
                </div>
                <div className="service-card-body">
                  <div className="service-card-icon">{service.icon}</div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <p className="service-card-desc">{service.desc}</p>
                </div>
                <div className="service-card-footer">
                  <span className="service-card-link">
                    {service.actionLabel}
                    <svg className="link-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* KATALOG MUTU BETON & KALKULATOR TAB */
          <div className="concrete-catalog-wrapper">
            
            {/* ISO / SNI Compliance Info Banner */}
            <div className="compliance-banner">
              <div className="compliance-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 11l2 2 4-4"/>
                </svg>
              </div>
              <div className="compliance-text">
                <strong>Standardisasi & Kendali Mutu Industri (ISO/SNI):</strong> Seluruh beton ReadyMix diproduksi melalui sistem batching otomatis terkomputasi yang memenuhi spesifikasi <strong>SNI 2847:2019</strong> (Persyaratan Beton Struktural), <strong>ISO 9001:2015</strong> (Sistem Manajemen Mutu), dan pengujian kuat tekan mengacu standar <strong>ISO 19204 / SNI 1974:2011</strong>.
              </div>
            </div>

            {/* Catalog Section */}
            <div className="catalog-header">
              <h3 className="catalog-section-title">Pilih Mutu Beton Sesuai Proyek Anda</h3>
              <p className="catalog-section-desc">Cari dan filter mutu beton berdasarkan spesifikasi yang Anda butuhkan.</p>
              
              <div className="catalog-filters-row">
                <div className="catalog-category-filters">
                  {[
                    { id: 'all', label: 'Semua Mutu' },
                    { id: 'ringan', label: 'Mutu Ringan (B0-K225)' },
                    { id: 'menengah', label: 'Mutu Menengah (K250-K350)' },
                    { id: 'tinggi', label: 'Mutu Tinggi (K375-K500)' },
                    { id: 'khusus', label: 'Mutu Khusus (FS)' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      className={`filter-chip ${selectedCategory === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="catalog-search">
                  <input
                    type="text"
                    placeholder="Cari mutu (misal: K-300)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <span className="search-icon">🔍</span>
                </div>
              </div>
            </div>

            {/* Catalog Table */}
            <div className="table-responsive">
              <table className="concrete-table">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Mutu Beton</th>
                    <th>fc' (MPa)</th>
                    <th>Slump</th>
                    <th>Rekomendasi Penggunaan</th>
                    <th style={{ textAlign: 'center' }}>Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGrades.length > 0 ? (
                    filteredGrades.map((grade) => (
                      <tr key={grade.no} className={selectedGrade === grade.name ? 'selected-row' : ''}>
                        <td>{grade.no}</td>
                        <td className="grade-badge-cell">
                          <span className={`grade-tag grade-${grade.category}`}>
                            {grade.name}
                          </span>
                        </td>
                        <td>{grade.fc}</td>
                        <td><span className="slump-badge">{grade.slump}</span></td>
                        <td className="grade-usage-desc">{grade.desc}</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="select-grade-btn"
                            onClick={() => handleSelectGrade(grade.name)}
                          >
                            Hitung Volume
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                        Tidak ditemukan mutu beton yang cocok dengan pencarian Anda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Calculator Section */}
            <div className="calculator-card" id="beton-calculator">
              <div className="calculator-grid">
                <div className="calculator-inputs">
                  <div className="calculator-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="12" height="12" style={{ display: 'inline-block', marginRight: '6px', verticalAlign: 'middle' }}>
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                    </svg>
                    Interactive Tools
                  </div>
                  <h4 className="calc-title">Kalkulator Kebutuhan Beton ReadyMix</h4>
                  <p className="calc-desc">Masukkan ukuran struktur proyek Anda untuk menghitung volume beton yang dibutuhkan secara presisi.</p>

                  <div className="input-group-row">
                    <div className="form-group">
                      <label>Panjang (m)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 10"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Lebar (m)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 6"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        min="0"
                        step="0.1"
                      />
                    </div>
                    <div className="form-group">
                      <label>Tebal / Tinggi (m)</label>
                      <input
                        type="number"
                        placeholder="Contoh: 0.12 (untuk 12cm)"
                        value={thickness}
                        onChange={(e) => setThickness(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div className="input-group-row">
                    <div className="form-group">
                      <label>Mutu Beton Terpilih</label>
                      <select 
                        value={selectedGrade} 
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        className="select-grade-dropdown"
                      >
                        {concreteGrades.map(grade => (
                          <option key={grade.name} value={grade.name}>{grade.name} ({grade.category.toUpperCase()})</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Safety Margin (Kelebihan) %</label>
                      <select 
                        value={safetyFactor} 
                        onChange={(e) => setSafetyFactor(parseInt(e.target.value))}
                        className="select-grade-dropdown"
                      >
                        <option value={0}>0% (Pas-pasan)</option>
                        <option value={5}>5% (Rekomendasi Standard)</option>
                        <option value={10}>10% (Rekomendasi Aman)</option>
                        <option value={15}>15% (Medan Sulit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="calculator-divider" style={{ margin: '20px 0', borderTop: '1px dashed rgba(255,255,255,0.1)' }}></div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h5 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--gold-400)', marginBottom: '12px' }}>Informasi Pemesanan & Pengiriman</h5>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label>Nama Pemesan</label>
                    <input
                      type="text"
                      placeholder="Masukkan nama pemesan / perusahaan..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </div>

                  <div className="input-group-row" style={{ marginBottom: '0' }}>
                    <div className="form-group">
                      <label>Nama PIC / No Telf</label>
                      <input
                        type="text"
                        placeholder="Contoh: Pak Budi / 081234..."
                        value={picPhone}
                        onChange={(e) => setPicPhone(e.target.value)}
                      />
                    </div>
                    <div className="form-group" style={{ flex: '1.5' }}>
                      <label>Alamat Proyek</label>
                      <input
                        type="text"
                        placeholder="Masukkan alamat lengkap proyek..."
                        value={projectAddress}
                        onChange={(e) => setProjectAddress(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="calculator-results">
                  <div className="results-wrapper">
                    <div className="results-label">Estimasi Hasil Perhitungan</div>
                    
                    <div className="result-stat-main">
                      <div className="result-val">{calculatedVolume.toFixed(2)}</div>
                      <div className="result-unit">Cubic Meter (m³)</div>
                    </div>

                    <div className="results-divider"></div>

                    <div className="results-specs">
                      <div className="spec-item">
                        <span>Panjang x Lebar x Tebal:</span>
                        <strong>{rawVolume.toFixed(2)} m³</strong>
                      </div>
                      <div className="spec-item">
                        <span>Mutu Beton:</span>
                        <strong>{selectedGrade}</strong>
                      </div>
                      <div className="spec-item">
                        <span>Safety Margin (+{safetyFactor}%):</span>
                        <strong>{(calculatedVolume - rawVolume).toFixed(2)} m³</strong>
                      </div>
                    </div>

                    <div className="results-divider"></div>

                    <div className="truck-estimates">
                      <div className="truck-est-title">Estimasi Kebutuhan Armada Truk:</div>
                      
                      <div className="truck-est-row">
                        <div className="truck-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M14 16h6V9l-3-3h-3v10z" />
                            <path d="M3 10c0-1.657 2.015-3 4.5-3s4.5 1.343 4.5 3-2.015 3-4.5 3S3 11.657 3 10z" />
                            <path d="M7 7l3 3m-3 0l3-3m-6 3h10" />
                            <path d="M2 16h12" />
                            <circle cx="4.5" cy="18.5" r="2.5" />
                            <circle cx="9.5" cy="18.5" r="2.5" />
                            <circle cx="16.5" cy="18.5" r="2.5" />
                          </svg>
                        </div>
                        <div className="truck-desc">
                          <div className="truck-name">Truk Besar (Kapasitas ±7 m³)</div>
                          <div className="truck-qty"><strong>{length && width && thickness ? estTruckLarge : 0}</strong> unit armada</div>
                        </div>
                      </div>

                      <div className="truck-est-row">
                        <div className="truck-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                            <path d="M13 16h5V10l-2-2h-3v8z" />
                            <path d="M2 11c0-1.38 1.79-2.5 4-2.5s4 1.12 4 2.5-1.79 2.5-4 2.5-4-1.12-4-2.5z" />
                            <path d="M5 8.5l2 2.5m-5.5.5h9" />
                            <path d="M2 16h11" />
                            <circle cx="4.5" cy="18.5" r="2.5" />
                            <circle cx="14.5" cy="18.5" r="2.5" />
                          </svg>
                        </div>
                        <div className="truck-desc">
                          <div className="truck-name">Truk Kecil / Minimix (Kapasitas ±3 m³)</div>
                          <div className="truck-qty"><strong>{length && width && thickness ? estTruckSmall : 0}</strong> unit armada</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      className="calc-order-btn"
                      onClick={handleWhatsAppOrder}
                      disabled={!length || !width || !thickness || !customerName || !projectAddress || !picPhone}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" style={{ display: 'inline-block', marginRight: '8px', verticalAlign: 'middle' }}>
                        <path d="M12.031 2c-5.516 0-9.999 4.484-9.999 9.998 0 1.952.562 3.774 1.53 5.32l-1.562 4.682 4.81-1.503a9.92 9.92 0 005.221 1.5c5.516 0 10-4.484 10-9.998C22.031 6.484 17.547 2 12.031 2zm0 1c4.962 0 9 4.038 9 9s-4.038 9-9 9a8.96 8.96 0 01-4.707-1.332l-.337-.197-2.825.882.915-2.744-.216-.345A8.962 8.962 0 013.031 12c0-4.962 4.038-9 9-9zM8.824 7.243c-.22 0-.46.064-.674.195-.31.189-.525.466-.607.781-.197.755.074 1.706.745 2.766.577.914 1.393 1.776 2.378 2.508l.307.227c1.077.787 2.128 1.34 2.984 1.488.309.054.62-.008.877-.174.22-.142.383-.377.46-.662l.332-1.22c.07-.257-.042-.527-.267-.643l-1.464-.757c-.208-.108-.46-.075-.63.08l-.513.47a.382.382 0 01-.482.046 5.864 5.864 0 01-1.63-1.309 6.222 6.222 0 01-1.12-1.602.383.383 0 01.071-.468l.422-.441c.143-.15.18-.372.095-.558L8.232 7.74a.498.498 0 00-.458-.297z" />
                      </svg>
                      Pesan Beton via WhatsApp
                    </button>
                    {!length || !width || !thickness || !customerName || !projectAddress || !picPhone ? (
                      <div className="calc-alert-note">Silakan lengkapi ukuran proyek, nama pemesan, alamat, dan nomor/nama PIC untuk melakukan pemesanan.</div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </section>
  );
}
