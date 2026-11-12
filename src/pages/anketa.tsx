import { useEffect, useId, useState } from "react"

import { BrandLogoMark } from "@/components/landing/brand-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "cn"
import { METRIKA_GOALS, reachGoal } from "@/lib/metrika"
import { appPath } from "@/lib/public-url"
import { setPageMeta } from "@/lib/page-meta"
import { legalDocPaths } from "@/site/legal-entity"

// Публичная ссылка формы «Анкета Car2me» в Яндекс Формах (аккаунт hello-car2me).
// Ответы анкеты передаются в скрытые вопросы через параметры ссылки.
const FORM_URL = "https://forms.yandex.ru/cloud/6af5d6626f1ca46f9570d1ee"

type Option = { id: string; label: string }

type Group = {
  id: string
  legend: string
  hint?: string
  options: Option[]
  multi: boolean
  exclusive?: string
}

const scenarioDefs: Option[] = [
  { id: "city", label: "Город каждый день" },
  { id: "citysome", label: "Город иногда" },
  { id: "highway", label: "Трасса 300–500+ км" },
  { id: "nature", label: "Природа по нормальной дороге" },
  { id: "dirt", label: "Грунтовка, колея, ямы" },
  { id: "winter", label: "Зима вне города" },
  { id: "trips", label: "Путешествия на несколько дней" },
  { id: "cargo", label: "Много вещей: сап, кемпинг" },
  { id: "people", label: "Регулярно вожу людей" },
  { id: "rare", label: "Езжу редко" },
]

const step1Groups: Group[] = [
  {
    id: "freq",
    legend: "Как часто бывает самое сложное из отмеченного?",
    options: [
      { id: "week", label: "Почти каждую неделю" },
      { id: "month", label: "Несколько раз в месяц" },
      { id: "year", label: "Несколько раз в год" },
      { id: "rare", label: "Редко, но машина должна справиться" },
      { id: "plan", label: "Пока только планирую" },
    ],
    multi: false,
  },
  {
    id: "hap",
    legend: "Что из этого бывает?",
    hint: "Можно несколько",
    options: [
      { id: "sleep", label: "Ночую в машине" },
      { id: "overtake", label: "Обгоняю на двухполосной" },
      { id: "park", label: "Тесная парковка" },
      { id: "pets", label: "Животные в салоне" },
      { id: "tow", label: "Буксировка прицепа" },
      { id: "none", label: "Ничего из этого" },
    ],
    multi: true,
    exclusive: "none",
  },
]

const importanceDefs: Option[] = [
  { id: "rel", label: "Надёжность и недорогой ремонт в России" },
  { id: "offroad", label: "Проходимость" },
  { id: "space", label: "Место в салоне и багажнике" },
  { id: "dyn", label: "Динамика и обгоны" },
  { id: "comfort", label: "Комфорт в дальней дороге" },
  { id: "eco", label: "Экономичность" },
  { id: "safety", label: "Безопасность" },
  { id: "amen", label: "Удобства в салоне" },
  { id: "look", label: "Внешний вид" },
  { id: "fun", label: "Удовольствие от вождения" },
]

const importanceLevels = ["Не важно", "Желательно", "Важно", "Критично"]

const marketOptions: Option[] = [
  { id: "jp", label: "Аукционы Японии" },
  { id: "kr", label: "Корея и Encar с европейскими марками" },
  { id: "cn", label: "Китай" },
  { id: "ru", label: "Новые машины у дилеров в России" },
  { id: "ruused", label: "Подержанные в России: Дром, Авто.ру" },
  { id: "grey", label: "«Серый» ввоз: BYD, Zeekr" },
  { id: "idk", label: "Не знаю — подскажите" },
]

