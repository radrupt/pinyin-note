chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    // 保存选中的文本和拼音（如果有）到 chrome.storage.local
    chrome.storage.local.set({ 
      selectedText: request.text,
      selectedPinyin: request.pinyin || ''
    }, () => {
      console.log('Text and pinyin saved');
    });
  }
});

// 当扩展安装或更新时初始化存储
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ 
    selectedText: "",
    selectedPinyin: ""
  }, () => {
    console.log('Storage initialized');
  });
});