// Tránh load trùng lặp
if (window._studentCommentLoaded) {
  console.log('Extension đã được load trước đó');
} else {
  window._studentCommentLoaded = true;
  console.log('Extension Nhận xét HANOI-EDU v2.0 đã tải!');
}

// Các mức nhận xét mặc định (dưới 50 ký tự)
const DEFAULT_COMMENTS = {
  excellent: 'Xuất sắc! Tiếp tục phát huy con nhé!',
  good: 'Giỏi lắm! Cố gắng hơn nữa nhé!',
  fair: 'Khá tốt! Cần cố gắng thêm!',
  average: 'Trung bình. Cần nỗ lực nhiều hơn!',
  weak: 'Cần cố gắng nhiều hơn nữa!'
};

// Cấu hình dựa trên cấu trúc HTML thực tế của HANOI-EDU
const HANOI_EDU_CONFIG = {
  // Điểm trung bình - tìm theo id chứa chuỗi
  scores: {
    hk1: { idContains: 'lbTBK1', name: 'ĐTBmhk1 (Học kỳ 1)' },
    hk2: { idContains: 'lbTBK2', name: 'ĐTBmhk2 (Học kỳ 2)' },
    cn: { idContains: 'lbTBCN', name: 'ĐTBmcn (Cả năm)' }
  },
  // Ô nhận xét - tìm theo class của td cha
  comments: {
    hk1: { cellClass: 'noiDungNhanXetMonHocKy1', name: 'Nội dung HK1' },
    hk2: { cellClass: 'noiDungNhanXetMonHocKy2', name: 'Nội dung HK2' },
    cn: { cellClass: 'noiDungNhanXetMonHocKyCN', name: 'Nội dung cả năm' }
  }
};

// Lấy nhận xét dựa trên điểm
function getComment(score, customComments) {
  let category;
  if (score >= 9) category = 'excellent';
  else if (score >= 8) category = 'good';
  else if (score >= 6.5) category = 'fair';
  else if (score >= 5) category = 'average';
  else category = 'weak';
  
  // Lấy danh sách nhận xét
  let commentList = (customComments && customComments[category]) || DEFAULT_COMMENTS[category];
  
  // Nếu là array, chọn ngẫu nhiên 1 cái
  if (Array.isArray(commentList)) {
    return commentList[Math.floor(Math.random() * commentList.length)];
  }
  
  // Nếu là string, trả về luôn
  return commentList;
}

// Phát hiện các loại cột có sẵn trong bảng
function detectAvailableTypes() {
  const result = {
    scores: [],
    comments: [],
    defaultScore: null,
    defaultComment: null,
    debug: {} // Thêm debug info
  };
  
  // Tìm bảng theo nhiều cách
  let rows = document.querySelectorAll('.rgDataDiv table.rgMasterTable tbody tr');
  result.debug.selector1 = rows.length;
  
  if (rows.length === 0) {
    rows = document.querySelectorAll('table.rgMasterTable tbody tr');
    result.debug.selector2 = rows.length;
  }
  
  if (rows.length === 0) {
    rows = document.querySelectorAll('table tbody tr');
    result.debug.selector3 = rows.length;
  }
  
  // Tìm tất cả span có id chứa lbTBK1 trong toàn trang
  const allScoreSpans = document.querySelectorAll('span[id*="lbTBK1"]');
  result.debug.lbTBK1Count = allScoreSpans.length;
  
  // Tìm tất cả td có class noiDungNhanXetMonHocKy1
  const allCommentCells = document.querySelectorAll('td.noiDungNhanXetMonHocKy1');
  result.debug.commentCellCount = allCommentCells.length;
  
  console.log('Debug detect:', result.debug);
  
  if (rows.length === 0) {
    // Nếu không tìm thấy row, nhưng tìm thấy span/td thì vẫn xử lý
    if (allScoreSpans.length > 0) {
      result.scores.push({ type: 'hk1', name: 'ĐTBmhk1 (Học kỳ 1)', visible: true });
      result.defaultScore = 'hk1';
    }
    if (allCommentCells.length > 0) {
      const firstCell = allCommentCells[0];
      const isVisible = firstCell.style.display !== 'none' && firstCell.offsetParent !== null;
      result.comments.push({ type: 'hk1', name: 'Nội dung HK1', visible: isVisible });
      if (isVisible) result.defaultComment = 'hk1';
    }
    return result;
  }
  
  const firstRow = rows[0];
  
  // Kiểm tra từng loại điểm
  for (const [type, config] of Object.entries(HANOI_EDU_CONFIG.scores)) {
    const scoreEl = firstRow.querySelector(`span[id*="${config.idContains}"]`);
    if (scoreEl) {
      const cell = scoreEl.closest('td');
      // Kiểm tra hiển thị bằng nhiều cách
      const isHidden = cell && (cell.style.display === 'none' || cell.offsetParent === null);
      const isVisible = !isHidden;
      result.scores.push({ type, name: config.name, visible: isVisible });
      if (isVisible && !result.defaultScore) {
        result.defaultScore = type;
      }
    }
  }
  
  // Kiểm tra từng loại ô nhận xét
  for (const [type, config] of Object.entries(HANOI_EDU_CONFIG.comments)) {
    const cell = firstRow.querySelector(`td.${config.cellClass}`);
    if (cell) {
      const isHidden = cell.style.display === 'none' || cell.offsetParent === null;
      const isVisible = !isHidden;
      result.comments.push({ type, name: config.name, visible: isVisible });
      if (isVisible && !result.defaultComment) {
        result.defaultComment = type;
      }
    }
  }
  
  console.log('Detect result:', result);
  return result;
}

