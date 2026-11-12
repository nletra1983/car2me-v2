import { publicUrl } from "@/lib/public-url"

/** Картинки лендинга в `public/images` — стабильные URL при публикации. */
export const siteImages = {
  logo: publicUrl("images/Car2me-1.png"),
  reportFan: publicUrl("images/отчёт-веер.png"),
  woman: publicUrl("images/women.png"),
  finalists: {
    "Hyundai Creta": publicUrl("images/creta.jpg"),
    "Toyota Raize": publicUrl("images/raize.jpg"),
    "Toyota Rush / Terios": publicUrl("images/rush.jpg"),
  },
} as const
