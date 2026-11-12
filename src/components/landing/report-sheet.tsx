import { type ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { sheets } from "@/site/content"

export function ReportSheet({
  page,
  children,
  variant = "card",
}: {
  page: string
  children: ReactNode
  variant?: "card" | "plain"
}) {
  const header = (
    <div className="flex justify-between gap-4 border-b border-border px-6 py-3 text-sm">
      <span>{sheets.coverTitle}</span>
      <span>{page}</span>
    </div>
  )

  if (variant === "plain") {
    return (
      <article className="rounded-lg border border-border bg-background">
        {header}
        <div className="px-6 py-5 text-base">{children}</div>
      </article>
    )
  }

  return (
    <Card className="overflow-hidden bg-background text-foreground">
      {header}
      <CardContent className="text-base">{children}</CardContent>
    </Card>
  )
}
