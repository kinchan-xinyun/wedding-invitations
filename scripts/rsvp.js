// --- Add Guest Handling ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('rsvp-form');
  const addBtn = document.getElementById('rsvp-add-guest-btn');

  if (!form || !addBtn) {
    console.error('フォームまたはボタンが見つかりません');
    return;
  }

  const firstGuest = form.querySelector('.rsvp-guest');
  const firstAddress = firstGuest.querySelector('input[name="address[]"]');

  addBtn.addEventListener('click', () => {
    const newGuest = firstGuest.cloneNode(true);
    const guestCount = form.querySelectorAll('.rsvp-guest').length + 1;

    // reset values
    newGuest.querySelectorAll('input, textarea').forEach(el => {
      if (el.type !== 'checkbox') el.value = '';
      el.required = el.hasAttribute('required');
    });

    // update guest number
    const header = newGuest.querySelector('.rsvp-guest-header .rsvp-guest-title');
    header.textContent = `Guest ${guestCount}`;

    // show remove button
    const removeBtn = newGuest.querySelector('.rsvp-remove-guest');
    if (removeBtn) {
      removeBtn.style.display = 'inline-block';
    }

    // remove "open" class so it's closed by default
    newGuest.classList.remove('rsvp-open');

    // 住所欄の下に「送信者と同じ住所」チェックを追加
    const addressField = newGuest.querySelector('.rsvp-field-row:has(input[name="address[]"])');
    if (addressField) {
      let sameAddressDiv = document.createElement('div');
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

    // add to form
    form.insertBefore(newGuest, addBtn);

    // bind all needed events
    bindGuestEvents(newGuest);
  });

  function bindGuestEvents(guest) {
    const removeBtn = guest.querySelector('.rsvp-remove-guest');
    const header = guest.querySelector('.rsvp-guest-header');
    const sameAddressCheckbox = guest.querySelector('.same-as-first-address');
    const postalInput = guest.querySelector('input[name="postal_code[]"]');
    const addressInput = guest.querySelector('input[name="address[]"]');

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        guest.remove();
        updateGuestNumbers();
      });
    }

    if (header) {
      header.addEventListener('click', () => {
        guest.classList.toggle('rsvp-open');
      });
    }

    // 「送信者と同じ住所」チェックボックスの処理
    if (sameAddressCheckbox) {
      sameAddressCheckbox.addEventListener('change', () => {
        if (sameAddressCheckbox.checked) {
          const firstPostalInput = firstGuest.querySelector('input[name="postal_code[]"]');
          const firstAddressInput = firstGuest.querySelector('input[name="address[]"]');
          
          postalInput.value = firstPostalInput.value;
          addressInput.value = firstAddressInput.value;
        } else {
          postalInput.value = '';
          addressInput.value = '';
        }
      });
    }

    // 郵便番号ボタンにも対応させる
    attachPostalListener(guest.querySelector('.rsvp-postal-code-btn'));
  }

  function updateGuestNumbers() {
    form.querySelectorAll('.rsvp-guest').forEach((guest, index) => {
      const title = guest.querySelector('.rsvp-guest-title');
      if (index === 0) title.textContent = `Guest 1（送信者）`;
      else title.textContent = `Guest ${index + 1}`;
    });
  }

  bindGuestEvents(firstGuest);
});

