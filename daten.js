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
    a: ['Maßhilfslinie', 'Maßlinie', 'Hinweislinie', 'Mittellinie'],
    ex: 'Maßhilfslinien verlängern die Körperkanten nach außen.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe([null, 'line']),
    a: ['Maßlinie', 'Maßhilfslinie', 'Hinweislinie', 'Körperkante'],
    ex: 'Die Maßlinie liegt parallel zur bemaßten Kante – hier senkrecht neben dem Werkstück.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe([null, 'num']),
    a: ['Maßzahl', 'Positionsnummer', 'Maßstabsangabe', 'Stückzahl'],
    ex: 'Die Maßzahl 14 gibt die Höhe in mm an. Sie ist von rechts lesbar.' },
  { q: 'Wie heißt das orange markierte Element?', svg: () => zeichnungStufe(['arrow']),
    a: ['Maßpfeil', 'Hinweispfeil', 'Schnittpfeil', 'Richtungspfeil'],
    ex: 'Die Spitze des Maßpfeils berührt die Maßhilfslinie.' },
  { q: 'Mia schreibt „35 mm“ an ihre Maßlinie. Was sagst du ihr?',
    a: ['Lass „mm“ weg – Maße werden ohne Einheit eingetragen.', 'Schreib „35mm“ – ohne Leerzeichen ist es normgerecht.', 'Schreib „3,5“ – Maße werden in cm eingetragen.', 'Das stimmt so – die Einheit gehört immer dazu.'],
    ex: 'Alle Maße sind in mm. Deshalb wird die Einheit nicht dazugeschrieben.' },
  { q: 'Ben zeichnet die Maßlinie direkt auf die Körperkante, um Platz zu sparen. Ist das erlaubt?',
    a: ['Nein – die Maßlinie braucht etwa 10 mm Abstand zur Kante.', 'Nein – die Maßlinie braucht etwa 20 mm Abstand zur Kante.', 'Ja – wenn wenig Platz ist, darf die Kante Maßlinie sein.', 'Ja – aber nur bei senkrechten Maßen.'],
    ex: 'Kanten dürfen nicht als Maßlinien benutzt werden. Die erste Maßlinie liegt 10 mm von der Kante entfernt.' },
  { q: 'Die erste Maßlinie liegt 10 mm von der Kante entfernt. Wie weit ist die zweite Maßlinie mindestens von der Kante weg?',
    a: ['18 mm', '12 mm', '15 mm', '20 mm'],
    ex: '10 mm bis zur ersten Maßlinie plus mindestens 8 mm Abstand = 18 mm.' },
  { q: 'Ein Werkstück hat ein Gesamtmaß von 80 und ein Teilmaß von 30. Welches Maß liegt näher an der Körperkante?',
    a: ['Das Teilmaß 30', 'Das Gesamtmaß 80', 'Beide auf derselben Maßlinie', 'Das Maß, das zuerst gezeichnet wird'],
    ex: 'Kleine Maße innen, große außen – so kreuzen Maßhilfslinien keine Maßlinien.' },
  { q: 'Warum zeichnet man die kleinen Maße innen und die großen außen?',
    a: ['Damit sich Maßhilfslinien und Maßlinien nicht kreuzen.', 'Damit alle Maßlinien 10 mm Abstand zur Kante haben.', 'Damit man die Teilmaße leichter zusammenrechnen kann.', 'Damit kleine Maßzahlen nicht zu weit vom Werkstück stehen.'],
    ex: 'Würde das große Maß innen liegen, müsste eine Maßhilfslinie die innere Maßlinie durchkreuzen.' },
  { q: 'Lukas lässt die Maßhilfslinien genau an der Maßlinie enden. Was fehlt?',
    a: ['Ein Überstand von etwa 2 mm über die Maßlinie', 'Ein Überstand von etwa 10 mm über die Maßlinie', 'Ein kleiner Querstrich am Ende der Maßhilfslinie', 'Nichts – Maßhilfslinien enden an der Maßlinie'],
    ex: 'Maßhilfslinien stehen etwa 2 mm über die Maßlinie hinaus.' },
  { q: 'Welche Schreibweise ist in einer technischen Zeichnung richtig?',
    a: ['45', '45 mm', '45,0', '4,5'],
    ex: 'Nur die Zahl in mm – ohne Einheit und ohne überflüssige Nachkommastelle.' },
  { q: 'Zwischen zwei Maßhilfslinien sind nur 4 mm Platz. Was machst du mit den Maßpfeilen?',
    a: ['Ich setze sie von außen an die Maßhilfslinien.', 'Ich zeichne sie halb so groß, damit sie hineinpassen.', 'Ich lasse sie weg und schreibe nur die Maßzahl hin.', 'Ich zeichne nur einen Pfeil auf einer Seite.'],
    ex: 'Bei wenig Platz werden die Pfeile von außen angesetzt.' },
  { q: 'Welcher Stift eignet sich am besten zum Bemaßen?',
    a: ['Ein harter, spitzer Bleistift (z. B. 2H)', 'Ein weicher, spitzer Bleistift (z. B. 2B)', 'Ein schwarzer Fineliner (0,5 mm)', 'Ein harter, stumpfer Bleistift (z. B. 4H)'],
    ex: 'Ein harter, spitzer Bleistift macht dünne, saubere Linien – und man kann radieren.' },
  { q: 'Warum wird jedes Maß nur einmal in die Zeichnung eingetragen?',
    a: ['Bei Änderungen vergisst man sonst eine Stelle.', 'Weil eine zweite Maßzahl auf dem Kopf stehen müsste.', 'Weil doppelte Maße das Gesamtmaß verfälschen.', 'Weil jede Kante nur eine Maßhilfslinie haben darf.'],
    ex: 'Doppelte Maße machen die Zeichnung unübersichtlich und können sich nach Änderungen widersprechen.' },
  { q: 'Welche Aussage über Maßpfeile stimmt?',
    a: ['Spitz (ca. 15°), ausgefüllt, an beiden Enden', 'Spitz (ca. 15°), offen, an beiden Enden', 'Stumpf (ca. 90°), ausgefüllt, an beiden Enden', 'Spitz (ca. 15°), ausgefüllt, nur an einem Ende'],
    ex: 'An beiden Enden der Maßlinie sitzt ein spitzer (15°), voll ausgemalter Pfeil.' },
  { q: 'Mit welcher Linienart zeichnest du Maßhilfslinien?',
    a: ['Schmale Volllinie', 'Breite Volllinie', 'Schmale Strichlinie', 'Schmale Strichpunktlinie'],
    ex: 'Maßlinien und Maßhilfslinien sind schmale Volllinien.' },
  { q: 'Wo stehen die Maße in der Regel?',
    a: ['Außerhalb der Werkstückfläche', 'Innerhalb der Werkstückfläche', 'Gesammelt im Schriftfeld', 'Nur unter und rechts vom Werkstück'],
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
    a: ['Durchmesser 6 mm, Bohrtiefe 20 mm', 'Radius 6 mm, Bohrtiefe 20 mm', 'Durchmesser 20 mm, Bohrtiefe 6 mm', 'Durchmesser 6 mm, 20 mm vom Rand'],
    ex: 'Ø6 ist der Durchmesser, „20 tief“ die Bohrtiefe. Es ist ein Sackloch.' },
  { q: 'In der Zeichnung steht „Ø10“ und die Bohrung geht ganz durch das Brett. Welchen Bohrer spannst du ein?',
    a: ['Einen Bohrer mit 10 mm Durchmesser', 'Einen Bohrer mit 5 mm Durchmesser', 'Einen Bohrer mit 20 mm Durchmesser', 'Einen Bohrer mit 9 mm Durchmesser'],
    ex: 'Ø gibt den Durchmesser an – also brauchst du einen Bohrer mit 10 mm Durchmesser.' },
  { q: 'Wie weit ist der Mittelpunkt der Bohrung vom unteren Rand entfernt?',
    svg: () => TZ.svg('-20 -22 84 60', TZ.body('M0,0 H50 V30 H0 Z') +
      '<circle class="k" cx="20" cy="18" r="5" fill="none"/>' + TZ.center(13, 18, 27, 18) + TZ.center(20, 11, 20, 25) +
      TZ.dimH({ x1: 0, x2: 20, y1: 0, y2: 13, yd: -10, text: '20' }) +
      TZ.dimV({ y1: 18, y2: 30, x1: 15, x2: 0, xd: -10, text: '12' })),
    a: ['12 mm', '20 mm', '18 mm', '7 mm'], ex: 'Das senkrechte Maß 12 geht vom unteren Rand bis zum Mittelpunkt.' },
  { q: 'Wie viele Maße brauchst du mindestens, um die Lage eines Lochmittelpunkts festzulegen?',
    a: ['Zwei – waagerecht und senkrecht', 'Eins – zur nächsten Kante', 'Drei – zwei Abstände und den Durchmesser', 'Vier – zu jeder Kante einen'],
    ex: 'Ein Maß von links (oder rechts) und eines von unten (oder oben). Der Durchmesser bestimmt die Größe, nicht die Lage.' },
  { q: 'Ein Sackloch ist in der Ansicht von vorne nicht zu sehen. Wie zeichnest du es trotzdem ein?',
    a: ['Mit schmalen Strichlinien', 'Mit schmalen Strichpunktlinien', 'Mit schmalen Volllinien', 'Mit Freihandlinien'],
    ex: 'Verdeckte Kanten werden als Strichlinien gezeichnet.' },
  { q: 'Mit welcher Linie zeichnest du das Kreuz in der Mitte einer Bohrung?',
    a: ['Schmale Strichpunktlinie', 'Breite Strichpunktlinie', 'Schmale Strichlinie', 'Schmale Volllinie'],
    ex: 'Mittellinien sind schmale Strichpunktlinien. Die breite Strichpunktlinie kennzeichnet den Schnittverlauf.' },
];

