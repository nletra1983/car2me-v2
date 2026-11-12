import { type ReactNode } from "react"

import { StartButton } from "@/components/landing/cta-buttons"

const navLinkClass =
  "rounded-sm text-base focus-visible:ring-3 focus-visible:ring-ring"

type SiteHeaderProps = {
  logo: ReactNode
  barHeight?: "compact" | "tall"
}

export function SiteHeader({ logo, barHeight = "tall" }: SiteHeaderProps) {
  const heightClass = barHeight === "tall" ? "h-24" : "h-16"

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background">
      <div
        className={`mx-auto flex w-full max-w-6xl items-center gap-4 px-4 ${heightClass} md:gap-6`}
      >
        <a
          aria-label="Car2Me — на главную"
          className="shrink-0 rounded-sm focus-visible:ring-3 focus-visible:ring-ring"
          href="#top"
        >
          {logo}
        </a>
        <nav
          aria-label="Разделы"
          className="hidden min-w-0 flex-1 items-center gap-5 lg:gap-6 md:flex"
        >
          <a className={navLinkClass} href="#how">
            Как это работает
          </a>
          <a className={navLinkClass} href="#report">
            Пример отчёта
          </a>
          <a className={navLinkClass} href="#price">
            Стоимость
          </a>
          <a className={navLinkClass} href="#faq">
            Вопросы
          </a>
        </nav>
        <div className="ml-auto shrink-0">
          <StartButton className="h-11" />
        </div>
      </div>
    </header>
  )
}
