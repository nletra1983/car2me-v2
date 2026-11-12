# Сборка PDF «Пример отчёта» из прототипа Даши в стиле новой версии Car2Me.
# Контент не меняется: меняются только лого, шрифт и фирменные цвета.

$ErrorActionPreference = 'Stop'

$proto = 'D:\Car2me\Первая проба в сентябре\первое ревью от Даши\car2me-prototype.html'
$outHtml = 'D:\Car2me\_temp_report_pdf.html'

# --- 1. Наш фирменный цвет risk-bad (oklch 0.66 0.24 45) -> HEX ---
function OkToHex([double]$L, [double]$C, [double]$H) {
  $rad = [Math]::PI / 180
  $a = $C * [Math]::Cos($H * $rad); $b = $C * [Math]::Sin($H * $rad)
  $l_ = $L + 0.3963377774 * $a + 0.2158037573 * $b
  $m_ = $L - 0.1055613458 * $a - 0.0638541728 * $b
  $s_ = $L - 0.0894841775 * $a - 1.291485548 * $b
  $l = [Math]::Pow($l_, 3); $m = [Math]::Pow($m_, 3); $s = [Math]::Pow($s_, 3)
  $R = 4.0767416621 * $l - 3.3077115913 * $m + 0.2309699292 * $s
  $G = -1.2684380046 * $l + 2.6097574011 * $m - 0.3413193965 * $s
  $B = -0.0041960863 * $l - 0.7034186147 * $m + 1.707614701 * $s
  $parts = @()
  foreach ($v in @($R, $G, $B)) {
    if ($v -lt 0) { $v = 0 }; if ($v -gt 1) { $v = 1 }
    if ($v -le 0.0031308) { $enc = 12.92 * $v } else { $enc = 1.055 * [Math]::Pow($v, 1 / 2.4) - 0.055 }
    $parts += ('{0:X2}' -f [int][Math]::Round($enc * 255))
  }
  return '#' + ($parts -join '')
}
$riskBad = OkToHex 0.66 0.24 45
Write-Host "risk-bad HEX: $riskBad"

# --- 2. Читаем прототип, берём только секцию отчёта (main.rp-list) ---
$lines = [System.IO.File]::ReadAllLines($proto)
# строки 142..1054 (индексы 141..1053): main.rp-list c 11 страницами
$sec = $lines[141..1053] -join "`n"

# --- 3. Карта картинок BLOBS из прототипа ---
$all = [System.IO.File]::ReadAllText($proto)
$m = [regex]::Match($all, 'var BLOBS = \{(.{10,}?)\};\s*\n', [System.Text.RegularExpressions.RegexOptions]::Singleline)
if (-not $m.Success) { throw 'BLOBS not found' }
$blobs = @{}
foreach ($e in [regex]::Matches($m.Groups[1].Value, '"/_blob/([a-f0-9]+)":\s*"(data:image/[a-z]+;base64,[^"]+)"')) {
  $blobs[$e.Groups[1].Value] = $e.Groups[2].Value
}

# --- 4. Наш логотип вместо лого прототипа ---
$logoB64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes('D:\Car2me\картинки\Car2me-1.png'))
$logoUri = "data:image/png;base64,$logoB64"

# Лого: 1 обложка (height 30px -> 36px) + 10 шапок страниц (height 20px -> 26px).
# Фото машин (jpeg) остаются как в прототипе.
$sec = $sec.Replace('data-blob="/_blob/cece604417921ce35781a2f0a78c8a9f"', "src=""$logoUri""")
$sec = [regex]::Replace($sec, '(<img src="data:image/png;base64,[^"]+"[^>]*?height: )30px', '${1}36px')
$sec = [regex]::Replace($sec, '(<img src="data:image/png;base64,[^"]+"[^>]*?height: )20px', '${1}26px')

# Фото из прототипа: подставляем данные напрямую
foreach ($key in $blobs.Keys) {
  if ($key -eq 'cece604417921ce35781a2f0a78c8a9f') { continue }
  $sec = $sec.Replace("data-blob=""/_blob/$key""", "src=""$($blobs[$key])""")
}

# --- 5. Наш шрифт: Inter вместо Roboto Flex ---
$sec = $sec.Replace("font-family: 'Roboto Flex', system-ui, sans-serif", "font-family: 'Inter Variable', system-ui, sans-serif")

# --- 6. Наши фирменные цвета (из index.css новой версии) ---
# оранжевый акцент: #FF5F1F -> oklch(0.68 0.23 48)  (фон brand-mark)
# светлый оранжевый фон: #FFF1EA -> oklch(0.97 0.05 52)  (--proof)
# тёмный оранжевый текст: #B23A0B -> oklch(0.52 0.18 45)  (--risk-bad-ink)
# средний оранжевый: #FFDCCB -> oklch(0.86 0.14 42)  (report-wash)
# самый тёмный оранжевый текст: #9A2F07 -> oklch(0.42 0.11 48)  (--proof-text)
# красная рамка заметки: #C23A22 -> oklch(0.66 0.24 45)  (--risk-bad)
# зелёная плашка «В порядке»: как в лендинге bg-risk-ok/20 + text-risk-ok-ink
$sec = $sec.Replace('#FF5F1F', '#FF5900')
$sec = $sec.Replace('#FFF1EA', '#FFEDD7')
$sec = $sec.Replace('#B23A0B', '#B73700')
$sec = $sec.Replace('#FFDCCB', '#FFB186')
$sec = $sec.Replace('#9A2F07', '#7B3606')
$sec = $sec.Replace('#C23A22', $riskBad)
$sec = $sec.Replace('#1F6B3B', '#009B28')
$sec = $sec.Replace('#ECF6EF', '#D9F4DC')

