// ========================================
// Firebase設定とフォーム送信
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase設定
const firebaseConfig = {
    apiKey: "AIzaSyCu2Cl4bHBM_53rPdSu1QutxPXLvF-HceU",
    authDomain: "li-oda-wedding.firebaseapp.com",
    projectId: "li-oda-wedding",
    storageBucket: "li-oda-wedding.firebasestorage.app",
    messagingSenderId: "790785209352",
    appId: "1:790785209352:web:1bad9b3725691cf8af8dbd",
    measurementId: "G-GTG79DQX1H"
};

// Firebase初期化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
// 招待コード認証
// ========================================
let currentInviteCode = null;
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  setupFormSubmit();
});

function checkAuthentication() {
  // セッションストレージから招待コードを取得
  const storedCode = sessionStorage.getItem('inviteCode');
  
  if (storedCode) {
    currentInviteCode = storedCode;
    isAuthenticated = true;
    showRSVPForm();
    // リロード時は既存回答のチェックをしない（招待コード入力時のみチェック）
  } else {
    showInviteCodePrompt();
  }
}

function showInviteCodePrompt() {
  const form = document.querySelector('#rsvp-form');
  if (!form) return;

  // フォームを非表示
  form.style.display = 'none';

  // 認証画面を作成
  const authDiv = document.createElement('div');
  authDiv.id = 'invite-code-auth';
  authDiv.innerHTML = `
    <div style="
      max-width: 750px; 
      margin: 50px auto; 
      padding: 30px; 
      background: #FFFFFF; 
      border-radius: 8px; 
      border: 4px solid #E53935;
      box-shadow: 4px 4px 0 #FFC107;
      position: relative;
      font-family: 'Yusei Magic', sans-serif;
    ">
      <div style="
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border: 2px dashed #666;
        pointer-events: none;
        z-index: 0;
      "></div>
      <div style="position: relative; z-index: 1;">
        <h2 style="
          text-align: center; 
          margin-bottom: 20px; 
          color: #E53935;
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-shadow: 2px 2px 0px #000000;
        ">🎊 招待コード入力</h2>
        <p style="
          margin-bottom: 25px; 
          color: #000000; 
          line-height: 1.8;
          text-align: center;
          font-size: 1.1rem;
        ">
          招待状に記載された招待コードを入力してください
        </p>
        <input type="text" id="invite-code-input" placeholder="例: ABC123XYZ" 
          style="
            width: 100%; 
            padding: 12px; 
            font-size: 16px; 
            border: 2px solid #0f0f0f; 
            border-radius: 4px; 
            margin-bottom: 20px; 
            box-sizing: border-box;
            font-family: 'Yusei Magic', sans-serif;
            background: #FFFFFF;
            color: #000000;
          ">
        <button id="verify-code-btn" 
          style="
            width: 100%; 
            padding: 12px 30px; 
            background: #E53935; 
            color: #FFFFFF; 
            border: 3px solid #0f0f0f; 
            border-radius: 4px; 
            font-size: 16px; 
            font-weight: 900;
            cursor: pointer; 
            transition: all 0.2s ease;
            font-family: 'Yusei Magic', sans-serif;
            box-shadow: 4px 4px 0px #FFC107;
          ">
          確認
        </button>
        <p style="
          margin-top: 20px; 
          font-size: 14px; 
          color: #666; 
          text-align: center;
          line-height: 1.6;
        ">
          招待コードが不明な場合は、新郎新婦にお問い合わせください
        </p>
      </div>
    </div>
  `;

  form.parentNode.insertBefore(authDiv, form);

  // イベントリスナー
  document.getElementById('verify-code-btn').addEventListener('click', verifyInviteCode);
  const input = document.getElementById('invite-code-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyInviteCode();
  });
  
  // 入力フィールドのフォーカススタイル
  input.addEventListener('focus', () => {
    input.style.borderColor = '#E53935';
    input.style.outline = 'none';
    input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.2)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = '#0f0f0f';
    input.style.boxShadow = 'none';
  });

  // ボタンホバー効果
  const btn = document.getElementById('verify-code-btn');
  btn.addEventListener('mouseenter', () => {
    btn.style.background = '#FFC107';
    btn.style.color = '#E53935';
    btn.style.transform = 'translate(-1px, -1px)';
    btn.style.boxShadow = '5px 5px 0px #E53935';
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.background = '#E53935';
    btn.style.color = '#FFFFFF';
    btn.style.transform = 'translate(0, 0)';
    btn.style.boxShadow = '4px 4px 0px #FFC107';
  });
}

