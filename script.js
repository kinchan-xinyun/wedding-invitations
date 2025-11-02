window.addEventListener("DOMContentLoaded", () => {
    const intro = document.querySelector(".intro-screen");
    const slideContainer = document.querySelector(".slide-container");
    const topSlide = document.querySelector(".top-slide");
    const bottomSlide = document.querySelector(".bottom-slide");
    const languageScreen = document.querySelector(".language-screen");
  
    // STEP 1: 表示 → 2秒後にフェードアウト
    setTimeout(() => {
      intro.style.opacity = "0";
      setTimeout(() => {
        intro.style.display = "none";
        slideContainer.style.display = "block";
  
        // STEP 2: 画像スライドアニメーション
        setTimeout(() => {
          topSlide.style.left = "0";
          bottomSlide.style.right = "0";
  
          // スライド後にSTEP 3へ
          setTimeout(() => {
            languageScreen.style.display = "flex";
          }, 2000);
        }, 200);
      }, 1000);
    }, 2000);
  
    // STEP 3: ボタン遷移
    document.getElementById("jp-btn").addEventListener("click", () => {
      window.location.href = "jp.html";
    });
    document.getElementById("cn-btn").addEventListener("click", () => {
      window.location.href = "cn.html";
    });
  });

  // スマホでのタップ感度向上
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("touchstart", () => btn.style.transform = "scale(1.05)");
    btn.addEventListener("touchend", () => btn.style.transform = "scale(1.0)");
  });

  document.addEventListener("DOMContentLoaded", () => {
    const fadeSections = document.querySelectorAll(".fade-section");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          // 一度表示したら監視解除（再スクロールでも消えない）
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2, // 画面に20%見えたら反応
    });
  
    fadeSections.forEach((section) => {
      observer.observe(section);
    });
  });