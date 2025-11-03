// ナビゲーションスクリプト
// （現在はHTMLに直接実装されているため、特に必要な処理はありません）

document.addEventListener("DOMContentLoaded", () => {
    const menuHeader = document.querySelector(".menu-header");
    if (!menuHeader) return;
  
    // メニューリンククリック時にメニューを閉じる
    const menuLinks = document.querySelectorAll(".menu-panel a");
    
    menuLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const menuToggle = document.getElementById("menuToggle");
        if (menuToggle) menuToggle.checked = false;
      });
    });
  });
  