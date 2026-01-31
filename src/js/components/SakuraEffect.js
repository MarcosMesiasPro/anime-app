// src/js/components/SakuraEffect.js

/**
 * Initialize sakura petals effect
 */
export function initSakuraEffect() {
  const container = document.getElementById('sakuraContainer');
  if (!container) return;

  container.innerHTML = '';
  
  // Apply container styles
  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '1',
    overflow: 'visible'
  });

  const petalCount = window.innerWidth < 768 ? 5 : 10;
  const colors = ['#FFB7C5', '#FFC0CB', '#FFB6C1', '#FADADD'];

  for (let i = 0; i < petalCount; i++) {
    createPetal(container, i, colors);
  }

  console.log(`🌸 Created ${petalCount} sakura petals`);
}

/**
 * Create a single petal
 * @param {HTMLElement} container - Container element
 * @param {number} index - Petal index
 * @param {Array} colors - Color palette
 */
function createPetal(container, index, colors) {
  const petal = document.createElement('div');
  
  const left = Math.random() * 100;
  const size = 12 + Math.random() * 6;
  const duration = 15 + Math.random() * 10;
  const delay = Math.random() * 10;
  const color = colors[Math.floor(Math.random() * colors.length)];

  Object.assign(petal.style, {
    position: 'absolute',
    left: `${left}%`,
    top: '-20px',
    width: `${size}px`,
    height: `${size}px`,
    background: `linear-gradient(135deg, ${color}, #FFC0CB)`,
    borderRadius: '50% 0 50% 0',
    opacity: '0.7',
    pointerEvents: 'none',
    animation: `fall${index} ${duration}s linear infinite ${delay}s`,
    filter: 'blur(0.5px)'
  });

  createAnimation(index);
  container.appendChild(petal);
}

/**
 * Create keyframe animation
 * @param {number} index - Animation index
 */
function createAnimation(index) {
  const style = document.createElement('style');
  const drift = (Math.random() - 0.5) * 100;
  
  style.textContent = `
    @keyframes fall${index} {
      0% { 
        transform: translateY(0) translateX(0) rotate(0deg); 
        opacity: 1; 
      }
      100% { 
        transform: translateY(110vh) translateX(${drift}px) rotate(360deg); 
        opacity: 0; 
      }
    }
  `;
  
  document.head.appendChild(style);
}