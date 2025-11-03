// ===========================
// Request Page JavaScript
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // テキストアニメーション
    animateText();
    
    // スクロールアニメーション
    observeElements();
  });
  
  // ===========================
  // Text Animation
  // ===========================
  function animateText() {
    const texts = document.querySelectorAll('.request-text');
    
    texts.forEach((text, index) => {
      const delay = index * 100;
      text.style.animation = `fadeInUp 0.6s ease-out ${delay}ms both`;
    });
  }
  
  // Add animation keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
  
  // ===========================
  // Intersection Observer for Scroll Effect
  // ===========================
  function observeElements() {
    const options = {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px'
    };
  
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, options);
  
    const requestBox = document.querySelector('.request-box');
    if (requestBox) {
      requestBox.style.opacity = '0';
      requestBox.style.transform = 'translateY(20px)';
      observer.observe(requestBox);
    }
  }
  
  // ===========================
  // Interactive Hover Effects
  // ===========================
  const requestTexts = document.querySelectorAll('.request-text');
  
  requestTexts.forEach(text => {
    text.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
      this.style.transition = 'transform 0.2s ease';
    });
  
    text.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });