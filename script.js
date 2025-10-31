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
document.getElementById('rsvp-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    // Googleフォームの送信URL（あなたのフォームのURLに置き換えてください）
    const formURL = "https://docs.google.com/forms/d/e/1FAIpQLScd4O7WPMugqDHceeJO7O3tH-U6rMiv2fhKTDUGgeCxQgxhsg/formResponse";
  
    // 各 entry番号（あなたのフォームの質問に合わせて変更）
    const entryName = "entry.283012233";
    const entryAttendance = "entry.43483956";
    const entryMessage = "entry.2107956952";
  
    // 入力値の取得
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;
    const message = document.getElementById('message').value;
  
    // Googleフォームに送信
    const formData = new FormData();
    formData.append(entryName, name);
    formData.append(entryAttendance, attendance);
    formData.append(entryMessage, message);
  
    fetch(formURL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    }).then(() => {
      // 送信完了後に新しいページを開く
      const newPage = `
        <html>
        <head>
          <meta charset="UTF-8">
          <title>RSVP Confirmation</title>
          <style>
            body { font-family: sans-serif; margin: 40px; line-height: 1.8; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>ご回答ありがとうございます / Thank You for Your Response</h1>
          <p><strong>お名前 / Name:</strong> ${name}</p>
          <p><strong>ご出欠 / Attendance:</strong> ${attendance}</p>
          <p><strong>メッセージ / Message:</strong> ${message || "（なし / None）"}</p>
          <p>このページを保存して控えとしてお使いください。</p>
        </body>
        </html>
      `;
  
      const newWindow = window.open();
      newWindow.document.write(newPage);
      newWindow.document.close();
    });
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