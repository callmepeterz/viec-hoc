import { z } from "zod";
import { authRequest } from "@/lib/auth-request";

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

const idSchema = z.uuid();
const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    is_done: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0);

const serverError = () => json({ error: "Đã xảy ra lỗi máy chủ." }, 500);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authRequest(request);
    if (!auth) return json({ error: "Chưa đăng nhập" }, 401);

    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      return json({ error: "ID công việc không hợp lệ" }, 400);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Body JSON không hợp lệ" }, 400);
    }

    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return json({ error: "Dữ liệu cập nhật không hợp lệ" }, 400);
    }

    const { data, error } = await auth.db
      .from("tasks")
      .update(parsed.data)
      .eq("id", id)
      .eq("user_id", auth.user.id)
      .select("id,title,is_done,created_at")
      .maybeSingle();

    if (error) return serverError();
    if (!data) return json({ error: "Không tìm thấy công việc" }, 404);

    return json({ data });
  } catch {
    return serverError();
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authRequest(request);
    if (!auth) return json({ error: "Chưa đăng nhập" }, 401);

    const { id } = await params;
    if (!idSchema.safeParse(id).success) {
      return json({ error: "ID công việc không hợp lệ" }, 400);
    }

    const { data, error } = await auth.db
      .from("tasks")
      .delete()
      .eq("id", id)
      .eq("user_id", auth.user.id)
      .select("id");

    if (error) return serverError();
    if (!data || data.length === 0) {
      return json({ error: "Không tìm thấy công việc" }, 404);
    }

    return json({ data: { id } });
  } catch {
    return serverError();
  }
}
