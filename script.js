/* ==========================================
   Apple Store - 交互脚本
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initProductCarousel();
  initScrollAnimations();
});

/* ========== 导航栏 ========== */
function initNav() {
  const nav = document.querySelector('.nav');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

/* ========== 商品卡片轮播 ========== */
function initProductCarousel() {
  const track = document.getElementById('productTrack');
  const prevBtn = document.getElementById('sectionPrev');
  const nextBtn = document.getElementById('sectionNext');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.product-card-apple');
  let currentIndex = 0;
  let autoPlayTimer;

  function getVisibleCount() {
    const containerWidth = track.parentElement.offsetWidth;
    const cardWidth = 280 + 16; // card width + gap
    return Math.max(1, Math.floor(containerWidth / cardWidth));
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCount());
  }

  function updateCarousel() {
    const cardWidth = 296; // 280 + 16 gap
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
  }

  function goPrev() {
    currentIndex = Math.max(0, currentIndex - 1);
    updateCarousel();
  }

  function goNext() {
    currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
    updateCarousel();
  }

  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
      if (currentIndex >= getMaxIndex()) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateCarousel();
    }, 5000);
  }

  function stopAutoPlay() {
    clearInterval(autoPlayTimer);
  }

  prevBtn.addEventListener('click', () => { goPrev(); startAutoPlay(); });
  nextBtn.addEventListener('click', () => { goNext(); startAutoPlay(); });

  // Touch / Swipe
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goNext() : goPrev();
    }
    startAutoPlay();
  }, { passive: true });

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', stopAutoPlay);
  track.parentElement.addEventListener('mouseleave', startAutoPlay);

  // Handle resize
  window.addEventListener('resize', () => {
    if (currentIndex > getMaxIndex()) {
      currentIndex = getMaxIndex();
      updateCarousel();
    }
  });

  startAutoPlay();
}

/* ========== 滚动入场动画 ========== */
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    '.hero-inner, .dual-inner, .dual-product, .product-card-apple, .store-card, .quick-link-card'
  );

  elements.forEach((el) => {
    el.classList.add('fade-up');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  elements.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    observer.observe(el);
  });
}
