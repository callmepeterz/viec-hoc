import { expect, test, type Page } from "@playwright/test";

const email = process.env.TEST_EMAIL_A;
const password = process.env.TEST_PASSWORD_A;

async function login(page: Page) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email!);
  await page.getByRole("textbox", {name: "Mật khẩu"}).fill(password!);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await expect(page).toHaveURL(/\/tasks$/);
}

async function accessToken(page: Page) {
  return page.evaluate(() => {
    for (let index = 0; index < localStorage.length; index += 1) {
      const value = localStorage.getItem(localStorage.key(index)!);
      if (!value) continue;
      try {
        const parsed = JSON.parse(value) as { access_token?: string };
        if (parsed.access_token) return parsed.access_token;
      } catch {
        continue;
      }
    }
    return null;
  });
}

test("đăng nhập và CRUD công việc qua API thật", async ({ page }) => {
  const title = `Kiểm thử Playwright ${Date.now()}`;
  const editedTitle = `${title} đã sửa`;
  let currentTitle = title;
  let taskRow = page.getByTestId("task-item").filter({ hasText: currentTitle });

  try {
    await login(page);

    await page.getByLabel("Tên công việc mới").fill(title);
    await page.getByRole("button", { name: "Thêm công việc" }).click();
    taskRow = page.getByTestId("task-item").filter({ hasText: title });
    await expect(taskRow).toBeVisible();

    await page.reload();
    taskRow = page.getByTestId("task-item").filter({ hasText: title });
    await expect(taskRow).toBeVisible();

    await taskRow.getByRole("button", { name: `Sửa ${title}` }).click();
    const editingRow = page
      .getByTestId("task-item")
      .filter({ has: page.getByLabel("Tên công việc") });

    await editingRow.getByLabel("Tên công việc").fill(editedTitle);
    await editingRow.getByRole("button", { name: "Lưu" }).click();
    currentTitle = editedTitle;
    taskRow = page.getByTestId("task-item").filter({ hasText: editedTitle });
    await expect(taskRow).toBeVisible();

    await taskRow.getByRole("button", { name: "Đánh dấu hoàn thành" }).click();
    await expect(taskRow.getByRole("button", { name: "Đánh dấu chưa hoàn thành" })).toBeVisible();

    await page.reload();
    taskRow = page.getByTestId("task-item").filter({ hasText: editedTitle });
    await expect(taskRow.getByRole("button", { name: "Đánh dấu chưa hoàn thành" })).toBeVisible();

    page.once("dialog", (dialog) => void dialog.accept());
    await taskRow.getByRole("button", { name: `Xóa ${editedTitle}` }).click();
    await expect(page.getByTestId("task-item").filter({ hasText: editedTitle })).toHaveCount(0);
  } finally {
    const remainingRow = page.getByTestId("task-item").filter({ hasText: currentTitle });
    if (await remainingRow.count()) {
      page.once("dialog", (dialog) => void dialog.accept());
      await remainingRow.getByRole("button", { name: `Xóa ${currentTitle}` }).click();
    }
  }
});

test("API từ chối token thiếu và input sai", async ({ page, request }) => {
  const unauthenticated = await request.get("/api/tasks");
  expect(unauthenticated.status()).toBe(401);

  await login(page);
  const token = await accessToken(page);
  expect(token).toBeTruthy();

  const invalidInput = await request.post("/api/tasks", {
    headers: { Authorization: `Bearer ${token}` },
    data: { title: "", unexpected: true },
  });
  expect(invalidInput.status()).toBe(400);
});