const QUIZ_ZEICHNUNGSARTEN = [
  { q: 'Ihr plant im Team einen Handyhalter und sammelt erste Ideen. Was zeichnet ihr?',
    a: ['Skizzen', 'Eine technische Zeichnung', 'Eine Explosionszeichnung', 'Eine Stückliste'],
    ex: 'Für erste Ideen reichen schnelle Freihand-Skizzen.' },
  { q: 'Jemand soll dein Werkstück auf den Millimeter genau nachbauen. Was gibst du ihm?',
    a: ['Eine bemaßte technische Zeichnung', 'Eine Explosionszeichnung mit Positionsnummern', 'Ein Foto mit einem Lineal daneben', 'Eine Stückliste mit allen Einzelteilen'],
    ex: 'Nur die technische Zeichnung enthält alle Maße eindeutig für die Fertigung.' },
  { q: 'In einer Bauanleitung sind alle Teile auseinandergezogen und nummeriert. Wie heißt diese Zeichnung?',
    a: ['Explosionszeichnung', 'Schnittzeichnung', 'Abwicklung', 'Gesamtzeichnung'],
    ex: 'Die Explosionszeichnung zeigt, wie die Teile zusammengebaut werden.' },
  { q: 'Woran erkennst du eine Skizze?',
    a: ['Sie ist freihand gezeichnet und nicht maßstäblich genau.', 'Sie ist mit Lineal gezeichnet, hat aber kein Schriftfeld.', 'Die Teile sind auseinandergezogen und nummeriert.', 'Sie zeigt das Werkstück immer aus drei Ansichten.'],
    ex: 'Skizzen zeichnet man schnell und ohne Lineal.' },
  { q: 'Was gehört NICHT in eine technische Zeichnung?',
    a: ['Die Einheit „mm“ hinter den Maßen', 'Ein Schriftfeld mit Maßstab', 'Mittellinien durch Bohrungen', 'Strichlinien für verdeckte Kanten'],
    ex: 'Alle Maße sind in mm – die Einheit wird deshalb nicht geschrieben.' },
  { q: 'Wozu dienen die Nummern in einer Explosionszeichnung?',
    a: ['Sie verweisen auf die Teile in der Stückliste.', 'Sie geben die Maße der Teile in mm an.', 'Sie zeigen, wie viele gleiche Teile es gibt.', 'Sie zeigen die Reihenfolge der Fertigung.'],
    ex: 'Mit den Positionsnummern findet man jedes Teil in der Stückliste wieder.' },
  { q: 'Im Schriftfeld steht „Maßstab 1:1“. Was bedeutet das?',
    a: ['Die Zeichnung ist so groß wie das Werkstück.', 'Die Zeichnung ist halb so groß wie das Werkstück.', 'Die Zeichnung ist doppelt so groß wie das Werkstück.', '1 cm in der Zeichnung sind 1 m in Wirklichkeit.'],
    ex: '1:1 heißt: 1 mm auf dem Papier = 1 mm in Wirklichkeit.' },
  { q: 'Ein 80 mm langes Werkstück wird im Maßstab 1:2 gezeichnet. Welche Maßzahl schreibst du an die Kante?',
    a: ['80', '40', '160', '82'],
    ex: 'Die Zeichnung ist zwar nur 40 mm lang, aber die Maßzahl gibt immer das echte Maß des Werkstücks an.' },
  { q: 'Auf einer Fläche in der Zeichnung siehst du schräge, parallele Linien. Was bedeutet das?',
    a: ['Hier ist eine Schnittfläche.', 'Hier ist eine schräge Fläche (Fase).', 'Diese Fläche wird später lackiert.', 'Hier ist eine verdeckte Fläche.'],
    ex: 'Die Schraffur kennzeichnet eine Schnittfläche – das Werkstück wurde gedanklich aufgeschnitten.' },
  { q: 'Mit welcher Linie zeigst du, wo ein Werkstück geschnitten wurde?',
    a: ['Breite Strichpunktlinie', 'Schmale Strichpunktlinie', 'Breite Strichlinie', 'Breite Volllinie'],
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
  { nr: 6, name: 'Tiefenanschlag', x: 784, y: 548 },
  { nr: 7, name: 'Elektromotor', x: 816, y: 420 },
  { nr: 8, name: 'Vorschubhebel', x: 712, y: 338 },
  { nr: 9, name: 'An- und Ausschalter', x: 510, y: 392 },
  { nr: 10, name: 'Not-Aus-Schalter', x: 504, y: 345 },
  { nr: 11, name: 'Riemenscheiben (unter der Haube)', x: 850, y: 205 },
  { nr: 12, name: 'Maschinenschraubstock', x: 513, y: 1146 },
];

// Bild-Quiz: Welches Bauteil hat diese Aufgabe?
const BAUTEIL_AUFGABEN = [
  { nr: 10, q: 'Etwas Gefährliches passiert! Welchen Knopf drückst du sofort?' },
  { nr: 6, q: 'Dein Loch soll genau 15 mm tief werden. Wo stellst du das ein?' },
  { nr: 8, q: 'Mit welchem Teil senkst du den Bohrer ins Werkstück?' },
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
  { s: 'Ole trägt eng anliegende Arbeitshandschuhe, damit er sich nicht an Spänen schneidet.', ok: false, ex: 'Gefährlich! Auch enge Handschuhe können vom Bohrer erfasst werden. An der Bohrmaschine trägt man keine Handschuhe.' },
  { s: 'Lars lässt den Bohrfutterschlüssel stecken, damit er ihn nicht suchen muss.', ok: false, ex: 'Gefährlich! Beim Einschalten wird der Schlüssel weggeschleudert.' },
  { s: 'Der Bohrtisch ist mit dem Feststellhebel festgeklemmt.', ok: true, ex: 'So kann der Tisch beim Bohren nicht absacken.' },
  { s: 'Ayse dreht sich kurz zu ihrer Nachbarin um, während der Bohrer noch ausläuft.', ok: false, ex: 'Gefährlich! Solange sich der Bohrer dreht, bleibt die Aufmerksamkeit an der Maschine.' },
  { s: 'Ein verbogener Bohrer wird der Lehrkraft gezeigt statt benutzt.', ok: true, ex: 'Beschädigtes Werkzeug wird gemeldet und nicht benutzt.' },
  { s: 'Jan pustet die Späne mit dem Mund vom Werkstück.', ok: false, ex: 'Gefährlich! Die Späne fliegen ins Gesicht und in die Augen. Besser: Pinsel oder Handfeger.' },
  { s: 'Lina legt beim Durchbohren ein Restholz unter ihr Werkstück.', ok: true, ex: 'Das Opferbrett schützt Bohrtisch und Werkstück.' },
  { s: 'Finn probiert die Bohrmaschine schon mal aus, bevor die Einweisung war.', ok: false, ex: 'Gefährlich! Maschinen nur nach Einweisung und mit Freigabe.' },
  { s: 'Tom legt seine Armbanduhr vor der Arbeit in sein Fach.', ok: true, ex: 'Schmuck und Uhren können sich verfangen.' },
  { s: 'Kai drückt bei einem dünnen 3-mm-Bohrer kräftig auf den Hebel, damit es schneller geht.', ok: false, ex: 'Gefährlich! Dünne Bohrer brechen schnell. Gleichmäßig und mit wenig Druck bohren.' },
  { s: 'Lena stellt für einen 10-mm-Bohrer in Stahl eine niedrige Drehzahl ein.', ok: true, ex: 'Richtig: großer Bohrer und harter Werkstoff – niedrige Drehzahl.' },
  { s: 'Mehmet bindet seine langen Haare zusammen, lässt aber die Kette unter dem Pulli an.', ok: false, ex: 'Gefährlich! Ketten können herausrutschen und sich verfangen. Schmuck wird abgelegt.' },
];

const QUIZ_SICHERHEIT = [
  { q: 'Der Bohrer verhakt sich und das Werkstück beginnt sich mitzudrehen. Was tust du?',
    a: ['Not-Aus drücken und zurücktreten', 'Vorschubhebel schnell nach oben ziehen', 'Bohrtisch lösen, damit er nachgibt', 'Drehzahl sofort herunterschalten'],
    ex: 'Nie in eine laufende Maschine greifen oder an ihr herumstellen – Not-Aus drücken und die Lehrkraft holen.' },
  { q: 'Beim Einspannen merkst du, dass der Bohrer leicht verbogen ist. Was tust du?',
    a: ['Nicht benutzen und der Lehrkraft melden', 'Mit niedriger Drehzahl vorsichtig bohren', 'Tiefer ins Bohrfutter spannen, damit er nicht schlägt', 'Nur noch für weiches Holz verwenden'],
    ex: 'Beschädigtes Werkzeug wird gemeldet – ein verbogener Bohrer kann brechen.' },
  { q: 'Du hast dich an einem Span leicht in den Finger geschnitten. Was tust du?',
    a: ['Sofort der Lehrkraft melden', 'Auswaschen, Pflaster drauf, weiterarbeiten', 'Erst den Arbeitsschritt beenden, dann melden', 'Nur melden, wenn es stark blutet'],
    ex: 'Jede Verletzung wird sofort gemeldet und versorgt – auch kleine.' },
  { q: 'Auf dem Bohrtisch liegen viele Späne. Wie entfernst du sie?',
    a: ['Ausschalten, Stillstand abwarten, mit Pinsel abfegen', 'Bei laufender Maschine vorsichtig mit Pinsel abfegen', 'Ausschalten und sofort mit dem Pinsel abfegen', 'Ausschalten, Stillstand abwarten, mit der Hand abwischen'],
    ex: 'Erst wenn alles stillsteht – und nie mit der Hand, denn Späne sind scharf.' },
  { q: 'Du hast gerade den Bohrer gewechselt. Was musst du vor dem Einschalten unbedingt tun?',
    a: ['Den Bohrfutterschlüssel abziehen', 'Die Drehzahl auf die höchste Stufe stellen', 'Den Bohrtisch ganz nach unten fahren', 'Den Tiefenanschlag ganz öffnen'],
    ex: 'Ein steckender Schlüssel wird beim Einschalten weggeschleudert.' },
  { q: 'Deine Freundin bietet an, dein Werkstück beim Bohren festzuhalten. Was sagst du?',
    a: ['Nein – es kommt in den Schraubstock.', 'Ja – wenn sie dabei Arbeitshandschuhe trägt.', 'Ja – wenn wir mit niedriger Drehzahl bohren.', 'Nur, wenn es nicht in den Schraubstock passt.'],
    ex: 'Werkstücke werden immer eingespannt, nie von Hand gehalten – auch nicht kleine.' },
  { q: 'Du trägst einen Kapuzenpulli mit langen Bändeln. Was machst du vor dem Bohren?',
    a: ['Bändel sichern oder den Pulli ausziehen', 'Die Kapuze aufsetzen, damit die Bändel hinten hängen', 'Mit etwas mehr Abstand zur Maschine arbeiten', 'Die Ärmel hochkrempeln – das reicht'],
    ex: 'Lose Bändel können vom Bohrer erfasst werden.' },
  { q: 'Du sollst mit einem dicken 10-mm-Bohrer in Metall bohren. Wie stellst du die Drehzahl ein?',
    a: ['Eher niedrig', 'Eher hoch', 'Immer die mittlere Stufe', 'Erst niedrig, dann möglichst hoch'],
    ex: 'Faustregel: Je größer der Bohrer und je härter der Werkstoff, desto niedriger die Drehzahl.' },
  { q: 'Dein Bohrer rutscht beim Ansetzen immer neben die Markierung. Was hilft?',
    a: ['Den Mittelpunkt vorher ankörnen', 'Mit höherer Drehzahl anbohren', 'Zuerst mit dem Kegelsenker anbohren', 'Mit mehr Druck auf den Hebel ansetzen'],
    ex: 'Die kleine Kuhle vom Körner führt die Bohrerspitze genau an die richtige Stelle.' },
  { q: 'Beim Durchbohren franst die Unterseite deines Bretts aus. Was machst du beim nächsten Loch anders?',
    a: ['Ein Opferbrett unterlegen', 'Mit mehr Druck schnell durchbohren', 'Einen Stahlbohrer nehmen', 'Den Tiefenanschlag einstellen'],
    ex: 'Das Opferbrett stützt die Fasern unten – das Loch reißt nicht aus.' },
  { q: 'Du bist mit dem Bohren fertig. Welche Reihenfolge ist richtig?',
    a: ['Ausschalten – Stillstand abwarten – Werkstück entnehmen – Platz säubern', 'Ausschalten – Werkstück entnehmen – Stillstand abwarten – Platz säubern', 'Werkstück entnehmen – ausschalten – Stillstand abwarten – Platz säubern', 'Ausschalten – Platz säubern – Stillstand abwarten – Werkstück entnehmen'],
    ex: 'Erst wenn der Bohrer stillsteht, wird etwas aus der Maschine genommen oder gesäubert.' },
];

// Werkstattordnung: Welche Regel wird verletzt?
const WERKSTATTORDNUNG = [
  { q: 'Elif trinkt an ihrem Werktisch eine Limo.',
    a: ['Essen und Trinken sind verboten.', 'Werkzeuge werden sicher abgelegt.', 'Taschen gehören nicht an den Arbeitsplatz.', 'Abfälle werden getrennt entsorgt.'], ex: 'Essen und Trinken gehören nicht in die Werkstatt.' },
  { q: 'Noah geht schon mal allein in die Werkstatt – die Lehrkraft kommt ja gleich.',
    a: ['Die Werkstatt wird nur mit der Lehrkraft betreten.', 'Maschinen werden nur nach Einweisung bedient.', 'In der Werkstatt wird nicht herumgelaufen.', 'Arbeitskleidung wird vor Arbeitsbeginn angezogen.'], ex: 'Ohne Lehrkraft bleibt die Werkstatt zu – auch wenn man noch nichts anfasst.' },
  { q: 'Can rennt quer durch den Raum, um als Erster an der Bohrmaschine zu sein.',
    a: ['In der Werkstatt wird nicht herumgelaufen.', 'Maschinen werden nur nach Einweisung bedient.', 'Sicherheitszeichen werden beachtet.', 'Es arbeitet immer nur eine Person an einer Maschine.'], ex: 'Wer rennt, kann stolpern oder andere anstoßen.' },
  { q: 'Am Stundenende liegen Feilen und Späne noch auf dem Werktisch.',
    a: ['Der Arbeitsplatz wird aufgeräumt.', 'Werkzeug wird vor der Arbeit geprüft.', 'Abfälle werden getrennt entsorgt.', 'Werkzeuge werden sicher abgelegt.'], ex: 'Jede*r hinterlässt den Platz sauber und das Werkzeug an seinem Ort.' },
  { q: 'Der Hammerstiel von Ida ist gesplittert. Sie arbeitet trotzdem weiter.',
    a: ['Defektes Werkzeug wird nicht benutzt.', 'Werkzeuge werden sicher abgelegt.', 'Jede Verletzung wird gemeldet.', 'Werkzeug wird nach der Arbeit zurückgebracht.'], ex: 'Beschädigtes Werkzeug kann Verletzungen verursachen.' },
  { q: 'Sami hat sich leicht geschnitten und klebt heimlich ein eigenes Pflaster drauf.',
    a: ['Jede Verletzung wird der Lehrkraft gemeldet.', 'Man muss wissen, wo der Verbandskasten hängt.', 'Beschädigtes Werkzeug wird gemeldet.', 'Bei Gefahr wird der Not-Aus gedrückt.'], ex: 'Auch kleine Verletzungen müssen gemeldet und richtig versorgt werden.' },
  { q: 'Metallspäne und Holzreste landen alle zusammen im Papierkorb.',
    a: ['Abfälle werden getrennt entsorgt.', 'Der Arbeitsplatz wird sauber gehalten.', 'Späne werden nicht mit der Hand entfernt.', 'Reststücke werden zur Wiederverwendung gesammelt.'], ex: 'Holz, Metall und Restmüll kommen in getrennte Behälter.' },
  { q: 'Tarek legt sein Cuttermesser mit offener Klinge an die Tischkante.',
    a: ['Werkzeuge werden sicher abgelegt.', 'Beschädigtes Werkzeug wird gemeldet.', 'Werkzeug wird nach der Arbeit zurückgebracht.', 'Der Arbeitsplatz wird sauber gehalten.'], ex: 'Offene Klingen an der Kante: Jemand kann hineingreifen oder es fällt herunter.' },
  { q: 'Lea weiß im Notfall nicht, wo der Verbandskasten hängt.',
    a: ['Man weiß, wo der Verbandskasten ist.', 'Jede Verletzung wird der Lehrkraft gemeldet.', 'Taschen gehören nicht an den Arbeitsplatz.', 'Fluchtwege werden freigehalten.'], ex: 'Im Notfall zählt jede Sekunde.' },
  { q: 'Jana arbeitet an der Werkbank mit ihrem langen Armband.',
    a: ['Schmuck und Uhren werden vor der Arbeit abgelegt.', 'Lange Haare werden zusammengebunden.', 'Arbeitskleidung wird geschlossen getragen.', 'Bei Maschinenarbeit trägt man eine Schutzbrille.'], ex: 'Schmuck kann hängen bleiben – besonders an Maschinen.' },
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
    a: ['Erst bohren, dann mit dem Kegelsenker senken', 'Erst mit dem Kegelsenker senken, dann bohren', 'Nur mit dem Kegelsenker, ganz durch', 'Erst dick anbohren, dann dünn durchbohren'],
    ex: 'Zuerst wird gebohrt, danach wird der Kegel für den Schraubenkopf gesenkt.' },
  { q: 'Wie sorgst du dafür, dass ein Sackloch genau 15 mm tief wird?',
    a: ['Mit dem Tiefenanschlag', 'Mit dem Feststellhebel am Bohrtisch', 'Mit der passenden Drehzahl', 'Mit dem Vorschubhebel nach Augenmaß'],
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
    a: ['Mit dem Kegelsenker', 'Mit dem Holzbohrer', 'Mit dem Körner', 'Mit der Anreißnadel'],
    ex: 'Mit dem Kegelsenker wird das Loch kurz angesenkt – der Grat ist weg.' },
  { q: 'Welcher Teil des Holzbohrers sorgt dafür, dass er beim Ansetzen nicht wegrutscht?',
    a: ['Die Zentrierspitze', 'Die Vorschneider', 'Die Spiralnut', 'Der Schaft'],
    ex: 'Die Zentrierspitze sticht zuerst ins Holz und führt den Bohrer.' },
  { q: 'Du bohrst in eine Acrylglas-Platte (Kunststoff). Welchen Bohrer nimmst du?',
    a: ['Stahlbohrer (Spiralbohrer)', 'Holzbohrer', 'Kegelsenker'], ex: 'Für Metall und Kunststoff nimmt man den Stahlbohrer.' },
  { q: 'Warum ist ein Holzbohrer für Metall ungeeignet?',
    a: ['Spitze und Vorschneider werden im Metall sofort stumpf.', 'Er hat keine Spiralnut, deshalb bleiben die Späne im Loch.', 'Sein Schaft ist zu dünn und passt nicht ins Bohrfutter.', 'Er muss sehr schnell drehen – das ist für Metall zu heiß.'],
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
