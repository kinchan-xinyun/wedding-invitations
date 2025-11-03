// スケジュールセクションスクリプト
// （現在は静的なコンテンツのため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const scheduleSection = document.getElementById("schedule-section");
    if (!scheduleSection) return;
  
    const scheduleItems = scheduleSection.querySelectorAll(".schedule-item");
    
    // スケジュール項目のホバーエフェクト
    scheduleItems.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        console.log(`Schedule item ${index} hovered`);
      });
    });
});