const rulesGroups: Group[] = [
  {
    id: "climate",
    legend: "Климат",
    options: [
      { id: "cold", label: "Суровые зимы — ниже −25 °C" },
      { id: "mid", label: "Обычные для средней полосы России" },
      { id: "warm", label: "Почти без морозов" },
    ],
    multi: false,
  },
  {
    id: "limit",
    legend: "Насколько жёсткий лимит бюджета?",
    options: [
      { id: "hard", label: "Жёстко — не превышу" },
      { id: "soft", label: "Мягко — плюс 5–10%" },
      { id: "flex", label: "Гибко — главное модель" },
    ],
    multi: false,
  },
  {
    id: "when",
    legend: "Когда нужна машина?",
    hint: "Привоз из Японии и Кореи обычно занимает от нескольких недель до пары месяцев",
    options: [
      { id: "now", label: "В ближайшие 2 недели" },
      { id: "month", label: "В течение месяца" },
      { id: "q", label: "Через 2–4 месяца" },
      { id: "look", label: "Пока присматриваюсь" },
    ],
    multi: false,
  },
  {
    id: "markets",
    legend: "Откуда готовы брать?",
    hint: "Можно несколько",
    options: marketOptions,
    multi: true,
    exclusive: "idk",
  },
  {
    id: "delivery",
    legend: "Заберёте сами или нужна доставка?",
    options: [
      { id: "self", label: "Заберу сам(а)" },
      { id: "deliv", label: "Доставка в мой город" },
      { id: "dep", label: "Зависит от цены" },
    ],
    multi: false,
  },
  {
    id: "wheel",
    legend: "Руль",
    options: [
      { id: "left", label: "Только левый" },
      { id: "pref", label: "Лучше левый" },
      { id: "any", label: "Без разницы" },
    ],
    multi: false,
  },
  {
    id: "gearNo",
    legend: "Какие коробки не подходят?",
    hint: "Можно несколько",
    options: [
      { id: "mt", label: "Механика" },
      { id: "cvt", label: "Вариатор" },
      { id: "dct", label: "Робот" },
      { id: "at", label: "Классический автомат" },
      { id: "all", label: "Подходят все" },
    ],
    multi: true,
    exclusive: "all",
  },
  {
    id: "people",
    legend: "Сколько человек обычно едет?",
    options: [
      { id: "one", label: "1–2" },
      { id: "four", label: "3–4" },
      { id: "five", label: "Бывает 5 и больше" },
      { id: "seven", label: "Нужно 7 мест" },
    ],
    multi: false,
  },
  {
    id: "drivexp",
    legend: "Опыт за рулём",
    options: [
      { id: "new", label: "Меньше 3 лет" },
      { id: "mid", label: "3–10 лет" },
      { id: "pro", label: "Больше 10 лет" },
    ],
    multi: false,
  },
  {
    id: "drivers",
    legend: "Кто ещё будет ездить за рулём?",
    options: [
      { id: "solo", label: "Только я" },
      { id: "pair", label: "Я и партнёр(ша)" },
      { id: "family", label: "Несколько водителей" },
    ],
    multi: false,
  },
  {
    id: "exp",
    legend: "Был плохой опыт с прошлыми машинами?",
    options: [
      { id: "yes", label: "Да — опишу в конце" },
      { id: "no", label: "Нет" },
      { id: "first", label: "Это моя первая машина" },
    ],
    multi: false,
  },
  {
    id: "resale",
    legend: "Продадите в ближайшие 1–3 года?",
    hint: "Льготный утильсбор требует год не продавать машину",
    options: [
      { id: "yes", label: "Да" },
      { id: "maybe", label: "Возможно" },
      { id: "no", label: "Нет, беру надолго" },
    ],
    multi: false,
  },
]