async function verifyInviteCode() {
  const input = document.getElementById('invite-code-input');
  const code = input.value.trim().toUpperCase();

  if (!code) {
    alert('招待コードを入力してください');
    input.style.borderColor = '#E53935';
    input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.3)';
    input.focus();
    return;
  }

  const btn = document.getElementById('verify-code-btn');
  btn.disabled = true;
  btn.textContent = '確認中...';
  btn.style.background = '#999';
  btn.style.cursor = 'not-allowed';
  btn.style.boxShadow = '2px 2px 0px #666';

  try {
    // Firestoreで招待コードを確認
    const inviteDoc = await getDoc(doc(db, 'invitations', code));

    if (inviteDoc.exists()) {
      currentInviteCode = code;
      isAuthenticated = true;
      sessionStorage.setItem('inviteCode', code);

      // 認証画面を削除
      document.getElementById('invite-code-auth').remove();
      
      // RSVPフォームを表示
      showRSVPForm();

      // 既存の回答があれば読み込む
      await loadExistingResponse(code);
    } else {
      alert('招待コードが正しくありません。\n招待状をご確認ください。');
      input.value = '';
      input.style.borderColor = '#E53935';
      input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.3)';
      input.focus();
      btn.disabled = false;
      btn.textContent = '確認';
      btn.style.background = '#E53935';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '4px 4px 0px #FFC107';
    }
  } catch (error) {
    console.error('認証エラー:', error);
    alert('認証中にエラーが発生しました。\nもう一度お試しください。\n\nエラー詳細: ' + error.message);
    btn.disabled = false;
    btn.textContent = '確認';
    btn.style.background = '#E53935';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '4px 4px 0px #FFC107';
  }
}

function showRSVPForm() {
  const form = document.querySelector('#rsvp-form');
  if (form) {
    form.style.display = 'block';
  }
}

async function loadExistingResponse(code) {
  try {
    // この招待コードで既に確認したかチェック
    const confirmedKey = `confirmed_${code}`;
    const alreadyConfirmed = sessionStorage.getItem(confirmedKey);
    
    const responseDoc = await getDoc(doc(db, 'responses', code));
    
    if (responseDoc.exists()) {
      const data = responseDoc.data();
      
      // 既に確認済みの場合はダイアログを表示しない
      if (alreadyConfirmed) {
        console.log('既存データあり（確認済み）');
        return;
      }
      
      const reload = confirm('以前の回答が見つかりました。\n内容を読み込みますか?\n\n「OK」= 読み込む\n「キャンセル」= 新規入力');
      
      // 確認したことを記録
      sessionStorage.setItem(confirmedKey, 'true');
      
      if (reload && data.guests) {
        console.log('既存データ読み込み:', data);
        fillFormWithExistingData(data);
      }
    }
  } catch (error) {
    console.error('データ読み込みエラー:', error);
  }
}

