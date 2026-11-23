import { siteImages } from "@/lib/site-images"

export function BrandLogoMark({ className }: { className?: string }) {
  return (
    <img
      alt="Car2Me"
      className={`w-auto object-contain ${className ?? ""}`}
      src={siteImages.logo}
    />
  )
}

export function BrandLogoImage({ className }: { className?: string }) {
  return <img alt="Car2Me" className={className} src={siteImages.logo} />
}
