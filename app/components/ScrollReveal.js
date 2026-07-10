'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px 50px 0px', // Trigger 50px before entering the viewport
      threshold: 0,
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
        observer.observe(el);
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
