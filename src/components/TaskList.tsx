import TaskItem, { Task } from "./TaskItem";

type TaskListProps = { tasks: Task[]; onToggle: (id: string) => Promise<boolean>; onDelete: (id: string) => Promise<boolean>; onEdit: (id: string, title: string) => Promise<boolean>; processingTaskId: string | null };

export default function TaskList({ tasks, onToggle, onDelete, onEdit, processingTaskId }: TaskListProps) {
  if (tasks.length === 0) return <div className="rounded-xl bg-white p-8 text-center text-sm text-muted shadow-sm">Chưa có công việc trong mục này.</div>;
  return <div className="flex flex-col gap-3">{tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} isProcessing={processingTaskId === task.id} />)}</div>;
}