// ========================================
// ゲスト追加機能
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#rsvp-form');
  const addBtn = document.getElementById('rsvp-add-guest-btn');

  if (!form) {
    console.error('フォーム (#rsvp-form) が見つかりません');
    return;
  }

  if (!addBtn) {
    console.error('ゲスト追加ボタンが見つかりません');
    return;
  }

  const firstGuest = form.querySelector('.rsvp-guest');
  if (!firstGuest) {
    console.error('最初のゲスト要素が見つかりません');
    return;
  }

  function bindGuestEvents(guest) {
    const removeBtn = guest.querySelector('.rsvp-remove-guest');
    const header = guest.querySelector('.rsvp-guest-header');
    const sameAddressCheckbox = guest.querySelector('.same-as-first-address');
    const postalInput = guest.querySelector('input[name="postal_code[]"]');
    const addressInput = guest.querySelector('input[name="address[]"]');

    // 削除ボタン
    if (removeBtn) {
      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        guest.remove();
        updateGuestNumbers();
      });
    }

    // ヘッダークリックで開閉
    if (header) {
      header.addEventListener('click', () => {
        guest.classList.toggle('rsvp-open');
      });
    }

    // 同じ住所チェックボックス
    if (sameAddressCheckbox) {
      sameAddressCheckbox.addEventListener('change', () => {
        if (sameAddressCheckbox.checked) {
          const firstPostalInput = firstGuest.querySelector('input[name="postal_code[]"]');
          const firstAddressInput = firstGuest.querySelector('input[name="address[]"]');
          
          if (firstPostalInput && firstAddressInput) {
            postalInput.value = firstPostalInput.value;
            addressInput.value = firstAddressInput.value;
          }
        } else {
          postalInput.value = '';
          addressInput.value = '';
        }
      });
    }

    // 郵便番号ボタン
    const postalBtn = guest.querySelector('.rsvp-postal-code-btn');
    if (postalBtn) {
      attachPostalListener(postalBtn);
    }
  }

  function updateGuestNumbers() {
    form.querySelectorAll('.rsvp-guest').forEach((guest, index) => {
      const title = guest.querySelector('.rsvp-guest-title');
      if (title) {
        if (index === 0) {
          title.textContent = 'Guest 1（送信者）';
        } else {
          title.textContent = `Guest ${index + 1}`;
        }
      }
    });
  }

  addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const newGuest = firstGuest.cloneNode(true);
    const guestCount = form.querySelectorAll('.rsvp-guest').length + 1;

    // フォーム値をリセット
    newGuest.querySelectorAll('input, textarea').forEach(el => {
      el.value = '';
      el.required = el.hasAttribute('required');
    });

    // ゲスト番号を更新
    const header = newGuest.querySelector('.rsvp-guest-title');
    if (header) {
      header.textContent = `Guest ${guestCount}`;
    }

    // 削除ボタンを表示
    const removeBtn = newGuest.querySelector('.rsvp-remove-guest');
    if (removeBtn) {
      removeBtn.style.display = 'inline-block';
    }

    // デフォルトでは閉じた状態
    newGuest.classList.remove('rsvp-open');

    // 「同じ住所」チェックボックスを追加
    const addressField = newGuest.querySelector('.rsvp-field-row:has(input[name="address[]"])');
    if (addressField) {
      let existingSameAddress = addressField.querySelector('.same-address-checkbox');
      if (!existingSameAddress) {
        const sameAddressDiv = document.createElement('div');
        sameAddressDiv.classList.add('same-address-checkbox');
        sameAddressDiv.style.marginTop = '10px';
        sameAddressDiv.innerHTML = `
          <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; width: fit-content;">
            <input type="checkbox" class="same-as-first-address" style="width: 18px; height: 18px; cursor: pointer;" />
            <span style="white-space: nowrap;">送信者と同じ住所</span>
          </label>
        `;
        addressField.appendChild(sameAddressDiv);
      }
    }

    // フォームに追加
    form.insertBefore(newGuest, addBtn);

    // イベントをバインド
    bindGuestEvents(newGuest);
  });

  // 最初のゲストにもイベントをバインド
  bindGuestEvents(firstGuest);
});

