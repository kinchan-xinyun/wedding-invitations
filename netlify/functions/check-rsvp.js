// check-rsvp.js
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// ★ Firebaseの初期化は共通（必要に応じて関数外で実行）
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

exports.handler = async (event, context) => {
  const confirmationId = event.queryStringParameters.id;

  if (!confirmationId) {
    return {
      statusCode: 400,
      body: 'IDが指定されていません。',
    };
  }

  try {
    const doc = await db.collection('rsvps').doc(confirmationId).get();

    if (!doc.exists) {
      return {
        statusCode: 404,
        body: '回答が見つかりませんでした。',
      };
    }

    const data = doc.data();
    const status = data.attendance === 'attend' ? '【ご出席】' : '【ご欠席】';

    // 回答内容をHTMLとしてレンダリング
    const htmlResponse = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>ご回答の確認 | A & P Wedding GIG</title>
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; border: 5px solid #CC0000; box-shadow: 10px 10px 0 #FFCC00; }
            h1 { color: #CC0000; border-bottom: 3px dashed #FFCC00; padding-bottom: 10px; }
            .status { font-size: 1.5em; font-weight: bold; color: ${data.attendance === 'attend' ? 'green' : '#333'}; }
          </style>
      </head>
      <body>
          <h1>A & P Wedding GIG ご回答内容</h1>
          <p>このURLは、お客様の回答内容を永続的に確認・保存するためのものです。</p>
          <hr>
          <p><strong>お名前:</strong> ${data.name}</p>
          <p><strong>メールアドレス:</strong> ${data.email}</p>
          <p class="status"><strong>ご出欠:</strong> ${status}</p>
          <p><strong>メッセージ:</strong> ${data.message || 'なし'}</p>
          <p style="margin-top: 30px;">（このページをスクリーンショットするなどして保存してください）</p>
      </body>
      </html>
    `;

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: htmlResponse,
    };

  } catch (error) {
    console.error('Firestore Error:', error);
    return {
      statusCode: 500,
      body: '回答データの取得中にエラーが発生しました。',
    };
  }
};