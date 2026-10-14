// =====================================================================
//  INHALTE DER ÜBUNGEN
//  Hier können Fragen ergänzt oder geändert werden.
//  Bei Multiple-Choice-Fragen steht die RICHTIGE Antwort immer an erster
//  Stelle – die Seite mischt die Antworten automatisch.
// =====================================================================

// ---------- Angaben für Impressum & Datenschutz ----------
// email: leer lassen ('') oder eine Adresse eintragen, z. B. 'name@schule.de'
const ANBIETER = {
  name: 'Daniel Dirks',
  strasse: 'Ahornweg 70',
  ort: '51469 Bergisch Gladbach',
  email: '',
  stand: 'Oktober 2026',
};

// ---------- Zeichnungen für Bohrlöcher und Bohrer ----------

function zeichnungBohrloch(typ) {
  const formen = {
    durchgang: 'M0,0 H16 V20 H0 Z M24,0 H40 V20 H24 Z',
    sack: 'M0,0 H16 V12 L20,14.4 L24,12 V0 H40 V20 H0 Z',
    senk: 'M0,0 H12 L16,4 V20 H0 Z M28,0 H40 V20 H24 V4 Z',
  };
  const tief = typ === 'sack' ? 16 : 23;
  const inhalt = TZ.body(formen[typ], true) + TZ.center(20, -3, 20, tief);
  return TZ.svg('-4 -5 48 30', inhalt, 'Querschnitt eines Bohrlochs', 'klein');
}

function zeichnungBohrer(typ) {
  // Spiralnuten als schräge Linien
  const rillen = (von, bis) => {
    let s = '';
    for (let x = von; x <= bis; x += 8) s += `<line class="t" x1="${x}" y1="6" x2="${x + 7}" y2="18"/>`;
    return s;
  };
  const formen = {
    stahl: '<path class="k" d="M2,7 H25 V6 H68 L71.6,12 L68,18 H25 V17 H2 Z" fill="var(--paper)"/>' + rillen(28, 60),
    holz: '<path class="k" d="M2,7 H25 V6 H68 L71,6.3 L68.8,8.6 L68.8,10.9 L74,12 L68.8,13.1 L68.8,15.4 L71,17.7 L68,18 H25 V17 H2 Z" fill="var(--paper)"/>' + rillen(28, 60),
    senker: '<path class="k" d="M2,8.5 H48 L52,2 L62,12 L52,22 L48,15.5 H2 Z" fill="var(--paper)"/>' +
      '<line class="t" x1="52" y1="7" x2="60" y2="12"/><line class="t" x1="52" y1="17" x2="60" y2="12"/><line class="t" x1="52" y1="2" x2="52" y2="22"/>',
  };
  return `<svg class="tz bohrer" viewBox="0 0 76 24" role="img" aria-label="Bohrer">${formen[typ]}</svg>`;
}

// ---------- Technisches Zeichnen ----------

const QUIZ_BEMASSUNG = [
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe(['ext']),
    a: ['Maßhilfslinie', 'Maßlinie', 'Körperkante', 'Mittellinie'],
    ex: 'Maßhilfslinien verlängern die Körperkanten nach außen.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe([null, 'line']),
    a: ['Maßlinie', 'Maßhilfslinie', 'Körperkante', 'Bruchlinie'],
    ex: 'Die Maßlinie liegt parallel zur bemaßten Kante – hier senkrecht neben dem Werkstück.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe([null, 'num']),
    a: ['Maßzahl', 'Maßeinheit', 'Positionsnummer', 'Maßpfeil'],
    ex: 'Die Maßzahl 14 gibt die Höhe in mm an. Sie ist von rechts lesbar.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe(['arrow']),
    a: ['Maßpfeil', 'Maßzahl', 'Maßhilfslinie', 'Mittellinie'],
    ex: 'Die Spitze des Maßpfeils berührt die Maßhilfslinie.' },
  { q: 'Mia schreibt „35 mm“ an ihre Maßlinie. Was sagst du ihr?',
    a: ['Lass das „mm“ weg – es wird nur 35 geschrieben.', 'Das ist genau richtig so.', 'Schreib besser „3,5 cm“.', 'Die Zahl gehört unter die Maßlinie.'],
    ex: 'Alle Maße sind in mm. Deshalb wird die Einheit nicht dazugeschrieben.' },
  { q: 'Ben zeichnet die Maßlinie direkt auf die Körperkante, um Platz zu sparen. Ist das erlaubt?',
    a: ['Nein – die Maßlinie bekommt 10 mm Abstand zur Kante.', 'Ja, wenn wenig Platz ist.', 'Ja, bei senkrechten Maßen.', 'Ja, wenn er sie dicker zeichnet.'],
    ex: 'Kanten dürfen nicht als Maßlinien benutzt werden. Die erste Maßlinie liegt 10 mm von der Kante entfernt.' },
  { q: 'Die erste Maßlinie liegt 10 mm von der Kante entfernt. Wie weit ist die zweite Maßlinie mindestens von der Kante weg?',
    a: ['18 mm', '12 mm', '10 mm', '20 mm'],
    ex: '10 mm bis zur ersten Maßlinie plus mindestens 8 mm Abstand = 18 mm.' },
  { q: 'Ein Werkstück hat ein Gesamtmaß von 80 und ein Teilmaß von 30. Welches Maß liegt näher an der Körperkante?',
    a: ['Das Teilmaß 30', 'Das Gesamtmaß 80', 'Beide auf derselben Linie', 'Das ist egal'],
    ex: 'Kleine Maße innen, große außen – so kreuzen Maßhilfslinien keine Maßlinien.' },
  { q: 'Warum zeichnet man die kleinen Maße innen und die großen außen?',
    a: ['Damit Maßhilfslinien keine Maßlinien kreuzen', 'Damit die Zeichnung kleiner wird', 'Weil kleine Zahlen sonst nicht lesbar sind', 'Weil man so Bleistift spart'],
    ex: 'Würde das große Maß innen liegen, müsste eine Maßhilfslinie die innere Maßlinie durchkreuzen.' },
  { q: 'Lukas lässt die Maßhilfslinien genau an der Maßlinie enden. Was fehlt?',
    a: ['Der Überstand von 2 mm', 'Die Maßeinheit', 'Ein zweiter Maßpfeil', 'Nichts – das ist richtig'],
    ex: 'Maßhilfslinien stehen 2 mm über die Maßlinie hinaus.' },
  { q: 'Welche Schreibweise ist in einer technischen Zeichnung richtig?',
    a: ['45', '45 mm', '4,5 cm', '45mm'],
    ex: 'Nur die Zahl – die Einheit mm entfällt.' },
  { q: 'Zwischen zwei Maßhilfslinien sind nur 4 mm Platz. Was machst du mit den Maßpfeilen?',
    a: ['Ich setze sie von außen an die Maßhilfslinien.', 'Ich lasse sie weg.', 'Ich zeichne sie ganz klein in die Lücke.', 'Ich lasse das Maß weg.'],
    ex: 'Bei wenig Platz dürfen die Pfeile von außen angesetzt werden.' },
  { q: 'Welcher Stift eignet sich am besten zum Bemaßen?',
    a: ['Ein harter, spitzer Bleistift (2H)', 'Ein weicher Bleistift (6B)', 'Ein Fineliner', 'Ein stumpfer Buntstift'],
    ex: 'Ein harter, spitzer Bleistift macht dünne, saubere Linien – und man kann radieren.' },
  { q: 'Warum soll jedes Maß nur einmal in der Zeichnung stehen?',
    a: ['Doppelte Maße machen die Zeichnung unübersichtlich und können sich widersprechen.', 'Weil man sonst zu viel radieren muss.', 'Weil die Lehrkraft das so mag.', 'Weil das Papier sonst zu voll wird.'],
    ex: 'Wird ein Maß geändert und steht doppelt da, vergisst man leicht eine Stelle.' },
  { q: 'Welche Aussage über Maßpfeile stimmt?',
    a: ['Sie sind etwa 5 mm lang, spitz und ausgemalt.', 'Sie sind offen wie ein „V“.', 'Sie zeigen immer zur Mitte der Maßlinie.', 'Man zeichnet nur einen Pfeil pro Maß.'],
    ex: 'An beiden Enden der Maßlinie sitzt ein spitzer (15°), voll ausgemalter Pfeil.' },
  { q: 'Mit welcher Linienart zeichnest du Maßhilfslinien?',
    a: ['Schmale Volllinie', 'Breite Volllinie', 'Strichlinie', 'Strichpunktlinie'],
    ex: 'Maßlinien und Maßhilfslinien sind schmale Volllinien.' },
  { q: 'Wo stehen die Maße normalerweise?',
    a: ['Außerhalb des Werkstücks', 'Mitten im Werkstück', 'Im Schriftfeld', 'Auf der Rückseite des Blattes'],
    ex: 'Maße stehen in der Regel außerhalb, damit die Zeichnung gut lesbar bleibt.' },
];

