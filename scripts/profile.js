// プロフィールセクションスクリプト
// （現在は静的なコンテンツのため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const profileSection = document.getElementById("profile-section");
    if (!profileSection) return;
  
    // プロフィールカードのホバーエフェクト
    const profileCards = profileSection.querySelectorAll(".profile-card");
    
    profileCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        // ホバー時の追加エフェクトなど
        console.log("Profile card hovered");
      });
    });
});