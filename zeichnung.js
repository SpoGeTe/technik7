// Hilfsfunktionen für technische Zeichnungen.
// Alle Koordinaten sind in Millimetern – die SVG-Grafik skaliert automatisch.
const TZ = (() => {
  let uid = 0;
  const AL = 4.5;                                  // Pfeillänge (ca. 5 mm)
  const AW = AL * Math.tan(7.5 * Math.PI / 180);   // halbe Pfeilbreite (15°-Pfeil)
  const f = (n) => +n.toFixed(2);

  // hl: ein Teil orange hervorheben; farben: {ext, line, num, arrow} → CSS-Klassen
  const cls = (base, o, teil) => base + (o.hl === teil ? ' hl' : '') + (o.farben?.[teil] ? ' ' + o.farben[teil] : '');

  function line(x1, y1, x2, y2, c) {
    return `<line class="${c}" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
  }

  // Pfeilspitze bei (x,y), zeigt in Richtung (dx,dy)
  function arrow(x, y, dx, dy, o) {
    const w = o.openArrows ? AW * 3 : AW;
    const bx = x - dx * AL, by = y - dy * AL, px = -dy * w, py = dx * w;
    const pts = `M${f(bx + px)},${f(by + py)} L${f(x)},${f(y)} L${f(bx - px)},${f(by - py)}`;
    if (o.openArrows) return `<path class="${cls('t', o, 'arrow')}" d="${pts}" fill="none"/>`;
    return `<path class="${cls('ar', o, 'arrow')}" d="${pts} Z"/>`;
  }

  function label(o) { return o.text + (o.unit ? ' mm' : ''); }

  // Waagerechtes Maß. y1/y2: wo die Maßhilfslinien an der Körperkante beginnen, yd: Höhe der Maßlinie
  function dimH(o) {
    const y2 = o.y2 ?? o.y1;
    const over = o.noOver ? 0 : 2;
    const s1 = Math.sign(o.yd - o.y1) || -1, s2 = Math.sign(o.yd - y2) || -1;
    let g = '';
    if (!o.noExt) {
      g += line(o.x1, o.y1, o.x1, o.yd + s1 * over, cls('t', o, 'ext'));
      g += line(o.x2, y2, o.x2, o.yd + s2 * over, cls('t', o, 'ext'));
    }
    g += line(o.x1, o.yd, o.x2, o.yd, cls('t', o, 'line'));
    g += arrow(o.x1, o.yd, -1, 0, o) + arrow(o.x2, o.yd, 1, 0, o);
    const ty = o.below ? o.yd + 4.6 : o.yd - 1.2;
    g += `<text class="${cls('num', o, 'num')}" x="${f((o.x1 + o.x2) / 2)}" y="${f(ty)}" text-anchor="middle">${label(o)}</text>`;
    return g;
  }

  // Senkrechtes Maß. x1/x2: wo die Maßhilfslinien beginnen, xd: Lage der Maßlinie
  function dimV(o) {
    const x2 = o.x2 ?? o.x1;
    const over = o.noOver ? 0 : 2;
    const s1 = Math.sign(o.xd - o.x1) || -1, s2 = Math.sign(o.xd - x2) || -1;
    let g = '';
    if (!o.noExt) {
      g += line(o.x1, o.y1, o.xd + s1 * over, o.y1, cls('t', o, 'ext'));
      g += line(x2, o.y2, o.xd + s2 * over, o.y2, cls('t', o, 'ext'));
    }
    g += line(o.xd, o.y1, o.xd, o.y2, cls('t', o, 'line'));
    g += arrow(o.xd, o.y1, 0, -1, o) + arrow(o.xd, o.y2, 0, 1, o);
    const my = (o.y1 + o.y2) / 2;
    // richtig: von rechts lesbar (rotate -90), falsch (flip): von links lesbar
    const tx = o.flip ? o.xd + 1.2 : o.xd - 1.2;
    const rot = o.flip ? 90 : -90;
    g += `<text class="${cls('num', o, 'num')}" x="${f(tx)}" y="${f(my)}" text-anchor="middle" transform="rotate(${rot} ${f(tx)} ${f(my)})">${label(o)}</text>`;
    return g;
  }

  // Körper (dicke Volllinie), optional schraffiert
  function body(d, hatch) {
    return `<path class="k" d="${d}" fill="${hatch ? 'url(#HATCH)' : 'none'}"/>`;
  }

  function center(x1, y1, x2, y2) {
    return `<line class="mitte" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
  }

  // Fertige SVG-Grafik. viewBox in mm, label = Beschreibung für Screenreader
  function svg(viewBox, content, label = 'Technische Zeichnung', extraClass = '') {
    const id = 'h' + (++uid);
    return `<svg class="tz ${extraClass}" viewBox="${viewBox}" role="img" aria-label="${label}">` +
      `<defs><pattern id="${id}" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">` +
      `<line class="hatch" x1="0" y1="0" x2="0" y2="2.4"/></pattern></defs>` +
      content.replaceAll('url(#HATCH)', `url(#${id})`) + `</svg>`;
  }

  // Beispiel-Linienmuster für die Linienarten
  function linie(art) {
    const m = {
      breit: '<line class="ls" x1="2" y1="4" x2="58" y2="4" stroke-width="1.1"/>',
      schmal: '<line class="ls" x1="2" y1="4" x2="58" y2="4" stroke-width="0.4"/>',
      freihand: '<path class="ls" d="M2,4 C10,2 16,6 24,4 S40,2 46,4.5 S56,4 58,3.6" fill="none" stroke-width="0.4"/>',
      strichpunkt: '<line class="ls" x1="2" y1="4" x2="58" y2="4" stroke-width="0.4" stroke-dasharray="7 1.6 0.6 1.6"/>',
      strich: '<line class="ls" x1="2" y1="4" x2="58" y2="4" stroke-width="0.5" stroke-dasharray="3 1.6"/>',
      strichpunktbreit: '<line class="ls" x1="2" y1="4" x2="58" y2="4" stroke-width="1.1" stroke-dasharray="7 1.8 0.8 1.8"/>',
    };
    return `<svg class="linie" viewBox="0 0 60 8" role="img" aria-label="Linienmuster">${m[art]}</svg>`;
  }

  return { dimH, dimV, body, center, svg, line, linie };
})();

