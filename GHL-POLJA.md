# Polja za ručno pravljenje u GoHighLevel

Izvučeno iz `window.MC.anketa` u `application.html`, nije prekucano.
Vrednosti kopiraj iz blokova - imaju kvačice i kose crte, pa prekucavanje
lako napravi razliku koju posle ne vidiš, a upis tiho ne prolazi.

Osam polja ispod, plus tri tekstualna na kraju.

---

## 1. Oblast rada

**Tip:** Radio  
**Ključ koji šaljemo:** `oblast_rada`

```
Finansije, računovodstvo i kontroling
Administracija i operacije
Prodaja, nabavka i logistika
Menadžment i rukovođenje
Analitika i IT
HR i razvoj zaposlenih
Preduzetništvo
Student / trenutno ne radim
Drugo
```

## 2. Pozicija

**Tip:** Radio  
**Ključ koji šaljemo:** `pozicija`

```
Zaposleni / stručnjak
Menadžer ili vođa tima
Direktor / rukovodilac sektora
Vlasnik kompanije / preduzetnik
HR / L&D stručnjak
Student / tražim posao
Drugo
```

## 3. Korišćenje AI

**Tip:** Radio  
**Ključ koji šaljemo:** `ai_koriscenje`

```
Da, svakodnevno
Da, nekoliko puta nedeljno
Da, ali samo povremeno
Ne, ali planiram da počnem
Ne koristim AI
```

## 4. Znanje o AI

**Tip:** Radio  
**Ključ koji šaljemo:** `ai_znanje`

```
Početnik sam i tek upoznajem mogućnosti AI-ja
Poznajem osnove i koristim jednostavne AI alate
Samostalno koristim AI u poslu, ali želim da naučim više
Napredan sam korisnik i već koristim AI za složenije zadatke i automatizaciju
Nisam siguran/na
```

## 5. Šta želi da unapredi

**Tip:** Checkbox (više odgovora)  ·  na stranici bira najviše 3  
**Ključ koji šaljemo:** `unapredjenje`

```
Da brže završavam svakodnevne zadatke
Da automatizujem ponavljajuće poslove
Da bolje analiziram podatke i pravim izveštaje
Da unapredim rad svog tima
Da steknem veštine za napredovanje ili promenu posla
Trenutno istražujem mogućnosti
```

## 6. Važnost AI

**Tip:** Radio  
**Ključ koji šaljemo:** `vaznost`

```
Veoma važno, jer imam osećaj da ne uspevam da ispratim sve novosti i mogućnosti koje AI donosi
Važno, jer želim uskoro da počnem ozbiljnije da koristim AI
Korisno, ali mi trenutno nije prioritet
Trenutno samo učim i istražujem mogućnosti
```

## 7. Teme

**Tip:** Checkbox (više odgovora)  ·  na stranici bira najviše 3  
**Ključ koji šaljemo:** `teme`

```
Excel
Power Query / Power Pivot
Power BI
AI i automatizacija
Microsoft 365 Copilot
Python u Excelu
Word i PowerPoint
Još nisam siguran/na
```

## 8. Prepreka za AI

**Tip:** Radio  
**Ključ koji šaljemo:** `prepreka`  ·  ume da stigne prazno

```
Nemam dovoljno vremena da istražujem nove AI alate i njihove mogućnosti
Brine me bezbednost i poverljivost kompanijskih podataka koje bih unosio/la u AI alate
Nisam siguran/na kako da AI primenim na konkretne poslovne probleme
Koristim AI, ali želim da pređem sa jednostavnih upita na napredniju primenu
U kompaniji postoje ograničenja za korišćenje AI alata
Trenutno nemam posebnih prepreka
```

---

## Još tri, bez vrednosti

Sva tri su tipa **Text**.

| Naziv | Ključ | Primer onoga što stiže |
|---|---|---|
| Termin | `termin` | četvrtak, 26.11. u 19 h |
| Vreme popunjavanja ankete | `submitted_at` | 2026-11-10T17:23:59.939Z |
| Stranica ankete | `page_url` | https://masterclass.excelgrasic.com/application |

---

## Pri upisu iz Make-a

- Radio polje prima običan string, poklapanje mora biti u slovo.
- Checkbox polje prima **niz**, i kad je izabrana jedna vrednost: `["Excel"]`.
- Naša dva checkbox polja stižu spojena sa ` | `, pa u Make-u ide
  `if(teme = ""; emptyarray; split(teme; " | "))`.
- Polje se gađa preko `id`, ne preko naziva, i kroz `fieldValue`.
