// Nhận xét mặc định (dưới 60 ký tự) - Tiến bộ, ưu điểm, hạn chế
const DEFAULT_COMMENTS = {
  excellent: [
    'Tiến bộ vượt bậc, tích cực, chăm chỉ. Phát huy nhé!',
    'Rất tiến bộ, năng động và sáng tạo. Tuyệt vời!',
    'Tiến bộ rõ rệt, chăm học, hăng hái. Cố lên em!',
    'Xuất sắc, chủ động học tập, luôn hoàn thành tốt!'
  ],
  good: [
    'Tiến bộ tốt, tự giác học tập. Tự tin hơn nhé!',
    'Có tiến bộ, học tập tích cực. Cần chủ động hơn.',
    'Tiến bộ nhiều, chăm chỉ. Mạnh dạn phát biểu nhé!',
    'Học tốt, có cố gắng. Cần phát huy hơn nữa!'
  ],
  fair: [
    'Có tiến bộ, cần tập trung và chủ động hơn.',
    'Tiến bộ từ từ, cần cố gắng và tích cực hơn.',
    'Có cố gắng, cần tập trung, hoàn thành bài tập.',
    'Khá hơn, cần chú ý nghe giảng, làm bài đầy đủ.'
  ],
  average: [
    'Tiến bộ chậm, cần nỗ lực và tập trung hơn.',
    'Chưa tiến bộ nhiều, cần chăm chỉ, làm bài đầy đủ.',
    'Còn chậm, cần chú ý nghe giảng, làm bài tập.',
    'Cần cố gắng hơn, tập trung học, hoàn thành bài.'
  ],
  weak: [
    'Còn yếu, cần cố gắng nhiều, tập trung học tập.',
    'Hạn chế nhiều, cần nỗ lực và chăm chỉ hơn nữa.',
    'Chưa đạt, cần chú ý học, hoàn thành bài đầy đủ.',
    'Yếu, cần tích cực hơn, chăm chỉ làm bài tập.'
  ]
};

// Hiển thị thông báo
function showStatus(message, type = 'info') {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = `status ${type}`;
  status.classList.remove('hidden');
  
  setTimeout(() => {
    status.classList.add('hidden');
  }, 3000);
}

// Lấy nhận xét từ form - split thành array nếu có nhiều nhận xét
function getCommentsFromForm() {
  const comments = {};
  const levels = ['excellent', 'good', 'fair', 'average', 'weak'];
  
  levels.forEach(level => {
    const el = document.getElementById(level);
    const value = el ? el.value.trim() : '';
    if (value) {
      // Split theo | hoặc , và lấy phần tử không rỗng
      const parts = value.split(/[|,]/).map(s => s.trim()).filter(s => s.length > 0);
      comments[level] = parts.length > 0 ? parts : DEFAULT_COMMENTS[level];
    } else {
      // Dùng array mặc định
      comments[level] = DEFAULT_COMMENTS[level];
    }
  });
  
  return comments;
}

// Load cài đặt đã lưu
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(['comments', 'scoreType', 'commentType']);
    
    // Load loại kỳ
    if (result.scoreType) {
      document.getElementById('scoreType').value = result.scoreType;
    }
    if (result.commentType) {
      document.getElementById('commentType').value = result.commentType;
    }
    
    // Load nhận xét
    if (result.comments) {
      const levels = ['excellent', 'good', 'fair', 'average', 'weak'];
      levels.forEach(level => {
        if (result.comments[level]) {
          const el = document.getElementById(level);
          if (el && result.comments[level] !== DEFAULT_COMMENTS[level]) {
            el.value = result.comments[level];
          }
        }
      });
    }
  } catch (error) {
    console.error('Lỗi load cài đặt:', error);
  }
}

// Lưu cài đặt
async function saveSettings() {
  try {
    const comments = getCommentsFromForm();
    const scoreType = document.getElementById('scoreType').value;
    const commentType = document.getElementById('commentType').value;
    await chrome.storage.local.set({ comments, scoreType, commentType });
    showStatus('✅ Đã lưu cài đặt thành công!', 'success');
  } catch (error) {
    console.error('Lỗi lưu cài đặt:', error);
    showStatus('❌ Lỗi khi lưu cài đặt!', 'error');
  }
}

// Đặt lại mặc định
function resetSettings() {
  const levels = ['excellent', 'good', 'fair', 'average', 'weak'];
  levels.forEach(level => {
    const el = document.getElementById(level);
    if (el) el.value = '';
  });
  document.getElementById('scoreType').value = 'hk1';
  document.getElementById('commentType').value = 'hk1';
  chrome.storage.local.remove(['comments', 'scoreType', 'commentType']);
  showStatus('🔄 Đã đặt lại về mặc định!', 'info');
}

