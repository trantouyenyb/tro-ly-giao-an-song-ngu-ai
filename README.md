# Trợ lý giáo án song ngữ AI — bản thử nghiệm chức năng

## Triển khai Netlify
1. Đưa toàn bộ thư mục lên GitHub.
2. Netlify → Add new project → Import Git repository; Publish directory: `.`.
3. Site configuration → Environment variables → thêm `GEMINI_API_KEY` (khóa Gemini API riêng, không đưa vào HTML).
4. Deploy. Netlify Functions gọi Gemini từ máy chủ.

## Firebase
Bản này không có Firebase Authentication hoặc Firestore. Có thể dùng Firebase cho đăng nhập/lưu trữ sau này, trong khi vẫn deploy giao diện và hàm AI trên Netlify. Nếu chỉ host HTML trên Firebase Hosting, `/.netlify/functions/generate` sẽ KHÔNG chạy; cần thay bằng Cloud Functions/Cloud Run và đổi endpoint.

## Giới hạn bản thử nghiệm
- Đã có: giao diện, ba chế độ, ảnh/PDF gửi Gemini, chỉnh sửa, lưu bản nháp cục bộ, in/PDF, xuất Word dạng HTML `.doc`.
- Chưa có: đăng nhập Firebase, dữ liệu đồng bộ, DOCX chuẩn, đọc DOCX tự động, OCR xác nhận trước khi tạo, TTS, bộ học liệu, lịch sử phiên bản, rate limiting/authentication cho endpoint AI.
- Không tải tài liệu nhạy cảm khi chưa bổ sung bảo mật, xác thực và kiểm soát chi phí API.
