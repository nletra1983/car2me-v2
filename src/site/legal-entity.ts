import { publicUrl } from "@/lib/public-url"

/** Реквизиты получателя платежа за отчёт Car2Me (единый источник для сайта). */
export const legalEntity = {
  nameFull: "Кузменкова Наталья Николаевна",
  nameShort: "Кузменкова Наталья Николаевна",
  status: "плательщик НПД (самозанятая)",
  statusShort: "самозанятая",
  inn: "782701946209",
} as const

export const legalDocPaths = {
  offer: publicUrl("offer.html"),
  privacy: publicUrl("privacy.html"),
  pdConsent: publicUrl("pd-consent.html"),
} as const

/** Строки для блока «Реквизиты» на лендинге */
export const paymentRequisitesLines = [
  `Получатель: ${legalEntity.nameFull}`,
  `Статус: ${legalEntity.status}`,
  `ИНН ${legalEntity.inn}`,
] as const
