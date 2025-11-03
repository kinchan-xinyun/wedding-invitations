// フッターセクションスクリプト
// （現在は静的なコンテンツのため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const footerSection = document.querySelector(".footer-section");
    if (!footerSection) return;
  
    const returnBtn = footerSection.querySelector(".footer-return-button");
    
    if (returnBtn) {
      returnBtn.addEventListener("click", () => {
        console.log("Return button clicked");
      });
    }
});