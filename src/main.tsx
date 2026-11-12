import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { bootstrapMetrika } from "@/lib/metrika"

document.documentElement.classList.remove("dark")
bootstrapMetrika()
document.documentElement.classList.add("light")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
