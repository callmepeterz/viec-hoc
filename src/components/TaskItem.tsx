import { FormEvent, useState } from "react";

export type Task = { id: number; title: string; is_done: boolean };

type TaskItemProps = {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
};

export default function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [error, setError] = useState("");

  function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (trimmedTitle.length < 1 || trimmedTitle.length > 120) {
      setError("Tên công việc phải dài từ 1 đến 120 ký tự.");
      return;
    }
    onEdit(task.id, trimmedTitle);
    setError("");
    setIsEditing(false);
  }

  function cancelEdit() {
    setTitle(task.title);
    setError("");
    setIsEditing(false);
  }

  return (
    <div data-testid="task-item" className="flex items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex min-w-0 items-center gap-4">
        <button type="button" aria-label={task.is_done ? "Đánh dấu chưa hoàn thành" : "Đánh dấu hoàn thành"} onClick={() => onToggle(task.id)} className={`flex size-6 shrink-0 items-center justify-center rounded-md text-sm transition active:scale-90 ${task.is_done ? "bg-secondary text-white" : "bg-surface-high text-transparent hover:text-outline"}`}>✓</button>
        {isEditing ? <form onSubmit={saveEdit} className="min-w-0"><label htmlFor={`edit-task-${task.id}`} className="sr-only">Tên công việc</label><input id={`edit-task-${task.id}`} value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} className="h-9 w-full rounded border border-primary px-2 text-sm outline-none" autoFocus /><div className="mt-1 flex gap-2 text-xs"><button type="submit" className="font-semibold text-primary">Lưu</button><button type="button" onClick={cancelEdit} className="text-muted">Hủy</button></div>{error && <p role="alert" className="mt-1 text-xs text-danger">{error}</p>}</form> : <span className={`truncate text-base ${task.is_done ? "text-outline line-through" : "font-medium text-foreground"}`}>{task.title}</span>}
      </div>
      {!isEditing && <div className="flex shrink-0 items-center gap-1"><button type="button" aria-label={`Sửa ${task.title}`} onClick={() => setIsEditing(true)} className="rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-surface-high">Sửa</button><button type="button" aria-label={`Xóa ${task.title}`} onClick={() => onDelete(task.id)} className="rounded-lg px-2 py-1.5 text-sm text-danger transition hover:bg-red-50">Xóa</button></div>}
    </div>
  );
}