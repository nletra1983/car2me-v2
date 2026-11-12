import { publicUrl } from "@/lib/public-url"

/** Реквизиты получателя платежа за отчёт Car2Me (единый источник для сайта). */
export const legalEntity = {
  nameFull:
    'ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ "СМАРТ ЭФФЕКТ"',
  nameShort: "ООО «СМАРТ ЭФФЕКТ»",
  inn: "7814838066",
  kpp: "781401001",
  bankName: 'ООО "Банк Точка"',
  bik: "044525104",
  settlementAccount: "40702810720000104612",
  correspondentAccount: "30101810745374525104",
} as const

export const legalDocPaths = {
  offer: publicUrl("offer.html"),
  privacy: publicUrl("privacy.html"),
  pdConsent: publicUrl("pd-consent.html"),
} as const

/** Строки для блока «Реквизиты» на лендинге */
export const paymentRequisitesLines = [
  `Получатель: ${legalEntity.nameShort}`,
  `ИНН ${legalEntity.inn}, КПП ${legalEntity.kpp}`,
  `Расчётный счёт: ${legalEntity.settlementAccount}`,
  `Банк: ${legalEntity.bankName}`,
  `БИК ${legalEntity.bik}`,
  `Корреспондентский счёт: ${legalEntity.correspondentAccount}`,
] as const