// --- 出席選択の処理 ---
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".rsvp-attend-option");
  
  console.log("出席ボタン数:", options.length);

  options.forEach((option, index) => {
    const circle = option.querySelector(".rsvp-circle");
    const choice = option.dataset.choice;
    
    console.log(`ボタン${index}: choice=${choice}, circle=`, circle);
    
    // circle の位置指定を確認
    if (circle) {
      circle.style.position = "relative";
      const computedStyle = window.getComputedStyle(circle);
      console.log(`circle のposition: ${computedStyle.position}`);
    }
    
    // 選択に応じたスタンプ画像を作成
    const stampIcon = document.createElement("img");
    stampIcon.className = "stamp-icon";
    
    let imagePath = "";
    if (choice === "attend") {
      imagePath = "images/xinyun_attend.png";
    } else if (choice === "absent") {
      imagePath = "images/xinyun_decline.png";
    } else {
      imagePath = "images/xinyun_keep.png";
    }
    
    console.log(`画像パス: ${imagePath}`);
    
    stampIcon.src = imagePath;
    stampIcon.alt = choice === "attend" ? "出席" : choice === "absent" ? "欠席" : "保留";
    
     // スタイルを個別に設定
     stampIcon.style.position = "absolute";
     stampIcon.style.top = "50%";
     stampIcon.style.left = "50%";
     stampIcon.style.transform = "translate(-50%, -50%) scale(0)";
     stampIcon.style.width = "100%";
     stampIcon.style.height = "100%";
     stampIcon.style.opacity = "0";
     stampIcon.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
     stampIcon.style.zIndex = "2";
     stampIcon.style.filter = "drop-shadow(0 3px 10px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 15px rgba(255, 204, 0, 0.4))";
     stampIcon.style.pointerEvents = "none";
     stampIcon.style.objectFit = "cover";
     stampIcon.style.display = "block";
     stampIcon.style.borderRadius = "50%";
     stampIcon.style.clipPath = "circle(50%)";
    
    // 画像読み込み成功時
    stampIcon.onload = function() {
      console.log(`✓ 画像読み込み成功: ${imagePath}`);
    };
    
    // 画像読み込み失敗時
    stampIcon.onerror = function() {
      console.error(`✗ 画像読み込み失敗: ${imagePath}`);
      this.style.display = "none";
    };
    
    circle.appendChild(stampIcon);
    console.log(`画像要素を追加: `, stampIcon);
  });

  // 選択状態を保持するための変数
  let selectedOption = null;

  options.forEach((option) => {
    option.addEventListener("click", () => {
      console.log("ボタンがクリックされました");
      
      // 同じボタンが既に選択されている場合は何もしない
      if (selectedOption === option) {
        console.log("既に選択されています");
        return;
      }
      
      // 他のオプションから selected クラスを削除
      options.forEach((o) => {
        o.classList.remove("selected");
      });

      // クリックされたオプションに selected クラスを追加
      option.classList.add("selected");
      selectedOption = option;
      console.log("selected クラスを追加しました");

      // スタンプ画像のアニメーション確認
      const stampImg = option.querySelector(".stamp-icon");
      if (stampImg) {
        console.log("スタンプ画像が存在します");
        // 選択状態を強制的に保持
        stampImg.style.transform = "translate(-50%, -50%) scale(1) rotate(-10deg) !important";
        stampImg.style.opacity = "1 !important";
        console.log("現在のスタイル:", {
          transform: stampImg.style.transform,
          opacity: stampImg.style.opacity
        });
      } else {
        console.warn("スタンプ画像が見つかりません");
      }

      // 隠れたinput要素に値を設定
      const hiddenInput = document.querySelector("input[name='attendance[]']");
      const choice = option.dataset.choice;

      let valueText = "";
      if (choice === "attend") valueText = "出席";
      else if (choice === "absent") valueText = "欠席";
      else valueText = "保留";

      hiddenInput.value = valueText;
      console.log(`選択: ${valueText}`);
    });
  });
});

