// --- スライドショー機能 ---
let slideIndex = 0;
showSlides();

function showSlides() {
  let i;
  // 'mySlides' クラスを持つ要素（写真）をすべて取得
  let slides = document.getElementsByClassName("mySlides");
  
  // すべてのスライドを非表示にする
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  // スライドインデックスを更新
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  
  // 現在のスライドを表示
  slides[slideIndex-1].style.display = "block";  
  
  // 5秒ごとにスライドを切り替える
  setTimeout(showSlides, 5000); 
}

// --- Form Submission Handling (API Call) / フォーム送信時の処理 ---
document.getElementById("rsvp-form").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const data = {
      name: document.getElementById("name").value,
      attendance: document.getElementById("attendance").value,
      message: document.getElementById("message").value
    };
  
    const scriptURL = "https://script.google.com/macros/s/AKfycbyqAkS2OwXGyeNarkuOLXFQyz5gSMuHEdRAUqy1dBt8ZKlx3gfxtcfXIqmLD1ctlu-azQ/exec";
  
  // URLSearchParams を使って application/x-www-form-urlencoded で送る
  const body = new URLSearchParams(data);

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: body,
      // Content-Type を指定しない（fetch が自動で適切に設定する）
    });

    // ネットワークが返したステータスをチェック
    if (!response.ok) {
      const text = await response.text();
      console.error("非 200 応答:", response.status, text);
      alert("サーバーエラーが発生しました。管理者に連絡してください。");
      return;
    }

    const result = await response.json();

    if (result.status === "success") {
      alert("送信が完了しました！ありがとうございます。");
      document.getElementById("rsvp-form").reset();
    } else {
      console.error("GAS エラー:", result);
      alert("送信中にエラーが発生しました。");
    }
  } catch (error) {
    console.error("通信例外:", error);
    alert("通信エラーが発生しました。ブラウザのコンソールにエラーを表示しました。");
  }
});

// --- スムーススクロール機能 ---
document.querySelectorAll('.scroll-link').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});