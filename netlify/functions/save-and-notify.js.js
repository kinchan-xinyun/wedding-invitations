// firebase-adminとSendGrid、node-fetchの依存関係が必要です。
const fetch = require('node-fetch'); 
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const sgMail = require('@sendgrid/mail');

// 認証情報の設定 (環境変数から)
const serviceAccount = JSON.parse(Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_KEY, 'base64').toString());
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const LINE_NOTIFY_API = 'https://notify-api.line.me/api/notify';
const SENDER_EMAIL = 'netlify-notifications@yourdomain.com'; // 認証済みFromアドレス
const HOST_EMAIL = 'your-wedding-email@example.com'; // 新郎新婦の連絡用アドレス

// --- メインハンドラ ---
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const { name, attendance, message, email } = data; // emailは必須

    // 1. データをFirestoreに保存し、ユニークIDを取得
    const docRef = await db.collection('rsvps').add({
      ...data,
      timestamp: new Date().toISOString(),
    });

    const confirmationId = docRef.id;
    // 確認URLの作成
    const confirmationUrl = `https://${event.headers.host}/check-rsvp?id=${confirmationId}`;
    
    // --- 2. LINE Notifyで新郎新婦へ通知 ---
    const lineStatus = attendance === 'attend' ? '【出席】🎉' : '【欠席】😢';
    const lineMessage = `
      \n--- 新しい回答がありました ---
      \n回答者: ${name} 様
      \nステータス: ${lineStatus}
      \n確認URL: ${confirmationUrl}
      \nメッセージ: ${message || 'なし'}
      \n------------------------------
      `;

    const linePromise = fetch(LINE_NOTIFY_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${process.env.LINE_NOTIFY_TOKEN}`,
      },
      body: `message=${encodeURIComponent(lineMessage)}`,
    });

    // --- 3. SendGridで回答者へ確認URLをメール通知 ---
    const guestEmailContent = {
      to: email,
      from: SENDER_EMAIL,
      replyTo: HOST_EMAIL,
      subject: `【重要】A & P Wedding GIG ご回答内容の確認URL`,
      html: `
        <p>${name}様、ご回答ありがとうございます。</p>
        <p>以下のURLから、いつでもご回答内容をご確認・**保存**いただけます。</p>
        <h3>👇 ご回答内容の確認URL（保存推奨）</h3>
        <p><a href="${confirmationUrl}" style="color: #CC0000; font-weight: bold;">${confirmationUrl}</a></p>
        <p>（このURLをブックマーク、スクリーンショット、またはコピーして保存してください。）</p>
        <hr>
        <p><strong>ご出欠:</strong> ${attendance === 'attend' ? 'ご出席' : 'ご欠席'}</p>
        <p><strong>メッセージ:</strong> ${message || 'なし'}</p>
      `,
    };
    
    const emailPromise = sgMail.send(guestEmailContent);

    // 両方の通知処理が完了するのを待つ
    await Promise.all([linePromise, emailPromise]);

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Success',
        confirmationUrl: confirmationUrl 
      }),
    };

  } catch (error) {
    console.error('API Error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process and notify.' }),
    };
  }
};