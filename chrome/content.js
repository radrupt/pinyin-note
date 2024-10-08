let popup = null;
let lastSelectedText = '';

function createPopup(text, x, y) {
  if (popup) {
    document.body.removeChild(popup);
  }

  popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.zIndex = '9999';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid black';
  popup.style.padding = '10px';
  popup.style.borderRadius = '5px';
  popup.style.boxShadow = '0 2px 0px rgba(0,0,0,0.2)';
  popup.style.maxWidth = '400px'; // 增加最大宽度
  popup.style.overflowWrap = 'break-word';
  popup.style.fontSize = '16px'; // 增加基础字体大小

  // 使用 pinyin 库添加拼音，直接使用带声调的拼音
  const pinyinText = pinyinPro.pinyin(text, { toneType: 'symbol', type: 'array' });
  const contentWithPinyin = text.split('').map((char, index) => {
    return `<ruby style="font-size: 14px;">${char}<rt style="font-size: 14px; color: #666;">${pinyinText[index]}</rt></ruby>`;
  }).join('');

  popup.innerHTML = `
    <style>
      .pinyin-content {
        line-height: 2.5;
        margin-top: 10px;
      }
    </style>
    <div class="pinyin-content">${contentWithPinyin}</div>
  `;

  // 设置弹窗位置
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;

  // 确保弹窗不会超出视窗
  const rect = popup.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    popup.style.left = `${window.innerWidth - rect.width}px`;
  }
  if (rect.bottom > window.innerHeight) {
    popup.style.top = `${window.innerHeight - rect.height}px`;
  }

  document.body.appendChild(popup);
}

function removePopup() {
  if (popup && document.body.contains(popup)) {
    document.body.removeChild(popup);
    popup = null;
    setTimeout(() => {
        lastSelectedText = '';
    }, 500);
  }
}

document.addEventListener('mouseup', function(event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0 && selectedText.length < 5 && !document.body.contains(popup) && selectedText !== lastSelectedText) {
    createPopup(selectedText, event.clientX + 10, event.clientY + 10);
    chrome.runtime.sendMessage({text: selectedText});
    lastSelectedText = selectedText;
  } else {
    removePopup();
  }
});

// 监听选中文本事件
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText) {
    try {
      const pinyinText = pinyinPro.pinyin(selectedText, { toneType: 'symbol', type: 'array' });
      // 发送选中的文本和拼音到背景脚本
      chrome.runtime.sendMessage({
        text: selectedText,
        pinyin: pinyinText.join(' ')
      });
    } catch (error) {
      console.error('Error converting to pinyin:', error);
      // 如果转换失败，只发送原文本
      chrome.runtime.sendMessage({ text: selectedText });
    }
  }
});

// 添加鼠标按下的事件
document.addEventListener('mousedown', function(event) {
  removePopup();
});