// "Welche Linienart ist das?" – nummerierte Linien in einer Zeichnung
const LINIEN_ERKENNEN = {
  svg: () => TZ.svg('-22 -28 96 64',
    TZ.body('M0,0 H50 V30 H0 Z') +
    '<line class="verdeckt" x1="21" y1="0" x2="21" y2="18"/><line class="verdeckt" x1="29" y1="0" x2="29" y2="18"/>' +
    '<path class="verdeckt" d="M21,18 L25,20.4 L29,18" fill="none"/>' + TZ.center(25, -4, 25, 24) +
    TZ.dimH({ x1: 0, x2: 50, y1: 0, yd: -12, text: '50' }) +
    TZ.dimV({ y1: 0, y2: 30, x1: 0, xd: -10, text: '30' }) +
    markierung(1, 62, 22, 50, 26) +
    markierung(2, 40, 8, 29, 9) +
    markierung(3, 36, -6, 25, -3) +
    markierung(4, 6, -23, 12, -12) +
    markierung(5, 62, -8, 50, -10),
    'Werkstück mit fünf nummerierten Linien'),
  paare: [
    { nr: 1, richtig: 'Volllinie, breit' },
    { nr: 2, richtig: 'Strichlinie' },
    { nr: 3, richtig: 'Strichpunktlinie, schmal' },
    { nr: 4, richtig: 'Volllinie, schmal' },
    { nr: 5, richtig: 'Volllinie, schmal' },
  ],
  optionen: ['Volllinie, breit', 'Volllinie, schmal', 'Strichlinie', 'Strichpunktlinie, schmal', 'Strichpunktlinie, breit', 'Freihandlinie'],
};

const LUECKENTEXT = {
  woerter: ['Maßhilfslinien', 'Maßlinien', '2', '8', '10', 'über', 'unter', 'mm', 'cm', 'rechts', 'links', 'voll', 'offen', 'breite', 'schmale', 'Strichpunktlinie', 'Strichlinie', 'Ø', '#'],
  saetze: [
    'Tim bemaßt ein Brettchen. Zuerst verlängert er die Körperkanten mit [Maßhilfslinien].',
    'Die erste Maßlinie zeichnet er [10] mm neben die Körperkante.',
    'Die Maßhilfslinien lässt er [2] mm über die Maßlinie hinausragen.',
    'Die Maßzahl schreibt er mittig [über] die Maßlinie – ohne die Einheit [mm].',
    'Das senkrechte Maß schreibt er so, dass man es von [rechts] lesen kann.',
    'Die Maßpfeile malt er [voll] aus.',
    'Für die Umrisse des Brettchens nimmt er eine [breite] Volllinie, für die Maßlinien eine [schmale].',
    'Die Mitte der Bohrung zeichnet er mit einer schmalen [Strichpunktlinie].',
    'Vor den Durchmesser der Bohrung schreibt er das Zeichen [Ø].',
  ],
};

// Kreuzworträtsel – die markierte Spalte ergibt das Lösungswort ZIRKEL
const KREUZWORT = {
  spalte: 5,
  loesung: 'ZIRKEL – noch ein Zeichengerät!',
  woerter: [
    { frage: 'Schnell und freihand gezeichnet, um eine Idee festzuhalten.', wort: 'SKIZZE', start: 2 },
    { frage: 'Schmale Strichpunktlinie durch die Mitte einer Bohrung.', wort: 'MITTELLINIE', start: 4 },
    { frage: 'Schräge, schmale Linien kennzeichnen eine Schnittfläche. Wie heißen sie zusammen?', wort: 'SCHRAFFUR', start: 2 },
    { frage: 'Verdeckte … zeichnet man als Strichlinie.', wort: 'KANTEN', start: 5 },
    { frage: 'Nach diesen festen Regeln werden technische Zeichnungen angefertigt.', wort: 'NORMEN', start: 1 },
    { frage: 'Sichtbare Kanten zeichnet man als breite …', wort: 'VOLLLINIE', start: 3 },
  ],
};

