// ヒーローセクションスクリプト
// （現在はCSSアニメーションで実装されているため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector(".hero-section");
    if (!heroSection) return;
  
    // スライダーコンテナの処理
    const topTrack = document.querySelector(".top-track");
    const bottomTrack = document.querySelector(".bottom-track");
  
    if (topTrack && bottomTrack) {
      console.log("Hero section with slider initialized");
    }
});