'use client';

import { useState, useEffect } from 'react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    concreteGrade: '',
    location: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  // Show tooltip after 5 seconds on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp wajib diisi';
    } else if (!/^[0-9+\-\s]{9,16}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Nomor WhatsApp tidak valid (min. 9 angka)';
    }
    if (!formData.service) newErrors.service = 'Pilih jenis kebutuhan proyek Anda';
    if (!formData.location.trim()) newErrors.location = 'Lokasi proyek wajib diisi';
    if (!formData.message.trim()) newErrors.message = 'Pesan atau pertanyaan wajib diisi';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Official Admin Number (Indonesian code prefix 62)
    const adminPhoneNumber = '6285283281858'; 

    const serviceLabel = formData.service;
    const concreteInfo = formData.service === 'Pemesanan Beton ReadyMix' && formData.concreteGrade
      ? `• *Mutu Beton:* ${formData.concreteGrade}\n`
      : '';

    // Beautiful WhatsApp message template
    const textMessage = `Halo Admin PT. Trans Ringo Groupmix, saya ingin berkonsultasi mengenai proyek saya:

*Data Pelanggan:*
• *Nama / Instansi:* ${formData.name.trim()}
• *No. WhatsApp:* ${formData.phone.trim()}

*Detail Kebutuhan:*
• *Layanan:* ${serviceLabel}
${concreteInfo}• *Lokasi Proyek:* ${formData.location.trim()}

*Pesan / Deskripsi Proyek:*
"${formData.message.trim()}"

Mohon informasi harga terbaru, estimasi, dan ketersediaan armada. Terima kasih!`;

    const waUrl = `https://api.whatsapp.com/send?phone=${adminPhoneNumber}&text=${encodeURIComponent(textMessage)}`;
    window.open(waUrl, '_blank');
    
    // Close widget after submitting
    setIsOpen(false);
  };

  return (
    <div className="wa-widget-wrapper">
      {/* Tooltip Bubble */}
      {showTooltip && !isOpen && (
        <div className="wa-tooltip-bubble">
          <div className="wa-tooltip-body">
            <span className="wa-tooltip-avatar">👷‍♂️</span>
            <div className="wa-tooltip-content">
              <span className="wa-tooltip-title">Butuh Bantuan Proyek?</span>
              <span className="wa-tooltip-desc">Tanya harga ReadyMix &amp; Concrete Pump di sini</span>
            </div>
            <button 
              className="wa-tooltip-close" 
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip(false);
              }}
              aria-label="Tutup petunjuk"
            >
              ×
            </button>
          </div>
          <div className="wa-tooltip-arrow"></div>
        </div>
      )}

      {/* Floating Chat Trigger Button */}
      <button
        className={`wa-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        aria-label="Hubungi kami lewat WhatsApp"
        title="Hubungi Kami"
      >
        {isOpen ? (
          <span className="wa-trigger-close-icon">×</span>
        ) : (
          <svg viewBox="0 0 24 24" width="30" height="30" className="wa-whatsapp-svg">
            <circle cx="12" cy="12" r="12" fill="#fff" />
            <path
              fill="#25d366"
              d="M12.004 2c-5.523 0-10 4.477-10 10 0 1.767.46 3.427 1.267 4.887L2 22l5.247-1.213C8.667 21.573 10.28 22 12.004 22c5.522 0 10-4.478 10-10s-4.478-10-10-10zm5.72 13.687c-.247-.123-1.46-.72-1.687-.803-.227-.083-.393-.123-.557.123-.167.247-.643.803-.787.967-.143.163-.287.183-.533.06-2.077-1.037-3.23-2.18-4.083-3.647-.077-.133-.007-.203.06-.27l.45-.45c.08-.083.107-.143.16-.247.053-.103.027-.193-.013-.277-.04-.083-.393-.947-.54-1.3-.143-.347-.3-.3-.41-.303h-.35c-.12 0-.317.043-.483.227-.167.183-.637.623-.637 1.52 0 .897.653 1.763.743 1.887.09.123 1.283 1.96 3.11 2.753.437.19.777.303 1.043.387.44.14.84.12 1.157.073.353-.053 1.083-.443 1.237-.87.153-.427.153-.793.107-.87-.047-.077-.167-.123-.413-.247z"
            />
          </svg>
        )}
        {!isOpen && <span className="wa-trigger-pulse"></span>}
      </button>

      {/* Floating Chat Form Popover */}
      {isOpen && (
        <div className="wa-form-card">
          {/* Header */}
          <div className="wa-form-header">
            <div className="wa-form-agent-info">
              <div className="wa-form-avatar-wrapper">
                <span className="wa-form-avatar-emoji">👷‍♂️</span>
                <span className="wa-form-online-dot"></span>
              </div>
              <div className="wa-form-agent-meta">
                <span className="wa-form-agent-name">Customer Support</span>
                <span className="wa-form-agent-status">PT. Trans Ringo Groupmix</span>
              </div>
            </div>
            <button 
              className="wa-form-close-btn" 
              onClick={() => setIsOpen(false)}
              aria-label="Tutup form chat"
            >
              ×
            </button>
          </div>

          <div className="wa-form-accent-bar"></div>

          {/* Form */}
          <form className="wa-form-body" onSubmit={handleSubmit}>
            <div className="wa-form-intro">
              Hubungi layanan admin resmi kami. Mohon lengkapi formulir di bawah ini untuk memulai chat:
            </div>

            {/* Input Name */}
            <div className="wa-form-group">
              <label htmlFor="wa-input-name">Nama Lengkap / Instansi <span className="req">*</span></label>
              <input
                type="text"
                id="wa-input-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Contoh: Budi (PT. Sinar Raya)"
                className={errors.name ? 'input-error' : ''}
              />
              {errors.name && <span className="wa-error-text">{errors.name}</span>}
            </div>

            {/* Input Phone */}
            <div className="wa-form-group">
              <label htmlFor="wa-input-phone">Nomor WhatsApp Aktif <span className="req">*</span></label>
              <input
                type="tel"
                id="wa-input-phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Contoh: 08123456789"
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="wa-error-text">{errors.phone}</span>}
            </div>

            {/* Select Service */}
            <div className="wa-form-group">
              <label htmlFor="wa-select-service">Pilih Layanan / Kebutuhan <span className="req">*</span></label>
              <select
                id="wa-select-service"
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className={errors.service ? 'input-error' : ''}
              >
                <option value="">-- Pilih Layanan --</option>
                <option value="Pemesanan Beton ReadyMix">Pemesanan Beton ReadyMix</option>
                <option value="Penyewaan Pompa Beton (Concrete Pump)">Penyewaan Pompa Beton (Concrete Pump)</option>
                <option value="Pembelian Material Alam (Pasir/Batu)">Pembelian Material Alam (Pasir / Batu)</option>
                <option value="Konsultasi Proyek &amp; Survey Lokasi">Konsultasi Proyek &amp; Survey Lokasi</option>
                <option value="Pertanyaan Umum / Lainnya">Pertanyaan Umum / Lainnya</option>
              </select>
              {errors.service && <span className="wa-error-text">{errors.service}</span>}
            </div>

            {/* Concrete Grade (Conditional) */}
            {formData.service === 'Pemesanan Beton ReadyMix' && (
              <div className="wa-form-group wa-form-group-conditional">
                <label htmlFor="wa-select-grade">Pilih Mutu Beton (Opsional)</label>
                <select
                  id="wa-select-grade"
                  name="concreteGrade"
                  value={formData.concreteGrade}
                  onChange={handleInputChange}
                >
                  <option value="">-- Pilih Mutu Beton (Jika Tahu) --</option>
                  <option value="K-100 s/d K-175 (Non-Struktural / Lantai Kerja)">K-100 s/d K-175 (Non-Struktural / Jalan Setapak)</option>
                  <option value="K-225 s/d K-300 (Struktural - Dak Ruko, Balok, Rumah Tingkat)">K-225 s/d K-300 (Struktural - Dak, Balok, Kolom)</option>
                  <option value="K-350 s/d K-500 (Mutu Tinggi - Jalan Raya, Alat Berat, Jembatan)">K-350 s/d K-500 (Mutu Tinggi - Jalan Raya, Jembatan)</option>
                  <option value="Butuh Konsultasi Teknis Terlebih Dahulu">Belum Tahu (Butuh Konsultasi Terlebih Dahulu)</option>
                </select>
              </div>
            )}

            {/* Input Location */}
            <div className="wa-form-group">
              <label htmlFor="wa-input-location">Lokasi Proyek / Pengiriman <span className="req">*</span></label>
              <input
                type="text"
                id="wa-input-location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Contoh: Kec. Cibitung, Bekasi"
                className={errors.location ? 'input-error' : ''}
              />
              {errors.location && <span className="wa-error-text">{errors.location}</span>}
            </div>

            {/* Message Textarea */}
            <div className="wa-form-group">
              <label htmlFor="wa-input-message">Pesan / Pertanyaan Anda <span className="req">*</span></label>
              <textarea
                id="wa-input-message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows="3"
                placeholder="Tulis detail kebutuhan volume beton, jadwal pengecoran, atau pertanyaan Anda di sini..."
                className={errors.message ? 'input-error' : ''}
              ></textarea>
              {errors.message && <span className="wa-error-text">{errors.message}</span>}
            </div>

            {/* Submit Button */}
            <button type="submit" className="wa-form-submit-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" className="wa-btn-icon">
                <path
                  fill="currentColor"
                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                />
              </svg>
              Kirim ke WhatsApp ↗
            </button>

            <div className="wa-form-footer-disclaimer">
              🛡️ Chat Anda akan diteruskan ke WhatsApp resmi Admin PT. Trans Ringo Groupmix untuk kalkulasi harga dan penawaran resmi.
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