// Inject content script vào tab nếu chưa có
async function ensureContentScript(tabId) {
  try {
    await chrome.tabs.sendMessage(tabId, { action: 'ping' });
    return true;
  } catch (error) {
    console.log('Injecting content script...');
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      await chrome.scripting.insertCSS({
        target: { tabId: tabId },
        files: ['content.css']
      });
      await new Promise(resolve => setTimeout(resolve, 100));
      return true;
    } catch (injectError) {
      console.error('Không thể inject script:', injectError);
      return false;
    }
  }
}

// Phát hiện các loại cột có sẵn
async function detectTypes() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showStatus('❌ Không tìm thấy tab hoạt động!', 'error');
      return;
    }
    
    const injected = await ensureContentScript(tab.id);
    if (!injected) {
      showStatus('❌ Không thể kết nối với trang!', 'error');
      return;
    }
    
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'detectTypes' });
    
    if (response) {
      console.log('Detect response:', response);
      
      const infoEl = document.getElementById('availableInfo');
      const visibleScores = response.scores.filter(s => s.visible).map(s => s.name).join(', ');
      const visibleComments = response.comments.filter(c => c.visible).map(c => c.name).join(', ');
      
      // Hiển thị debug info
      let debugInfo = '';
      if (response.debug) {
        debugInfo = `<br/><small>Debug: lbTBK1=${response.debug.lbTBK1Count || 0}, cells=${response.debug.commentCellCount || 0}</small>`;
      }
      
      if (visibleScores || visibleComments) {
        infoEl.innerHTML = `<strong>Đang hiển thị:</strong><br/>Điểm: ${visibleScores || 'Không có'}<br/>Nhận xét: ${visibleComments || 'Không có'}${debugInfo}`;
        infoEl.className = 'status-info success';
        
        if (response.defaultScore) {
          document.getElementById('scoreType').value = response.defaultScore;
        }
        if (response.defaultComment) {
          document.getElementById('commentType').value = response.defaultComment;
        }
        
        showStatus('✅ Phát hiện thành công!', 'success');
      } else if (response.debug && (response.debug.lbTBK1Count > 0 || response.debug.commentCellCount > 0)) {
        // Tìm thấy element nhưng không detect được
        infoEl.innerHTML = `<strong>Tìm thấy dữ liệu:</strong><br/>Span điểm: ${response.debug.lbTBK1Count}<br/>Ô nhận xét: ${response.debug.commentCellCount}${debugInfo}`;
        infoEl.className = 'status-info success';
        
        // Vẫn set mặc định là HK1
        document.getElementById('scoreType').value = 'hk1';
        document.getElementById('commentType').value = 'hk1';
        
        showStatus('✅ Tìm thấy bảng điểm!', 'success');
      } else {
        infoEl.innerHTML = `⚠️ Không tìm thấy bảng HANOI-EDU${debugInfo}`;
        infoEl.className = 'status-info error';
        showStatus('⚠️ Không tìm thấy bảng điểm!', 'error');
      }
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showStatus('❌ Lỗi! Hãy tải lại trang và thử lại.', 'error');
  }
}

// Điền nhận xét
async function fillComments() {
  try {
    const comments = getCommentsFromForm();
    const scoreType = document.getElementById('scoreType').value;
    const commentType = document.getElementById('commentType').value;
    
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      showStatus('❌ Không tìm thấy tab hoạt động!', 'error');
      return;
    }
    
    const injected = await ensureContentScript(tab.id);
    if (!injected) {
      showStatus('❌ Không thể kết nối với trang!', 'error');
      return;
    }
    
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'fillByType',
      scoreType: scoreType,
      commentType: commentType,
      comments: comments
    });
    
    if (response && response.success) {
      if (response.count > 0) {
        showStatus(`✅ Đã điền ${response.count} nhận xét!`, 'success');
      } else {
        showStatus('⚠️ Không tìm thấy ô để điền! Kiểm tra lại kỳ.', 'error');
      }
    } else {
      showStatus('⚠️ Không tìm thấy ô để điền!', 'error');
    }
  } catch (error) {
    console.error('Lỗi:', error);
    showStatus('❌ Lỗi! Hãy tải lại trang và thử lại.', 'error');
  }
}

// Khởi tạo khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Gán sự kiện cho các nút
  document.getElementById('fillBtn').addEventListener('click', fillComments);
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  document.getElementById('resetBtn').addEventListener('click', resetSettings);
  document.getElementById('detectBtn').addEventListener('click', detectTypes);
  
  // Tự động phát hiện khi mở popup
  setTimeout(detectTypes, 300);
});