const limitGroups: Group[] = [
  {
    id: "age",
    legend: "Возраст машины",
    hint: "Машины 3–5 лет обычно растаможить дешевле всего",
    options: [
      { id: "young", label: "До 3 лет" },
      { id: "opt", label: "3–5 лет" },
      { id: "seven", label: "До 7 лет" },
      { id: "old", label: "Старше — если выгодно" },
      { id: "idk", label: "Не знаю — подскажите" },
    ],
    multi: false,
  },
  {
    id: "power",
    legend: "Сколько мощности нужно?",
    hint: "Мощность влияет на утильсбор, транспортный налог и ОСАГО — подскажем, где граница",
    options: [
      { id: "calm", label: "Для спокойной езды — до 120 л. с." },
      { id: "overtake", label: "С запасом на обгоны — 120–160 л. с." },
      { id: "strong", label: "Мощная, но без перебора — 160–250 л. с." },
      { id: "max", label: "Чем мощнее, тем лучше" },
      { id: "idk", label: "Не знаю — подскажите" },
    ],
    multi: false,
  },
  {
    id: "util",
    legend: "Уложиться в льготный утильсбор?",
    hint: "При ввозе для себя льгота действует до 160 л. с. и объёма меньше 3 л; у гибридов считается суммарная мощность",
    options: [
      { id: "yes", label: "Да, это важно" },
      { id: "no", label: "Не принципиально" },
      { id: "idk", label: "Не знаю" },
    ],
    multi: false,
  },
  {
    id: "turbo",
    legend: "Турбомотор",
    options: [
      { id: "ok", label: "Подходит" },
      { id: "no", label: "Лучше без турбины" },
      { id: "idk", label: "Не знаю" },
    ],
    multi: false,
  },
  {
    id: "fuel",
    legend: "На чём должна ехать машина?",
    hint: "Можно несколько",
    options: [
      { id: "petrol", label: "Бензин" },
      { id: "diesel", label: "Дизель" },
      { id: "hybrid", label: "Гибрид" },
      { id: "gas", label: "Газ (ГБО)" },
      { id: "ev", label: "Электро или подключаемый гибрид" },
      { id: "any", label: "Без разницы — подскажите" },
    ],
    multi: true,
    exclusive: "any",
  },
  {
    id: "charge",
    legend: "Электро или подключаемый гибрид: есть где заряжать?",
    options: [
      { id: "home", label: "Дома или на работе" },
      { id: "city", label: "Только на городских станциях" },
      { id: "none", label: "Негде" },
    ],
    multi: false,
  },
  {
    id: "octane",
    legend: "Бензин",
    hint: "Часть японских и корейских моторов рассчитана на АИ-95 и выше",
    options: [
      { id: "ai92", label: "Хочу, чтобы подходил АИ-92" },
      { id: "any", label: "Без разницы" },
    ],
    multi: false,
  },
  {
    id: "drive",
    legend: "Привод",
    hint: "Задний привод даёт больше удовольствия от вождения, но зимой требует навыка",
    options: [
      { id: "fwd", label: "Передний достаточно" },
      { id: "rwd", label: "Задний" },
      { id: "awdw", label: "Полный желательно" },
      { id: "awd", label: "Полный обязательно" },
      { id: "idk", label: "Не знаю" },
    ],
    multi: false,
  },
  {
    id: "clearance",
    legend: "Клиренс — зазор под днищем",
    options: [
      { id: "any", label: "Не важен" },
      { id: "sedan", label: "Как у обычного седана" },
      { id: "high", label: "Повыше — иногда грунтовка" },
      { id: "max", label: "Максимально высокий" },
    ],
    multi: false,
  },
  {
    id: "range",
    legend: "Запас хода на одном баке",
    options: [
      { id: "any", label: "Не важно" },
      { id: "400", label: "Хотя бы 400 км" },
      { id: "550", label: "Хотя бы 550 км" },
      { id: "700", label: "700+ км" },
    ],
    multi: false,
  },
  {
    id: "bodyNo",
    legend: "Кузов — что точно не подходит",
    hint: "Остальные варианты подберём сами",
    options: [
      { id: "sedan", label: "Седан" },
      { id: "hatch", label: "Хэтчбек" },
      { id: "lift", label: "Лифтбек" },
      { id: "wagon", label: "Универсал" },
      { id: "suv", label: "Кроссовер" },
      { id: "offroad", label: "Внедорожник" },
      { id: "van", label: "Минивэн" },
      { id: "coupe", label: "Купе и кабриолет" },
      { id: "pickup", label: "Пикап" },
      { id: "kei", label: "Кей-кар — японская малолитражка 660 см³" },
      { id: "all", label: "Подходит всё" },
    ],
    multi: true,
    exclusive: "all",
  },
  {
    id: "equip",
    legend: "Обязательно в комплектации",
    hint: "Можно несколько",
    options: [
      { id: "climate", label: "Климат-контроль" },
      { id: "heat", label: "Подогревы" },
      { id: "cam", label: "Камера" },
      { id: "cruise", label: "Круиз-контроль" },
      { id: "isofix", label: "Isofix" },
      { id: "rails", label: "Рейлинги" },
      { id: "spare", label: "Полноразмерная запаска" },
      { id: "rus", label: "Русское меню и навигация" },
      { id: "start", label: "Автозапуск или подогреватель" },
    ],
    multi: true,
  },
  {
    id: "parking",
    legend: "Где стоит машина",
    options: [
      { id: "garage", label: "Гараж или крытая парковка" },
      { id: "street", label: "Двор, улица круглый год" },
      { id: "mixed", label: "По-разному" },
    ],
    multi: false,
  },
]

