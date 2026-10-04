import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-green-100/60 blur-3xl" />
      <div className="relative w-full max-w-[460px] overflow-hidden rounded-xl bg-white p-8 shadow-xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-xl bg-surface-low p-2 shadow-sm">
            <Image src="/logo.png" alt="Logo Việc học của tôi" width={48} height={48} className="size-full rounded-lg object-contain" priority />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Việc học của tôi</h1>
          <p className="mt-1.5 text-sm text-muted">Đăng nhập vào tài khoản học tập</p>
        </div>
        <div className="mt-8 flex items-center gap-2 rounded-lg bg-surface-low p-3 text-sm text-primary"><span aria-hidden="true">✦</span><span>Không gian học tập cá nhân tập trung và hiệu quả mỗi ngày.</span></div>
        <LoginForm />
        <div className="-mx-8 -mb-8 mt-8 flex flex-col items-center justify-between gap-2 bg-surface-low/60 px-8 py-5 text-center text-sm text-muted sm:-mx-10 sm:-mb-10 sm:flex-row sm:px-10 sm:text-left"><span>Chưa có tài khoản học tập?</span><a href="#dang-ky" className="font-semibold text-primary">Tạo tài khoản mới →</a></div>
      </div>
    </main>
  );
}