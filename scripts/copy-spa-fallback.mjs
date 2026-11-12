import { copyFileSync, existsSync, mkdirSync } from "node:fs"
import { resolve } from "node:path"

const distDir = resolve(import.meta.dirname, "../dist")
const distIndex = resolve(distDir, "index.html")

if (!existsSync(distIndex)) {
  console.error("copy-spa-fallback: dist/index.html не найден — сначала npm run build")
  process.exit(1)
}

copyFileSync(distIndex, resolve(distDir, "404.html"))

const anketaDir = resolve(distDir, "anketa")
mkdirSync(anketaDir, { recursive: true })
copyFileSync(distIndex, resolve(anketaDir, "index.html"))

console.log("copy-spa-fallback: dist/404.html и dist/anketa/index.html готовы для GitHub Pages")
