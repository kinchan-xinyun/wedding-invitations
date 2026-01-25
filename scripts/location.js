// ロケーションセクションスクリプト
document.addEventListener("DOMContentLoaded", () => {
    const locationSection = document.getElementById("location-section");
    if (!locationSection) return;

    // アクセスマップ拡大機能
    const accessMapImage = document.getElementById("access-map-image");
    const mapModal = document.getElementById("map-modal");
    const mapModalOverlay = document.getElementById("map-modal-overlay");
    const mapModalImage = document.getElementById("map-modal-image");
    const mapModalClose = document.getElementById("map-modal-close");

    if (accessMapImage && mapModal && mapModalOverlay && mapModalImage && mapModalClose) {
        // 画像クリックでモーダルを開く
        accessMapImage.addEventListener("click", () => {
            mapModalImage.src = accessMapImage.src;
            mapModal.classList.add("active");
            mapModalOverlay.classList.add("active");
            // スクロールを無効化
            document.body.style.overflow = "hidden";
        });

        // 閉じるボタン
        mapModalClose.addEventListener("click", closeModal);

        // オーバーレイクリックで閉じる
        mapModalOverlay.addEventListener("click", closeModal);

        // モーダル画像クリックで閉じる
        mapModalImage.addEventListener("click", closeModal);

        function closeModal() {
            mapModal.classList.remove("active");
            mapModalOverlay.classList.remove("active");
            // スクロールを有効化
            document.body.style.overflow = "";
        }

        // ESCキーで閉じる
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && mapModal.classList.contains("active")) {
                closeModal();
            }
        });
    }
});
  