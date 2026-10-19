"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Email hoặc mật khẩu không đúng. Vui lòng thử lại.");
      setIsSubmitting(false);
      return;
    }

    router.replace("/tasks");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="email">
        Email
        <span className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-outline">@</span>
          <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="hocvien@viethoc.edu.vn" className="h-11 w-full rounded-lg bg-surface-low pl-11 pr-4 text-sm font-normal text-foreground outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/20" />
        </span>
      </label>
      <label className="flex flex-col gap-1.5 text-sm font-semibold" htmlFor="password">
        Mật khẩu
        <span className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-outline">*</span>
          <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Nhập mật khẩu" className="h-11 w-full rounded-lg bg-surface-low pl-11 pr-12 text-sm font-normal text-foreground outline-none transition focus:bg-white focus:ring-2 focus:ring-primary/20" />
          <button type="button" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-xs text-outline hover:text-foreground">{showPassword ? "Ẩn" : "Hiện"}</button>
        </span>
      </label>
      <div className="flex items-center justify-between pt-1 text-xs text-muted">
        <label className="flex cursor-pointer items-center gap-2"><input type="checkbox" className="size-4 accent-secondary" />Ghi nhớ đăng nhập</label>
        <a href="#quen-mat-khau" className="font-semibold text-primary hover:text-primary-container">Quên mật khẩu?</a>
      </div>
      {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      <button type="submit" disabled={isSubmitting} className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-white shadow-md transition hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"} {!isSubmitting && <span aria-hidden="true">→</span>}</button>
    </form>
  );
}