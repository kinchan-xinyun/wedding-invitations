// ロケーションセクションスクリプト
// （現在は静的なコンテンツのため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const locationSection = document.getElementById("location-section");
    if (!locationSection) return;
  
    const locationCard = locationSection.querySelector(".location-card");
    
    if (locationCard) {
      locationCard.addEventListener("click", () => {
        // ロケーション情報のコピー機能など
        console.log("Location card clicked");
      });
    }
});
  