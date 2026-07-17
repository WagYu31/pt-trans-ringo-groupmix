'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';

const galleryImages = [
  { id: 'v1', src: '/images/gallery/video-activity-1.jpg', videoSrc: '/videos/activity-1.mp4', type: 'video', category: 'kegiatan', title: 'Aktivitas Harian Loader', desc: 'Pengisian material alam agregat ke hopper batching plant menggunakan wheel loader.' },
  { id: 'v2', src: '/images/gallery/video-activity-2.jpg', videoSrc: '/videos/activity-2.mp4', type: 'video', category: 'kegiatan', title: 'Loading Beton ke Truk Mixer', desc: 'Proses pengisian beton ReadyMix segar dari mixer batching plant ke dalam armada truk mixer.' },
  { id: 'v3', src: '/images/gallery/video-zoomlion.jpg', videoSrc: '/videos/zoomlion.mp4', type: 'video', category: 'alat berat', title: 'Serah Terima Ekskavator Zoomlion', desc: 'Serah terima dan kesiapan operasional alat berat ekskavator baru untuk mendukung proyek kontraktor.' },
  { id: 'v4', src: '/images/gallery/video-night-op.jpg', videoSrc: '/videos/night-op.mp4', type: 'video', category: 'kegiatan', title: 'Operasional Malam Hari', desc: 'Aktivitas pengolahan dan loading material pada malam hari demi mengejar target proyek tepat waktu.' },
  { id: 1, src: '/images/gallery/gallery-1.jpeg', category: 'produksi', title: 'Operasional Batching Plant', desc: 'Aktivitas pengolahan bahan baku beton di batching plant modern.' },
  { id: 2, src: '/images/gallery/gallery-2.jpeg', category: 'armada', title: 'Armada Truk Mixer', desc: 'Barisan truk mixer siap mendistribusikan beton siap pakai ke lokasi proyek.' },
  { id: 3, src: '/images/gallery/gallery-3.jpeg', category: 'proyek', title: 'Proyek Pengecoran Jalan', desc: 'Proses perataan beton segar untuk rigid pavement jalan raya.' },
  { id: 4, src: '/images/gallery/gallery-4.jpeg', category: 'produksi', title: 'Kontrol Kualitas Beton', desc: 'Pengujian slump test untuk memastikan konsistensi kualitas adukan beton.' },
  { id: 5, src: '/images/gallery/gallery-5.jpeg', category: 'armada', title: 'Kesiapan Pengiriman', desc: 'Armada truk mixer keluar dari area loading dengan muatan beton siap pakai.' },
  { id: 6, src: '/images/gallery/gallery-6.jpeg', category: 'proyek', title: 'Pengecoran Struktur Gedung', desc: 'Penyaluran beton ReadyMix menggunakan concrete pump ke struktur bertingkat.' },
  { id: 7, src: '/images/gallery/gallery-7.jpeg', category: 'produksi', title: 'Pabrikasi Beton ReadyMix', desc: 'Pengawasan sistem pencampuran material agregat halus, kasar, dan semen.' },
  { id: 8, src: '/images/gallery/gallery-8.jpeg', category: 'proyek', title: 'Pengecoran Dak Lantai', desc: 'Pengecoran plat lantai dak beton bertulang pada proyek gedung ruko.' },
  { id: 9, src: '/images/gallery/gallery-9.jpeg', category: 'armada', title: 'Mobilisasi Truk Mixer', desc: 'Koordinasi armada di jalan untuk memastikan beton sampai tepat waktu sebelum setting.' },
  { id: 10, src: '/images/gallery/gallery-10.jpeg', category: 'produksi', title: 'Fasilitas Batching Plant', desc: 'Infrastruktur silo semen dan penyimpanan material pasir batu split.' },
  { id: 11, src: '/images/gallery/gallery-11.jpeg', category: 'proyek', title: 'Pengecoran Rigid Pavement', desc: 'Finishing permukaan beton jalan raya agar menghasilkan tekstur anti-selip.' },
  { id: 12, src: '/images/gallery/gallery-12.jpeg', category: 'produksi', title: 'Bahan Baku Agregat', desc: 'Stok material batu split berkualitas tinggi sebagai bahan dasar adukan beton.' },
  { id: 13, src: '/images/gallery/gallery-13.jpeg', category: 'armada', title: 'Line-up Armada Pengiriman', desc: 'Persiapan harian armada pengiriman beton untuk proyek komersial.' },
  { id: 14, src: '/images/gallery/gallery-14.jpeg', category: 'proyek', title: 'Konstruksi Sipil & Cor Beton', desc: 'Pekerjaan bekisting dan pembesian kolom sebelum diisi adukan beton.' },
  { id: 15, src: '/images/gallery/gallery-15.jpeg', category: 'produksi', title: 'Sistem Pencampuran Otomatis', desc: 'Teknologi computerized batching control panel untuk akurasi formula beton.' },
  { id: 16, src: '/images/gallery/gallery-16.jpeg', category: 'proyek', title: 'Pekerjaan Pengecoran Selesai', desc: 'Tahap curing permukaan beton yang baru selesai dicor untuk menjaga kelembaban.' },
];

