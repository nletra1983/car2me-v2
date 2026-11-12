import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BrandLogoMark } from "@/components/landing/brand-logo"
import {
  ExampleButton,
  StartButton,
} from "@/components/landing/cta-buttons"
import {
  RiskMark,
  ScoreMark,
  TotalMark,
  weightDotClass,
} from "@/components/landing/report-marks"
import { ReportSheet } from "@/components/landing/report-sheet"
import { SiteHeader } from "@/components/landing/site-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CircleCheck } from "lucide-react"

import { CompareCell } from "./compare-mark"

import {
  compareColumns,
  compareIntro,
  compareRows,
  example,
  faq,
  finalAdvice,
  finalists,
  founder,
  hero,
  mail,
  method,
  modelCompare,
  modelRisks,
  priceIncludes,
  reportCaption,
  sources,
  steps,
  stories,
} from "./content"
import { publicUrl } from "@/lib/public-url"
import { siteImages } from "@/lib/site-images"
import { legalDocPaths, legalEntity } from "./legal-entity"

type FinalistName = (typeof finalists)[number]["name"]

function finalistPhotoUrl(name: FinalistName): string {
  return siteImages.finalists[name]
}

const publicMethod = method.map((step) => {
  const dot = step.indexOf(". ")
  return [step.slice(0, dot), step.slice(dot + 2)] as const
})

const bestScore = Math.max(...modelCompare.rows.map((row) => row.score))

