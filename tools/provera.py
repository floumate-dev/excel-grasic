#!/usr/bin/env python3
"""Provera stranica pre pusha.

    python3 tools/provera.py

Hvata greske koje se lako naprave pri menjanju teksta: polomljen HTML,
izgubljen id koji JavaScript trazi, dugi dash, pokvaren charset.
Izlazni kod 1 znaci da nesto ne valja - tada se ne pusuje.
"""

import io
import os
import re
import sys
from html.parser import HTMLParser

KOREN = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# tagovi koji se ne zatvaraju
PRAZNI = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
          'link', 'meta', 'param', 'source', 'track', 'wbr'}

# sta svaka stranica mora da sadrzi da bi radila
OBAVEZNO = {
    'optin/index.html': [
        'window.MC', 'id="optin-modal"', 'id="mc-form"', 'id="fullname"',
        'id="email"', 'id="phone"', 'id="field5"', 'id="field12"',
        'id="mc-submit"', 'id="form-err"', 'data-open-optin', 'id="cd-form"',
        'id="tk-d"', 'id="tk-m"', 'id="tk-t"', 'id="yr"',
    ],
    'application.html': [
        'window.MC', 'id="vsl"', 'id="hello"', 'id="survey-box"',
        'id="fill"', 'id="track-lab"', 'id="open-survey"', 'id="yr"',
    ],
    'thankyou.html': [
        'window.MC', 'id="vsl"', 'id="hello"', 'id="open-mail"',
        'id="sent-to"', 'id="share-url"', 'id="copy-btn"', 'id="yr"',
    ],
    'index.html': ['optin/'],
}


class Parser(HTMLParser):
    """Prati da li je svaki otvoreni tag i zatvoren, i to pravim redom."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stek = []
        self.greske = []

    def handle_starttag(self, tag, attrs):
        if tag not in PRAZNI:
            self.stek.append((tag, self.getpos()[0]))

    def handle_endtag(self, tag):
        if tag in PRAZNI:
            return
        if not self.stek:
            self.greske.append('red %d: </%s> a nista nije otvoreno'
                               % (self.getpos()[0], tag))
            return
        otvoren, red = self.stek[-1]
        if otvoren == tag:
            self.stek.pop()
        elif any(t == tag for t, _ in self.stek):
            while self.stek:
                t, r = self.stek.pop()
                if t == tag:
                    break
                self.greske.append('red %d: <%s> otvoren a nije zatvoren '
                                   '(naislo se na </%s> u redu %d)'
                                   % (r, t, tag, self.getpos()[0]))
        else:
            self.greske.append('red %d: </%s> a taj tag nije otvoren'
                               % (self.getpos()[0], tag))


def proveri(putanja, obavezno):
    pun = os.path.join(KOREN, putanja)
    greske = []

    if not os.path.exists(pun):
        return ['fajl ne postoji']

    sirovo = open(pun, 'rb').read()
    try:
        tekst = sirovo.decode('utf-8')
    except UnicodeDecodeError as e:
        return ['fajl nije u UTF-8 kodiranju (%s) - sacuvaj ga kao UTF-8' % e]

    if '<meta charset="utf-8">' not in tekst.lower():
        greske.append('fali <meta charset="utf-8"> - kvacice ce biti pokvarene')

    for znak, ime in (('—', 'dugi dash -'), ('–', 'srednji dash -')):
        if znak in tekst:
            redovi = [i + 1 for i, r in enumerate(tekst.split('\n')) if znak in r]
            greske.append('%s zameni obicnom crticom (redovi: %s)'
                          % (ime, ', '.join(map(str, redovi[:8]))))

    p = Parser()
    try:
        p.feed(tekst)
    except Exception as e:
        greske.append('HTML se ne moze procitati: %s' % e)
    greske.extend(p.greske)
    for tag, red in p.stek:
        greske.append('red %d: <%s> nikad nije zatvoren' % (red, tag))

    for deo in obavezno:
        if deo not in tekst:
            greske.append('nedostaje "%s" - bez toga stranica ne radi' % deo)

    return greske


def main():
    ukupno = 0
    for putanja in sorted(OBAVEZNO):
        greske = proveri(putanja, OBAVEZNO[putanja])
        if greske:
            ukupno += len(greske)
            print('\n%s' % putanja)
            for g in greske:
                print('   %s' % g)
        else:
            print('%-22s u redu' % putanja)

    if ukupno:
        print('\n%d problem(a). Popravi pa pokreni ponovo - ne pusuj ovako.'
              % ukupno)
        return 1
    print('\nSve stranice su u redu.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
