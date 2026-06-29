(function () {
  const track = document.getElementById('gallery-track');
  if (!track) return;

  const prevBtn = document.querySelector('.gallery-nav.prev');
  const nextBtn = document.querySelector('.gallery-nav.next');

  function slideAmount() {
    const slide = track.querySelector('.gallery-slide');
    if (!slide) return track.clientWidth;
    const style = window.getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap || '20') || 20;
    return slide.getBoundingClientRect().width + gap;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      track.scrollBy({ left: -slideAmount(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      track.scrollBy({ left: slideAmount(), behavior: 'smooth' });
    });
  }
})();
