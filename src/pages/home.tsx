import { useEffect } from "react"

import { setPageMeta } from "@/lib/page-meta"
import { Landing } from "@/site/landing"

export function HomePage() {
  useEffect(() => {
    setPageMeta({
      title:
        "Car2Me — какая модель вам подходит и сколько она стоит под ключ",
      description:
        "Расскажите, как вы ездите. За 24 часа пришлём короткий список моделей и цену под ключ, со всеми платежами.",
      pathname: "/",
      robots: "index, follow, max-snippet:-1, max-image-preview:large",
    })
  }, [])

  return <Landing />
}
