export type CompareMarkKind = "yes" | "part" | "no"

export function compareMark(text: string): CompareMarkKind | null {
  if (text.startsWith("Нет") || text.startsWith("Зарабатывает"))
    return "no"
  if (text.startsWith("Да") || text.startsWith("Все рынки")) return "yes"
  if (
    text.startsWith("Частично") ||
    text.startsWith("Приблизительно") ||
    text.startsWith("Обычно") ||
    text.startsWith("Редко") ||
    text.startsWith("Без ") ||
    text.startsWith("В основном") ||
    text.startsWith("Цены ")
  ) {
    return "part"
  }
  return null
}

const compareTone = {
  yes: "text-risk-ok-ink",
  part: "text-risk-note-ink",
  no: "text-proof-heading",
} as const

function CompareMark({
  kind,
  soft,
}: {
  kind: CompareMarkKind
  soft?: boolean
}) {
  if (!soft && kind === "yes") {
    return (
      <svg
        aria-hidden="true"
        className="mt-0.5 size-5 shrink-0 text-risk-ok-ink"
        viewBox="0 0 20 20"
      >
        <circle className="fill-current" cx="10" cy="10" r="10" />
        <path
          d="M6 10.2l2.6 2.6L14 7.4"
          fill="none"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      </svg>
    )
  }

  return (
    <svg
      aria-hidden="true"
      className={`mt-0.5 size-5 shrink-0 ${compareTone[kind]}`}
      viewBox="0 0 20 20"
    >
      <circle
        cx="10"
        cy="10"
        fill="currentColor"
        fillOpacity="0.16"
        r="9.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {kind === "yes" ? (
        <path
          d="M6 10.2l2.6 2.6L14 7.4"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}
      {kind === "part" ? (
        <path
          d="M10 .75a9.25 9.25 0 0 1 0 18.5z"
          fill="currentColor"
          fillOpacity="0.45"
        />
      ) : null}
      {kind === "no" ? (
        <path
          d="M7 7l6 6M13 7l-6 6"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.5"
        />
      ) : null}
    </svg>
  )
}

export function CompareCell({
  text,
  tone,
}: {
  text: string
  tone?: "car"
}) {
  const mark = compareMark(text)

  return (
    <span className="flex min-w-0 items-start gap-2">
      {mark ? <CompareMark kind={mark} soft={tone !== "car"} /> : null}
      <span className="min-w-0">{text}</span>
    </span>
  )
}
