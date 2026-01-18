'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ 
      showSpinner: false,
      minimum: 0.2,
      easing: 'ease',
      speed: 400,
    });

    // Add custom styling for thicker, more visible bar
    const style = document.createElement('style');
    style.innerHTML = `
      #nprogress .bar {
        height: 4px !important;
      }
    `;
    document.head.appendChild(style);

    // Start progress bar on link clicks
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      const clickTarget = event.target as HTMLElement;

      // Skip if clicking on an interactive element inside the link (buttons, menus, etc.)
      const isInteractiveElement = clickTarget.closest('button, [role="button"], [role="menuitem"]');
      if (isInteractiveElement) {
        return;
      }

      // Only track internal navigation
      if (
        href &&
        href.startsWith('/') &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.shiftKey &&
        !event.defaultPrevented
      ) {
        NProgress.start();
      }
    };

    // Add click listeners to all links
    const links = document.querySelectorAll('a[href^="/"]');
    links.forEach((link) => {
      link.addEventListener('click', handleAnchorClick as any);
    });

    // Debounced observer to handle dynamically added links
    let debounceTimer: NodeJS.Timeout;
    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const newLinks = document.querySelectorAll('a[href^="/"]');
        newLinks.forEach((link) => {
          link.removeEventListener('click', handleAnchorClick as any);
          link.addEventListener('click', handleAnchorClick as any);
        });
      }, 100); // Debounce by 100ms
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      clearTimeout(debounceTimer);
      links.forEach((link) => {
        link.removeEventListener('click', handleAnchorClick as any);
      });
      observer.disconnect();
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
