document.addEventListener("DOMContentLoaded", () => {
  const countdownSection = document.getElementById("countdown-section");
  if (!countdownSection) return;

  const targetDate = new Date("2026-10-26T00:00:00+09:00"); // 日本時間

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