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

// --- フォーム送信時の処理（デモ用） ---
document.getElementById('rsvp-form').addEventListener('submit', function(event) {
    event.preventDefault(); // ページの再読み込みを防ぐ

    // フォームデータを取得
    const name = document.getElementById('name').value;
    const attendance = document.getElementById('attendance').value;

    if (attendance === 'attend') {
        alert(`${name}様、ご参加ありがとうございます！当日お会いできるのを楽しみにしています！`);
    } else if (attendance === 'decline') {
        alert(`${name}様、ご連絡ありがとうございます。また改めてお会いできる機会を楽しみにしております。`);
    } else {
        alert('回答が送信されました。改めてご連絡いたします。');
    }

    // 実際には、ここでサーバーサイドのエンドポイントにデータを送信する処理（fetch APIなど）が必要です。
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