import { Badge } from "@/components/ui/badge"

const weightDot: Record<string, string> = {
  Критично: "bg-proof-heading",
  Важно: "bg-foreground",
  Желательно: "bg-muted-foreground",
}

export function weightDotClass(label: string) {
  return weightDot[label] ?? "bg-muted-foreground"
}

export function ScoreMark({ value }: { value: number }) {
  const tone =
    value >= 5
      ? "bg-foreground text-background"
      : value === 4
        ? "bg-chart-3 text-background"
        : value === 3
          ? "bg-chart-1 text-foreground"
          : "bg-proof text-proof-text ring-1 ring-inset ring-proof-heading"

  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium tabular-nums ${tone}`}
    >
      {value}
    </span>
  )
}

export function TotalMark({ value, best }: { value: number; best: boolean }) {
  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-md text-sm font-medium tabular-nums ${
        best
          ? "bg-foreground text-background"
          : "bg-background text-foreground ring-1 ring-border ring-inset"
      }`}
    >
      {value}
    </span>
  )
}

export function RiskMark({ level }: { level: string }) {
  const tone =
    level === "Критично"
      ? "border-risk-bad bg-risk-bad/20 text-risk-bad-ink"
      : level === "Заметно"
        ? "border-risk-note bg-risk-note/35 text-risk-note-ink"
        : "border-risk-ok bg-risk-ok/20 text-risk-ok-ink"

  return (
    <Badge className={`h-auto rounded-[6px] px-2.5 py-1 text-sm ${tone}`}>
      {level}
    </Badge>
  )
}
