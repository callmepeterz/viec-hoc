import TaskItem, { Task } from "./TaskItem";

type TaskListProps = { tasks: Task[]; onToggle: (id: number) => void; onDelete: (id: number) => void; onEdit: (id: number, title: string) => void };

export default function TaskList({ tasks, onToggle, onDelete, onEdit }: TaskListProps) {
  if (tasks.length === 0) return <div className="rounded-xl bg-white p-8 text-center text-sm text-muted shadow-sm">Chưa có công việc trong mục này.</div>;
  return <div className="flex flex-col gap-3">{tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />)}</div>;
}