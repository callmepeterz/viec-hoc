| Mã | Thử điều gì | Kết quả phải đạt | Checklist |
|---|---|---|---|
| T01 | Mở `/tasks` chưa đăng nhập | Không có dữ liệu; về `/login` | Có |
| T02 | Đăng nhập sai rồi đúng | Sai báo lỗi, đúng vào danh sách | Có |
| T03 | CRUD và reload | Dữ liệu giữ đúng sau reload | Có |
| T04 | Tên rỗng, dấu cách, 121 ký tự | API trả 400, không tạo dòng | Có |
| T05 | Xóa rồi Hủy | Dòng vẫn còn | Có |
| T06 | 390 px và phím Tab | Không tràn; thao tác được | Có |
| T07 | Tắt mạng và thêm việc | Báo lỗi; không báo lưu giả | Có |
| T08 | API thiếu token hoặc token sai | 401 | Có |
| T09 | A tạo việc, B đọc danh sách | B không thấy việc của A | Có |
| T10 | B sửa/xóa id thuộc A qua API | 404 và dữ liệu A không đổi | Có |
| T11 | B ghi `user_id=A` trực tiếp vào Supabase | RLS chặn; không tạo được dòng | Có |
| T12 | Đăng xuất rồi Back/reload | Không hiện lại dữ liệu đã đăng xuất | Có |
