'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.IntersectionObserver) return;

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -10% 0px', // Triggers when 10% of the element is visible
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Stop observing once revealed to boost scrolling performance
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const elements = document.querySelectorAll('.reveal');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If the element is already in or above the initial viewport, reveal immediately
        if (rect.top < window.innerHeight) {
          el.classList.add('revealed');
        } else {
          observer.observe(el);
        }
      });
    };

    // Run observation on mount
    observeElements();

    // Re-run observation if Next.js dynamically updates or re-renders the DOM tree
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
