"use client";

import { FormEvent, useState } from "react";

type TaskFormProps = { onAdd: (title: string) => void };

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
      setError("Tên công việc phải dài từ 1 đến 120 ký tự.");
      return;
    }
    onAdd(trimmedTitle);
    setError("");
    setTitle("");
  }

  return <form onSubmit={handleSubmit} className="flex flex-col gap-1 rounded-xl bg-white p-4 shadow-sm sm:flex-row sm:items-start"><div className="min-w-0 flex-1"><label htmlFor="new-task-title" className="sr-only">Tên công việc mới</label><input id="new-task-title" value={title} maxLength={120} onChange={(event) => { setTitle(event.target.value); if (error) setError(""); }} className="h-12 w-full rounded-lg bg-surface-low px-4 text-sm outline-none placeholder:text-outline focus:bg-white focus:ring-2 focus:ring-primary/20" placeholder="Nhập tên công việc học tập mới..." aria-invalid={Boolean(error)} aria-describedby={error ? "new-task-error" : undefined} />{error && <p id="new-task-error" role="alert" className="mt-1 text-xs text-danger">{error}</p>}</div><button type="submit" className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-container"><span className="text-xl leading-none">+</span> Thêm công việc</button></form>;
}