const consentUrl = legalDocPaths.pdConsent
const offerUrl = legalDocPaths.offer

function joinLabels(options: Option[], ids: string[]): string {
  return options
    .filter((option) => ids.includes(option.id))
    .map((option) => option.label)
    .join("; ")
}

// Оставляет только цифры и отделяет разряды пробелами: 1500000 -> "1 500 000"
function formatDigits(value: string, maxDigits = 9): string {
  const digits = value.replace(/\D/g, "").slice(0, maxDigits)
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
}

function StepHeader({
  title,
  lead,
}: {
  title: string
  lead: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="text-base leading-relaxed">{lead}</p>
    </div>
  )
}

function Chip({
  label,
  on,
  blocked,
  onPick,
}: {
  label: string
  on: boolean
  blocked: boolean
  onPick: () => void
}) {
  return (
    <Button
      aria-pressed={on}
      className="h-11 min-w-0 px-4 text-left text-[15px] leading-snug"
      disabled={blocked}
      onClick={onPick}
      type="button"
      variant={on ? "default" : "outline"}
    >
      {label}
    </Button>
  )
}

function ChipGroup({
  group,
  picked,
  onPick,
}: {
  group: Group
  picked: string[]
  onPick: (optionId: string) => void
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-base font-medium">{group.legend}</legend>
      {group.hint ? (
        <p className="text-sm text-muted-foreground">{group.hint}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {group.options.map((option) => (
          <Chip
            blocked={false}
            key={option.id}
            label={option.label}
            on={picked.includes(option.id)}
            onPick={() => onPick(option.id)}
          />
        ))}
      </div>
    </fieldset>
  )
}

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string
  children: string
  hint?: string
}) {
  return (
    <span className="flex flex-col gap-1">
      <label className="text-base font-medium" htmlFor={htmlFor}>
        {children}
      </label>
      {hint ? (
        <span className="text-sm text-muted-foreground">{hint}</span>
      ) : null}
    </span>
  )
}

