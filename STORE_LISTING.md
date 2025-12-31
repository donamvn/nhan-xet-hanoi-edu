# Hướng dẫn đăng Chrome Web Store

## 📋 Checklist trước khi đăng

### Bắt buộc
- [x] Icons: 16x16, 32x32, 48x48, 128x128 (PNG) ✅
- [x] Manifest.json hợp lệ ✅
- [x] Chính sách bảo mật (PRIVACY_POLICY.md) ✅
- [ ] Tài khoản Google Developer ($5 một lần)
- [ ] Screenshot ít nhất 1 ảnh (1280x800 hoặc 640x400)
- [ ] Promotional tile (440x280) - tùy chọn

### Thông tin đăng ký

#### Tên extension (45 ký tự max)
```
Nhận xét HANOI-EDU - By Đỗ Nam
```

#### Mô tả ngắn (132 ký tự max)
```
Tự động điền nhận xét học sinh theo điểm trung bình trên truong.hanoi.edu.vn. Tiết kiệm thời gian cho giáo viên!
```

#### Mô tả đầy đủ (tiếng Việt)
```
🎯 NHẬN XÉT HANOI-EDU - Công cụ hỗ trợ giáo viên

Extension giúp giáo viên tự động điền nhận xét học sinh trên hệ thống truong.hanoi.edu.vn dựa theo điểm trung bình môn.

✨ TÍNH NĂNG CHÍNH:
• Tự động phát hiện bảng điểm HANOI-EDU
• Điền nhận xét theo 5 mức: Xuất sắc, Giỏi, Khá, Trung bình, Yếu
• Hỗ trợ Học kỳ 1, Học kỳ 2 và Cả năm
• Tùy chỉnh nội dung nhận xét cho từng mức điểm
• Nhận xét ngẫu nhiên để đa dạng hóa
• Lưu cài đặt để sử dụng lại

📊 PHÂN LOẠI ĐIỂM:
• 9-10 điểm: Xuất sắc
• 8-8.9 điểm: Giỏi  
• 6.5-7.9 điểm: Khá
• 5-6.4 điểm: Trung bình
• Dưới 5 điểm: Yếu

💡 CÁCH SỬ DỤNG:
1. Mở trang nhập điểm trên truong.hanoi.edu.vn
2. Click icon extension
3. Chọn loại điểm và ô nhận xét
4. Click "Điền nhận xét tự động"

🔒 BẢO MẬT:
• KHÔNG thu thập dữ liệu cá nhân
• KHÔNG gửi thông tin ra bên ngoài
• Tất cả dữ liệu lưu trữ cục bộ

👨‍💻 Tác giả: Đỗ Nam - Giáo viên THCS Duyên Thái, Thường Tín, Hà Nội

Miễn phí - Được phát triển để hỗ trợ đồng nghiệp giáo viên!
```

#### Danh mục (Category)
```
Productivity
```

#### Ngôn ngữ
```
Vietnamese (Tiếng Việt)
```

---

## 🚀 Các bước đăng lên Chrome Web Store

### Bước 1: Đăng ký tài khoản Developer
1. Truy cập: https://chrome.google.com/webstore/devconsole
2. Đăng nhập bằng tài khoản Google
3. Thanh toán phí đăng ký: **$5** (một lần duy nhất)
4. Chấp nhận các điều khoản

### Bước 2: Tạo file ZIP
```powershell
# Vào thư mục extension
cd C:\Users\DoNam\student-comment-extension

# Tạo file ZIP (không bao gồm các file không cần thiết)
Compress-Archive -Path manifest.json, popup.html, popup.css, popup.js, content.js, content.css, icons -DestinationPath nhan-xet-hanoi-edu.zip -Force
```

### Bước 3: Upload extension
1. Vào Developer Dashboard: https://chrome.google.com/webstore/devconsole
2. Click **"New Item"**
3. Upload file **nhan-xet-hanoi-edu.zip**
4. Điền thông tin:
   - Name: `Nhận xét HANOI-EDU - By Đỗ Nam`
   - Description: (copy từ trên)
   - Category: `Productivity`
   - Language: `Vietnamese`

### Bước 4: Upload hình ảnh
1. **Icon**: Upload `icons/icon128.png`
2. **Screenshots**: Chụp màn hình extension đang hoạt động
   - Kích thước: 1280x800 hoặc 640x400
   - Ít nhất 1 ảnh, tối đa 5 ảnh
3. **Promotional tile** (tùy chọn): 440x280

### Bước 5: Điền Privacy Policy
- URL đến trang chính sách bảo mật
- Có thể host trên GitHub Pages hoặc bất kỳ trang web nào
- Hoặc paste nội dung từ file `PRIVACY_POLICY.md`

### Bước 6: Submit để xét duyệt
1. Kiểm tra lại tất cả thông tin
2. Click **"Submit for Review"**
3. Đợi xét duyệt (thường 1-3 ngày làm việc)

---

## 📸 Hướng dẫn chụp Screenshot

### Screenshot 1: Popup chính
- Mở extension popup
- Chụp toàn bộ popup với các mức điểm và nút bấm

### Screenshot 2: Đang điền nhận xét
- Mở trang HANOI-EDU có bảng điểm
- Click "Điền nhận xét tự động"
- Chụp kết quả với các nhận xét đã được điền

### Screenshot 3: Tùy chỉnh nhận xét
- Mở popup
- Nhập nhận xét tùy chỉnh
- Chụp để hiển thị tính năng tùy chỉnh

---

## ⚠️ Lưu ý quan trọng

1. **Không vi phạm bản quyền**: Đảm bảo icon và hình ảnh không vi phạm bản quyền

2. **Chính sách bảo mật**: Bắt buộc phải có nếu extension yêu cầu quyền truy cập

3. **Xét duyệt**: Google có thể yêu cầu chỉnh sửa nếu vi phạm chính sách

4. **Cập nhật**: Sau khi được duyệt, có thể cập nhật version mới bất cứ lúc nào

---

## 📞 Hỗ trợ

Nếu gặp vấn đề khi đăng, tham khảo:
- https://developer.chrome.com/docs/webstore/publish/
- https://developer.chrome.com/docs/webstore/troubleshooting/