// "Richtig bemaßt?" – richtig: true/false
const RICHTIG_BEMASST = [
  { svg: () => zeichnungRechteck(), richtig: true,
    ex: 'Alles korrekt: 10 mm Abstand, Maßhilfslinien mit Überstand, Maßzahlen über der Linie, senkrecht von rechts lesbar.' },
  { svg: () => zeichnungRechteck({ top: { below: true } }), richtig: false,
    ex: 'Die 50 steht unter der Maßlinie. Maßzahlen gehören mittig über die Maßlinie.' },
  { svg: () => zeichnungRechteck({ left: { unit: true } }), richtig: false,
    ex: 'Dort steht „24 mm“. Die Einheit mm wird nicht geschrieben.' },
  { svg: () => zeichnungRechteck({ top: { noOver: true } }), richtig: false,
    ex: 'Die Maßhilfslinien der 50 enden genau an der Maßlinie. Sie müssen 2 mm überstehen.' },
  { svg: () => zeichnungRechteck({ left: { xd: 0, noExt: true } }), richtig: false,
    ex: 'Links wurde die Körperkante als Maßlinie benutzt. Die Maßlinie braucht 10 mm Abstand.' },
  { svg: () => zeichnungRechteck({ left: { flip: true } }), richtig: false,
    ex: 'Die 24 ist von links lesbar. Senkrechte Maße müssen von rechts lesbar sein.' },
  { svg: () => zeichnungRechteck({ left: { openArrows: true } }), richtig: false,
    ex: 'Die Maßpfeile der 24 sind offen. Sie müssen spitz und voll ausgemalt sein.' },
  { svg: () => zeichnungRechteck({ viewBox: '-18 -20 76 66',
      extra: TZ.dimH({ x1: 0, x2: 50, y1: 24, yd: 34, text: '50' }) }), richtig: false,
    ex: 'Die 50 steht oben und unten. Jedes Maß wird nur einmal eingetragen.' },
  { svg: () => zeichnungStufe(), richtig: true,
    ex: 'Alles korrekt: Das kleinere Maß (25) liegt innen, das Gesamtmaß (70) außen.' },
  { svg: () => TZ.svg('-20 -26 112 62', TZ.body('M0,0 H25 V16 H70 V30 H0 Z', true) +
      TZ.dimH({ x1: 0, x2: 70, y1: 0, y2: 16, yd: -10, text: '70' }) +
      TZ.dimH({ x1: 0, x2: 25, y1: 0, yd: -18, text: '25' }) +
      TZ.dimV({ y1: 0, y2: 30, x1: 0, xd: -10, text: '30' }) +
      TZ.dimV({ y1: 16, y2: 30, x1: 70, xd: 80, text: '14' })), richtig: false,
    ex: 'Das große Maß 70 liegt innen. Dadurch kreuzt die Maßhilfslinie der 25 die Maßlinie der 70.' },
  { svg: () => TZ.svg('-20 -14 92 60', TZ.body('M0,0 H18 V12 H40 V0 H60 V28 H0 Z', true) +
      TZ.dimH({ x1: 18, x2: 40, y1: 12, yd: -6, text: '22' }) +
      TZ.dimH({ x1: 0, x2: 60, y1: 28, yd: 38, text: '60' }) +
      TZ.dimV({ y1: 0, y2: 28, x1: 0, xd: -10, text: '28' })), richtig: false,
    ex: 'Die Maßlinie der 22 liegt nur 6 mm über der Werkstückoberkante. Der Abstand zur Körperkante muss 10 mm betragen.' },
];

// Fehlersuche: U-förmiges Werkstück mit 5 Fehlern, Klickbereiche in mm
const FEHLERSUCHE = {
  svg: () => TZ.svg('-20 -28 94 76',
    TZ.body('M0,0 H20 V15 H40 V0 H60 V30 H0 Z', true) +
    TZ.dimH({ x1: 20, x2: 40, y1: 15, y2: 15, yd: -10, text: '20', below: true }) +
    TZ.dimH({ x1: 40, x2: 60, y1: 0, yd: -10, text: '20', openArrows: true }) +
    TZ.dimH({ x1: 0, x2: 60, y1: 0, yd: -18, text: '60' }) +
    TZ.dimV({ y1: 0, y2: 30, x1: 0, xd: 0, text: '30', noExt: true }) +
    TZ.dimH({ x1: 0, x2: 60, y1: 30, yd: 40, text: '60', unit: true }),
    'Zeichnung mit Bemaßungsfehlern'),
  fehler: [
    { x: 21, y: -9, w: 18, h: 8, text: 'Die 20 der Nut steht unter der Maßlinie. Maßzahlen stehen mittig über der Maßlinie.' },
    { x: 41, y: -15, w: 18, h: 9, text: 'Die Maßpfeile der rechten 20 sind offen. Maßpfeile sind spitz und voll ausgemalt.' },
    { x: -2, y: -26, w: 64, h: 10, text: 'Die 60 steht oben und unten in der Zeichnung. Jedes Maß wird nur einmal eingetragen.' },
    { x: -8, y: -1, w: 9, h: 32, text: 'Die 30 wurde direkt an die Körperkante geschrieben – die Kante ist hier die Maßlinie. Die Maßlinie braucht 10 mm Abstand.' },
    { x: 16, y: 33, w: 28, h: 9, text: 'Unten steht „60 mm“. Die Einheit mm wird nicht geschrieben.' },
  ],
};

