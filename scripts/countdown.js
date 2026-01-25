document.addEventListener("DOMContentLoaded", () => {
  const countdownSection = document.getElementById("countdown-section");
  if (!countdownSection) return;

  const targetDate = new Date("2026-10-24T00:00:00+09:00"); // 日本時間

  // ========== タイプライター効果 ==========
  function typewriterEffect() {
    const dateTextEl = document.querySelector(".countdown-date .date-text");
    if (!dateTextEl) {
      console.log("要素が見つかりません");
      return;
    }

    const text = dateTextEl.textContent.trim();
    dateTextEl.textContent = ""; // 初期化
    dateTextEl.style.opacity = "1";

    let index = 0;
    function typeChar() {
      if (index < text.length) {
        dateTextEl.textContent += text[index];
        index++;
        setTimeout(typeChar, 100); // 100ms ごとに一文字追加
      }
    }
    typeChar();
  }

  // IntersectionObserver でスクロール時にタイプライター効果を実行
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typewriterEffect();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const countdownDate = document.querySelector(".countdown-date");
  if (countdownDate) {
    observer.observe(countdownDate);
  }

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    const finishEl = document.getElementById("countdown-finish");

    if (diff <= 0) {
      const timerEl = document.getElementById("countdown-timer");
      if (timerEl) timerEl.style.display = "none";
      if (finishEl) finishEl.textContent = "✨ TODAY IS THE WEDDING DAY! ✨";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});