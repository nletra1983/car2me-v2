import { type CSSProperties } from "react"

import { siteImages } from "@/lib/site-images"

export function BrandLogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`brand-mark ${className ?? ""}`}
      style={
        { "--brand-logo": `url("${siteImages.logo}")` } as CSSProperties
      }
    />
  )
}

export function BrandLogoImage({ className }: { className?: string }) {
  return <img alt="Car2Me" className={className} src={siteImages.logo} />
}