// Maße berechnen
const MASSE_RECHNEN = [
  { q: 'Wie breit ist der niedrige rechte Teil des Werkstücks (in mm)?', svg: () => zeichnungStufe(),
    loesung: 45, ex: 'Gesamtlänge minus hoher Teil: 70 − 25 = 45 mm.' },
  { q: 'Wie hoch ist die Stufe zwischen dem hohen und dem niedrigen Teil (in mm)?', svg: () => zeichnungStufe(),
    loesung: 16, ex: 'Gesamthöhe minus niedriger Teil: 30 − 14 = 16 mm.' },
  { q: 'Wie breit ist das rechte Stück neben der Nut (in mm)?',
    svg: () => TZ.svg('-20 -14 92 62', TZ.body('M0,0 H18 V12 H40 V0 H60 V28 H0 Z', true) +
      TZ.dimH({ x1: 0, x2: 18, y1: 0, yd: -10, text: '18' }) +
      TZ.dimH({ x1: 18, x2: 40, y1: 12, y2: 12, yd: -10, text: '22' }) +
      TZ.dimH({ x1: 0, x2: 60, y1: 28, yd: 38, text: '60' }) +
      TZ.dimV({ y1: 0, y2: 28, x1: 0, xd: -10, text: '28' })),
    loesung: 20, ex: '60 − 18 − 22 = 20 mm.' },
  { q: 'Wie weit sind die Mittelpunkte der beiden Bohrungen voneinander entfernt (in mm)?',
    svg: () => TZ.svg('-20 -26 116 62', TZ.body('M0,0 H80 V28 H0 Z') +
      '<circle class="k" cx="12" cy="14" r="3" fill="none"/><circle class="k" cx="68" cy="14" r="3" fill="none"/>' +
      TZ.center(7, 14, 17, 14) + TZ.center(12, 9, 12, 19) + TZ.center(63, 14, 73, 14) + TZ.center(68, 9, 68, 19) +
      TZ.dimH({ x1: 0, x2: 12, y1: 0, y2: 9, yd: -10, text: '12' }) +
      TZ.dimH({ x1: 68, x2: 80, y1: 9, y2: 0, yd: -10, text: '12' }) +
      TZ.dimH({ x1: 0, x2: 80, y1: 0, yd: -18, text: '80' }) +
      TZ.dimV({ y1: 0, y2: 28, x1: 0, xd: -10, text: '28' })),
    loesung: 56, ex: '80 − 12 − 12 = 56 mm.' },
  { q: 'Wie breit ist die Vertiefung in der Mitte (in mm)?',
    svg: () => TZ.svg('-20 -12 126 62', TZ.body('M0,0 H25 V10 H65 V0 H90 V20 H0 Z', true) +
      TZ.dimH({ x1: 0, x2: 25, y1: 20, yd: 30, text: '25' }) +
      TZ.dimH({ x1: 65, x2: 90, y1: 20, yd: 30, text: '25' }) +
      TZ.dimH({ x1: 0, x2: 90, y1: 20, yd: 38, text: '90' }) +
      TZ.dimV({ y1: 0, y2: 20, x1: 0, xd: -10, text: '20' })),
    loesung: 40, ex: '90 − 25 − 25 = 40 mm.' },
];

const QUIZ_BOHRUNG = [
  { q: 'Was bedeutet die Angabe „Ø6, 20 tief“?',
    a: ['Ein Loch mit 6 mm Durchmesser, 20 mm tief', 'Ein Loch, 20 mm breit und 6 mm tief', '6 Löcher im Abstand von 20 mm', 'Bohrer Nr. 6, Drehzahl 20'],
    ex: 'Ø6 ist der Durchmesser, „20 tief“ die Bohrtiefe. Es ist ein Sackloch.' },
  { q: 'In der Zeichnung steht „Ø10“ und die Bohrung geht ganz durch das Brett. Welchen Bohrer spannst du ein?',
    a: ['Einen 10-mm-Bohrer', 'Einen 5-mm-Bohrer', 'Einen 20-mm-Bohrer', 'Einen Kegelsenker'],
    ex: 'Ø gibt den Durchmesser an – also brauchst du einen Bohrer mit 10 mm Durchmesser.' },
  { q: 'Wie weit ist der Mittelpunkt der Bohrung vom unteren Rand entfernt?',
    svg: () => TZ.svg('-20 -22 84 60', TZ.body('M0,0 H50 V30 H0 Z') +
      '<circle class="k" cx="20" cy="18" r="5" fill="none"/>' + TZ.center(13, 18, 27, 18) + TZ.center(20, 11, 20, 25) +
      TZ.dimH({ x1: 0, x2: 20, y1: 0, y2: 13, yd: -10, text: '20' }) +
      TZ.dimV({ y1: 18, y2: 30, x1: 15, x2: 0, xd: -10, text: '12' })),
    a: ['12 mm', '20 mm', '18 mm', '30 mm'], ex: 'Das senkrechte Maß 12 geht vom unteren Rand bis zum Mittelpunkt.' },
  { q: 'Wie viele Maße brauchst du mindestens, um die Lage eines Lochmittelpunkts festzulegen?',
    a: ['Zwei – waagerecht und senkrecht', 'Eins – den Durchmesser', 'Drei', 'Keins – man sieht es ja'],
    ex: 'Ein Maß von links (oder rechts) und eines von unten (oder oben).' },
  { q: 'Ein Sackloch ist in der Ansicht von vorne nicht zu sehen. Wie zeichnest du es trotzdem ein?',
    a: ['Mit Strichlinien', 'Mit breiten Volllinien', 'Gar nicht', 'Mit Freihandlinien'],
    ex: 'Verdeckte Kanten werden als Strichlinien gezeichnet.' },
  { q: 'Mit welcher Linie zeichnest du das Kreuz in der Mitte einer Bohrung?',
    a: ['Schmale Strichpunktlinie', 'Breite Volllinie', 'Strichlinie', 'Freihandlinie'],
    ex: 'Mittellinien sind schmale Strichpunktlinien.' },
];

