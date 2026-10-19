"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-browser";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import { Task } from "./TaskItem";

type Filter = "all" | "active" | "completed";

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function apiFetch<T>(
  router: ReturnType<typeof useRouter>,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) {
    throw new ApiError(500, "Không thể kiểm tra phiên đăng nhập.");
  }

  if (!data.session) {
    router.replace("/login");
    throw new ApiError(401, "Vui lòng đăng nhập lại.");
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${data.session.access_token}`);
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(path, { ...init, headers });
  let body: { data?: T; error?: string } = {};
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, "Phản hồi từ máy chủ không hợp lệ.");
    }
  }

  if (!response.ok) {
    if (response.status === 401) {
      router.replace("/login");
      throw new ApiError(401, "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
    }
    throw new ApiError(response.status, body.error ?? "Không thể hoàn tất yêu cầu.");
  }

  return body.data as T;
}

export default function TaskDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    setError("");
    try {
      const data = await apiFetch<Task[]>(router, "/api/tasks");
      setTasks(data);
    } catch (caught) {
      const apiError = caught instanceof ApiError ? caught : null;
      setError(apiError?.message ?? "Không thể tải danh sách công việc.");
    } finally {
      setIsLoadingTasks(false);
    }
  }, [router]);

  useEffect(() => {
    let isMounted = true;
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (session) {
        setIsAuthenticated(true);
        setIsLoadingSession(false);
        void loadTasks();
        return;
      }

      setTasks([]);
      setIsAuthenticated(false);
      setIsLoadingSession(false);
      router.replace("/login");
    });

    async function initialize() {
      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (sessionError) {
        setError("Không thể kiểm tra phiên đăng nhập.");
        setIsLoadingSession(false);
        return;
      }

      if (!data.session) {
        setIsLoadingSession(false);
        router.replace("/login");
        return;
      }

      setIsAuthenticated(true);
      setIsLoadingSession(false);
      await loadTasks();
    }

    void initialize();

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [loadTasks, router]);

  async function handleSignOut() {
    setError("");
    setIsSigningOut(true);
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError("Không thể đăng xuất. Vui lòng thử lại.");
      setIsSigningOut(false);
      return;
    }

    setTasks([]);
    setFilter("all");
    setIsAuthenticated(false);
    router.replace("/login");
  }

  async function addTask(title: string) {
    setIsAdding(true);
    try {
      await apiFetch<Task>(router, "/api/tasks", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      await loadTasks();
      return true;
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Không thể thêm công việc.");
      return false;
    } finally {
      setIsAdding(false);
    }
  }

  async function updateTask(id: string, body: { title?: string; is_done?: boolean }) {
    setProcessingTaskId(id);
    try {
      await apiFetch<Task>(router, `/api/tasks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      await loadTasks();
      return true;
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Không thể cập nhật công việc.");
      return false;
    } finally {
      setProcessingTaskId(null);
    }
  }

  async function toggleTask(id: string) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return false;
    return updateTask(id, { is_done: !task.is_done });
  }

  async function editTask(id: string, title: string) {
    return updateTask(id, { title });
  }

  async function deleteTask(id: string) {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này không?")) return false;

    setProcessingTaskId(id);
    try {
      await apiFetch<{ id: string }>(router, `/api/tasks/${id}`, { method: "DELETE" });
      await loadTasks();
      return true;
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Không thể xóa công việc.");
      return false;
    } finally {
      setProcessingTaskId(null);
    }
  }

  if (isLoadingSession || !isAuthenticated) {
    return error ? <p role="alert" className="p-6 text-sm text-danger">{error}</p> : null;
  }

  const completed = tasks.filter((task) => task.is_done).length;
  const visibleTasks = tasks.filter((task) => filter === "all" || (filter === "completed" ? task.is_done : !task.is_done));
  const tabs: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: tasks.length },
    { key: "active", label: "Chưa xong", count: tasks.filter((task) => !task.is_done).length },
    { key: "completed", label: "Đã xong", count: completed },
  ];

  return (
    <main className="min-h-screen bg-surface px-4 py-8 text-foreground sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface-low px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
              ◷ Hôm nay • Kế hoạch cá nhân
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Công việc học tập</h1>
            <p className="mt-1 text-base text-muted">Hôm nay bạn cần hoàn thành những gì?</p>
          </div>
          <div className="flex items-center gap-4 rounded-xl bg-white p-3 px-5 shadow-sm">
            <div>
              <p className="text-xs text-muted">Tổng tiến độ</p>
              <p className="text-lg font-bold">{completed}/{tasks.length} hoàn thành</p>
            </div>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-surface-high">
              <div
                className="h-full bg-secondary transition-all"
                style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }}
              />
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg px-2 py-1 text-sm font-semibold text-primary hover:bg-surface-low disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </button>
          </div>
        </header>
        {error && <p role="alert" className="mb-4 text-sm text-danger">{error}</p>}
        {isLoadingTasks ? (
          <p className="mb-8 text-sm text-muted">Đang tải công việc...</p>
        ) : (
          <div>
            <div className="mb-8">
              <TaskForm onAdd={addTask} isSubmitting={isAdding} />
            </div>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <section className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white p-1.5 shadow-sm">
                  <div className="flex gap-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setFilter(tab.key)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === tab.key ? "bg-primary-container text-white" : "text-muted hover:bg-surface-high"}`}
                      >
                        {tab.label} <span className="ml-1 rounded-full bg-black/10 px-1.5 py-0.5 text-xs">{tab.count}</span>
                      </button>
                    ))}
                  </div>
                  <span className="hidden pr-3 text-xs text-outline sm:inline">Nhấp để thay đổi trạng thái</span>
                </div>
                <TaskList
                  tasks={visibleTasks}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  processingTaskId={processingTaskId}
                />
              </section>
              <aside className="flex flex-col gap-4">
                <div className="rounded-xl bg-surface-low p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">Gợi ý tập trung</p>
                  <p className="text-sm leading-6 text-muted">Chia nhỏ bài học lớn thành các phần 25 phút theo kỹ thuật Pomodoro để hoàn thành nhẹ nhàng hơn.</p>
                </div>
                <div className="rounded-xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-surface-low text-2xl text-primary">✓</div>
                  <h2 className="text-lg font-bold">Giữ nhịp học tập</h2>
                  <p className="mt-2 text-sm text-muted">Mỗi công việc hoàn thành là một bước tiến nhỏ trong ngày hôm nay.</p>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
