/** Канонический хост продакшена (без слэша в конце). */
export const SITE_ORIGIN = "https://car2me.ru"

export function canonicalUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`
  if (path === "/" || path === "") return `${SITE_ORIGIN}/`
  return `${SITE_ORIGIN}${path}`
}
