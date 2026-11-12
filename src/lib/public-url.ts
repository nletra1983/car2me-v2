/** Файл из `public/` с учётом `base` (GitHub Pages → `/car2me-v2/`, car2me.ru → `/`). */
export function publicUrl(path: string): string {
  const base = import.meta.env.BASE_URL
  const relative = path.replace(/^\//, "")
  const encoded = relative
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/")
  return `${base}${encoded}`
}

/** Внутренняя ссылка SPA (анкета, главная). */
export function appPath(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "")
  if (!path || path === "/") return `${base}/`
  const sub = path.replace(/^\//, "")
  return `${base}/${sub}`
}
