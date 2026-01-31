// src/js/components/ScrollToTop.js

/**
 * Create scroll to top button HTML
 * @returns {string} HTML string
 */
export function createScrollToTopButton() {
  return `
    <button id="scrollToTop" aria-label="Volver arriba">
      <svg class="h-6 w-6 text-sakura transition-transform group-hover:-translate-y-1" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
      </svg>
    </button>
  `;
}

/**
 * Setup scroll to top functionality
 */
export function setupScrollToTop() {
  const button = document.getElementById('scrollToTop');
  if (!button) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      button.classList.add('show');
    } else {
      button.classList.remove('show');
    }
  }, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}