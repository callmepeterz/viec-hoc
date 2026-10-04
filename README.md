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

## Chạy ứng dụng

Khởi động development server:

```bash
npm run dev
```

Mở các URL sau trong trình duyệt:

- [http://localhost:3000](http://localhost:3000): tự chuyển đến trang công việc.
- [http://localhost:3000/login](http://localhost:3000/login): form đăng nhập mẫu.
- [http://localhost:3000/tasks](http://localhost:3000/tasks): dashboard công việc học tập.

## Phạm vi hiện tại

- Chưa có database.
- Chưa có đăng nhập thật hoặc xác thực tài khoản.
- Dữ liệu công việc chỉ là dữ liệu tạm trong React state và sẽ mất khi tải lại trang.
- Chưa gọi API và chưa lưu dữ liệu vào `localStorage`.

## Kiểm tra

```bash
npm run lint
npm run build
```
