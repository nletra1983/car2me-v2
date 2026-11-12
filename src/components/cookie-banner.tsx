import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { legalDocPaths } from "@/site/legal-entity"

import {
  getAnalyticsConsent,
  METRIKA_GOALS,
  reachGoal,
  setAnalyticsConsent,
} from "@/lib/metrika"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getAnalyticsConsent() === null) {
      setVisible(true)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 p-4 shadow-lg backdrop-blur-sm"
      role="dialog"
      aria-label="Настройки cookie"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-muted-foreground">
          Сайт использует cookie и Яндекс.Метрику для обезличенной статистики.
          Имя, телефон и почту в Метрику не отправляем. «Только необходимое» —
          без аналитики при следующих заходах. Подробнее — в{" "}
          <a
            className="text-foreground underline underline-offset-4"
            href={legalDocPaths.privacy}
          >
            политике персональных данных
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => {
              setAnalyticsConsent("0")
              setVisible(false)
            }}
          >
            Только необходимое
          </Button>
          <Button
            type="button"
            className="h-10"
            onClick={() => {
              setAnalyticsConsent("1")
              reachGoal(METRIKA_GOALS.cookieAccept)
              setVisible(false)
            }}
          >
            Принять
          </Button>
        </div>
      </div>
    </div>
  )
}