// Điền nhận xét theo loại (hk1, hk2, cn)
function fillCommentsByType(scoreType, commentType, customComments) {
  const scoreConfig = HANOI_EDU_CONFIG.scores[scoreType];
  const commentConfig = HANOI_EDU_CONFIG.comments[commentType];
  
  console.log('Đang điền:', { scoreType, commentType, scoreConfig, commentConfig });
  
  if (!scoreConfig || !commentConfig) {
    console.error('Loại không hợp lệ:', scoreType, commentType);
    return 0;
  }
  
  // Tìm rows bằng nhiều cách
  let rows = document.querySelectorAll('.rgDataDiv table.rgMasterTable tbody tr');
  console.log('Selector 1 (.rgDataDiv...):', rows.length);
  
  if (rows.length === 0) {
    rows = document.querySelectorAll('table.rgMasterTable tbody tr');
    console.log('Selector 2 (table.rgMasterTable...):', rows.length);
  }
  
  if (rows.length === 0) {
    rows = document.querySelectorAll('table tbody tr');
    console.log('Selector 3 (table tbody tr):', rows.length);
  }
  
  // Tìm trực tiếp tất cả span điểm
  const allScoreSpans = document.querySelectorAll(`span[id*="${scoreConfig.idContains}"]`);
  console.log(`Tổng span ${scoreConfig.idContains}:`, allScoreSpans.length);
  
  let filledCount = 0;
  
  // Nếu tìm được span, dùng span làm gốc
  if (allScoreSpans.length > 0) {
    allScoreSpans.forEach((scoreEl, index) => {
      const score = parseFloat(scoreEl.textContent.trim());
      if (isNaN(score) || score < 0 || score > 10) return;
      
      // Tìm row chứa span này
      const row = scoreEl.closest('tr');
      if (!row) return;
      
      // Tìm textarea trong ô có class tương ứng
      const commentCell = row.querySelector(`td.${commentConfig.cellClass}`);
      if (!commentCell) {
        console.log(`Hàng ${index + 1}: Không tìm thấy td.${commentConfig.cellClass}`);
        return;
      }
      
      // Kiểm tra ô có hiển thị không
      if (commentCell.style.display === 'none') {
        console.log(`Hàng ${index + 1}: Ô nhận xét đang ẩn`);
        return;
      }
      
      const textarea = commentCell.querySelector('textarea');
      if (!textarea) {
        console.log(`Hàng ${index + 1}: Không tìm thấy textarea`);
        return;
      }
      
      // Điền nhận xét
      const comment = getComment(score, customComments);
      textarea.value = comment;
      
      // Trigger events để trang nhận biết thay đổi
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      textarea.dispatchEvent(new Event('change', { bubbles: true }));
      textarea.dispatchEvent(new Event('blur', { bubbles: true }));
      
      // Highlight tạm thời
      textarea.style.backgroundColor = '#c8e6c9';
      setTimeout(() => {
        textarea.style.backgroundColor = '';
      }, 1500);
      
      filledCount++;
      console.log(`✅ Hàng ${index + 1}: Điểm ${score} -> "${comment}"`);
    });
  }
  
  console.log('Đã điền:', filledCount);
  return filledCount;
}

// Lắng nghe message từ popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script nhận message:', request.action);
  
  if (request.action === 'ping') {
    sendResponse({ success: true });
    return true;
  }
  
  if (request.action === 'detectTypes') {
    const result = detectAvailableTypes();
    sendResponse(result);
    return true;
  }
  
  if (request.action === 'fillByType') {
    const { scoreType, commentType, comments } = request;
    const count = fillCommentsByType(scoreType || 'hk1', commentType || 'hk1', comments);
    sendResponse({ success: true, count: count });
    return true;
  }
  
  // Tương thích ngược - nếu gọi action cũ, dùng HK1 mặc định
  if (request.action === 'fillComments') {
    const count = fillCommentsByType('hk1', 'hk1', request.comments);
    sendResponse({ success: true, count: count });
    return true;
  }
  
  return true;
});