# --- 6.1 Удаляем заметки для редактора (по просьбе Натальи от 12.11.2026) ---
$notePattern = '<div style="border: 1\.5px dashed[^"]*"[^>]*>\s*<h3[^>]*>Заметка для редактора[\s\S]*?</div>'
$noteCount = [regex]::Matches($sec, $notePattern).Count
$sec = [regex]::Replace($sec, $notePattern, '')
Write-Host "Удалено заметок для редактора: $noteCount"
if ($noteCount -eq 0) { throw 'Заметки для редактора не найдены — проверьте шаблон' }

# --- 6.2 Убираем пометки «рынок уточнить» (по просьбе Натальи от 12.11.2026) ---
$marketCount = 0
$before = $sec.Length
$sec = $sec.Replace('1.6, 6AT, рынок уточнить*', '1.6, 6AT'); if ($sec.Length -lt $before) { $marketCount++ ; $before = $sec.Length }
$sec = $sec.Replace('1.6 атмосферный, классический 6AT, рынок — [уточнить]', '1.6 атмосферный, классический 6AT'); if ($sec.Length -lt $before) { $marketCount++ ; $before = $sec.Length }
$footnotePattern = '<span>\*\s*В Южной Корее Creta[^<]*</span>'
$footnotes = [regex]::Matches($sec, $footnotePattern).Count
$sec = [regex]::Replace($sec, $footnotePattern, '')
if ($footnotes -gt 0) { $marketCount++ }
Write-Host "Убрано пометок «рынок уточнить»: $marketCount (из них сносок: $footnotes)"
if ($marketCount -lt 3) { throw 'Найдены не все пометки «рынок уточнить» — проверьте текст' }
if ($sec.IndexOf('уточнить') -ge 0) { throw 'В тексте ещё осталось «уточнить»' }

# --- 7. Шрифты Inter (subsets) как base64 ---
$fm = 'D:\Car2me\node_modules\@fontsource-variable\inter\files'
function FontFace([string]$name, [string]$file, [string]$range) {
  $b64 = [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("$fm\$file"))
  return "@font-face{font-family:'Inter Variable';font-style:normal;font-display:swap;font-weight:100 900;src:url(data:font/woff2;base64,$b64) format('woff2-variations');unicode-range:$range}"
}
$fonts = @(
  (FontFace 'cyr-ext' 'inter-cyrillic-ext-wght-normal.woff2' 'U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F'),
  (FontFace 'cyr' 'inter-cyrillic-wght-normal.woff2' 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'),
  (FontFace 'lat-ext' 'inter-latin-ext-wght-normal.woff2' 'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'),
  (FontFace 'lat' 'inter-latin-wght-normal.woff2' 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD')
) -join "`n"

# --- 8. Печатная вёрстка: каждая страница = лист PDF ---
$css = @"
$fonts
@page { size: 794px 1123px; margin: 0 }
@page land { size: 1123px 794px; margin: 0 }
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#FFFFFF}
body{font-family:'Inter Variable',system-ui,sans-serif;color:#16181B}
.rp-list{display:block;padding:0}
.rp-frame{position:relative;overflow:hidden;width:794px;height:1123px;background:#FFFFFF;break-after:page}
.rp-frame[data-w="1123"]{width:1123px;height:794px;page:land}
.rp-frame:last-of-type{break-after:auto}
.rp-page{position:absolute;left:0;top:0}
"@

$html = "<!doctype html>`n<html lang=`"ru`">`n<head>`n<meta charset=`"utf-8`">`n<title>Car2Me — пример отчёта</title>`n<style>`n$css`n</style>`n</head>`n<body>`n$sec`n</body>`n</html>"

[System.IO.File]::WriteAllText($outHtml, $html, [System.Text.Encoding]::UTF8)
$size = (Get-Item $outHtml).Length
Write-Host "HTML собран: $outHtml ($([math]::Round($size/1MB,2)) МБ)"
Write-Host "Проверка замен:"
Write-Host ("  лого (наш PNG): " + ([regex]::Matches($html, [regex]::Escape($logoB64.Substring(0,60))).Count) + " вхожд.")
Write-Host ("  фото прототипа (jpeg): " + ([regex]::Matches($html, 'src="data:image/jpeg;base64').Count) + " вхожд.")
Write-Host ("  Roboto Flex осталось: " + ([regex]::Matches($html, 'Roboto Flex').Count))
Write-Host ("  старый акцент FF5F1F остался: " + ([regex]::Matches($html, 'FF5F1F').Count))
Write-Host ("  старый лого-ссылок data-blob осталось: " + ([regex]::Matches($html, 'data-blob').Count))

# --- 9. Пересобираем PDF и обновляем обе копии: корень и public (для кнопки скачивания) ---
$edge = 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
& $edge --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf="d:\Car2me\_temp_report.pdf" "file:///d:/Car2me/_temp_report_pdf.html" 2>&1 | Out-Null
Start-Sleep -Seconds 3
Copy-Item 'd:\Car2me\_temp_report.pdf' 'd:\Car2me\Пример отчёта Car2Me.pdf' -Force
Copy-Item 'd:\Car2me\_temp_report.pdf' 'd:\Car2me\public\пример-отчёта.pdf' -Force
Write-Host "PDF обновлён: d:\Car2me\Пример отчёта Car2Me.pdf и d:\Car2me\public\пример-отчёта.pdf"