// ========================================
// 出席選択ボタン
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const options = document.querySelectorAll('.rsvp-attend-option');
  let selectedOption = null;

  options.forEach((option) => {
    const circle = option.querySelector('.rsvp-circle');
    const choice = option.dataset.choice;

    if (!circle) return;

    // スタンプ画像を作成
    const stampIcon = document.createElement('img');
    stampIcon.className = 'stamp-icon';

    const imagePaths = {
      attend: 'images/xinyun_attend.png',
      absent: 'images/xinyun_decline.png',
      keep: 'images/xinyun_keep.png'
    };

    stampIcon.src = imagePaths[choice] || imagePaths.keep;
    stampIcon.alt = choice === 'attend' ? '出席' : choice === 'absent' ? '欠席' : '保留';

    // スタイル設定
    stampIcon.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      z-index: 2;
      filter: drop-shadow(0 3px 10px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 15px rgba(255, 204, 0, 0.4));
      pointer-events: none;
      object-fit: cover;
      display: block;
      border-radius: 50%;
      clip-path: circle(50%);
    `;

    stampIcon.onload = () => console.log('✓ 画像読み込み成功:', stampIcon.src);
    stampIcon.onerror = () => {
      console.error('✗ 画像読み込み失敗:', stampIcon.src);
      stampIcon.style.display = 'none';
    };

    circle.style.position = 'relative';
    circle.appendChild(stampIcon);
  });

  // クリックイベント
  options.forEach((option) => {
    option.addEventListener('click', () => {
      if (selectedOption === option) return;

      // 前の選択のスタンプをアニメーション削除
      if (selectedOption) {
        const prevStampImg = selectedOption.querySelector('.stamp-icon');
        if (prevStampImg) {
          prevStampImg.style.transform = 'translate(-50%, -50%) scale(0) rotate(10deg)';
          prevStampImg.style.opacity = '0';
        }
        selectedOption.classList.remove('selected');
      }

      // 新しい選択を追加
      option.classList.add('selected');
      selectedOption = option;

      // スタンプをアニメーション
      const stampImg = option.querySelector('.stamp-icon');
      if (stampImg) {
        stampImg.style.transform = 'translate(-50%, -50%) scale(1) rotate(-10deg)';
        stampImg.style.opacity = '1';
      }

      // 隠れたinputに値を設定
      const hiddenInput = document.querySelector("input[name='attendance[]']");
      const choice = option.dataset.choice;
      const valueMap = { attend: '出席', absent: '欠席', keep: '保留' };
      if (hiddenInput) {
        hiddenInput.value = valueMap[choice] || '';
      }
    });
  });
});

// ========================================
// 郵便番号自動入力
// ========================================
async function searchPostalCode(postalCode) {
  const formattedPostal = postalCode.replace('-', '');

  // 方法1: zipaddress.net API
  try {
    const url = `https://zipaddress.net/api/v2/address?zipcode=${formattedPostal}&format=json`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.pref) {
        return `${data.pref}${data.city}${data.town}`;
      }
    }
  } catch (err) {
    console.log('zipaddress.net API失敗:', err.message);
  }

  // 方法2: 日本郵便 JSON API
  try {
    const url = `https://api.zipaddress.net/?zipcode=${formattedPostal}`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.code === 200 && data.data && data.data.pref) {
        return `${data.data.pref}${data.data.city}${data.data.town}`;
      }
    }
  } catch (err) {
    console.log('日本郵便 API失敗:', err.message);
  }

  return null;
}

