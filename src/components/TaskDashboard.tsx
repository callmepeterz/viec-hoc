"use client";

import { useState } from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Task } from "./TaskItem";

type Filter = "all" | "active" | "completed";

const initialTasks: Task[] = [
  { id: 1, title: "Đọc chương 3 Sách Giải tích", is_done: true },
  { id: 2, title: "Làm bài tập ngữ pháp Tiếng Anh Unit 4", is_done: false },
  { id: 3, title: "Ôn tập từ vựng chuyên ngành 30 phút", is_done: false },
  { id: 4, title: "Soạn đề cương Lịch sử Đảng", is_done: true },
];

export default function TaskDashboard() {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState<Filter>("all");
  const completed = tasks.filter((task) => task.is_done).length;
  const visibleTasks = tasks.filter((task) => filter === "all" || (filter === "completed" ? task.is_done : !task.is_done));

  function addTask(title: string) { setTasks((current) => [...current, { id: Date.now(), title, is_done: false }]); }
  function toggleTask(id: number) { setTasks((current) => current.map((task) => task.id === id ? { ...task, is_done: !task.is_done } : task)); }
  function editTask(id: number, title: string) { setTasks((current) => current.map((task) => task.id === id ? { ...task, title } : task)); }
  function deleteTask(id: number) { if (window.confirm("Bạn có chắc muốn xóa công việc này không?")) setTasks((current) => current.filter((task) => task.id !== id)); }

  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: tasks.length },
    { key: "active", label: "Chưa xong", count: tasks.filter((task) => !task.is_done).length },
    { key: "completed", label: "Đã xong", count: completed },
  ];

  return <main className="min-h-screen bg-surface px-4 py-8 text-foreground sm:px-6 lg:px-10"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">◷ Hôm nay • Kế hoạch cá nhân</div><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Công việc học tập</h1><p className="mt-1 text-base text-muted">Hôm nay bạn cần hoàn thành những gì?</p></div><div className="flex items-center gap-4 rounded-xl bg-white p-3 px-5 shadow-sm"><div><p className="text-xs text-muted">Tổng tiến độ</p><p className="text-lg font-bold">{completed}/{tasks.length} hoàn thành</p></div><div className="h-2 w-24 overflow-hidden rounded-full bg-surface-high"><div className="h-full bg-secondary transition-all" style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} /></div></div></header><div className="mb-8"><TaskForm onAdd={addTask} /></div><div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="flex min-w-0 flex-col gap-3"><div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-1.5 shadow-sm"> <div className="flex gap-1">{tabs.map((tab) => <button key={tab.key} type="button" onClick={() => setFilter(tab.key)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === tab.key ? "bg-primary-container text-white" : "text-muted hover:bg-surface-high"}`}>{tab.label} <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-xs">{tab.count}</span></button>)}</div><span className="hidden pr-3 text-xs text-outline sm:inline">Nhấp để thay đổi trạng thái</span></div><TaskList tasks={visibleTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} /></section><aside className="flex flex-col gap-4"><div className="rounded-xl bg-surface-low p-4"><p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Gợi ý tập trung</p><p className="text-sm leading-6 text-muted">Chia nhỏ bài học lớn thành các phần 25 phút theo kỹ thuật Pomodoro để hoàn thành nhẹ nhàng hơn.</p></div><div className="rounded-xl bg-white p-6 text-center shadow-sm"><div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-surface-low text-2xl text-primary">✓</div><h2 className="text-lg font-bold">Giữ nhịp học tập</h2><p className="mt-2 text-sm text-muted">Mỗi công việc hoàn thành là một bước tiến nhỏ trong ngày hôm nay.</p></div></aside></div></div></main>;
}