const QUIZ_ZEICHNUNGSARTEN = [
  { q: 'Ihr plant im Team einen Handyhalter und sammelt erste Ideen. Was zeichnet ihr?',
    a: ['Skizzen', 'Eine technische Zeichnung mit Schriftfeld', 'Eine Explosionszeichnung', 'Gar nichts'],
    ex: 'Für erste Ideen reichen schnelle Freihand-Skizzen.' },
  { q: 'Jemand soll dein Werkstück auf den Millimeter genau nachbauen. Was gibst du ihm?',
    a: ['Eine technische Zeichnung', 'Eine Skizze', 'Ein Foto', 'Eine Explosionszeichnung ohne Maße'],
    ex: 'Nur die technische Zeichnung enthält alle Maße eindeutig für die Fertigung.' },
  { q: 'In einer Bauanleitung sind alle Teile auseinandergezogen und nummeriert. Wie heißt diese Zeichnung?',
    a: ['Explosionszeichnung', 'Skizze', 'Abwicklung', 'Schnittzeichnung'],
    ex: 'Die Explosionszeichnung zeigt, wie die Teile zusammengebaut werden.' },
  { q: 'Woran erkennst du eine Skizze?',
    a: ['Sie ist freihand gezeichnet und nicht ganz genau.', 'Sie hat ein Schriftfeld und ist genau bemaßt.', 'Die Teile sind auseinandergezogen.', 'Sie ist immer farbig.'],
    ex: 'Skizzen zeichnet man schnell und ohne Lineal.' },
  { q: 'Was gehört NICHT in eine technische Zeichnung?',
    a: ['Bunte Schattierungen und Verzierungen', 'Maße', 'Mittellinien', 'Ein Schriftfeld'],
    ex: 'Technische Zeichnungen sind sachlich: Linien nach Norm, Maße und Schriftfeld.' },
  { q: 'Wozu dienen die Nummern in einer Explosionszeichnung?',
    a: ['Sie zeigen, welches Einzelteil gemeint ist (Positionsnummern).', 'Es sind die Maße in mm.', 'Sie zeigen die Reihenfolge beim Bemalen.', 'Sie geben die Seitenzahl an.'],
    ex: 'Mit den Positionsnummern findet man jedes Teil in der Stückliste wieder.' },
  { q: 'Im Schriftfeld steht „Maßstab 1:1“. Was bedeutet das?',
    a: ['Die Zeichnung ist so groß wie das echte Werkstück.', 'Die Zeichnung ist halb so groß.', 'Die Zeichnung ist doppelt so groß.', 'Es gibt nur ein Werkstück.'],
    ex: '1:1 heißt: 1 mm auf dem Papier = 1 mm in Wirklichkeit.' },
  { q: 'Auf einer Fläche in der Zeichnung siehst du schräge, parallele Linien. Was bedeutet das?',
    a: ['Hier wurde das Werkstück gedanklich aufgeschnitten (Schnittfläche).', 'Hier ist das Werkstück schmutzig.', 'Hier wird gebohrt.', 'Hier ist eine verdeckte Kante.'],
    ex: 'Die Schraffur kennzeichnet eine Schnittfläche.' },
  { q: 'Mit welcher Linie zeigst du, wo ein Werkstück geschnitten wurde?',
    a: ['Breite Strichpunktlinie', 'Schmale Volllinie', 'Strichlinie', 'Freihandlinie'],
    ex: 'Der Schnittverlauf wird mit einer breiten Strichpunktlinie gekennzeichnet.' },
];

// ---------- Tischbohrmaschine ----------

// Bauteile auf dem Bild (x/y = Position der Nummer)
const BAUTEILE = [
  { nr: 1, name: 'Fuß', x: 633, y: 925 },
  { nr: 2, name: 'Höhenverstellbarer Bohrtisch', x: 598, y: 695 },
  { nr: 3, name: 'Feststellhebel für die Höhenverstellung', x: 858, y: 720 },
  { nr: 4, name: 'Bohrer', x: 646, y: 576 },
  { nr: 5, name: 'Bohrfutter', x: 671, y: 522 },
  { nr: 6, name: 'Vorschubhebel', x: 784, y: 548 },
  { nr: 7, name: 'Elektromotor', x: 816, y: 420 },
  { nr: 8, name: 'Tiefenanschlag', x: 712, y: 338 },
  { nr: 9, name: 'An- und Ausschalter', x: 510, y: 392 },
  { nr: 10, name: 'Not-Aus-Schalter', x: 504, y: 345 },
  { nr: 11, name: 'Riemenscheiben (unter der Haube)', x: 850, y: 205 },
  { nr: 12, name: 'Maschinenschraubstock', x: 513, y: 1146 },
];

// Bild-Quiz: Welches Bauteil hat diese Aufgabe?
const BAUTEIL_AUFGABEN = [
  { nr: 10, q: 'Etwas Gefährliches passiert! Welchen Knopf drückst du sofort?' },
  { nr: 8, q: 'Dein Loch soll genau 15 mm tief werden. Wo stellst du das ein?' },
  { nr: 6, q: 'Mit welchem Teil senkst du den Bohrer ins Werkstück?' },
  { nr: 5, q: 'Welches Teil hält den Bohrer fest?' },
  { nr: 12, q: 'Worin spannst du dein Werkstück ein, damit es sich nicht mitdreht?' },
  { nr: 3, q: 'Der Bohrtisch hat die richtige Höhe. Womit stellst du ihn fest?' },
  { nr: 2, q: 'Auf welchem Teil liegt der Schraubstock beim Bohren?' },
  { nr: 1, q: 'Welches Teil sorgt dafür, dass die Maschine sicher steht und nicht kippt?' },
  { nr: 7, q: 'Welches Teil treibt die Maschine an?' },
  { nr: 11, q: 'Unter welcher Haube wird über einen Riemen die Drehzahl verändert?' },
  { nr: 9, q: 'Mit welchem Schalter startest und stoppst du die Maschine ganz normal?' },
  { nr: 4, q: 'Welches Teil schneidet das Loch ins Werkstück?' },
];