// 郵便番号自動入力機能
document.addEventListener('DOMContentLoaded', function() {
  
  // 郵便番号検索関数
  async function searchPostalCode(postalCode) {
    const formattedPostal = postalCode.replace('-', '');
    console.log('郵便番号検索開始:', formattedPostal);
    
    let address = null;
    
    // 方法1: 日本郵便のJSON API
    try {
      console.log('日本郵便JSON API試行中...');
      const url = `https://api.zipaddress.net/?zipcode=${formattedPostal}`;
      const response = await fetch(url);
      console.log('日本郵便JSON レスポンスステータス:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('日本郵便JSON レスポンス:', data);
        
        if (data.code === 200 && data.data && data.data.pref) {
          address = `${data.data.pref}${data.data.city}${data.data.town}`;
          console.log('日本郵便JSONから住所取得成功:', address);
          return address;
        }
      }
    } catch (err) {
      console.log('日本郵便JSON API失敗:', err.message);
    }
    
    // 方法2: zipaddress.net API
    try {
      console.log('zipaddress.net API試行中...');
      const url2 = `https://zipaddress.net/api/v2/address?zipcode=${formattedPostal}&format=json`;
      const response2 = await fetch(url2);
      console.log('zipaddress.net レスポンスステータス:', response2.status);
      
      if (response2.ok) {
        const data2 = await response2.json();
        console.log('zipaddress.net レスポンス:', data2);
        
        if (data2.pref) {
          address = `${data2.pref}${data2.city}${data2.town}`;
          console.log('zipaddress.netから住所取得成功:', address);
          return address;
        }
      }
    } catch (err) {
      console.log('zipaddress.net API失敗:', err.message);
    }
    
    // 方法3: geonames API
    try {
      console.log('geonames API試行中...');
      const url3 = `http://api.geonames.org/postalCodeSearchJSON?postalcode=${formattedPostal}&country=JP&username=demo`;
      const response3 = await fetch(url3);
      console.log('geonames レスポンスステータス:', response3.status);
      
      if (response3.ok) {
        const data3 = await response3.json();
        console.log('geonames レスポンス:', data3);
        
        if (data3.postalCodes && data3.postalCodes.length > 0) {
          const result = data3.postalCodes[0];
          address = `${result.adminName1}${result.adminName2}${result.placeName}`;
          console.log('geonamesから住所取得成功:', address);
          return address;
        }
      }
    } catch (err) {
      console.log('geonames API失敗:', err.message);
    }
    
    return null;
  }
  
  // 郵便番号ボタンのイベントリスナーを設定する関数
  function attachPostalListener(button) {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const guestSection = this.closest('.rsvp-guest');
      const postalInput = guestSection.querySelector('input[name="postal_code[]"]');
      const addressInput = guestSection.querySelector('input[name="address[]"]');
      
      const postalCode = postalInput.value.trim();
      
      if (!postalCode) {
        alert('郵便番号を入力してください');
        return;
      }
      
      if (!/^\d{3}-\d{4}$|^\d{7}$/.test(postalCode)) {
        alert('郵便番号は「123-4567」または「1234567」の形式で入力してください');
        return;
      }
      
      const originalText = this.textContent;
      
      try {
        this.disabled = true;
        this.textContent = '検索中...';
        
        const address = await searchPostalCode(postalCode);
        
        if (address && address.trim() !== '') {
          addressInput.value = address;
          addressInput.focus();
          this.textContent = '完了';
          
          // 2秒後に元のテキストに戻す
          setTimeout(() => {
            this.textContent = originalText;
            this.disabled = false;
          }, 2000);
        } else {
          this.textContent = originalText;
          this.disabled = false;
          alert('該当する住所が見つかりませんでした。\n\n郵便番号をご確認ください。');
        }
      } catch (error) {
        console.error('エラー:', error);
        this.textContent = originalText;
        this.disabled = false;
        alert('住所の取得に失敗しました。\nもう一度お試しください。');
      }
    });
  }
  
  // 初期ロード時のボタンに対応
  const initialButtons = document.querySelectorAll('.rsvp-postal-code-btn');
  initialButtons.forEach(btn => {
    btn.setAttribute('data-initialized', 'true');
    attachPostalListener(btn);
  });
  
  // ゲスト追加時に新しいボタンに対応
  const addGuestBtn = document.getElementById('rsvp-add-guest-btn');
  if (addGuestBtn) {
    const observer = new MutationObserver(function(mutations) {
      const newButtons = document.querySelectorAll('.rsvp-postal-code-btn:not([data-initialized])');
      newButtons.forEach(btn => {
        btn.setAttribute('data-initialized', 'true');
        attachPostalListener(btn);
      });
    });
    
    observer.observe(document.getElementById('rsvp-form'), {
      childList: true,
      subtree: true
    });
  }
});