'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['beranda', 'tentang', 'visi-misi', 'layanan', 'tim', 'legalitas', 'brosur', 'klien-mitra', 'galeri', 'kontak'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px',
      threshold: 0.1,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Normalize matching section for nav links (brosur is under gallery section, but let's highlight legalitas or contact based on it)
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const links = [
    { href: '#tentang', id: 'tentang', label: 'Tentang' },
    { href: '#visi-misi', id: 'visi-misi', label: 'Visi & Misi' },
    { href: '#layanan', id: 'layanan', label: 'Layanan' },
    { href: '#tim', id: 'tim', label: 'Tim Kami' },
    { href: '#legalitas', id: 'legalitas', label: 'Legalitas' },
    { href: '#galeri', id: 'galeri', label: 'Galeri' },
    { href: '#kontak', id: 'kontak', label: 'Kontak' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container">
        <a href="#beranda" className="navbar-brand">
          <div className="navbar-logo-badge">
            <Image
              src="/images/logo.jpeg"
              alt="Logo TRGMIX - PT. Trans Ringo Groupmix"
              width={120}
              height={50}
              style={{ objectFit: 'contain', height: '36px', width: 'auto' }}
            />
          </div>
        </a>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {links.map((link) => {
            const isActive = activeSection === link.id || (link.id === 'legalitas' && activeSection === 'brosur');
            return (
              <a
                key={link.href}
                href={link.href}
                className={`navbar-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            );
          })}
          <a href="#kontak" className="btn btn-primary navbar-cta" onClick={() => setMenuOpen(false)}>
            Hubungi Kami
          </a>
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