const SICHER_ODER_NICHT = [
  { s: 'Kim schiebt die Schutzbrille auf die Stirn, weil sie beschlägt, und bohrt weiter.', ok: false, ex: 'Gefährlich! Die Brille schützt nur vor den Augen. Lieber kurz abwischen.' },
  { s: 'Der Schraubstock ist zu, aber das Werkstück wackelt noch ein bisschen.', ok: false, ex: 'Gefährlich! Das Werkstück muss fest sitzen, sonst reißt der Bohrer es mit.' },
  { s: 'Paul wartet, bis der Bohrer stillsteht, bevor er das Werkstück herausnimmt.', ok: true, ex: 'Ein auslaufender Bohrer kann noch verletzen.' },
  { s: 'Mira krempelt die Ärmel hoch und bindet ihre Haare zusammen.', ok: true, ex: 'Nichts Loses kann sich im Bohrer verfangen.' },
  { s: 'Ein Schüler trägt dicke Gartenhandschuhe, um sich vor Spänen zu schützen.', ok: false, ex: 'Gefährlich! Handschuhe können vom Bohrer erfasst werden.' },
  { s: 'Lars lässt den Bohrfutterschlüssel stecken, damit er ihn nicht suchen muss.', ok: false, ex: 'Gefährlich! Beim Einschalten wird der Schlüssel weggeschleudert.' },
  { s: 'Der Bohrtisch ist mit dem Feststellhebel festgeklemmt.', ok: true, ex: 'So kann der Tisch beim Bohren nicht absacken.' },
  { s: 'Ayse unterhält sich beim Bohren mit dem Rücken zur Maschine.', ok: false, ex: 'Gefährlich! An der Maschine braucht man volle Aufmerksamkeit.' },
  { s: 'Ein verbogener Bohrer wird der Lehrkraft gezeigt statt benutzt.', ok: true, ex: 'Beschädigtes Werkzeug wird gemeldet und nicht benutzt.' },
  { s: 'Jan pustet die Späne mit dem Mund vom Werkstück.', ok: false, ex: 'Gefährlich! Die Späne fliegen ins Gesicht und in die Augen. Besser: Pinsel oder Handfeger.' },
  { s: 'Lina legt beim Durchbohren ein Restholz unter ihr Werkstück.', ok: true, ex: 'Das Opferbrett schützt Bohrtisch und Werkstück.' },
  { s: 'Finn probiert die Bohrmaschine schon mal aus, bevor die Einweisung war.', ok: false, ex: 'Gefährlich! Maschinen nur nach Einweisung und mit Freigabe.' },
  { s: 'Tom legt seine Armbanduhr vor der Arbeit in sein Fach.', ok: true, ex: 'Schmuck und Uhren können sich verfangen.' },
  { s: 'Der Bohrer wird mit voller Kraft ruckartig ins Metall gedrückt.', ok: false, ex: 'Falsch! Der Bohrer kann brechen. Gleichmäßig und mit wenig Druck bohren.' },
];

const QUIZ_SICHERHEIT = [
  { q: 'Der Bohrer verhakt sich und das Werkstück beginnt sich mitzudrehen. Was tust du?',
    a: ['Sofort den Not-Aus-Schalter drücken und zurücktreten', 'Das Werkstück mit der Hand festhalten', 'Schnell den Bohrer herausziehen', 'Abwarten, ob es von allein aufhört'],
    ex: 'Nie in eine laufende Maschine greifen – Not-Aus drücken und die Lehrkraft holen.' },
  { q: 'Beim Einspannen merkst du, dass der Bohrer verbogen ist. Was tust du?',
    a: ['Ihn nicht benutzen und der Lehrkraft Bescheid sagen', 'Vorsichtig damit bohren', 'Ihn geradebiegen', 'Ihn zurücklegen, ohne etwas zu sagen'],
    ex: 'Beschädigtes Werkzeug wird gemeldet – ein verbogener Bohrer kann brechen.' },
  { q: 'Du hast dich an einem Span leicht in den Finger geschnitten. Was tust du?',
    a: ['Der Lehrkraft Bescheid sagen und die Wunde versorgen lassen', 'Weiterarbeiten – ist ja nur klein', 'Selbst ein Pflaster aus der Tasche holen', 'Am Ende der Stunde Bescheid sagen'],
    ex: 'Jede Verletzung wird gemeldet und sofort behandelt.' },
  { q: 'Auf dem Bohrtisch liegen viele Späne. Wie entfernst du sie?',
    a: ['Maschine aus, Stillstand abwarten, dann mit Pinsel oder Handfeger', 'Bei laufender Maschine mit der Hand wegwischen', 'Wegpusten', 'Liegen lassen'],
    ex: 'Späne sind scharf. Nie mit der Hand oder dem Mund entfernen.' },
  { q: 'Du hast gerade den Bohrer gewechselt. Was musst du vor dem Einschalten unbedingt tun?',
    a: ['Den Bohrfutterschlüssel abziehen', 'Den Bohrer einölen', 'Den Bohrtisch ganz nach unten fahren', 'Die Schutzbrille abnehmen'],
    ex: 'Ein steckender Schlüssel wird beim Einschalten weggeschleudert.' },
  { q: 'Deine Freundin bietet an, dein Werkstück beim Bohren festzuhalten. Was sagst du?',
    a: ['Nein danke – ich spanne es im Maschinenschraubstock ein.', 'Gern, aber halt gut fest!', 'Ja, mit Handschuhen geht das.', 'Ja, wenn wir langsam bohren.'],
    ex: 'Werkstücke werden immer eingespannt, nie von Hand gehalten.' },
  { q: 'Du trägst einen Kapuzenpulli mit langen Bändeln. Was machst du vor dem Bohren?',
    a: ['Die Bändel sichern oder den Pulli ausziehen', 'Nichts, Bändel sind ungefährlich', 'Die Kapuze aufsetzen', 'Einfach etwas weiter weg stehen'],
    ex: 'Lose Bändel können vom Bohrer erfasst werden.' },
  { q: 'Du sollst mit einem dicken 10-mm-Bohrer in Metall bohren. Wie stellst du die Drehzahl ein?',
    a: ['Eher niedrig', 'So hoch wie möglich', 'Das ist egal', 'Erst hoch, dann ganz schnell runter'],
    ex: 'Faustregel: Je größer der Bohrer und je härter der Werkstoff, desto niedriger die Drehzahl.' },
  { q: 'Dein Bohrer rutscht beim Ansetzen immer neben die Markierung. Was hilft?',
    a: ['Den Mittelpunkt vorher mit dem Körner ankörnen', 'Fester drücken', 'Eine höhere Drehzahl', 'Das Werkstück festhalten'],
    ex: 'Die kleine Kuhle vom Körner führt die Bohrerspitze genau an die richtige Stelle.' },
  { q: 'Beim Durchbohren franst die Unterseite deines Bretts aus. Was machst du beim nächsten Loch anders?',
    a: ['Ein Opferbrett unterlegen', 'Schneller bohren', 'Das Brett umdrehen und von unten bohren', 'Einen Holzbohrer mit Senker nehmen'],
    ex: 'Das Opferbrett stützt die Fasern unten – das Loch reißt nicht aus.' },
  { q: 'Du bist mit dem Bohren fertig. Was ist der richtige Abschluss?',
    a: ['Maschine aus, Stillstand abwarten, Bohrer entnehmen, Platz reinigen', 'Maschine laufen lassen für den Nächsten', 'Werkstück rausnehmen, während der Bohrer ausläuft', 'Einfach gehen – die Lehrkraft räumt auf'],
    ex: 'Ein sauberer, sicherer Arbeitsplatz gehört zur Arbeit dazu.' },
];