function attachPostalListener(button) {
  button.addEventListener('click', async (e) => {
    e.preventDefault();

    const guestSection = button.closest('.rsvp-guest');
    if (!guestSection) return;

    const postalInput = guestSection.querySelector('input[name="postal_code[]"]');
    const addressInput = guestSection.querySelector('input[name="address[]"]');

    if (!postalInput || !addressInput) return;

    const postalCode = postalInput.value.trim();

    if (!postalCode) {
      alert('郵便番号を入力してください');
      return;
    }

    if (!/^\d{3}-\d{4}$|^\d{7}$/.test(postalCode)) {
      alert('郵便番号は「123-4567」または「1234567」の形式で入力してください。\nもしくは、お手数おかけしますが、ご自身で住所をご入力ください。');
      return;
    }

    const originalText = button.textContent;

    try {
      button.disabled = true;

      const address = await searchPostalCode(postalCode);

      if (address && address.trim() !== '') {
        addressInput.value = address;
        addressInput.focus();

        setTimeout(() => {
          button.textContent = originalText;
          button.disabled = false;
        }, 2000);
      } else {
        button.textContent = originalText;
        button.disabled = false;
        alert('該当する住所が見つかりませんでした。\nお手数おかけしますが、ご自身で住所をご入力ください。');
      }
    } catch (error) {
      console.error('エラー:', error);
      button.textContent = originalText;
      button.disabled = false;
      alert('住所の取得に失敗しました。\nお手数おかけしますが、ご自身で住所をご入力ください。');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 初期ロード時のボタン
  const initialButtons = document.querySelectorAll('.rsvp-postal-code-btn');
  initialButtons.forEach(btn => attachPostalListener(btn));
});

// ========================================
// フォーム送信
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#rsvp-form');

  if (!form) {
    console.error('フォーム (#rsvp-form) が見つかりません');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('フォーム送信開始');

    try {
      // ゲストデータ収集
      const guests = [];
      const guestElements = form.querySelectorAll('.rsvp-guest');

      console.log('ゲスト数:', guestElements.length);

      guestElements.forEach((guestEl, index) => {
        const firstName = guestEl.querySelector('input[name="first_name[]"]')?.value?.trim() || '';
        const lastName = guestEl.querySelector('input[name="last_name[]"]')?.value?.trim() || '';
        const email = guestEl.querySelector('input[name="email[]"]')?.value?.trim() || '';
        const address = guestEl.querySelector('input[name="address[]"]')?.value?.trim() || '';

        if (!firstName || !lastName || !email || !address) {
          alert(`Guest ${index + 1}: 名前、メール、住所は必須です`);
          throw new Error(`Guest ${index + 1}: 必須項目が不足`);
        }

        const guest = {
          guest_no: index + 1,
          first_name: firstName,
          last_name: lastName,
          first_name_kana: guestEl.querySelector('input[name="first_name_kana[]"]')?.value?.trim() || '',
          last_name_kana: guestEl.querySelector('input[name="last_name_kana[]"]')?.value?.trim() || '',
          email: email,
          postal_code: guestEl.querySelector('input[name="postal_code[]"]')?.value?.trim() || '',
          address: address,
          allergy: guestEl.querySelector('input[name="allergy[]"]')?.value?.trim() || '',
          message: guestEl.querySelector('textarea[name="message[]"]')?.value?.trim() || ''
        };

        guests.push(guest);
      });

      // 出席状況
      const selectedOption = document.querySelector('.rsvp-attend-option.selected');
      const attendance = selectedOption?.dataset.choice || 'unknown';

      const payload = {
        timestamp: new Date().toLocaleString('ja-JP'),
        attendance: attendance,
        guests: JSON.stringify(guests)
      };

      console.log('送信ペイロード:', payload);

      const scriptURL = 'https://script.google.com/macros/s/AKfycbwloLi5vVoXQjwphtVUsuCHi1tBjb4qhw-IgH7m0uR8B0rFdTyI4GJV57lb96Ds1fb9Ig/exec';

      const response = await fetch(scriptURL, {
        method: 'POST',
        body: new URLSearchParams(payload),
        mode: 'no-cors'
      });

      console.log('レスポンス受信:', response);

      alert('ご予約ありがとうございます！\n新郎新婦からの連絡をお待ちください');
      
      form.reset();
      document.querySelectorAll('.rsvp-attend-option').forEach(o => o.classList.remove('selected'));

    } catch (error) {
      console.error('送信エラー:', error);
      alert('エラーが発生しました。\n' + error.message);
    }
  });
});