# Uputstvo za Claude Code na ovom projektu

Ovo je funnel za besplatan Productivity Masterclass (Excel Grašić / Outliers).
Tri samostalne HTML stranice, bez build koraka. Menja se uglavnom **tekst**.

```
optin/index.html     landing, prijava se otvara u popupu
optin-2/index.html   druga verzija landinga (A/B), menja se nezavisno od prve
                     utisci su ovde slajder, na optin stranici su zid
utisci/              screenshotovi mejlova, koriste ih obe verzije landinga
application.html     bridge: video pa slot za anketu
thankyou.html        potvrda: video pa dva koraka
index.html           samo preusmerenje na /optin/
kalendar/index.html  "dodaj u kalendar" iz mejla: sklopi termin i posalje
                     posetioca u njegov kalendar; za Apple i ICS sam napravi
                     .ics fajl u pregledacu, bez servera
mejl/                blokovi koji se lepe u ActiveCampaign mejlove
                     (nisu stranice, ne otvaraju se same)
kompanije/           Yearly Ticket za kompanije (B2B). Tekst i dizajn su
                     Jankovi (njegov fajl prepakovan za GHL), plus traka
                     sa 14 logoa klijenata. Lepi se u GHL ceo fajl; slike
                     iz kompanije/img/ se pozivaju punim github.io linkom,
                     SEO slika je kompanije/seo-yearly-ticket-1200x630.jpg.
                     Forma salje sve na Make webhook (org "My Organization",
                     scenario "Yearly Ticket Optin") i vodi na thank you:
kompanije/hvala/     thank you za Yearly Ticket (GHL putanja /hvala);
                     jedna sekcija: upit je poslat, javice se neko iz tima.
```

Sve je u jednom fajlu po stranici: HTML, CSS u `<style>`, JS u `<script>`.

Video na optin-2, application i thankyou je vturb plejer: embed kod stoji
direktno u HTML-u (`<vturb-smartplayer>` u `.vsl`), ne u `window.MC`.

---

## Pravila koja se ne krše

**1. Ne diraj ništa osim onoga što je traženo.**
Ako je tražena izmena teksta, menja se samo tekst između tagova. CSS, JS, imena
klasa, `id` atributi i struktura ostaju netaknuti. `id` se koristi iz JavaScripta -
ako nestane, stranica puca.

**2. Nikad dugi dash.** Ni `—` ni `–`. Uvek obična crtica `-`.

