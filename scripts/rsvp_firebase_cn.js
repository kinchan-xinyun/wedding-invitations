// ========================================
// Firebase设置与表单提交
// ========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase配置
const firebaseConfig = {
    apiKey: "AIzaSyCu2Cl4bHBM_53rPdSu1QutxPXLvF-HceU",
    authDomain: "li-oda-wedding.firebaseapp.com",
    projectId: "li-oda-wedding",
    storageBucket: "li-oda-wedding.firebasestorage.app",
    messagingSenderId: "790785209352",
    appId: "1:790785209352:web:1bad9b3725691cf8af8dbd",
    measurementId: "G-GTG79DQX1H"
};

// Firebase初始化
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ========================================
// 姓名认证（平假名）
// ========================================
let currentInviteCode = null;
let isAuthenticated = false;

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  setupFormSubmit();
});

function checkAuthentication() {
  showInviteCodePrompt();
}

function showInviteCodePrompt() {
  const form = document.querySelector('#rsvp-form');
  if (!form) return;

  // 隐藏表单
  form.style.display = 'none';

  // 创建认证界面
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
        ">📛 输入姓名</h2>
        <p style="
          margin-bottom: 25px; 
          color: #000000; 
          line-height: 1.8;
          text-align: center;
          font-size: 1.1rem;
        ">
          请用 <span style="text-decoration: underline;">拼音</span> 输入您的姓名（点击确认按钮后需填写详细信息）
        </p>
        <input type="text" id="invite-code-input" placeholder="例如：zhangsan" 
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
          确认
        </button>
        <p style="
          margin-top: 20px; 
          font-size: 14px; 
          color: #666; 
          text-align: center;
          line-height: 1.6;
        ">
          如果正确输入仍出现错误，请联系新郎新娘
        </p>
      </div>
    </div>
  `;

  form.parentNode.insertBefore(authDiv, form);

  // 事件监听器
  document.getElementById('verify-code-btn').addEventListener('click', verifyInviteCode);
  const input = document.getElementById('invite-code-input');
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') verifyInviteCode();
  });
  
  // 输入框焦点样式
  input.addEventListener('focus', () => {
    input.style.borderColor = '#E53935';
    input.style.outline = 'none';
    input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.2)';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = '#0f0f0f';
    input.style.boxShadow = 'none';
  });

  // 按钮悬停效果
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
  const code = input.value.trim();

  if (!code) {
    alert('请输入姓名（平假名）');
    input.style.borderColor = '#E53935';
    input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.3)';
    input.focus();
    return;
  }

  const btn = document.getElementById('verify-code-btn');
  btn.disabled = true;
  btn.textContent = '确认中...';
  btn.style.background = '#999';
  btn.style.cursor = 'not-allowed';
  btn.style.boxShadow = '2px 2px 0px #666';

  try {
    // 在Firestore中验证邀请码
    const inviteDoc = await getDoc(doc(db, 'invitations', code));

    if (inviteDoc.exists()) {
      currentInviteCode = code;
      isAuthenticated = true;

      // 删除认证界面
      document.getElementById('invite-code-auth').remove();
      
      // 显示RSVP表单
      showRSVPForm();

      // 如果有已有回复则加载
      await loadExistingResponse(code);
    } else {
      alert('未找到该姓名。\n请确认邀请函上的平假名姓名。\n\n（例如：やまだたろう）');
      input.value = '';
      input.style.borderColor = '#E53935';
      input.style.boxShadow = '0 0 0 2px rgba(229, 57, 53, 0.3)';
      input.focus();
      btn.disabled = false;
      btn.textContent = '确认';
      btn.style.background = '#E53935';
      btn.style.cursor = 'pointer';
      btn.style.boxShadow = '4px 4px 0px #FFC107';
    }
  } catch (error) {
    console.error('认证错误:', error);
    alert('认证过程中发生错误。\n请重试。\n\n错误详情: ' + error.message);
    btn.disabled = false;
    btn.textContent = '确认';
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
    const responseDoc = await getDoc(doc(db, 'responses', code));
    
    if (responseDoc.exists()) {
      const data = responseDoc.data();
      
      const reload = confirm('找到了之前的回复。\n是否加载内容？\n\n「确定」= 加载\n「取消」= 重新填写');
      
      if (reload && data.guests) {
        console.log('加载已有数据:', data);
        fillFormWithExistingData(data);
      }
    }
  } catch (error) {
    console.error('数据加载错误:', error);
  }
}

// 将已有数据填入表单
function fillFormWithExistingData(data) {
  const form = document.querySelector('#rsvp-form');
  if (!form) return;

  // 设置出席状态
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

  // 填入宾客数据
  if (data.guests && Array.isArray(data.guests)) {
    const existingGuests = form.querySelectorAll('.rsvp-guest');
    
    // 根据需要添加宾客
    const addGuestBtn = document.getElementById('rsvp-add-guest-btn');
    while (existingGuests.length < data.guests.length && addGuestBtn) {
      addGuestBtn.click();
    }
    
    // 稍等片刻后再填入（等待宾客添加完成）
    setTimeout(() => {
      const allGuests = form.querySelectorAll('.rsvp-guest');
      
      data.guests.forEach((guest, index) => {
        if (index < allGuests.length) {
          const guestEl = allGuests[index];
          
          // 设置各字段的值
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
      
      console.log('✅ 已将已有数据填入表单');
      alert('✅ 已加载之前的回复！\n请确认、编辑内容后重新提交。');
    }, 500);
  }
}

// ========================================
// 表单提交处理
// ========================================
function setupFormSubmit() {
  const form = document.querySelector('#rsvp-form');

  if (!form) {
    console.error('未找到表单 (#rsvp-form)');
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('表单提交开始');

    // 认证检查
    if (!isAuthenticated || !currentInviteCode) {
      alert('需要姓名认证。\n请重新加载页面。');
      return;
    }

    try {
      // 收集宾客数据
      const guests = [];
      const guestElements = form.querySelectorAll('.rsvp-guest');

      console.log('宾客人数:', guestElements.length);

      // 先获取出席状态
      const selectedOption = document.querySelector('.rsvp-attend-option.selected');
      const attendance = selectedOption?.dataset.choice || 'unknown';

      guestElements.forEach((guestEl, index) => {
        const firstName = guestEl.querySelector('input[name="first_name[]"]')?.value?.trim() || '';
        const lastName = guestEl.querySelector('input[name="last_name[]"]')?.value?.trim() || '';
        const email = guestEl.querySelector('input[name="email[]"]')?.value?.trim() || '';
        const address = guestEl.querySelector('input[name="address[]"]')?.value?.trim() || '';

        // 姓名和邮箱必填
        if (!firstName || !lastName || !email) {
          alert(`宾客 ${index + 1}：姓名、邮箱地址为必填项`);
          throw new Error(`宾客 ${index + 1}：缺少必填项`);
        }

        // 出席时地址也必填
        if (attendance === 'attend' && !address) {
          alert(`宾客 ${index + 1}：出席时地址为必填项`);
          throw new Error(`宾客 ${index + 1}：缺少地址`);
        }

        // 获取二次会参加选择
        const afterpartyRadio = guestEl.querySelector('input[name="afterparty[]"]:checked');
        const afterparty = afterpartyRadio?.value || '';

        const firstNameKana = guestEl.querySelector('input[name="first_name_kana[]"]')?.value?.trim() || '';
        const lastNameKana = guestEl.querySelector('input[name="last_name_kana[]"]')?.value?.trim() || '';
        const postalCode = guestEl.querySelector('input[name="postal_code[]"]')?.value?.trim() || '';
        const allergy = guestEl.querySelector('input[name="allergy[]"]')?.value?.trim() || '';
        const isMinor = guestEl.querySelector('input[name="is_minor[]"]')?.checked || false;

        const guest = {
          guestNo: index + 1,
          firstName: firstName,
          lastName: lastName,
          firstNameKana: firstNameKana,
          lastNameKana: lastNameKana,
          email: email,
          postalCode: postalCode,
          address: address,
          allergy: allergy,
          afterparty: afterparty,
          isMinor: isMinor,
          message: guestEl.querySelector('textarea[name="message[]"]')?.value?.trim() || ''
        };

        // 根据出席情况生成通知消息
        if (attendance === 'attend') {
          guest.notificationMessage = `${lastName} ${firstName} 先生/女士

感谢您的出席通知。

【参加相关信息确认】
▼ 姓名
　汉字：${lastName} ${firstName}
　罗马字：${lastNameKana} ${firstNameKana}

▼ 地址
　邮编：${postalCode}
　地址：${address}

▼ 邮箱地址
　${email}

▼ 过敏情况
　${allergy || '无'}

▼ 年龄确认（用于酒水安排）
　${isMinor ? '未满二十周岁' : '已满二十周岁'}

▼ 二次会参加
　${afterparty || '未回答'}

请确认以上内容是否有误。

如有疑问或需要修改，请通过新郎新娘各自的私人LINE联系。`;
        } else if (attendance === 'absent') {
          guest.notificationMessage = `${lastName} ${firstName} 先生/女士

感谢您的联系。
已知悉您将缺席。

【确认事项】
缺席时无需特别处理。

如有疑问或需要告知的事项，请通过新郎新娘各自的私人LINE联系。`;
        } else if (attendance === 'keep') {
          guest.notificationMessage = `${lastName} ${firstName} 先生/女士

感谢您的联系。
已知悉您的出席状态为「待定」。

【今后流程】
出席情况确定后，请再次联系我们。
恳请您在10月3日前联系我们。

如有疑问或需要修改，
请通过新郎新娘各自的私人LINE联系。`;
        }

        guests.push(guest);
      });

      // 保存到Firebase的数据
      const payload = {
        inviteCode: currentInviteCode,
        timestamp: new Date().toISOString(),
        timestampJst: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
        lastUpdated: serverTimestamp(),
        attendance: attendance,
        guestCount: guests.length,
        guests: guests
      };

      console.log('提交载荷:', payload);

      // 保存到Firestore
      await setDoc(doc(db, 'responses', currentInviteCode), payload, { merge: true });

      console.log('Firestore保存成功');

      alert('✅ 感谢您的预约！\n请等待新郎新娘的联系');
      
      // 重置表单
      form.reset();
      document.querySelectorAll('.rsvp-attend-option').forEach(o => o.classList.remove('selected'));

    } catch (error) {
      console.error('提交错误:', error);
      alert('❌ 发生错误。\n\n错误详情:\n' + error.message + '\n\n请重试或联系新郎新娘。');
    }
  });
}
