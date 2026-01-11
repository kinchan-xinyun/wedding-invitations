// プライバシーポリシー モーダル制御

document.addEventListener('DOMContentLoaded', () => {
  const modalOverlay = document.getElementById('privacy-modal-overlay');
  const modal = document.getElementById('privacy-modal');
  const modalCheckbox = document.getElementById('privacy-modal-consent');
  const mainCheckbox = document.getElementById('privacy-consent');
  const agreeBtn = document.getElementById('privacy-agree-btn');
  const cancelBtn = document.getElementById('privacy-cancel-btn');
  const closeBtn = document.getElementById('privacy-modal-close');
  const openLink = document.querySelector('.privacy-consent-label a');

  if (!modalOverlay || !modal || !modalCheckbox || !mainCheckbox) {
    console.log('モーダル要素が見つかりません');
    return;
  }

  // リンクをクリックしてモーダルを開く
  if (openLink) {
    openLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  }

  // モーダルを開く
  function openModal() {
    modalOverlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // 背景のスクロールを無効化
    
    // モーダルを開いた時、メインのチェック状態をモーダルに反映
    if (sessionStorage.getItem('privacyConsent') === 'true') {
      modalCheckbox.checked = true;
      agreeBtn.disabled = false;
    } else {
      modalCheckbox.checked = false;
      agreeBtn.disabled = true;
    }
    
    // モーダルの最上部にスクロール
    const modalBody = modal.querySelector('.privacy-modal-body');
    if (modalBody) {
      modalBody.scrollTop = 0;
    }
  }

  // モーダルを閉じる
  function closeModal() {
    modalOverlay.classList.remove('active');
    modal.classList.remove('active');
    document.body.style.overflow = ''; // 背景のスクロールを再有効化
  }

  // モーダル内のチェックボックスの変更を監視
  modalCheckbox.addEventListener('change', () => {
    agreeBtn.disabled = !modalCheckbox.checked;
  });

  // 同意ボタンをクリック
  if (agreeBtn) {
    agreeBtn.addEventListener('click', () => {
      if (modalCheckbox.checked) {
        // sessionStorageに保存
        sessionStorage.setItem('privacyConsent', 'true');
        
        // メインのチェックボックスをチェック
        mainCheckbox.checked = true;
        
        // メインのチェックボックスのchangeイベントを発火
        const event = new Event('change', { bubbles: true });
        mainCheckbox.dispatchEvent(event);
        
        // モーダルを閉じる
        closeModal();
        
        // RSVPフォームまでスクロール（オプション）
        const rsvpSection = document.getElementById('rsvp-section');
        if (rsvpSection) {
          rsvpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // キャンセルボタンをクリック
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  // 閉じるボタンをクリック
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  // オーバーレイをクリックして閉じる
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESCキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});