export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef(null);

  // Show all gallery images in the slider
  const filteredImages = galleryImages;

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
      
      if (direction === 'right') {
        const isEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10;
        sliderRef.current.scrollTo({
          left: isEnd ? 0 : scrollLeft + clientWidth,
          behavior: 'smooth'
        });
      } else {
        const isStart = scrollLeft <= 10;
        sliderRef.current.scrollTo({
          left: isStart ? scrollWidth : scrollLeft - clientWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  const handlePrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setActiveIndex(prev => (prev === 0 ? filteredImages.length - 1 : prev - 1));
  }, [filteredImages.length]);

  const handleNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setActiveIndex(prev => (prev === filteredImages.length - 1 ? 0 : prev + 1));
  }, [filteredImages.length]);

  const handleKeyDown = useCallback((e) => {
    if (activeIndex === null) return;
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'Escape') setActiveIndex(null);
  }, [activeIndex, handlePrev, handleNext]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || activeIndex !== null) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = sliderRef.current;
        const isEnd = Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 10;
        
        sliderRef.current.scrollTo({
          left: isEnd ? 0 : scrollLeft + clientWidth,
          behavior: 'smooth'
        });
      }
    }, 3500); // Auto-scroll every 3.5 seconds

    return () => clearInterval(interval);
  }, [isPaused, activeIndex]);

  return (
    <section className="section section-gradient" id="galeri">
      {/* Ambient background glow */}
      <div className="gallery-ambient-glow"></div>

      <div className="container">
        <div className="section-header reveal reveal-fade-up">
          <span className="section-label">✦ Dokumentasi Kami</span>
          <h2 className="section-title">Galeri Proyek &amp; Kegiatan</h2>
          <p className="section-subtitle">
            Kumpulan dokumentasi foto operasional batching plant, kesiapan armada truk mixer, 
            serta pengerjaan pengecoran di berbagai proyek di lapangan.
          </p>
        </div>

        {/* Gallery Slider */}
        <div 
          className="gallery-slider-container reveal reveal-zoom-in"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <button 
            className="gallery-nav-btn prev" 
            onClick={() => handleScroll('left')}
            aria-label="Previous slide"
          >
            ‹
          </button>
          
          <div className="gallery-slider-track" ref={sliderRef}>
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                className="gallery-slide-card"
                onClick={() => setActiveIndex(index)}
              >
                <div className="gallery-img-wrapper">
                  <Image
                    src={img.src}
                    alt={img.title}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div className="gallery-hover-overlay">
                    <div className="gallery-hover-content">
                      <span className="gallery-zoom-icon">{img.type === 'video' ? '▶' : '🔍'}</span>
                      <span className="gallery-cat-tag">{img.category.toUpperCase()}</span>
                      <h3 className="gallery-card-title">{img.title}</h3>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            className="gallery-nav-btn next" 
            onClick={() => handleScroll('right')}
            aria-label="Next slide"
          >
            ›
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && (
        <div className="lightbox-overlay" onClick={() => setActiveIndex(null)}>
          <div className="lightbox-content-card gallery-lightbox" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close-btn" onClick={() => setActiveIndex(null)}>
              ✕
            </button>

            {/* Left navigation arrow */}
            <button className="lightbox-nav-btn prev-btn" onClick={handlePrev} aria-label="Previous image">
              ‹
            </button>

            <div className="lightbox-image-container">
              {filteredImages[activeIndex].type === 'video' ? (
                <video
                  src={filteredImages[activeIndex].videoSrc}
                  className="lightbox-main-video"
                  controls
                  autoPlay
                  playsInline
                />
              ) : (
                <img
                  src={filteredImages[activeIndex].src}
                  alt={filteredImages[activeIndex].title}
                  className="lightbox-main-img"
                />
              )}
            </div>

            {/* Right navigation arrow */}
            <button className="lightbox-nav-btn next-btn" onClick={handleNext} aria-label="Next image">
              ›
            </button>

            <div className="lightbox-footer">
              <div className="lightbox-text-side">
                <span className="lightbox-counter">
                  {activeIndex + 1} dari {filteredImages.length}
                </span>
                <h4 className="lightbox-title">{filteredImages[activeIndex].title}</h4>
                <p className="lightbox-desc">{filteredImages[activeIndex].desc}</p>
              </div>
              {filteredImages[activeIndex].type === 'video' ? (
                <a
                  href={filteredImages[activeIndex].videoSrc}
                  download={`PT-TRGMIX-video-${filteredImages[activeIndex].id}.mp4`}
                  className="btn btn-primary lightbox-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 Unduh Video
                </a>
              ) : (
                <a
                  href={filteredImages[activeIndex].src}
                  download={`PT-TRGMIX-${filteredImages[activeIndex].category}-${filteredImages[activeIndex].id}.jpeg`}
                  className="btn btn-primary lightbox-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📥 Unduh Gambar
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