export function Anketa() {
  const [step, setStep] = useState(1)
  const [scenarios, setScenarios] = useState<string[]>([])
  const [top, setTop] = useState<string[]>([])
  const [single, setSingle] = useState<Record<string, string>>({})
  const [multi, setMulti] = useState<Record<string, string[]>>({})
  const [importance, setImportance] = useState<Record<string, number>>({})
  const [budget, setBudget] = useState("")
  const [city, setCity] = useState("")
  const [height, setHeight] = useState("")
  const [story, setStory] = useState("")
  const [mileage, setMileage] = useState("")
  const [likes, setLikes] = useState("")
  const [dislikes, setDislikes] = useState("")
  const [question, setQuestion] = useState("")
  const [more, setMore] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [emailError, setEmailError] = useState(false)
  const [consentError, setConsentError] = useState(false)

  useEffect(() => {
    setPageMeta({
      title: "Анкета Car2Me — расскажите, как вы ездите",
      description:
        "Короткая анкета о поездках и бюджете. После отправки — ссылка на оплату на email и персональный отчёт по моделям за 24 часа.",
      pathname: "/anketa",
      robots: "index, follow",
    })
    reachGoal(METRIKA_GOALS.anketaStart)
  }, [])

  const storyId = useId()
  const heightId = useId()
  const budgetId = useId()
  const cityId = useId()
  const mileageId = useId()
  const likesId = useId()
  const dislikesId = useId()
  const questionId = useId()
  const moreId = useId()
  const nameId = useId()
  const emailId = useId()
  const consentId = useId()

  const critCount = Object.values(importance).filter((v) => v === 3).length

  function toggleScenario(id: string) {
    setScenarios((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
    setTop((prev) => prev.filter((x) => x !== id))
  }

  function toggleTop(id: string) {
    setTop((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 3) return prev
      return [...prev, id]
    })
  }

  function pickSingle(groupId: string, optionId: string) {
    setSingle((prev) => ({ ...prev, [groupId]: optionId }))
  }

  function pickMulti(group: Group, optionId: string) {
    setMulti((prev) => {
      const picked = prev[group.id] ?? []
      let next: string[]
      if (group.exclusive && optionId === group.exclusive) {
        next = picked.includes(optionId) ? [] : [optionId]
      } else {
        next = picked.includes(optionId)
          ? picked.filter((x) => x !== optionId)
          : [...picked.filter((x) => !(group.exclusive && x === group.exclusive)), optionId]
      }
      return { ...prev, [group.id]: next }
    })
  }

  function pickImportance(id: string, level: number) {
    if (level === 3 && importance[id] !== 3 && critCount >= 3) return
    setImportance((prev) => ({ ...prev, [id]: level }))
  }

  const emailValid = /\S+@\S+\.\S+/.test(email.trim())

  function goNext() {
    if (step === 5) {
      const emailBad = !emailValid
      const consentBad = !consent
      setEmailError(emailBad)
      setConsentError(consentBad)
      if (emailBad || consentBad) return
    }
    setStep((prev) => Math.min(6, prev + 1))
    window.scrollTo({ top: 0 })
  }

  function goBack() {
    setStep((prev) => Math.max(1, prev - 1))
    window.scrollTo({ top: 0 })
  }

  function groupAnswer(group: Group): string {
    if (group.multi) {
      return joinLabels(group.options, multi[group.id] ?? [])
    }
    const picked = single[group.id]
    if (!picked) return ""
    return group.options.find((o) => o.id === picked)?.label ?? ""
  }

  function buildFormUrl(): string {
    const parts: string[] = []

    const push = (key: string, value: string) => {
      const trimmed = value.trim()
      if (trimmed) parts.push(`${key}=${trimmed}`)
    }

    push("trips", joinLabels(scenarioDefs, scenarios))
    push("must", joinLabels(scenarioDefs, top))

    const details: string[] = []
    const freq = step1Groups[0]
    const hap = step1Groups[1]
    const freqLabel = groupAnswer(freq)
    const hapLabels = joinLabels(hap.options, multi[hap.id] ?? [])
    if (freqLabel) details.push(`Частота сложного: ${freqLabel}`)
    if (hapLabels) details.push(`Бывает: ${hapLabels}`)
    if (height) details.push(`Рост: ${height} см`)
    if (story) details.push(`Идеальная поездка: ${story}`)
    push("scen_detail", details.join("; "))

    const priorities = importanceDefs
      .filter((d) => importance[d.id] !== undefined)
      .map((d) => `${d.label}: ${importanceLevels[importance[d.id]]}`)
    push("priorities", priorities.join("; "))

    const budgetCity: string[] = []
    if (budget) budgetCity.push(`Бюджет под ключ: ${budget} ₽`)
    if (city) budgetCity.push(`Город: ${city}`)
    push("budget_city", budgetCity.join("; "))

    push(
      "frames",
      rulesGroups
        .map((group) => {
          const answer = groupAnswer(group)
          return answer ? `${group.legend}: ${answer}` : ""
        })
        .filter(Boolean)
        .join("; ")
    )

    const limits: string[] = []
    visibleLimitGroups.forEach((group) => {
      const answer = groupAnswer(group)
      if (answer) limits.push(`${group.legend}: ${answer}`)
    })
    if (mileage) limits.push(`Пробег до: ${mileage} км`)
    if (likes) limits.push(`Марки нравятся: ${likes}`)
    if (dislikes) limits.push(`Не рассматриваю: ${dislikes}`)
    push("limits", limits.join("; "))

    const texts: string[] = []
    if (question) texts.push(`Вопрос к отчёту: ${question}`)
    if (more) texts.push(`Ещё важно: ${more}`)
    push("texts", texts.join("; "))
    push("name", name)
    push("email", email)

    return `${FORM_URL}?${parts.join("&")}`
  }

  const stepLabel = step <= 5 ? `Шаг ${step} из 5` : "Проверка"
  const progressValue = step <= 5 ? step * 20 : 100

  const fuelPick = multi["fuel"] ?? []
  const chargeVisible = fuelPick.includes("ev")
  const octaneVisible =
    fuelPick.includes("petrol") || fuelPick.includes("hybrid")
  const heightVisible = (multi["hap"] ?? []).includes("sleep")

  // Скрытые вопросы не попадают и в отправку — их ответы неактуальны
  const visibleLimitGroups = limitGroups.filter(
    (group) =>
      (group.id !== "charge" || chargeVisible) &&
      (group.id !== "octane" || octaneVisible)
  )

  const tripsText =
    joinLabels(scenarioDefs, scenarios) || "Не указаны — подскажем в отчёте"
  const mustText = joinLabels(scenarioDefs, top) || "Не выбрано"
  const budgetText =
    budget
      ? `${budget} ₽${city ? `, ${city}` : ""}`
      : "Не указан — подскажем в отчёте"
  const marketsText = joinLabels(marketOptions, multi["markets"] ?? [])

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="mx-auto flex h-16 w-full max-w-3xl items-center justify-between gap-4 px-4 md:gap-6">
          <a
            aria-label="Car2Me — на главную"
            className="rounded-sm focus-visible:ring-3 focus-visible:ring-ring"
            href={appPath("/")}
          >
            <BrandLogoMark className="h-12" />
          </a>
          <span className="text-sm text-muted-foreground">{stepLabel}</span>
        </div>
        <div className="mx-auto w-full max-w-3xl px-4 pb-3">
          <Progress
            aria-label={stepLabel}
            value={progressValue}
          />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-4 py-12">
        {step === 1 ? (
          <>
            <StepHeader
              lead="Отметьте всё, что у вас бывает или точно будет. Технические детали знать не нужно."
              title="Как вы ездите?"
            />
            <ChipGroup
              group={{
                id: "scenarios",
                legend: "Какие поездки для вас важны?",
                hint: "Можно несколько",
                multi: true,
                options: scenarioDefs,
              }}
              picked={scenarios}
              onPick={toggleScenario}
            />
            {scenarios.length > 0 ? (
              <div className="flex flex-col gap-3 rounded-lg bg-muted p-6">
                <span className="text-sm text-muted-foreground">
                  Без чего машина точно не подойдёт? Выбрано {top.length} из 3
                </span>
                <div className="flex flex-wrap gap-2">
                  {scenarioDefs
                    .filter((d) => scenarios.includes(d.id))
                    .map((d) => (
                      <Chip
                        blocked={!top.includes(d.id) && top.length >= 3}
                        key={d.id}
                        label={d.label}
                        on={top.includes(d.id)}
                        onPick={() => toggleTop(d.id)}
                      />
                    ))}
                </div>
              </div>
            ) : null}
            {step1Groups.map((group) => (
              <ChipGroup
                group={group}
                key={group.id}
                picked={group.multi ? (multi[group.id] ?? []) : single[group.id] ? [single[group.id]] : []}
                onPick={(optionId) =>
                  group.multi ? pickMulti(group, optionId) : pickSingle(group.id, optionId)
                }
              />
            ))}
            {heightVisible ? (
              <div className="flex flex-col gap-1.5">
                <FieldLabel
                  hint="Подберём длину спального места"
                  htmlFor={heightId}
                >
                  Ваш рост, см
                </FieldLabel>
                <Input
                  className="w-32"
                  id={heightId}
                  inputMode="numeric"
                  onChange={(event) =>
                    setHeight(formatDigits(event.target.value, 3))
                  }
                  type="text"
                  value={height}
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={storyId}>
                Опишите идеальную поездку своими словами
              </FieldLabel>
              <Textarea
                id={storyId}
                maxLength={1000}
                onChange={(event) => setStory(event.target.value)}
                placeholder="Например: из Питера в Карелию с дочкой и чемоданами, иногда сворачиваю на лесную дорогу"
                rows={4}
                value={story}
              />
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <StepHeader
              lead="Честно расставьте приоритеты — так мы поймём, чем можно пожертвовать."
              title="Что для вас важнее?"
            />
            <Badge variant="secondary">Критично: {critCount} из 3</Badge>
            <div className="flex flex-col gap-5">
              {importanceDefs.map((d) => (
                <fieldset className="flex flex-col gap-2" key={d.id}>
                  <legend className="text-[15px] font-medium">{d.label}</legend>
                  <div className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
                    {importanceLevels.map((level, levelIndex) => {
                      const on = importance[d.id] === levelIndex
                      const blocked =
                        levelIndex === 3 && !on && critCount >= 3
                      return (
                        <Button
                          aria-pressed={on}
                          className={cn(
                            "h-11 text-[13px] leading-tight",
                            on
                              ? "bg-background text-foreground shadow-xs hover:bg-background"
                              : "bg-transparent text-muted-foreground hover:bg-background/60"
                          )}
                          disabled={blocked}
                          key={level}
                          onClick={() => pickImportance(d.id, levelIndex)}
                          type="button"
                          variant="ghost"
                        >
                          {level}
                        </Button>
                      )
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <StepHeader
              lead="Короткие вопросы, которые часто меняют выбор."
              title="Рамки покупки"
            />
            <div className="flex flex-col gap-1.5">
              <FieldLabel
                hint="Любой бюджет. Считаем всё: лот, доставку, пошлину, утильсбор и услуги брокера"
                htmlFor={budgetId}
              >
                Бюджет «под ключ», ₽
              </FieldLabel>
              <Input
                id={budgetId}
                inputMode="numeric"
                onChange={(event) => setBudget(formatDigits(event.target.value))}
                placeholder="Например: 1 500 000"
                type="text"
                value={budget}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={cityId}>
                Город, где машина будет жить
              </FieldLabel>
              <Input
                autoComplete="address-level2"
                id={cityId}
                onChange={(event) => setCity(event.target.value)}
                type="text"
                value={city}
              />
            </div>
            {rulesGroups.map((group) => (
              <ChipGroup
                group={group}
                key={group.id}
                picked={group.multi ? (multi[group.id] ?? []) : single[group.id] ? [single[group.id]] : []}
                onPick={(optionId) =>
                  group.multi ? pickMulti(group, optionId) : pickSingle(group.id, optionId)
                }
              />
            ))}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <StepHeader
              lead="По желанию: заполните, только если вам принципиально. Этот шаг можно пропустить."
              title="Ограничения"
            />
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={mileageId}>Пробег до, км</FieldLabel>
              <Input
                id={mileageId}
                inputMode="numeric"
                onChange={(event) =>
                  setMileage(formatDigits(event.target.value, 7))
                }
                type="text"
                value={mileage}
              />
            </div>
            {visibleLimitGroups.map((group) => (
              <ChipGroup
                group={group}
                key={group.id}
                picked={group.multi ? (multi[group.id] ?? []) : single[group.id] ? [single[group.id]] : []}
                onPick={(optionId) =>
                  group.multi ? pickMulti(group, optionId) : pickSingle(group.id, optionId)
                }
              />
            ))}
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={likesId}>Марки, которые нравятся</FieldLabel>
              <Input
                id={likesId}
                onChange={(event) => setLikes(event.target.value)}
                type="text"
                value={likes}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={dislikesId}>
                Марки, которые точно не рассматриваете
              </FieldLabel>
              <Input
                id={dislikesId}
                onChange={(event) => setDislikes(event.target.value)}
                type="text"
                value={dislikes}
              />
            </div>
          </>
        ) : null}

        {step === 5 ? (
          <>
            <StepHeader
              lead="Анкета ни к чему не обязывает. Оплата — на следующем шаге."
              title="Вопросы и контакты"
            />
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={questionId}>
                Вопрос, на который хотите прямой ответ в отчёте
              </FieldLabel>
              <Textarea
                id={questionId}
                maxLength={1000}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Например: японец или кореец? Хватит ли мощности на трассе?"
                rows={3}
                value={question}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={moreId}>
                Что ещё важно — своими словами
              </FieldLabel>
              <Textarea
                id={moreId}
                maxLength={1000}
                onChange={(event) => setMore(event.target.value)}
                placeholder="Например: что пошло не так с прошлой машиной или чего точно не хотите"
                rows={3}
                value={more}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={nameId}>Как к вам обращаться</FieldLabel>
              <Input
                autoComplete="given-name"
                id={nameId}
                onChange={(event) => setName(event.target.value)}
                type="text"
                value={name}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel htmlFor={emailId}>Email для отчёта и чека</FieldLabel>
              <Input
                aria-invalid={emailError}
                autoComplete="email"
                id={emailId}
                inputMode="email"
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (emailError && /\S+@\S+\.\S+/.test(event.target.value)) {
                    setEmailError(false)
                  }
                }}
                type="email"
                value={email}
              />
              {emailError ? (
                <p className="text-sm text-destructive">
                  Проверьте email — похоже, в нём опечатка. Без него мы не
                  пришлём отчёт.
                </p>
              ) : null}
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                checked={consent}
                id={consentId}
                onCheckedChange={(checked) => {
                  setConsent(checked === true)
                  if (checked) setConsentError(false)
                }}
              />
              <label className="text-sm leading-relaxed" htmlFor={consentId}>
                Даю{" "}
                <a
                  className="underline underline-offset-4"
                  href={consentUrl}
                  rel="noopener"
                  target="_blank"
                >
                  согласие на обработку персональных данных
                </a>{" "}
                и принимаю{" "}
                <a
                  className="underline underline-offset-4"
                  href={offerUrl}
                  rel="noopener"
                  target="_blank"
                >
                  оферту
                </a>
              </label>
            </div>
            {consentError ? (
              <p className="text-sm text-destructive">
                Без согласия мы не сможем принять анкету — поставьте галочку.
              </p>
            ) : null}
          </>
        ) : null}

        {step === 6 ? (
          <>
            <StepHeader
              lead="Проверьте главное. Если что-то не так — вернитесь назад, ответы не потеряются."
              title="Анкета готова к отправке"
            />
            <dl className="flex flex-col text-base">
              {(
                [
                  ["Поездки", tripsText],
                  ["Без чего машина не подойдёт", mustText],
                  ["Бюджет «под ключ»", budgetText],
                  ["Откуда готовы брать", marketsText],
                ] as const
              ).map(([term, value]) => (
                <div
                  className="flex flex-col gap-1 border-t border-border py-5 last:border-b"
                  key={term}
                >
                  <dt className="text-sm text-muted-foreground">{term}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="text-base leading-relaxed">
              Нажмите «Отправить анкету» — откроется страница Яндекс Форм, там
              нажмите «Отправить». В течение рабочего дня (10:00–22:00 МСК) на
              email из формы пришлём ссылку на оплату 2 000 ₽ — СБП или карта.
            </p>
            {!FORM_URL ? (
              <p className="text-sm text-muted-foreground">
                Отправка заработает, когда подключим вашу форму в Яндекс
                Формах.
              </p>
            ) : null}
          </>
        ) : null}
      </main>

      <footer className="sticky bottom-0 border-t border-border bg-background">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-4">
          {step >= 2 ? (
            <Button className="h-11" onClick={goBack} type="button" variant="outline">
              Назад
            </Button>
          ) : null}
          {step <= 5 ? (
            <Button className="h-11 flex-1" onClick={goNext} type="button">
              Дальше
            </Button>
          ) : FORM_URL ? (
            <Button
              className="h-11 flex-1"
              nativeButton={false}
              render={
                <a
                  href={buildFormUrl()}
                  onClick={() => reachGoal(METRIKA_GOALS.anketaSent)}
                />
              }
            >
              Отправить анкету
            </Button>
          ) : (
            <Button className="h-11 flex-1" disabled>
              Отправить анкету
            </Button>
          )}
        </div>
      </footer>
    </div>
  )
}

export default Anketa
