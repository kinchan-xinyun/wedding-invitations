// === タイプライターアニメーション ===
function initTypewriter() {
    const typewriterLines = document.querySelectorAll(".typewriter-line");
    let totalDelay = 0;
  
    typewriterLines.forEach((element, lineIndex) => {
      const text = element.textContent;
      element.textContent = ""; // テキストをクリア
      element.style.minHeight = "1em"; // 高さを確保
  
      // 各文字を一文字ずつ表示
      let currentIndex = 0;
      const charDelay = 100; // 1文字の表示間隔（ミリ秒）
  
      const startTyping = () => {
        const charInterval = setInterval(() => {
          if (currentIndex < text.length) {
            element.textContent += text[currentIndex];
            currentIndex++;
          } else {
            clearInterval(charInterval);
            // この行の次の行を開始
            if (lineIndex === 0) {
              typewriterLines[1] ? startNextLine() : null;
            }
          }
        }, charDelay);
      };
  
      const startNextLine = () => {
        const nextElement = typewriterLines[1];
        const nextText = nextElement.textContent || "No life."; // HTMLから取得
        nextElement.textContent = "";
        let nextIndex = 0;
  
        const nextCharInterval = setInterval(() => {
          if (nextIndex < nextText.length) {
            nextElement.textContent += nextText[nextIndex];
            nextIndex++;
          } else {
            clearInterval(nextCharInterval);
          }
        }, charDelay);
      };
  
      if (lineIndex === 0) {
        startTyping();
      }
    });
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    // タイプライターアニメーション初期化
    initTypewriter();
  
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