**3. Tekst se piše rodno neutralno.** Bez muškog roda kao podrazumevanog i bez
oblika sa kosom crtom („dobio/la"). Umesto „biće zadovoljan" - „bićeš zadovoljan_a"
ne valja ni to; preformuliši rečenicu da rod ne bude potreban.

**4. Reči sa crticom ne smeju da se lome preko dva reda.**
`Masterclass-u`, `Outliers-a`, `5-10x` i slične obmotaj u `<span class="nb">`.

**5. Datumi, linkovi i ID-evi se menjaju samo u `window.MC`** bloku na vrhu svake
stranice. Nikad ručno po tekstu - vrednosti se ubacuju JavaScriptom.

**6. Ne menjaj `.gitignore`, workflow fajlove ni `tools/`** bez izričitog traženja.

**6a. U linkovima za kalendar `z=` ostaje zadnji parametar.** Zoom linkovi u
sebi nose `?` i `&`, pa `kalendar/index.html` cita vrednost sve do kraja
adrese. Dodaš li bilo šta posle `z=`, link za pristup se prelomi i ljudi
dobiju pola adrese u kalendaru.

**7. Slike u `utisci/` su obrađene - ne menjaj ih.** Na svakoj su zamućeni
mejl adresa i prezime, i u zaglavlju i u potpisu; vidi se samo ime. Zato i
fajl i `alt` nose samo ime. Ako dodaješ nov utisak, zamuti isto to pre nego
što ga ubaciš, imenuj ga po imenu osobe i dodaj ga u `id="ut-grid"` na obe
verzije landinga. Originali stoje u `utisci-izvor/` i ne idu na sajt.

---

## Pre nego što kažeš da je gotovo

Obavezno, tim redom:

```bash
python3 tools/provera.py          # mora da prođe bez greške
python3 tools/serve.py            # otvori http://localhost:8731/optin/
```

Pa u pregledaču proveri:
- slova sa kvačicama izgledaju ispravno (ž, č, ć, š, đ), nema `UÅ½IVO`
- nema greške u konzoli
- stranica se ne preliva vodoravno na širini telefona (375px)
- ako si menjao tekst na application ili thankyou stranici, otvori ih sa
  parametrima: `?firstname=Ana&email=ana@gmail.com`

Tek onda commit i push.

---

## Objavljivanje

`git push` na granu `main` i stranica je uživo za minut-dva:

- https://floumate-dev.github.io/excel-grasic/optin
- https://floumate-dev.github.io/excel-grasic/optin-2
- https://floumate-dev.github.io/excel-grasic/application.html
- https://floumate-dev.github.io/excel-grasic/thankyou.html

Nema staging okruženja. Push ide pravo na ono što klijent vidi, zato provera
pre pusha nije formalnost.

Ako nešto pukne, vraćanje je `git revert <hash>` pa push.

---

## Gde šta stoji

| Hoću da promenim | Fajl | Traži |
|---|---|---|
| Naslov u herou | `optin/index.html` | `<h1>` |
| Tekst ispod naslova | `optin/index.html` | `class="hero-lead"` |
| Tri stavke u herou | `optin/index.html` | `class="hero-list"` |
| Sekciju o problemima | `optin/index.html` | `class="prob-row"` |
| Benefite | `optin/index.html` | `class="ben-item"` |
| Redosled utisaka | `optin/index.html` | `id="ut-grid"` |
| Bio Aleksandra | `optin/index.html` | `class="bio-list"` |
| Tekst u popupu za prijavu | `optin/index.html` | `id="optin-modal"` |
| Poruke o greškama u formi | `optin/index.html` | `function proveri` |
| Spisak pozivnih brojeva | `optin/index.html` | `var ZEMLJE` |
| Tekst na bridge stranici | `application.html` | `class="sub"`, `class="step"` |
| Pitanja u anketi | `application.html` | `anketa` u `window.MC` |
| Tekst na potvrdi | `thankyou.html` | `class="step"` |
| Reč koja se upiše u odgovor | `thankyou.html` | `odgovorNaslov`, `odgovorTekst` u `window.MC` |
| Termine (datum i sat) | `optin/index.html`, `optin-2/index.html` | `termini` u `window.MC` |
| Datum, video, linkove | sve tri | `window.MC` |
| Naziv i opis termina u kalendaru | `kalendar/index.html` | `naziv`, `opis` u `window.MC` |
| Šta se skida sa linka za pristup | `kalendar/index.html` | `ocisti` u `window.MC` |
| Dugmad za kalendar u mejlu | `mejl/kalendar-dugmad-termin-1.html` | ceo fajl |
| Imena država na srpskom | `optin/index.html`, `optin-2/index.html` | `var ZEMLJE` |

---

## Šta još nije gotovo

Ovo čeka podatke od klijenta, ne diraj dok ne stignu:

- **ID polja u ActiveCampaignu za izabrani termin** - `ac.poljeTermin` u
  `window.MC` je prazan, pa termin ne stiže u AC. Dok se ne upiše (npr. `"18"`
  za `field[18]`), prijava radi ali se ne zna ko je izabrao koji termin.
- **ID polja u ActiveCampaignu za državu** - `ac.poljeDrzava` je prazan, pa
  država ne stiže u AC. U Make webhook sa optin-2 i u webhook ankete ide i
  bez toga (`drzava`, `drzava_kod`).
- slot za anketu na application stranici je prazan (`id="survey-box"`)
- glavni pasus na application stranici je lorem ipsum
- piksel: optin-2, application i thankyou su na GHL-u (masterclass.excelgrasic.com: `/`, `/application`, `/thank-you`). Osnovni kod piksela je u GHL Head tracking code svake stranice, a u kodu su samo događaji: Lead na optinu, SubmitApplication na application kad je anketa popunjena (jednom po osobi). Treba potvrda media buyera koji događaj koristi za optimizaciju.
