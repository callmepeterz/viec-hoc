# Việc học của tôi

Giao diện quản lý công việc học tập được xây dựng bằng Next.js App Router, TypeScript và Tailwind CSS.

## Cài đặt

Từ thư mục `viec-hoc`, cài dependency bằng một trong hai lệnh:

```bash
npm install
```

Hoặc, nếu muốn cài đúng các phiên bản trong lockfile:

```bash
npm ci
```

## Thiết lập Supabase

1. Truy cập [Supabase](https://supabase.com/), đăng nhập và chọn **New project**.
2. Đặt tên project, chọn organization và tạo mật khẩu database theo hướng dẫn của Supabase.
3. Trong project vừa tạo, mở **SQL Editor**, tạo query mới và chạy toàn bộ nội dung của [`supabase/schema/schema.sql`](./supabase/schema/schema.sql).
   Script này tạo bảng `tasks`, index, quyền truy cập và Row Level Security để mỗi tài khoản chỉ đọc/sửa/xóa công việc của mình.
4. Mở **Authentication > Users**, chọn **Add user**, tạo một tài khoản email/mật khẩu để đăng nhập thủ công.
5. Tạo thêm tài khoản thử dành riêng cho Playwright nếu chạy test end-to-end. Ghi thông tin tài khoản này vào `.env.local`, không commit file này.

## Cấu hình biến môi trường

Tạo `.env.local` ở thư mục gốc, dựa trên [`.env.example`](./.env.example):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
TEST_EMAIL_A=playwright-user@example.com
TEST_PASSWORD_A=your-test-password
```

Lấy `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` trong **Project Settings > API** của Supabase. Chỉ dùng publishable key ở phía trình duyệt; không đưa service role key hoặc mật khẩu vào source code, log hay git.

## Chạy ứng dụng

Khởi động development server:

```bash
npm run dev
```

Mở các URL sau trong trình duyệt:

- [http://localhost:3000](http://localhost:3000): tự chuyển đến trang công việc.
- [http://localhost:3000/login](http://localhost:3000/login): đăng nhập bằng Supabase Auth.
- [http://localhost:3000/tasks](http://localhost:3000/tasks): dashboard công việc học tập.

## Phạm vi hiện tại

- Đăng nhập và đăng xuất dùng Supabase Auth ở phía trình duyệt.
- Công việc được đọc và thay đổi qua API `/api/tasks`; dữ liệu lưu trong Supabase.
- API tasks yêu cầu Bearer token và áp dụng kiểm tra quyền sở hữu theo user.
- Chưa có cơ chế khôi phục mật khẩu hoặc đăng ký tài khoản trong giao diện.

## Kiểm tra

Lint và build:

```bash
npm run lint
npm run build
```

Kiểm thử end-to-end với tài khoản Supabase thật đã khai báo trong `.env.local`:

```bash
npx playwright test --project=chromium
```

Playwright tự chạy `npm run dev`, dùng `http://localhost:3000` và chỉ sử dụng project Chromium. Test đăng nhập qua giao diện, tạo/sửa/hoàn thành/xóa công việc bằng API thật, kiểm tra reload và kiểm tra các trường hợp API thiếu token hoặc input không hợp lệ. Test chỉ dọn các công việc do chính nó tạo.
