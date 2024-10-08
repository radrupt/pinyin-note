document.addEventListener('DOMContentLoaded', () => {
  const selectedTextElement = document.getElementById('selected-text');
  
  // 从 chrome.storage.local 读取保存的文本和拼音
  chrome.storage.local.get(['selectedText', 'selectedPinyin'], (result) => {
    if (result.selectedText) {
      selectedTextElement.innerHTML = `
        <p>选中的文本：${result.selectedText}</p>
        <p>拼音：${result.selectedPinyin || '无法转换拼音'}</p>
      `;
    } else {
      selectedTextElement.textContent = '没有选中的文本';
    }
  });
});