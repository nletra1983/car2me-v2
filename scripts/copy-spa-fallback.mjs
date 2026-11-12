import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const distIndex = resolve(import.meta.dirname, "../dist/index.html")

if (!existsSync(distIndex)) {
  console.error("copy-spa-fallback: dist/index.html не найден — сначала npm run build")
  process.exit(1)
}

copyFileSync(distIndex, resolve(import.meta.dirname, "../dist/404.html"))
console.log("copy-spa-fallback: dist/404.html готов для GitHub Pages")