// Werkstattordnung: Welche Regel wird verletzt?
const WERKSTATTORDNUNG = [
  { q: 'Elif trinkt an ihrem Werktisch eine Limo.',
    a: ['In der Werkstatt wird nicht gegessen und getrunken.', 'Lange Haare werden zusammengebunden.', 'Werkzeug wird sicher abgelegt.', 'Abfälle werden getrennt.'], ex: 'Essen und Trinken gehören nicht in die Werkstatt.' },
  { q: 'Noah geht schon mal allein in die Werkstatt – die Lehrkraft kommt ja gleich.',
    a: ['Die Werkstatt wird nur mit der Lehrkraft betreten.', 'Nicht unnötig umherlaufen.', 'Jede Verletzung melden.', 'Sicherheitskennzeichen beachten.'], ex: 'Ohne Lehrkraft bleibt die Werkstatt zu.' },
  { q: 'Can rennt quer durch den Raum, um als Erster an der Bohrmaschine zu sein.',
    a: ['In der Werkstatt läuft man nicht unnötig umher.', 'Maschinen nur nach Einweisung bedienen.', 'Schmuck ablegen.', 'Abfälle trennen.'], ex: 'Wer rennt, kann stolpern oder andere anstoßen.' },
  { q: 'Am Stundenende liegen Feilen und Späne noch auf dem Werktisch.',
    a: ['Den Arbeitsplatz gründlich reinigen und alles ordentlich ablegen.', 'Nicht essen und trinken.', 'Haare zusammenbinden.', 'Not-Aus-Schalter kennen.'], ex: 'Jeder hinterlässt seinen Platz sauber und sicher.' },
  { q: 'Der Hammerstiel von Ida ist gesplittert. Sie arbeitet trotzdem weiter.',
    a: ['Werkzeug vor der Arbeit prüfen und Schäden der Lehrkraft melden.', 'Nicht unnötig umherlaufen.', 'Mülltrennung beachten.', 'Werkstatt nur mit Lehrkraft betreten.'], ex: 'Beschädigtes Werkzeug kann Verletzungen verursachen.' },
  { q: 'Sami hat sich leicht geschnitten und klebt heimlich ein eigenes Pflaster drauf.',
    a: ['Jede Verletzung wird der Lehrkraft gemeldet.', 'Werkzeug sicher ablegen.', 'Nicht essen und trinken.', 'Sicherheitskennzeichen beachten.'], ex: 'Auch kleine Verletzungen müssen gemeldet und richtig versorgt werden.' },
  { q: 'Metallspäne und Holzreste landen alle zusammen im Papierkorb.',
    a: ['Abfälle werden nach Mülltrennung entsorgt.', 'Arbeitskleidung tragen.', 'Werkstatt nur mit Lehrkraft betreten.', 'Nicht unnötig umherlaufen.'], ex: 'Holz, Metall und Restmüll kommen in getrennte Behälter.' },
  { q: 'Tarek legt sein Cuttermesser mit offener Klinge an die Tischkante.',
    a: ['Werkzeuge werden sicher und geordnet abgelegt.', 'Haare zusammenbinden.', 'Nicht essen und trinken.', 'Abfälle trennen.'], ex: 'Offene Klingen an der Kante: Jemand kann hineingreifen oder es fällt herunter.' },
  { q: 'Lea weiß im Notfall nicht, wo der Verbandskasten hängt.',
    a: ['Man muss wissen, wo Verbandskasten und Not-Aus-Schalter sind.', 'Werkzeug prüfen.', 'Nicht unnötig umherlaufen.', 'Schmuck ablegen.'], ex: 'Im Notfall zählt jede Sekunde.' },
  { q: 'Jana arbeitet an der Werkbank mit ihrem langen Armband.',
    a: ['Armbanduhr und Schmuck werden vor der Arbeit abgelegt.', 'Nicht essen und trinken.', 'Mülltrennung beachten.', 'Werkstatt nur mit Lehrkraft betreten.'], ex: 'Schmuck kann hängen bleiben – besonders an Maschinen.' },
];

const QUIZ_BOHRLOCH = [
  { q: 'Welche Lochart siehst du im Querschnitt?', svg: () => zeichnungBohrloch('sack'),
    a: ['Sackloch', 'Durchgangsloch', 'Senkloch'], ex: 'Das Loch endet im Werkstück – unten bleibt die Spitze des Bohrers.' },
  { q: 'Welche Lochart siehst du im Querschnitt?', svg: () => zeichnungBohrloch('senk'),
    a: ['Senkloch', 'Sackloch', 'Durchgangsloch'], ex: 'Oben ist der Kegel für den Schraubenkopf.' },
  { q: 'Welche Lochart siehst du im Querschnitt?', svg: () => zeichnungBohrloch('durchgang'),
    a: ['Durchgangsloch', 'Sackloch', 'Senkloch'], ex: 'Das Loch ist oben und unten offen.' },
  { q: 'Ein Holz-Schlüsselanhänger braucht ein Loch für den Schlüsselring. Welche Lochart?',
    a: ['Durchgangsloch', 'Sackloch', 'Senkloch'], ex: 'Der Ring muss ganz hindurch passen.' },
  { q: 'Eine Stange soll 20 mm tief in einen Holzklotz gesteckt werden. Unten soll man nichts sehen. Welche Lochart?',
    a: ['Sackloch', 'Durchgangsloch', 'Senkloch'], ex: 'Das Sackloch endet in der gewünschten Tiefe.' },
  { q: 'Ein Türschild wird mit Senkkopfschrauben befestigt. Die Köpfe sollen nicht überstehen. Welche Lochart?',
    a: ['Senkloch', 'Sackloch', 'Durchgangsloch'], ex: 'Im Senkloch liegt der Schraubenkopf bündig.' },
  { q: 'Wie entsteht ein Senkloch?',
    a: ['Erst ein Loch bohren, dann mit dem Kegelsenker senken', 'Erst senken, dann bohren', 'Nur mit dem Kegelsenker', 'Mit einem sehr dicken Bohrer'],
    ex: 'Zuerst wird gebohrt, danach wird der Kegel für den Schraubenkopf gesenkt.' },
  { q: 'Wie sorgst du dafür, dass ein Sackloch genau 15 mm tief wird?',
    a: ['Mit dem Tiefenanschlag', 'Nach Gefühl', 'Mit einer höheren Drehzahl', 'Mit dem Feststellhebel'],
    ex: 'Der Tiefenanschlag begrenzt, wie weit der Bohrer nach unten fährt.' },
];

