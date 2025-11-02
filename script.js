window.addEventListener("DOMContentLoaded", () => {
    const intro = document.querySelector(".intro-screen");
    const slideContainer = document.querySelector(".slide-container");
    const topSlide = document.querySelector(".top-slide");
    const bottomSlide = document.querySelector(".bottom-slide");
    const languageScreen = document.querySelector(".language-screen");
  
    document.getElementById("jp-btn").addEventListener("click", () => {
      window.location.href = "jp.html";
    });
    document.getElementById("cn-btn").addEventListener("click", () => {
      window.location.href = "cn.html";
    });
  });

  // スマホでのタップ感度向上
  document.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("touchstart", () => btn.style.transform = "scale(1.05)");
    btn.addEventListener("touchend", () => btn.style.transform = "scale(1.0)");
  });

  document.addEventListener("DOMContentLoaded", () => {
    const fadeSections = document.querySelectorAll(".fade-section");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          // 一度表示したら監視解除（再スクロールでも消えない）
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2, // 画面に20%見えたら反応
    });
  
    fadeSections.forEach((section) => {
      observer.observe(section);
    });
  });

// === COUNTDOWN SCRIPT ===
document.addEventListener("DOMContentLoaded", function() {
  const targetDate = new Date("2026-10-26T00:00:00+09:00"); // 日本時間

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;
    const finishEl = document.getElementById("countdown-finish");

    if (diff <= 0) {
      document.getElementById("countdown-timer").style.display = "none";
      finishEl.textContent = "✨ TODAY IS THE WEDDING DAY! ✨";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
});

// --- Add Guest Handling ---
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestForm');
  const addBtn = document.getElementById('addGuestBtn');

  const firstGuest = form.querySelector('.guest');
  const firstAddress = firstGuest.querySelector('input[name="address[]"]');

  addBtn.addEventListener('click', () => {
    const newGuest = firstGuest.cloneNode(true);
    const guestCount = form.querySelectorAll('.guest').length + 1;

    // reset values
    newGuest.querySelectorAll('input, textarea').forEach(el => {
      if (el.type !== 'checkbox') el.value = '';
      el.required = el.hasAttribute('required'); // keep required
    });

    // 住所欄の下に「送信者と同じ住所」チェックを追加
    let sameAddressDiv = document.createElement('div');
    sameAddressDiv.classList.add('same-address');
    sameAddressDiv.innerHTML = `
      <input type="checkbox" class="same-as-first">
      <label>送信者と同じ住所</label>
    `;
    const addressRow = newGuest.querySelector('input[name="address[]"]').parentNode;
    addressRow.appendChild(sameAddressDiv);

    // update guest number
    const header = newGuest.querySelector('.guest-header .guest-title');
    header.textContent = `Guest ${guestCount}`;

    // show remove button
    newGuest.querySelector('.remove-guest').style.display = 'inline-block';

    // remove "open" class so it's closed by default
    newGuest.classList.remove('open');

    // add to form
    form.insertBefore(newGuest, addBtn);

    // bind all needed events
    bindGuestEvents(newGuest);
  });

  function bindGuestEvents(guest) {
    const removeBtn = guest.querySelector('.remove-guest');
    const header = guest.querySelector('.guest-header');
    const sameCheck = guest.querySelector('.same-as-first');
    const addressInput = guest.querySelector('input[name="address[]"]');

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        guest.remove();
        updateGuestNumbers();
      });
    }

    if (header) {
      header.addEventListener('click', () => {
        guest.classList.toggle('open');
      });
    }

    if (sameCheck) {
      sameCheck.addEventListener('change', () => {
        if (sameCheck.checked) {
          addressInput.value = firstAddress.value;
        } else {
          addressInput.value = '';
        }
      });
    }
  }

  function updateGuestNumbers() {
    form.querySelectorAll('.guest').forEach((guest, index) => {
      const title = guest.querySelector('.guest-title');
      if (index === 0) title.textContent = `Guest 1（送信者）`;
      else title.textContent = `Guest ${index + 1}`;
    });
  }

  bindGuestEvents(firstGuest);
});

// --- Form Submission Handling (API Call) / フォーム送信時の処理 ---
document.getElementById("guestForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const guests = [];
  document.querySelectorAll(".guest").forEach((guest) => {
    const data = {
      first_name: guest.querySelector('input[name="first_name[]"]')?.value || "",
      last_name: guest.querySelector('input[name="last_name[]"]')?.value || "",
      first_name_kana: guest.querySelector('input[name="first_name_kana[]"]')?.value || "",
      last_name_kana: guest.querySelector('input[name="last_name_kana[]"]')?.value || "",
      email: guest.querySelector('input[name="email[]"]')?.value || "",
      address: guest.querySelector('input[name="address[]"]')?.value || "",
      allergy: guest.querySelector('input[placeholder="アレルギー"]')?.value || "",
      message: guest.querySelector('textarea')?.value || ""
    };
    guests.push(data);
  });

  const scriptURL = "https://script.google.com/macros/s/AKfycbwsw62EleW4hvYPL1Kr2Ju6I9fc-bSYyzzK1UYeR7DkjydE3ZER63rN6lF-WlTSkOm-Eg/exec";

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: new URLSearchParams({
        guests: JSON.stringify(guests) // 複数ゲストをまとめて送信
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("非200応答:", response.status, text);
      alert("サーバーエラーが発生しました。管理者に連絡してください。");
      return;
    }

    const result = await response.json();

    if (result.status === "success") {
      alert("送信が完了しました！ありがとうございます。");
      document.getElementById("guestForm").reset();
    } else {
      console.error("GASエラー:", result);
      alert("送信中にエラーが発生しました。");
    }
  } catch (error) {
    console.error("通信例外:", error);
    alert("通信エラーが発生しました。ブラウザのコンソールを確認してください。");
  }
});

