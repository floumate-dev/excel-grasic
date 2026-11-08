# Excel Grašić / Outliers - webinar funnel

Tri single-file stranice, bez build koraka. Svaka je samostalan `.html` (CSS i JS inline),
hostuje se bilo gde (Vercel, Netlify, S3, Cloudflare Pages).

| Fajl | Uloga | Progres traka |
|---|---|---|
| `optin/index.html` | Landing + prijava u popupu (ActiveCampaign) | - |
| `optin-2/index.html` | Druga verzija landinga (A/B test) | - |
| `application.html` | Bridge: VSL + anketa | 62% |
| `thankyou.html` | Potvrda + dva koraka | 100% |

Tok: `/optin/` → (AC submit) → `application.html?firstname=…&email=…&utm_*` → anketa → `thankyou.html`

Landing zivi u `optin/index.html` da bi adresa bila `/excel-grasic/optin` bez nastavka `.html`.
Koreni `index.html` je samo preusmerenje na `optin/` i prosledjuje UTM parametre.

Uzivo:
[optin](https://floumate-dev.github.io/excel-grasic/optin) ·
[optin-2](https://floumate-dev.github.io/excel-grasic/optin-2) ·
[application](https://floumate-dev.github.io/excel-grasic/application.html) ·
[thankyou](https://floumate-dev.github.io/excel-grasic/thankyou.html)

## Prvi put na projektu

```bash
git clone https://github.com/floumate-dev/excel-grasic.git
cd excel-grasic
```

Pa pokreni Claude Code u tom folderu. On sam procita `CLAUDE.md`, gde pise sta
sme da se menja, gde koji tekst stoji i sta se proverava pre pusha.

Rad bez Claude Code-a radi isto, samo rucno:

```bash
python3 tools/serve.py      # pregled na http://localhost:8731/optin/
python3 tools/provera.py    # obavezno pre pusha
```

`tools/provera.py` hvata polomljen HTML, izgubljen `id` koji JavaScript trazi,
dugi dash i pokvareno kodiranje. Isto to se pokrece i na GitHubu posle svakog
pusha, pa ako nesto promakne stize mejl sa greskom.

**Push ide pravo u produkciju.** Grana `main` je ono sto klijent vidi, stranica
se osvezi za minut-dva. Nema staginga. Ako nesto pukne: `git revert <hash>` pa push.

## Konfiguracija

Svaka stranica ima `window.MC = {…}` blok na vrhu `<head>`. Sve što se menja je tu.

**Pre lansiranja obavezno:**

1. **Datum webinara** - `datumISO`, `datumTekst`, `datumKratko` u `index.html`;
   `datumTekst` u `application.html`; `datumISO`, `krajISO`, `datumTekst` u `thankyou.html`.
   Trenutno stoji placeholder **20.11. u 19h**.
2. **Bridge VSL** - `vimeoId` u `application.html` sada pokazuje na isti video kao optin.
   Zameniti ID-em novog videa kada stigne.
3. **Anketa** - u `application.html` postoji prazan slot `#survey-box`. Dok je prazan,
   u njemu stoji privremena kartica sa dugmetom koje vodi pravo na thank you. Kad stigne
   embed kod (Typeform, Tally, Google Forms, Make), zameni se ceo sadrzaj tog diva -
   nista drugo ne treba dirati, parametri iz URL-a se i dalje prosledjuju dalje.
4. **Pikseli** - stranice okidaju `fbq`/`ttq` evente samo ako je bazni piksel već učitan.
   Dodati GTM/Meta/TikTok snippet u `<head>` svake stranice (ili preko hosting platforme).
   U `application.html` postoji `PIXEL_ID` placeholder za Meta advanced matching.

## ActiveCampaign

Forma živi u popupu (`#optin-modal`) - otvara ga svako dugme sa atributom `data-open-optin`
(hero CTA, kartica u sekciji „Prijavi se", sticky traka na mobilnom). Zatvara se na X, Esc i
klik na pozadinu; dok je otvoren, telo stranice se ne skroluje.

`index.html` šalje prijavu direktno na `https://excelgrasic.activehosted.com/proc.php`
(`fetch`, `mode: no-cors`), pa radi redirect sam - zato kontrolišemo gde posetilac ide dalje.

Polja preuzeta sa postojeće forme 35 na excelgrasic.com:

| Polje u formi | Šalje se kao | Naziv u AC |
|---|---|---|
| Ime i prezime | `firstname` + `lastname` | Ime, Prezime |
| Email | `email` | Email |
| Broj telefona | `phone` | Phone |
| Pozicija na poslu | `field[5]` | `funkcija` |
| Zemlja | `field[12]` | `zemlja` |

Ime i prezime su jedno polje u formi - pri slanju se prva reč šalje kao `firstname`,
ostatak kao `lastname`. Validacija traži najmanje dve reči bez brojeva i sama podiže
početna slova.

> **Phone još nije na formi 35.** Originalna forma na njihovom sajtu nema polje za telefon,
> pa ga treba dodati u ActiveCampaign formi 35 - inače AC može da odbaci `phone` iz POST-a.
> Proveriti na prvoj test prijavi da li je broj stigao na kontakt.

Pozivni broj se popunjava sam: zemlja se pogađa iz vremenske zone uređaja (pa iz
`navigator.language`, pa fallback Srbija), i iz nje se izvlače pozivni broj i naziv zemlje.
Broj se pre slanja normalizuje u E.164 (`060 123 4567` → `+381601234567`, `00381…` → `+381…`).

Hidden: `u=6AE5C8B7002DE`, `f=35`, `act=sub`, `v=2`, `or=83103e39-76f2-40ee-b0ac-55e0142fe058`.

> Forma 31 na njihovom sajtu ima i `field[22]` (izbor između dva termina). Ako se pređe na
> dva termina, koristi se ta forma: `u=6AE5C8B70C8DF`, `f=31`, `or=fe0f44b3-4723-4b9a-82d8-a9c32112ffea`.

## AEvent (samo `optin-2`)

Pored AC prijave, `optin-2` šalje prijavu i u AEvent (`fetch`, `mode: no-cors`) na
`aevent.endpoint` iz `window.MC`. AEvent registruje osobu na Zoom webinar izabranog termina
i pravi lični Zoom link, koji AEvent dalje šalje u ActiveCampaign i GHL.

Svaki termin u `termini` nosi svoju AEvent kampanju i Zoom webinar:

| Termin | `aeventWtl` (kampanja) | `aeventWebinarId` (Zoom) |
|---|---|---|
| 26.11. | `kHbfJwMUv2CqhGO` | `85170335868` |
| 30.11. | `sTlwUYlMg63WGWw` | `85402964220` |

Pre slanja forma sa `aevent.dataUrl` uzme **token** za izabranu kampanju (isto radi AEventov
skript). Bez tokena AEvent prijavu šalje na CAPTCHA korak i ona se nikad ne završi.

Šalje se: `token`, `wtl`, `webinarid`, `name`, `email`, `phone` (samo cifre sa pozivnim),
`timezone`, `location` i `lp` (adresa stranice). Domen stranice mora biti na whitelisti u AEventu, inače AEvent odbija
prijavu. Redirect na `application.html` čeka oba slanja, najviše 5 sekundi.

## Assets

Slike (logo, Aleksandar, press logoi, gift box) se učitavaju sa `excelgrasic.com/wp-content/…`.
Rade sa bilo kog domena. Ako se želi potpuna nezavisnost od njihovog WP-a, skinuti ih lokalno
i zameniti putanje.

## Brand

`_brand.css` je referenca sa tokenima izvučenim iz njihove Bricks teme.

Stranice su **svetle**, isto kao `/productivity-masterclass/` - belo telo (`#ffffff`),
tekst `#363636`, a zelena je traka-akcenat. Redosled traka:

```
belo → ZELENO #004d3a (hero) → belo → cream #ecede5 (press) → belo
     → ZELENO #004d3a (prijava) → #001812 (footer)
```

Boje: `#004d3a` primarna zelena, `#e1f25e` CTA lime (tekst na dugmetu je zelen),
`#75a34d` logo zelena, `#ecede5` cream trake, `#e1eae8` kartice, `#dfe5e2` linije.
Naslovi su `font-weight:500` (ne bold), radijus `16px`, font **Onest** (Google Fonts).

## Lokalni preview

```
python3 '/Users/dusan/Floumate Dev/.claude/serve_utf8.py' 8731
```

Pokretati isključivo preko `serve_utf8.py` - običan `python3 -m http.server` servira bez
charseta i kvari naša slova (UŽIVO → UÅ½IVO).