// フォームに既存データを入力する関数
function fillFormWithExistingData(data) {
  const form = document.querySelector('#rsvp-form');
  if (!form) return;

  // 出席状況を設定
  if (data.attendance) {
    const attendanceMap = {
      '出席': 'attend',
      '欠席': 'absent',
      '保留': 'keep'
    };
    const choice = attendanceMap[data.attendance] || data.attendance;
    const option = document.querySelector(`.rsvp-attend-option[data-choice="${choice}"]`);
    if (option) {
      option.click();
    }
  }

  // ゲストデータを入力
  if (data.guests && Array.isArray(data.guests)) {
    const existingGuests = form.querySelectorAll('.rsvp-guest');
    
    // 必要に応じてゲストを追加
    const addGuestBtn = document.getElementById('rsvp-add-guest-btn');
    while (existingGuests.length < data.guests.length && addGuestBtn) {
      addGuestBtn.click();
    }
    
    // 少し待ってから入力（ゲストが追加されるのを待つ）
    setTimeout(() => {
      const allGuests = form.querySelectorAll('.rsvp-guest');
      
      data.guests.forEach((guest, index) => {
        if (index < allGuests.length) {
          const guestEl = allGuests[index];
          
          // 各フィールドに値を設定
          const firstNameInput = guestEl.querySelector('input[name="firstName[]"]');
          const lastNameInput = guestEl.querySelector('input[name="lastName[]"]');
          const firstNameKanaInput = guestEl.querySelector('input[name="firstNameKana[]"]');
          const lastNameKanaInput = guestEl.querySelector('input[name="lastNameKana[]"]');
          const emailInput = guestEl.querySelector('input[name="email[]"]');
          const postalCodeInput = guestEl.querySelector('input[name="postalCode[]"]');
          const addressInput = guestEl.querySelector('input[name="address[]"]');
          const allergiesInput = guestEl.querySelector('input[name="allergies[]"]');
          const messageInput = guestEl.querySelector('textarea[name="message[]"]');
          const notesInput = guestEl.querySelector('textarea[name="notes[]"]');
          
          if (firstNameInput) firstNameInput.value = guest.firstName || '';
          if (lastNameInput) lastNameInput.value = guest.lastName || '';
          if (firstNameKanaInput) firstNameKanaInput.value = guest.firstNameKana || '';
          if (lastNameKanaInput) lastNameKanaInput.value = guest.lastNameKana || '';
          if (emailInput) emailInput.value = guest.email || '';
          if (postalCodeInput) postalCodeInput.value = guest.postalCode || '';
          if (addressInput) addressInput.value = guest.address || '';
          if (allergiesInput) allergiesInput.value = guest.allergies || '';
          if (messageInput) messageInput.value = guest.message || '';
        }
      });
      
      console.log('✅ フォームに既存データを入力しました');
      alert('✅ 以前の回答を読み込みました！\n内容を確認・編集して再送信してください。');
    }, 500);
  }
}

// ========================================
// フォーム送信処理
// ========================================
function setupFormSubmit() {
  const form = document.querySelector('#rsvp-form');

  if (!form) {
    console.error('フォーム (#rsvp-form) が見つかりません');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('フォーム送信開始');

    // 認証チェック
    if (!isAuthenticated || !currentInviteCode) {
      alert('招待コード認証が必要です。\nページを再読み込みしてください。');
      return;
    }

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
          guestNo: index + 1,
          firstName: firstName,
          lastName: lastName,
          firstNameKana: guestEl.querySelector('input[name="first_name_kana[]"]')?.value?.trim() || '',
          lastNameKana: guestEl.querySelector('input[name="last_name_kana[]"]')?.value?.trim() || '',
          email: email,
          postalCode: guestEl.querySelector('input[name="postal_code[]"]')?.value?.trim() || '',
          address: address,
          allergy: guestEl.querySelector('input[name="allergy[]"]')?.value?.trim() || '',
          message: guestEl.querySelector('textarea[name="message[]"]')?.value?.trim() || ''
        };

        guests.push(guest);
      });

      // 出席状況
      const selectedOption = document.querySelector('.rsvp-attend-option.selected');
      const attendance = selectedOption?.dataset.choice || 'unknown';

      // Firebaseに保存するデータ
      const payload = {
        inviteCode: currentInviteCode,
        timestamp: new Date().toISOString(),
        timestampJst: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        lastUpdated: serverTimestamp(),
        attendance: attendance,
        guestCount: guests.length,
        guests: guests, // オブジェクト配列として直接保存
        rawGuestsJson: JSON.stringify(guests) // バックアップ用
      };

      console.log('送信ペイロード:', payload);

      // Firestoreに保存
      await setDoc(doc(db, 'responses', currentInviteCode), payload, { merge: true });

      console.log('Firestore保存成功');

      alert('✅ ご予約ありがとうございます！\n新郎新婦からの連絡をお待ちください');
      
      // フォームリセット
      form.reset();
      document.querySelectorAll('.rsvp-attend-option').forEach(o => o.classList.remove('selected'));

    } catch (error) {
      console.error('送信エラー:', error);
      alert('❌ エラーが発生しました。\n\nエラー詳細:\n' + error.message + '\n\nもう一度お試しいただくか、新郎新婦にご連絡ください。');
    }
  });
}