export function Landing() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <SiteHeader logo={<BrandLogoMark className="h-[4.5rem]" />} />

      <main>
        <section
          className="mx-auto grid w-full max-w-6xl scroll-mt-28 items-center gap-10 px-4 py-12 lg:grid-cols-2"
          id="top"
        >
          <div className="flex flex-col gap-6">
            <h1 className="max-w-xl text-[2.5rem] leading-tight font-semibold tracking-tight sm:text-[3.25rem]">
              {hero.title}
            </h1>
            <p className="max-w-xl text-base leading-snug font-medium">
              {hero.offer}
            </p>
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground">
              {hero.lead}
            </p>
            <p className="max-w-xl text-sm text-muted-foreground">{hero.legal}</p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <StartButton className="h-11" />
              <ExampleButton surface="default">
                Посмотреть пример отчёта
              </ExampleButton>
            </div>
          </div>

          <img
            alt="Пример отчёта: обложка со списком моделей и страницы с разбором модели и рисков"
            className="mx-auto w-full max-w-[36rem]"
            src={siteImages.reportFan}
          />
        </section>

        <section className="relative overflow-x-clip text-proof-text">
          <div aria-hidden="true" className="report-wash" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-16 pb-24">
            <div className="grid items-start gap-10 lg:grid-cols-2">
              <div className="flex flex-col gap-5">
                <h2 className="text-[2.125rem] leading-tight font-semibold text-proof-heading">
                  Вы рассказываете, как живёте
                  <br />
                  Мы переводим это в требования к машине
                </h2>
                <div className="flex items-center gap-3">
                  <div
                    aria-hidden="true"
                    className="h-44 w-[7.9rem] shrink-0 self-center bg-[oklch(0.4_0.06_42/0.22)]"
                    style={{
                      maskImage: `url("${siteImages.woman}")`,
                      WebkitMaskImage: `url("${siteImages.woman}")`,
                      maskRepeat: "no-repeat",
                      maskPosition: "center bottom",
                      maskSize: "100% 100%",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="size-6 shrink-0 rounded-full bg-background"
                  />
                  <blockquote className="min-w-0 flex-1 rounded-3xl bg-background px-4 py-3 text-base leading-relaxed text-foreground">
                    «{example.quote}»
                  </blockquote>
                </div>
              </div>
              <Table className="text-base lg:mt-[1.125rem]">
                <TableHeader>
                  <TableRow className="border-proof-heading hover:bg-transparent">
                    <TableHead className="h-auto w-[42%] px-0 pb-3 text-sm font-medium whitespace-normal text-foreground">
                      Вы спрашиваете
                    </TableHead>
                    <TableHead className="h-auto w-5 px-0 pb-3">
                      <span className="sr-only">Перевод в требование</span>
                    </TableHead>
                    <TableHead className="h-auto px-0 pb-3 text-sm font-medium whitespace-normal text-foreground">
                      Мы понимаем
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {example.rows.map(([said, means]) => (
                    <TableRow className="hover:bg-transparent" key={said}>
                      <TableCell className="px-0 py-3 align-top whitespace-normal text-foreground">
                        «{said}»
                      </TableCell>
                      <TableCell className="w-5 px-0.5 py-3 text-center align-middle text-proof-heading">
                        <svg
                          aria-hidden="true"
                          className="mx-auto h-2 w-3.5"
                          viewBox="0 0 24 12"
                        >
                          <path
                            d="M0 6h21M17 1.5L21.5 6 17 10.5"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.4"
                          />
                        </svg>
                      </TableCell>
                      <TableCell className="px-0 py-3 align-top font-normal whitespace-normal text-foreground">
                        {means}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-base leading-relaxed">
              Знать, что такое клиренс или вариатор, не нужно. Анкета спрашивает
              о ваших поездках, а отчёт объясняет, какие характеристики из них
              следуют и какие модели им соответствуют.
            </p>
          </div>
        </section>

        <section>
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16">
            <h2 className="text-[2.125rem] leading-tight font-semibold">
              Почему Car2Me, а не фильтры на сайтах, и не совет брокера?
            </h2>
            <p className="text-base leading-relaxed">{compareIntro}</p>
            <Table className="min-w-[40rem] table-fixed text-base md:min-w-0">
              <caption className="sr-only">
                Сравнение фильтров на сайтах, брокера, ChatGPT и Car2Me
              </caption>
              <TableHeader>
                <TableRow>
                  {compareColumns.map((column) => (
                    <TableHead
                      className="h-auto px-3 py-3 align-bottom leading-snug whitespace-normal"
                      key={column}
                    >
                      {column}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {compareRows.map((row) => (
                  <TableRow key={row[0]}>
                    {row.map((cell, index) =>
                      index === 0 ? (
                        <TableHead
                          className="h-auto px-3 py-3 align-top leading-relaxed font-normal whitespace-normal"
                          key={`${row[0]}-${index}`}
                          scope="row"
                        >
                          {cell}
                        </TableHead>
                      ) : (
                        <TableCell
                          className="h-auto px-3 py-3 align-top leading-relaxed whitespace-normal"
                          key={`${row[0]}-${index}`}
                        >
                          <CompareCell
                            text={cell}
                            tone={index === 4 ? "car" : undefined}
                          />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section
          className="relative scroll-mt-28 overflow-x-clip text-proof-text"
          id="report"
        >
          <div aria-hidden="true" className="report-wash" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-20 pb-28">
            <div className="flex flex-col gap-3">
              <h2 className="text-[2.125rem] font-semibold text-proof-heading">
                Так выглядит отчёт
              </h2>
              <p className="text-base leading-relaxed">
                Фрагмент примера: бюджет {example.budget}, {example.city},
                расчёт на {example.date}.
              </p>
            </div>
            <Tabs defaultValue="requirements">
              <div className="flex flex-wrap items-center gap-3">
                <TabsList className="h-auto flex-wrap bg-background group-data-horizontal/tabs:h-auto">
                  <TabsTrigger value="requirements">Требования</TabsTrigger>
                  <TabsTrigger value="compare">Сравнение моделей</TabsTrigger>
                  <TabsTrigger value="risks">Риски</TabsTrigger>
                  <TabsTrigger value="final">Три финалиста</TabsTrigger>
                </TabsList>
                <div className="ml-auto">
                  <ExampleButton
                    href={publicUrl("sample-report.pdf")}
                    surface="proof"
                    target="_blank"
                  >
                    Открыть пример целиком, PDF
                  </ExampleButton>
                </div>
              </div>
              <TabsContent className="flex flex-col gap-4" value="requirements">
                <ReportSheet page="Страница 2 из 11">
                  <div className="grid gap-8 lg:grid-cols-2">
                    <figure className="flex flex-col gap-3">
                      <figcaption className="text-sm text-muted-foreground">
                        Из анкеты
                      </figcaption>
                      <blockquote className="text-base leading-relaxed">
                        «{example.quote}»
                      </blockquote>
                    </figure>
                    <div className="flex flex-col gap-4">
                      {example.weights.map(([name, text]) => (
                        <div
                          className="flex flex-col gap-1 border-t border-border pt-4 first:border-0 first:pt-0"
                          key={name}
                        >
                          <h3 className="flex items-center gap-2 text-sm font-medium">
                            <span
                              aria-hidden="true"
                              className={`size-2 rounded-full ${weightDotClass(name)}`}
                            />
                            {name}
                          </h3>
                          <p className="text-sm leading-relaxed">{text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </ReportSheet>
                <p className="text-base leading-relaxed">
                  {reportCaption.requirements}
                </p>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4" value="compare">
                <ReportSheet page="Страница 3 из 11">
                  <Table className="min-w-[64rem] table-fixed">
                    <colgroup>
                      <col className="w-[18%]" />
                      <col className="w-[7%]" />
                      <col className="w-[11%]" />
                      {modelCompare.columns.map((column) => (
                        <col className="w-[8%]" key={column} />
                      ))}
                    </colgroup>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Модель</TableHead>
                        <TableHead className="px-1 text-center">Балл</TableHead>
                        <TableHead className="h-auto align-bottom whitespace-normal">
                          Под ключ, млн ₽
                        </TableHead>
                        {modelCompare.columns.map((column) => (
                          <TableHead
                            className="h-auto px-1 text-center align-bottom leading-tight whitespace-normal"
                            key={column}
                          >
                            {column === "Проходимость"
                              ? "Проходи\u00ADмость"
                              : column}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr:last-child]:border-b!">
                      {modelCompare.rows.map((row) => (
                        <TableRow key={row.name}>
                          <TableCell className="whitespace-normal">
                            <span className="block font-medium">
                              {row.name}
                            </span>
                            <span className="block text-muted-foreground">
                              {row.spec}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <TotalMark
                              best={row.score === bestScore}
                              value={row.score}
                            />
                          </TableCell>
                          <TableCell className="tabular-nums">
                            {row.price}
                          </TableCell>
                          {row.marks.map((mark, index) => (
                            <TableCell
                              className="px-1 text-center"
                              key={modelCompare.columns[index]}
                            >
                              <ScoreMark value={mark} />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-3.5 rounded-sm bg-foreground"
                      />
                      5 — отлично
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-3.5 rounded-sm bg-chart-1"
                      />
                      3 — компромисс
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="size-3.5 rounded-sm bg-proof ring-1 ring-proof-heading ring-inset"
                      />
                      1–2 — слабое место для ваших задач
                    </span>
                  </div>
                </ReportSheet>
                <p className="text-base leading-relaxed">
                  {reportCaption.compare}
                </p>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4" value="risks">
                <ReportSheet page="Страница 4 из 11">
                  <div className="grid gap-8 md:grid-cols-3">
                    {modelRisks.map((column) => (
                      <div className="flex flex-col gap-4" key={column.model}>
                        <h3 className="border-b border-foreground pb-3 text-lg font-medium">
                          {column.model}
                        </h3>
                        <ul className="flex flex-col gap-4">
                          {column.items.map(([level, text]) => (
                            <li
                              className="flex flex-col items-start gap-1.5"
                              key={text}
                            >
                              <RiskMark level={level} />
                              <span className="text-sm leading-relaxed">
                                {text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </ReportSheet>
                <p className="text-base leading-relaxed">
                  {reportCaption.risks}
                </p>
              </TabsContent>
              <TabsContent className="flex flex-col gap-4" value="final">
                <ReportSheet page="Страница 5 из 11">
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-8 md:grid-cols-3">
                      {finalists.map((item) => (
                        <div
                          className="flex flex-col gap-2 border-t border-foreground pt-4"
                          key={item.name}
                        >
                          <figure className="flex flex-col gap-1.5">
                            <img
                              alt={item.photoAlt}
                              className="aspect-[4/3] w-full rounded-md bg-muted object-cover"
                              src={finalistPhotoUrl(item.name)}
                            />
                            <figcaption className="text-xs leading-snug text-muted-foreground">
                              Фото: {item.photoAuthor},{" "}
                              <a
                                className="underline underline-offset-2"
                                href={item.photoPage}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                Wikimedia Commons
                              </a>
                              ,{" "}
                              <a
                                className="underline underline-offset-2"
                                href={item.photoLicensePage}
                                rel="noopener noreferrer"
                                target="_blank"
                              >
                                {item.photoLicense}
                              </a>
                              , кадрировано
                            </figcaption>
                          </figure>
                          <p className="text-sm text-muted-foreground">
                            {item.when}
                          </p>
                          <h3 className="text-xl font-medium">{item.name}</h3>
                          <p className="text-base font-medium">{item.price}</p>
                          <p className="text-sm leading-relaxed">{item.text}</p>
                          <a
                            className="mt-1 w-fit text-sm underline underline-offset-4"
                            href={item.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {item.source}
                          </a>
                        </div>
                      ))}
                    </div>
                    <p className="rounded-lg bg-muted p-4 text-sm leading-relaxed">
                      <span className="font-medium">Совет из отчёта: </span>
                      {finalAdvice}
                    </p>
                  </div>
                </ReportSheet>
                <p className="text-base leading-relaxed">
                  {reportCaption.final}
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="relative z-10 scroll-mt-28" id="how">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16">
            <h2 className="text-[2.125rem] font-semibold">Как это работает</h2>
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map(([title, text, aside], index) => (
                <li key={title}>
                  <Card className="h-full shadow-none ring-0">
                    <CardHeader>
                      <p className="text-sm text-muted-foreground">
                        Шаг {index + 1}
                      </p>
                      <h3 className="text-xl font-medium">{title}</h3>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-base leading-relaxed">{text}</p>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <p className="text-sm text-muted-foreground">{aside}</p>
                    </CardFooter>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="mx-auto grid w-full max-w-6xl scroll-mt-28 items-start gap-10 px-4 py-16 lg:grid-cols-2"
          id="sources"
        >
          <div className="flex flex-col gap-4">
            <h2 className="text-[2.125rem] leading-tight font-semibold">
              Как мы считаем и откуда цены
            </h2>
            <p className="text-base leading-relaxed">
              Вы видите веса, баллы и причину, по которой модель попала в список
              или выпала из него. В список попадают только модели, которые можно
              законно ввезти.
            </p>
            <ol className="flex flex-col">
              {publicMethod.map(([title, text], index) => (
                <li
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-border py-5 last:border-b"
                  key={title}
                >
                  <span className="font-semibold text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="flex flex-col gap-1">
                    <span className="font-semibold">{title}</span>
                    <span className="text-base leading-relaxed text-muted-foreground">
                      {text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-muted p-6 lg:mt-[1.125rem]">
            <h3 className="text-xl font-medium">
              Источники для каждого расчёта
            </h3>
            <ul className="flex flex-col">
              {sources.map((source) => (
                <li
                  className="border-t border-border py-3 text-base first:border-0 first:pt-0"
                  key={source}
                >
                  {source}
                </li>
              ))}
            </ul>
            <p className="text-base leading-relaxed text-muted-foreground">
              Цены считаем заново для каждого клиента. Дата расчёта — на обложке
              отчёта. В цену «под ключ» входят действующий утильсбор и остальные
              платежи.
            </p>
          </div>
        </section>

        <section className="relative overflow-x-clip text-proof-text">
          <div aria-hidden="true" className="report-wash" />
          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-16 pb-24">
            <div className="flex flex-col gap-4">
              <h2 className="max-w-3xl text-[2.125rem] leading-tight font-semibold text-proof-heading">
                «{founder.quote}»
              </h2>
              <p className="text-base leading-relaxed">{founder.quoteNote}</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {stories.map((story) => (
                <Card className="h-full" key={story.title}>
                  <CardHeader className="gap-3">
                    <div className="flex items-center gap-3.5">
                      <Avatar className="size-14 after:border-0">
                        <AvatarImage
                          alt={story.avatarAlt}
                          className="object-cover"
                          src={story.avatarSrc}
                        />
                        <AvatarFallback>
                          {story.who.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm text-muted-foreground">
                        {story.who}
                      </p>
                    </div>
                    <h3 className="text-xl font-medium text-proof-heading">
                      {story.title}
                    </h3>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-base leading-relaxed">{story.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section
          className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 pt-16 pb-20 lg:pt-24 lg:pb-28"
          id="price"
        >
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-18">
            <div className="flex flex-col gap-4">
              <p className="text-base font-medium text-muted-foreground">
                Отчёт Car2Me
              </p>
              <p className="text-6xl font-semibold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
                2 000 ₽
              </p>
              <p className="max-w-md text-lg leading-relaxed">
                Разовая оплата за отчёт, без процента со сделки. Это около
                0,13% бюджета в 1,5 млн ₽.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <StartButton className="h-11 min-w-0 flex-1" />
                <p className="shrink-0 text-sm text-muted-foreground">
                  Оплата после анкеты
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-6 lg:mt-[1.125rem]">
              <ul className="flex flex-col gap-3.5 text-base">
                {priceIncludes.map((item) => (
                  <li className="flex gap-3" key={item}>
                    <CircleCheck
                      aria-hidden="true"
                      className="mt-0.5 size-5 shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="scroll-mt-28 border-t border-border"
          id="faq"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-18 lg:py-20">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <h2 className="text-[2.125rem] font-semibold">Частые вопросы</h2>
              <p className="text-base text-muted-foreground">
                Не нашли ответ — напишите на{" "}
                <a
                  className="text-foreground underline underline-offset-4"
                  href={`mailto:${mail}`}
                >
                  {mail}
                </a>
                .
              </p>
            </div>
            <Accordion className="border-b border-border">
              {faq.map((item) => (
                <AccordionItem className="border-border" key={item.q} value={item.q}>
                  <AccordionTrigger className="py-5 text-lg font-medium hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 text-base">
                    <p className="max-w-prose leading-relaxed text-muted-foreground">
                      {item.a}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        <section className="scroll-mt-28" id="start">
          <div className="mx-auto w-full max-w-6xl px-4 pb-16 lg:pb-20">
            <div className="flex flex-col gap-8 rounded-3xl bg-foreground px-6 py-10 text-background sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-14 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              <div className="flex max-w-md flex-col gap-3.5">
                <h2 className="text-[2.125rem] leading-tight font-semibold sm:text-4xl">
                  Начните с анкеты
                </h2>
                <p className="text-lg leading-relaxed text-background/80">
                  Платить нужно только после неё. Отчёт — в течение 24 часов.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <StartButton className="h-11 bg-background text-foreground hover:bg-background/90" />
                <ExampleButton className="h-11" surface="dark">
                  Посмотреть пример отчёта
                </ExampleButton>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Separator />
      <footer>
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-8 sm:grid-cols-2 sm:gap-14">
          <div className="flex min-w-0 flex-col gap-3 sm:mt-[1.125rem]">
            <p className="text-base leading-relaxed">
              Информационный сервис подбора моделей авто. Не брокер и не
              дилер: не продаём машины и не получаем комиссию с лотов.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Исполнитель: {legalEntity.nameShort}, ИНН {legalEntity.inn}, КПП{" "}
              {legalEntity.kpp}
            </p>
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base">
              <span>© 2026 Car2Me</span>
              <a
                className="underline underline-offset-4"
                href={`mailto:${mail}`}
              >
                {mail}
              </a>
            </p>
            <p className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <a
                className="underline underline-offset-4"
                href={legalDocPaths.offer}
              >
                Публичная оферта
              </a>
              <a
                className="underline underline-offset-4"
                href={legalDocPaths.privacy}
              >
                Персональные данные
              </a>
              <a
                className="underline underline-offset-4"
                href={legalDocPaths.pdConsent}
              >
                Согласие на обработку ПДн
              </a>
            </p>
          </div>
          <div className="flex flex-col sm:items-end">
            <a aria-label="Car2Me — на главную" className="w-fit" href="#top">
              <BrandLogoMark className="h-24" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
