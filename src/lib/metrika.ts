/**
 * Яндекс.Метрика — car2me.ru
 * Имя, телефон и почту в параметры целей не передаём.
 *
 * Цели (тип «JavaScript-событие» в интерфейсе Метрики):
 * - anketa_start — открыта страница /anketa
 * - anketa_sent — нажата «Отправить анкету» на сводке
 * - cookie_accept — «Принять» в баннере cookie
 */
export const METRIKA_ID = 112130182

export const METRIKA_GOALS = {
  anketaStart: "anketa_start",
  anketaSent: "anketa_sent",
  cookieAccept: "cookie_accept",
} as const

const CONSENT_KEY = "car2me_analytics_consent"

declare global {
  interface Window {
    ym?: (id: number, action: string, ...args: unknown[]) => void
  }
}

export function getAnalyticsConsent(): "1" | "0" | null {
  const v = localStorage.getItem(CONSENT_KEY)
  if (v === "1" || v === "0") return v
  return null
}

export function setAnalyticsConsent(value: "1" | "0") {
  localStorage.setItem(CONSENT_KEY, value)
  if (value === "1") {
    loadMetrika()
  }
  // value === "0" — на следующих визитах bootstrapMetrika не грузит счётчик
}

/** Можно собирать визиты и цели, пока пользователь явно не отказался. */
export function analyticsAllowed(): boolean {
  return getAnalyticsConsent() !== "0"
}

let metrikaLoaded = false

export function loadMetrika() {
  if (metrikaLoaded || typeof window === "undefined") return
  if (!METRIKA_ID) return

  type YmStub = { a?: unknown[]; l?: number }
  const win = window as Window & { ym?: YmStub & ((...args: unknown[]) => void) }

  win.ym =
    win.ym ||
    function (...args: unknown[]) {
      const stub = win.ym as YmStub
      stub.a = stub.a || []
      stub.a.push(args)
    }
  const stub = win.ym as YmStub
  if (!stub.l) stub.l = Date.now()

  const src = "https://mc.yandex.ru/metrika/tag.js"
  for (let j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j]?.src === src) return
  }
  const script = document.createElement("script")
  const first = document.getElementsByTagName("script")[0]
  script.async = true
  script.src = src
  first?.parentNode?.insertBefore(script, first)

  window.ym?.(METRIKA_ID, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true,
    webvisor: true,
    trackHash: true,
    ecommerce: "dataLayer",
  })

  metrikaLoaded = true
}

export function bootstrapMetrika() {
  if (analyticsAllowed()) {
    loadMetrika()
  }
}

export function reachGoal(goal: string) {
  if (!analyticsAllowed()) return

  const fire = (attempts = 0) => {
    if (typeof window.ym !== "function") {
      if (attempts < 30) setTimeout(() => fire(attempts + 1), 100)
      return
    }
    window.ym(METRIKA_ID, "reachGoal", goal)
  }
  fire()
}
