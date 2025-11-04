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

// プロフィール画像のスクロールフェードイン効果
document.addEventListener('DOMContentLoaded', function() {
  const profileImages = document.querySelectorAll('.profile-img');
  const profileContainer = document.querySelector('.profile-container');

  // 初期状態: 画像を非表示にして位置をずらす
  profileImages.forEach((img, index) => {
    img.style.opacity = '0';
    if (index === 0) {
      // 左の画像は左からフェードイン
      img.style.transform = 'translateX(-60px)';
    } else {
      // 右の画像は右からフェードイン
      img.style.transform = 'translateX(60px)';
    }
    img.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
  });

  // IntersectionObserver でスクロール時にアニメーション実行
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // コンテナが画面に入ったら
          profileImages.forEach((img, index) => {
            // 少し遅延させて順に表示
            setTimeout(() => {
              img.style.opacity = '1';
              img.style.transform = 'translateX(0)';
            }, index * 200); // インデックスに応じて200ms遅延
          });
          // 一度実行したら観察を解除
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3, // コンテナの30%が見えたときに実行
    }
  );

  // 観察開始
  if (profileContainer) {
    observer.observe(profileContainer);
  }
});