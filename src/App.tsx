import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import { CookieBanner } from "@/components/cookie-banner"
import { Anketa } from "@/pages/anketa"
import { HomePage } from "@/pages/home"

const baseUrl = import.meta.env.BASE_URL
const routerBasename =
  baseUrl === "/" ? undefined : baseUrl.replace(/\/$/, "")

export function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/anketa" element={<Anketa />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}

export default App
