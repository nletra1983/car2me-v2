import { expect, test } from "@playwright/test"

test.describe("Главная лендинга", () => {
  test("кнопка анкеты, навигация и пример PDF", async ({ page }) => {
    await page.goto("/")

    await expect(
      page.getByRole("heading", {
        name: /Поймите за 24 часа/i,
      })
    ).toBeVisible()

    const start = page.locator('a[href="/anketa"]', { hasText: "Начать анкету" }).first()
    await expect(start).toBeVisible()
    await start.click()
    await expect(page).toHaveURL(/\/anketa$/)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()

    await page.goto("/")
    await page.getByRole("link", { name: "Как это работает" }).click()
    await expect(page.locator("#how")).toBeInViewport()

    await page.locator("#report").scrollIntoViewIfNeeded()
    const pdf = page.locator('a[href*="sample-report.pdf"]', {
      hasText: /Открыть пример целиком/i,
    })
    await expect(pdf).toBeVisible()
    await expect(pdf).toHaveAttribute("target", "_blank")
  })
})
