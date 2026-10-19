import { FormEvent, useState } from "react";

export type Task = { id: string; title: string; is_done: boolean };

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onEdit: (id: string, title: string) => Promise<boolean>;
  isProcessing: boolean;
};

export default function TaskItem({ task, onToggle, onDelete, onEdit, isProcessing }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState("");

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
      setError("Tên công việc phải dài từ 1 đến 120 ký tự.");
      return;
    }
    const updated = await onEdit(task.id, trimmedTitle);
    if (updated) {
      setError("");
      setIsEditing(false);
    }
  }

  function cancelEdit() {
    setTitle(task.title);
    setError("");
    setIsEditing(false);
  }

  return (
    <div data-testid="task-item" className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex min-w-0 items-center gap-4">
        <button type="button" disabled={isProcessing} aria-label={task.is_done ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"} onClick={() => void onToggle(task.id)} className={`flex size-6 shrink-0 items-center justify-center rounded-md text-sm transition active:scale-90 disabled:cursor-not-allowed disabled:opacity-60 ${task.is_done ? "bg-secondary text-white" : "bg-surface-high text-transparent hover:text-outline"}`}>✓</button>
        {isEditing ? <form onSubmit={saveEdit} className="min-w-0"><label htmlFor={`edit-task-${task.id}`} className="sr-only">Tên công việc</label><input id={`edit-task-${task.id}`} value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} className="h-9 w-full rounded border border-primary px-2 text-sm outline-none" autoFocus disabled={isProcessing} /><div className="mt-1 flex gap-2 text-xs"><button type="submit" disabled={isProcessing} className="font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-60">{isProcessing ? "Đang lưu..." : "Lưu"}</button><button type="button" disabled={isProcessing} onClick={cancelEdit} className="text-muted disabled:cursor-not-allowed disabled:opacity-60">Hủy</button></div>{error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}</form> : <span className={`truncate text-base ${task.is_done ? "text-outline line-through" : "font-medium text-foreground"}`}>{task.title}</span>}
      </div>
      {!isEditing && <div className="flex shrink-0 items-center gap-1"><button type="button" disabled={isProcessing} aria-label={`Sửa ${task.title}`} onClick={() => setIsEditing(true)} className="rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-surface-high disabled:cursor-not-allowed disabled:opacity-60">Sửa</button><button type="button" disabled={isProcessing} aria-label={`Xóa ${task.title}`} onClick={() => void onDelete(task.id)} className="rounded-lg px-2 py-1.5 text-sm text-danger transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">Xóa</button></div>}
    </div>
  );
}