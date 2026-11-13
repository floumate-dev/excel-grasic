/**
 * Masterclass dashboard - izvor podataka.
 *
 * Ovaj kod stoji u Apps Script-u vezanom za Google Sheet
 * "Excel Grašić | Masterclass" (Extensions > Apps Script) i objavljen je kao
 * Web app (Execute as: Me, Who has access: Anyone).
 *
 * Vraca SAMO zbirne brojke (koliko optina, odakle, koliko applicationa).
 * Imena, mejlovi i telefoni nikad ne izlaze iz Sheeta.
 *
 * Kolone u tabu "Optin" (kako ih Make upisuje, od 0):
 *  0 vreme, 1 ime i prezime, 5 email, 8 drzava, 9 termin, 10 source,
 *  11 specific source, 12 utm_source, 13 utm_medium, 14 utm_campaign, 15 utm_content
 * Tab "Application": 0 vreme, 1 email, dalje odgovori iz ankete.
 */

var TZ = 'Europe/Belgrade';

/* Test prijave koje se ne broje: mejl sadrzi neki od ovih delova,
   ili je u imenu posebna rec "test". Dopuni spisak ako se pojavi nova test adresa. */
var TEST_MEJL = ['floumate', 'dusankocic', 'danilotest', 'danilozdravkovic', 'danilozdr', 'test454'];

var DANA_U_GRAFIKONU = 21;

function doGet() {
  var cache = CacheService.getScriptCache();
  var hit = cache.get('dash');
  if (hit) return json_(hit);
  var out = JSON.stringify(izracunaj_());
  cache.put('dash', out, 30); /* 30 sekundi */
  return json_(out);
}

function json_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}

function jeTest_(email, ime) {
  var m = String(email || '').toLowerCase();
  for (var i = 0; i < TEST_MEJL.length; i++) if (m.indexOf(TEST_MEJL[i]) > -1) return true;
  return /(^|\s)test(\s|$)/i.test(String(ime || ''));
}

function datum_(v) {
  if (v instanceof Date) return v;
  var d = new Date(String(v || ''));
  return isNaN(d) ? null : d;
}

function dan_(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }

function ocisti_(v) {
  v = String(v == null ? '' : v).trim();
  if (!v || v === 'undefined' || v === 'null') return '';
  return v;
}

/* Glavni izvor jedne prijave: source -> utm_source -> direktno */
function izvor_(r) {
  var s = ocisti_(r[10]).toLowerCase();
  if (s) return s;
  var u = ocisti_(r[12]).toLowerCase();
  if (u) return u;
  return 'direktno';
}

function broji_(mapa, kljuc) { mapa[kljuc] = (mapa[kljuc] || 0) + 1; }

function sortiraj_(mapa, max) {
  return Object.keys(mapa).map(function (k) { return { naziv: k, broj: mapa[k] }; })
    .sort(function (a, b) { return b.broj - a.broj; }).slice(0, max || 50);
}

function izracunaj_() {
  var ss = SpreadsheetApp.getActive();
  var optin = ss.getSheetByName('Optin').getDataRange().getValues().slice(1);
  var app = ss.getSheetByName('Application').getDataRange().getValues().slice(1);

  var danas = dan_(new Date());
  var juce = dan_(new Date(Date.now() - 864e5));
  var poDanu = {};
  for (var i = DANA_U_GRAFIKONU - 1; i >= 0; i--) {
    poDanu[dan_(new Date(Date.now() - i * 864e5))] = { optini: 0, aplikacije: 0 };
  }

  /* Optini: jedna osoba = jedan mejl (ako se prijavi dvaput, broji se prvi put) */
  var vidjen = {}, prijava = 0, izvori = {}, specificni = {}, kampanje = {}, termini = {}, drzave = {};
  var optinDanas = 0, optinJuce = 0, testova = 0;
  optin.forEach(function (r) {
    var email = ocisti_(r[5]).toLowerCase();
    if (!email) return;
    if (jeTest_(email, r[1])) { testova++; return; }
    prijava++;
    if (vidjen[email]) return;
    vidjen[email] = true;
    var d = datum_(r[0]);
    if (d) {
      var k = dan_(d);
      if (poDanu[k]) poDanu[k].optini++;
      if (k === danas) optinDanas++;
      if (k === juce) optinJuce++;
    }
    var iz = izvor_(r);
    broji_(izvori, iz);
    var sp = ocisti_(r[11]);
    if (sp) broji_(specificni, sp);
    var kp = ocisti_(r[14]);
    if (kp) broji_(kampanje, kp);
    var tm = ocisti_(r[9]);
    if (tm) broji_(termini, tm);
    broji_(drzave, ocisti_(r[8]) || 'Nepoznato');
  });

  /* Applicationi: jedna osoba = jedan mejl */
  var appVidjen = {}, appDanas = 0, appJuce = 0, appIzOptina = 0;
  app.forEach(function (r) {
    var email = ocisti_(r[1]).toLowerCase();
    if (!email || jeTest_(email, '')) return;
    if (appVidjen[email]) return;
    appVidjen[email] = true;
    if (vidjen[email]) appIzOptina++;
    var d = datum_(r[0]);
    if (d) {
      var k = dan_(d);
      if (poDanu[k]) poDanu[k].aplikacije++;
      if (k === danas) appDanas++;
      if (k === juce) appJuce++;
    }
  });

  var optini = Object.keys(vidjen).length;
  var aplikacije = Object.keys(appVidjen).length;

  return {
    azurirano: new Date().toISOString(),
    optini: optini,
    prijava: prijava,
    aplikacije: aplikacije,
    stopaAplikacija: optini ? Math.round(appIzOptina / optini * 1000) / 10 : 0,
    danas: { optini: optinDanas, aplikacije: appDanas },
    juce: { optini: optinJuce, aplikacije: appJuce },
    izvori: sortiraj_(izvori),
    specificni: sortiraj_(specificni, 15),
    kampanje: sortiraj_(kampanje, 15),
    termini: sortiraj_(termini),
    drzave: sortiraj_(drzave, 10),
    poDanu: Object.keys(poDanu).map(function (k) {
      return { dan: k, optini: poDanu[k].optini, aplikacije: poDanu[k].aplikacije };
    }),
    iskljucenoTestova: testova
  };
}