const QUIZ_BOHRER = [
  { q: 'Welcher Bohrer ist das?', svg: () => zeichnungBohrer('holz'),
    a: ['Holzbohrer', 'Stahlbohrer (Spiralbohrer)', 'Kegelsenker'], ex: 'Zentrierspitze in der Mitte, Vorschneider am Rand.' },
  { q: 'Welcher Bohrer ist das?', svg: () => zeichnungBohrer('stahl'),
    a: ['Stahlbohrer (Spiralbohrer)', 'Holzbohrer', 'Kegelsenker'], ex: 'Kegelförmige Spitze (118°).' },
  { q: 'Welches Werkzeug ist das?', svg: () => zeichnungBohrer('senker'),
    a: ['Kegelsenker', 'Holzbohrer', 'Stahlbohrer (Spiralbohrer)'], ex: 'Kegelförmiger Kopf zum Senken und Entgraten.' },
  { q: 'Du willst in eine Kiefernleiste ein sauberes Loch für einen Rundstab bohren. Welcher Bohrer?',
    a: ['Holzbohrer', 'Stahlbohrer', 'Kegelsenker'], ex: 'Die Vorschneider schneiden die Holzfasern sauber an.' },
  { q: 'Das Loch in deiner Aluplatte hat scharfe, raue Kanten (Grat). Womit entfernst du sie?',
    a: ['Mit dem Kegelsenker', 'Mit dem Holzbohrer', 'Mit dem Körner', 'Mit Schleifpapier im Loch'],
    ex: 'Mit dem Kegelsenker wird das Loch kurz angesenkt – der Grat ist weg.' },
  { q: 'Welcher Teil des Holzbohrers sorgt dafür, dass er beim Ansetzen nicht wegrutscht?',
    a: ['Die Zentrierspitze', 'Die Vorschneider', 'Der Schaft', 'Die Spiralnut'],
    ex: 'Die Zentrierspitze sticht zuerst ins Holz und führt den Bohrer.' },
  { q: 'Du bohrst in eine Acrylglas-Platte (Kunststoff). Welchen Bohrer nimmst du?',
    a: ['Stahlbohrer (Spiralbohrer)', 'Holzbohrer', 'Kegelsenker'], ex: 'Für Metall und Kunststoff nimmt man den Stahlbohrer.' },
  { q: 'Warum ist ein Holzbohrer für Metall ungeeignet?',
    a: ['Zentrierspitze und Vorschneider werden sofort stumpf oder brechen ab.', 'Er ist zu kurz.', 'Er passt nicht ins Bohrfutter.', 'Er dreht sich falsch herum.'],
    ex: 'Metall ist viel härter als Holz.' },
];

// Reihenfolge: Ein Durchgangsloch bohren
const ARBEITSSCHRITTE_UEBUNG = [
  { t: 'Bohrmittelpunkt anzeichnen', d: 'Mit Lineal und Anreißnadel bzw. Bleistift.' },
  { t: 'Ankörnen', d: 'Kleine Kuhle mit dem Körner.' },
  { t: 'Werkstück mit Opferbrett einspannen', d: 'Fest im Maschinenschraubstock.' },
  { t: 'Drehzahl einstellen', d: 'Passend zu Werkstoff und Bohrer.' },
  { t: 'Schutzbrille aufsetzen und Maschine einschalten', d: 'Nach Freigabe durch die Lehrkraft.' },
  { t: 'Bohren', d: 'Mit gleichmäßigem Vorschub.' },
  { t: 'Maschine ausschalten', d: 'Warten, bis der Bohrer stillsteht.' },
  { t: 'Entgraten und Arbeitsplatz säubern', d: 'Grat entfernen, Späne mit dem Pinsel wegfegen.' },
];

// Für die Lernkarten
const ARBEITSSCHRITTE = [
  { t: 'Anreißen', d: 'Bohrmittelpunkt mit Anreißnadel und Lineal anzeichnen.' },
  { t: 'Körnen', d: 'Mit dem Körner eine kleine Vertiefung schlagen.' },
  { t: 'Einspannen', d: 'Werkstück fest im Maschinenschraubstock sichern.' },
  { t: 'Drehzahl wählen', d: 'Passend zu Werkstoff und Bohrerdurchmesser einstellen.' },
  { t: 'Bohren', d: 'Mit gleichmäßigem Vorschub am Hebel bohren.' },
  { t: 'Entgraten', d: 'Scharfe Kanten am Loch mit Senker oder Feile entfernen.' },
];

// Für die Lernkarten (Linienarten-Tabelle)
const LINIENARTEN = [
  { links: 'breit', name: 'Volllinie, breit', rechts: 'Sichtbare Kanten und Umrisse' },
  { links: 'schmal', name: 'Volllinie, schmal', rechts: 'Maßlinien, Maßhilfslinien, Schraffur' },
  { links: 'freihand', name: 'Freihandlinie', rechts: 'Bruchlinien' },
  { links: 'strichpunkt', name: 'Strichpunktlinie, schmal', rechts: 'Mittellinien, Lochkreise' },
  { links: 'strich', name: 'Strichlinie', rechts: 'Verdeckte Kanten' },
  { links: 'strichpunktbreit', name: 'Strichpunktlinie, breit', rechts: 'Kennzeichnung des Schnittverlaufs' },
];