// ---------- Wiederverwendbare Zeichnungen ----------

// Stufen-Werkstück (70 × 30, Stufe 25 / 14). hl: [Teil am Maß 25, Teil am Maß 14]
function zeichnungStufe(hl) {
  const b = TZ.body('M0,0 H25 V16 H70 V30 H0 Z', true);
  const d =
    TZ.dimH({ x1: 0, x2: 25, y1: 0, yd: -10, text: '25', hl: hl?.[0] }) +
    TZ.dimH({ x1: 0, x2: 70, y1: 0, y2: 16, yd: -18, text: '70' }) +
    TZ.dimV({ y1: 0, y2: 30, x1: 0, xd: -10, text: '30' }) +
    TZ.dimV({ y1: 16, y2: 30, x1: 70, xd: 80, text: '14', hl: hl?.[1] });
  return TZ.svg('-20 -26 112 62', b + d, 'Bemaßtes Werkstück: 70 mm lang, 30 mm hoch');
}

// Einfache Rechtecke für "Richtig bemaßt?" (50 × 24)
function zeichnungRechteck(opt = {}) {
  const b = TZ.body('M0,0 H50 V24 H0 Z', true);
  const top = Object.assign({ x1: 0, x2: 50, y1: 0, yd: -10, text: '50' }, opt.top || {});
  const left = Object.assign({ y1: 0, y2: 24, x1: 0, xd: -10, text: '24' }, opt.left || {});
  let d = TZ.dimH(top) + TZ.dimV(left);
  if (opt.extra) d += opt.extra;
  return TZ.svg(opt.viewBox || '-18 -20 76 54', b + d, 'Bemaßtes Rechteck');
}

// Nummerierte Markierung mit Hinweislinie (für "Welche Linie ist das?")
function markierung(nr, cx, cy, zx, zy) {
  return `<line class="t" x1="${cx}" y1="${cy}" x2="${zx}" y2="${zy}"/><circle class="t" cx="${zx}" cy="${zy}" r=".7" fill="currentColor"/>` +
    `<g class="call"><circle cx="${cx}" cy="${cy}" r="3.2"/><text x="${cx}" y="${cy + 1.3}" text-anchor="middle">${nr}</text></g>`;
}
