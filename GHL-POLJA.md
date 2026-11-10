# Polja za GoHighLevel

Spisak je izvučen iz `window.MC.anketa` u `application.html`. Ako se tamo
promeni pitanje, promeni se i ono što stiže na webhook - pa i ovaj spisak
treba ponovo izvući, ne dopisivati ručno.

Webhook: `https://hook.eu1.make.com/9h8hqfmcgeb12w3bdl1bfd3b5t4eeulv`

---

## Polja iz pitanja

### 1. `oblast_rada`

- **Pitanje:** Koja je tvoja trenutna oblast rada?
- **Tip polja:** SINGLE_OPTIONS

| Vrednosti |
|---|
| Finansije, računovodstvo i kontroling |
| Administracija i operacije |
| Prodaja, nabavka i logistika |
| Menadžment i rukovođenje |
| Analitika i IT |
| HR i razvoj zaposlenih |
| Preduzetništvo |
| Student / trenutno ne radim |
| Drugo |

### 2. `pozicija`

- **Pitanje:** Koja opcija najbolje opisuje tvoju trenutnu poziciju?
- **Tip polja:** SINGLE_OPTIONS

| Vrednosti |
|---|
| Zaposleni / stručnjak |
| Menadžer ili vođa tima |
| Direktor / rukovodilac sektora |
| Vlasnik kompanije / preduzetnik |
| HR / L&D stručnjak |
| Student / tražim posao |
| Drugo |

### 3. `ai_koriscenje`

- **Pitanje:** Da li koristiš AI u svom svakodnevnom radu?
- **Tip polja:** SINGLE_OPTIONS

| Vrednosti |
|---|
| Da, svakodnevno |
| Da, nekoliko puta nedeljno |
| Da, ali samo povremeno |
| Ne, ali planiram da počnem |
| Ne koristim AI |

### 4. `ai_znanje`

- **Pitanje:** Kako stojiš sa znanjem o AI?
- **Tip polja:** SINGLE_OPTIONS

| Vrednosti |
|---|
| Početnik sam i tek upoznajem mogućnosti AI-ja |
| Poznajem osnove i koristim jednostavne AI alate |
| Samostalno koristim AI u poslu, ali želim da naučim više |
| Napredan sam korisnik i već koristim AI za složenije zadatke i automatizaciju |
| Nisam siguran/na |

### 5. `unapredjenje`

- **Pitanje:** Šta najviše želiš da unaprediš u svom radu?
- **Tip polja:** TEXT (stiže više odgovora spojenih sa " | ")
- **Najviše odgovora:** 3

| Vrednosti |
|---|
| Da brže završavam svakodnevne zadatke |
| Da automatizujem ponavljajuće poslove |
| Da bolje analiziram podatke i pravim izveštaje |
| Da unapredim rad svog tima |
| Da steknem veštine za napredovanje ili promenu posla |
| Trenutno istražujem mogućnosti |

### 6. `vaznost`

- **Pitanje:** Koliko ti je važno da unaprediš svoje znanje i primenu AI-ja u skorije vreme?
- **Tip polja:** SINGLE_OPTIONS

| Vrednosti |
|---|
| Veoma važno, jer imam osećaj da ne uspevam da ispratim sve novosti i mogućnosti koje AI donosi |
| Važno, jer želim uskoro da počnem ozbiljnije da koristim AI |
| Korisno, ali mi trenutno nije prioritet |
| Trenutno samo učim i istražujem mogućnosti |

### 7. `teme`

- **Pitanje:** Koje teme želiš bolje da savladaš?
- **Tip polja:** TEXT (stiže više odgovora spojenih sa " | ")
- **Najviše odgovora:** 3

| Vrednosti |
|---|
| Excel |
| Power Query / Power Pivot |
| Power BI |
| AI i automatizacija |
| Microsoft 365 Copilot |
| Python u Excelu |
| Word i PowerPoint |
| Još nisam siguran/na |

### 8. `prepreka`

- **Pitanje:** Šta te trenutno najviše sprečava da bolje iskoristiš AI u svom radu?
- **Tip polja:** SINGLE_OPTIONS
- **Može da stigne prazno:** da, ne pita se ako je `ai_znanje` = "Početnik sam i tek upoznajem mogućnosti AI-ja"

| Vrednosti |
|---|
| Nemam dovoljno vremena da istražujem nove AI alate i njihove mogućnosti |
| Brine me bezbednost i poverljivost kompanijskih podataka koje bih unosio/la u AI alate |
| Nisam siguran/na kako da AI primenim na konkretne poslovne probleme |
| Koristim AI, ali želim da pređem sa jednostavnih upita na napredniju primenu |
| U kompaniji postoje ograničenja za korišćenje AI alata |
| Trenutno nemam posebnih prepreka |

---

## Polja koja ne dolaze iz pitanja

| Ključ | Šta nosi | Tip | Napomena |
|---|---|---|---|
| `event` | uvek `anketa` | - | služi scenariju da razdvoji anketu od prijave |
| `email` | mejl | standardno polje | iz linka, ili uneto na kraju ankete |
| `phone` | telefon u E.164 obliku | standardno polje | npr. `+381601234567` |
| `first_name` | ime | standardno polje | iz linka |
| `termin` | izabrani termin | TEXT | npr. `četvrtak, 26.11. u 19 h`; prazno ako nije stiglo kroz link |
| `page_url` | adresa stranice | TEXT | opciono |
| `submitted_at` | vreme slanja, ISO | DATE ili TEXT | npr. `2026-11-10T17:23:59.939Z` |
