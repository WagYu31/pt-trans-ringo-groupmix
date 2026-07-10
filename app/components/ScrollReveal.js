'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px', // Trigger when element is 80px inside the viewport
      threshold: 0.02,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal:not(.revealed)');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Only reveal immediately if it is at the very top of the page (above fold)
        if (rect.bottom < 150) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
