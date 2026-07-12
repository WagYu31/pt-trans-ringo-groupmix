'use client';

export default function VideoProfile() {
  return (
    <section className="section section-dark" id="video-profil">
      <div className="container">
        <div className="section-header reveal reveal-fade-up">
          <span className="section-label">★ Video Profil</span>
          <h2 className="section-title">Dokumentasi Batching Plant &amp; Operasional</h2>
          <p className="section-subtitle">
            Lihat langsung bagaimana proses produksi beton ReadyMix berkualitas tinggi kami diproduksi menggunakan Batching Plant modern dan armada mixer yang andal.
          </p>
        </div>

        <div className="video-container-wrapper reveal reveal-zoom-in">
          <div className="video-iframe-container">
            <iframe
              src="https://www.youtube.com/embed/TAwviQxET5A"
              title="PT. Trans Ringo Groupmix - Video Profil"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
