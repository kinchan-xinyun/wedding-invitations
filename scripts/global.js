// フェードアニメーション（Intersection Observer）
document.addEventListener("DOMContentLoaded", () => {
    const fadeSections = document.querySelectorAll(".fade-section");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
    });
  
    fadeSections.forEach((section) => {
      observer.observe(section);
    });
  });
  
  // ハンバーガーメニューのタップ感度向上
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("touchstart", () => btn.style.transform = "scale(1.05)");
    btn.addEventListener("touchend", () => btn.style.transform = "scale(1.0)");
});