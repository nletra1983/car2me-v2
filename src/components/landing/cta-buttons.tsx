import { Button } from "@/components/ui/button"
import { appPath } from "@/lib/public-url"
import { cn } from "cn"

/** Контурная кнопка: фон прозрачный, сливается с фоном блока. */
export type ExampleSurface = "default" | "proof" | "dark"

const surfaceStyles: Record<ExampleSurface, string> = {
  default:
    "border-border bg-transparent text-foreground shadow-none hover:bg-muted/50",
  proof:
    "border-proof-heading/40 bg-transparent text-foreground shadow-none hover:bg-background/60",
  dark:
    "border-background/40 bg-transparent text-background shadow-none hover:bg-background/15 hover:text-background",
}

export function StartButton({ className }: { className?: string }) {
  return (
    <Button
      className={className}
      nativeButton={false}
      render={<a href={appPath("anketa")} />}
      size="lg"
    >
      Начать анкету
    </Button>
  )
}

export function ExampleButton({
  children,
  className,
  href = "#report",
  target,
  surface = "default",
}: {
  children: string
  className?: string
  href?: string
  target?: string
  surface?: ExampleSurface
}) {
  return (
    <Button
      className={cn(surfaceStyles[surface], className)}
      nativeButton={false}
      render={
        <a
          href={href}
          rel={target === "_blank" ? "noopener" : undefined}
          target={target}
        />
      }
      size="lg"
      variant="outline"
    >
      {children}
    </Button>
  )
}
