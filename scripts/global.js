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

// フローティングRSVPボタンの表示制御
document.addEventListener("DOMContentLoaded", () => {
  const floatingBtn = document.querySelector(".floating-rsvp-btn");
  const rsvpSection = document.getElementById("rsvp-section");
  
  if (!floatingBtn || !rsvpSection) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // RSVPセクションが表示されたらボタンを非表示
        floatingBtn.classList.add("hide");
      } else {
        // RSVPセクションが画面外ならボタンを表示
        floatingBtn.classList.remove("hide");
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "-100px 0px 0px 0px"
  });
  
  observer.observe(rsvpSection);
});