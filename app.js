// =====================================================================
//  Technik 7 – Übungsportal: Seitenaufbau und Übungsarten
// =====================================================================

const app = document.getElementById('app');

// ---------- Hilfsfunktionen ----------

function mischen(liste) {
  const a = [...liste];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function auswahl(liste, n) { return mischen(liste).slice(0, n); }

// ---------- Fortschritt (nur auf diesem Gerät) ----------

const SPEICHER = 'technik7-fortschritt';

function ladeFortschritt() {
  try { return JSON.parse(localStorage.getItem(SPEICHER)) || {}; } catch { return {}; }
}

function speichere(id, punkte, max) {
  const p = ladeFortschritt();
  const prozent = Math.round((punkte / max) * 100);
  if (p[id] === undefined || prozent > p[id]) p[id] = prozent;
  try { localStorage.setItem(SPEICHER, JSON.stringify(p)); } catch { /* privates Fenster */ }
}

function sterneZahl(prozent) {
  if (prozent === undefined) return -1;
  return prozent >= 90 ? 3 : prozent >= 70 ? 2 : prozent >= 40 ? 1 : 0;
}

function sterneHTML(prozent, gross = false) {
  const n = sterneZahl(prozent);
  if (n < 0) return `<span class="sterne leer${gross ? ' gross' : ''}" aria-label="noch nicht geübt">☆☆☆</span>`;
  return `<span class="sterne${gross ? ' gross' : ''}" aria-label="${n} von 3 Sternen">${'★'.repeat(n)}<span class="aus">${'★'.repeat(3 - n)}</span></span>`;
}

// ---------- Bereiche und Übungen ----------

const BEREICHE = {
  zeichnen: {
    titel: 'Technisches Zeichnen',
    text: 'Bemaßungsregeln, Linienarten, Bohrungen bemaßen und Zeichnungsarten.',
    icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 42 L6 8 L40 42 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M13 35 V24 L24 35 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M6 14h4M6 20h3M6 26h4M6 32h3" stroke="currentColor" stroke-width="2"/></svg>',
  },
  bohren: {
    titel: 'Bohren & Sicherheit',
    text: 'Die Tischbohrmaschine: Bauteile, Sicherheitsregeln, Bohrer und Lochtypen.',
    icon: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="14" y="4" width="20" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="3"/><path d="M20 16v6h8v-6M22 22v8l2 6 2-6v-8" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M8 44h32M12 40h24" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
  },
};

const UEBUNGEN = [
  // Technisches Zeichnen
  { id: 'z-wissen', bereich: 'zeichnen', art: 'Lernen', titel: 'Lernkarten: Bemaßung & Linien', text: 'Alle Regeln zum Nachlesen – starte hier!', start: wissenZeichnen },
  { id: 'z-quiz', bereich: 'zeichnen', art: 'Quiz', titel: 'Quiz: Bemaßungsregeln', text: '12 Fragen zu Maßlinien, Maßzahlen, Maßhilfslinien und Maßpfeilen.',
    start: (b, ex) => quiz(b, ex, mcFragen(auswahl(QUIZ_BEMASSUNG, 12))) },
  { id: 'z-luecke', bereich: 'zeichnen', art: 'Lückentext', titel: 'Lückentext: Tim bemaßt', text: 'Hilf Tim beim Bemaßen: Wähle für jede Lücke das passende Wort.', start: lueckentext },
  { id: 'z-kreuz', bereich: 'zeichnen', art: 'Rätsel', titel: 'Kreuzworträtsel', text: 'Finde das Lösungswort in der markierten Spalte.', start: kreuzwort },
  { id: 'z-linien', bereich: 'zeichnen', art: 'Zuordnen', titel: 'Welche Linie ist das?', text: 'Bestimme für jede nummerierte Linie die Linienart.',
    start: (b, ex) => zuordnen(b, ex, LINIEN_ERKENNEN.paare.map(p => ({ ...p, links: `<span class="nr">${p.nr}</span>` })), LINIEN_ERKENNEN.optionen, LINIEN_ERKENNEN.svg()) },
  { id: 'z-check', bereich: 'zeichnen', art: 'Richtig/Falsch', titel: 'Richtig bemaßt?', text: 'Schau genau hin: Ist die Zeichnung korrekt bemaßt?',
    start: (b, ex) => quiz(b, ex, tfFragen(mischen(RICHTIG_BEMASST).map(r => ({ s: 'Ist diese Zeichnung richtig bemaßt?', svg: r.svg, ok: r.richtig, ex: r.ex })), ['✔ Richtig bemaßt', '✘ Fehler drin'])) },
  { id: 'z-fehler', bereich: 'zeichnen', art: 'Fehlersuche', titel: 'Fehlersuche', text: 'In der Zeichnung stecken 5 Fehler. Tippe sie an!', start: fehlersuche },
  { id: 'z-rechnen', bereich: 'zeichnen', art: 'Rechnen', titel: 'Fehlende Maße berechnen', text: 'Rechne aus den angegebenen Maßen das fehlende Maß aus.',
    start: (b, ex) => quiz(b, ex, mischen(MASSE_RECHNEN).map(f => ({ ...f, typ: 'zahl' }))) },
  { id: 'z-bohrung', bereich: 'zeichnen', art: 'Quiz', titel: 'Bohrungen bemaßen', text: 'Durchmesser, Tiefe und Lage einer Bohrung.',
    start: (b, ex) => quiz(b, ex, mcFragen(mischen(QUIZ_BOHRUNG))) },
  { id: 'z-arten', bereich: 'zeichnen', art: 'Quiz', titel: 'Skizze, Zeichnung, Explosion', text: 'Zeichnungsarten und Linien – wofür nutze ich was?',
    start: (b, ex) => quiz(b, ex, mcFragen(mischen(QUIZ_ZEICHNUNGSARTEN))) },

  // Bohren & Sicherheit
  { id: 'b-wissen', bereich: 'bohren', art: 'Lernen', titel: 'Lernkarten: Tischbohrmaschine', text: 'Aufbau, Sicherheit, Bohrer, Lochtypen und Arbeitsschritte.', start: wissenBohren },
  { id: 'b-teile', bereich: 'bohren', art: 'Bild-Quiz', titel: 'Welches Bauteil macht das?', text: 'Lies die Aufgabe und tippe im Bild auf das passende Bauteil.',
    start: (b, ex) => quiz(b, ex, mischen(BAUTEIL_AUFGABEN).map(f => {
      const teil = BAUTEILE.find(t => t.nr === f.nr);
      return { ...f, typ: 'bild', richtig: f.nr, loesungText: `Nr. ${teil.nr} – ${teil.name}`, ex: `Das ist Nr. ${teil.nr}: ${teil.name}.` };
    })) },
  { id: 'b-sicher', bereich: 'bohren', art: 'Sicher?', titel: 'Sicher oder gefährlich?', text: 'Entscheide bei jeder Situation: sicher oder gefährlich?',
    start: (b, ex) => quiz(b, ex, tfFragen(mischen(SICHER_ODER_NICHT), ['✔ Sicher', '✘ Gefährlich'])) },
  { id: 'b-regeln', bereich: 'bohren', art: 'Quiz', titel: 'Quiz: Warum diese Regel?', text: 'Sicherheitsregeln verstehen – nicht nur auswendig lernen.',
    start: (b, ex) => quiz(b, ex, mcFragen(mischen(QUIZ_SICHERHEIT))) },
  { id: 'b-ordnung', bereich: 'bohren', art: 'Quiz', titel: 'Werkstattordnung: Welche Regel?', text: 'Welche Regel der Werkstattordnung wird hier verletzt?',
    start: (b, ex) => quiz(b, ex, mcFragen(auswahl(WERKSTATTORDNUNG, 8))) },
  { id: 'b-bohrer', bereich: 'bohren', art: 'Quiz', titel: 'Bohrer erkennen', text: 'Holzbohrer, Stahlbohrer oder Kegelsenker?',
    start: (b, ex) => quiz(b, ex, mcFragen(mischen(QUIZ_BOHRER))) },
  { id: 'b-loecher', bereich: 'bohren', art: 'Quiz', titel: 'Bohrlocharten', text: 'Durchgangsloch, Sackloch oder Senkloch?',
    start: (b, ex) => quiz(b, ex, mcFragen(mischen(QUIZ_BOHRLOCH))) },
  { id: 'b-schritte', bereich: 'bohren', art: 'Reihenfolge', titel: 'Ein Loch bohren – Schritt für Schritt', text: 'Du bohrst ein Durchgangsloch. Bringe die Schritte in die richtige Reihenfolge.', start: reihenfolge },
];

const ABSCHLUSSTEST = { id: 't-test', bereich: 'test', art: 'Test', titel: 'Abschlusstest', text: '15 gemischte Fragen aus beiden Themen – wie in der Klassenarbeit.', start: abschlusstest };

function findeUebung(id) { return UEBUNGEN.find(u => u.id === id) || (id === ABSCHLUSSTEST.id ? ABSCHLUSSTEST : null); }

// ---------- Seiten ----------

function startseite() {
  const p = ladeFortschritt();
  const kachel = (key) => {
    const b = BEREICHE[key];
    const liste = UEBUNGEN.filter(u => u.bereich === key && u.art !== 'Lernen');
    const geschafft = liste.filter(u => sterneZahl(p[u.id]) >= 2).length;
    return `<a class="bereich-kachel ${key}" href="#/${key}">
      <span class="b-icon">${b.icon}</span>
      <span class="b-text"><strong>${b.titel}</strong><span>${b.text}</span>
      <span class="b-stand"><span class="mini-balken"><i style="width:${(geschafft / liste.length) * 100}%"></i></span>${geschafft} von ${liste.length} Übungen geschafft</span></span>
    </a>`;
  };
  app.innerHTML = `
    <section class="hero">
      <p class="kicker">Technik · Jahrgang 7</p>
      <h1>Üben, testen, Profi werden.</h1>
      <p class="lead">Hier kannst du alles rund um <strong>technisches Zeichnen</strong> und das <strong>Bohren an der Tischbohrmaschine</strong> üben. Nach jeder Antwort siehst du sofort, ob sie richtig war.</p>
    </section>
    <section class="karte tipp">
      <h2>So funktioniert's</h2>
      <ol>
        <li>Wähle ein Thema und lies zuerst die <strong>Lernkarten</strong>.</li>
        <li>Mach dann die Übungen. Für jede Übung bekommst du bis zu <span class="sterne">★★★</span>.</li>
        <li>Zum Schluss: der <strong>Abschlusstest</strong> mit Fragen aus beiden Themen.</li>
      </ol>
    </section>
    <section class="bereiche">${kachel('zeichnen')}${kachel('bohren')}</section>
    <a class="test-kachel" href="#/uebung/t-test">
      <span><strong>🏁 Abschlusstest</strong><span>${ABSCHLUSSTEST.text}</span></span>
      ${sterneHTML(p['t-test'], true)}
    </a>`;
}

function bereichsseite(key) {
  const b = BEREICHE[key];
  const p = ladeFortschritt();
  const karten = UEBUNGEN.filter(u => u.bereich === key).map(u => `
    <a class="uebung-kachel ${u.art === 'Lernen' ? 'lernen' : ''}" href="#/uebung/${u.id}">
      <span class="art">${u.art}</span>
      <strong>${u.titel}</strong>
      <span class="u-text">${u.text}</span>
      ${u.art === 'Lernen' ? '<span class="u-start">Lesen →</span>' : sterneHTML(p[u.id])}
    </a>`).join('');
  app.innerHTML = `
    <a class="zurueck" href="#/">← Übersicht</a>
    <header class="seitenkopf ${key}"><span class="b-icon">${b.icon}</span><div><h1>${b.titel}</h1><p>${b.text}</p></div></header>
    <section class="uebungen">${karten}</section>`;
}

function uebungsseite(id) {
  const u = findeUebung(id);
  if (!u) return startseite();
  const zurueck = u.bereich === 'test' ? ['#/', 'Übersicht'] : [`#/${u.bereich}`, BEREICHE[u.bereich].titel];
  app.innerHTML = `
    <a class="zurueck" href="${zurueck[0]}">← ${zurueck[1]}</a>
    <header class="uebungskopf ${u.bereich}"><span class="art">${u.art}</span><h1>${u.titel}</h1><p>${u.text}</p></header>
    <section class="uebung-inhalt"></section>`;
  u.start(app.querySelector('.uebung-inhalt'), u);
}

// ---------- Passwortabfrage ----------
// Einfache Zugangssperre im Browser (kein echter Schutz: der Quelltext bleibt öffentlich).
// Gespeichert ist nur der SHA-256-Wert des Passworts, nicht das Passwort selbst.
const PASSWORT_HASH = 'b925956617cd836a1e4dcdd65d9148eb8aa1f77875813e9baecde15f99c322fc';
const ZUGANG = 'technik7-zugang';

function freigeschaltet() {
  try { return localStorage.getItem(ZUGANG) === PASSWORT_HASH; } catch { return false; }
}

async function sha256(text) {
  const daten = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', daten);
  return [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function passwortseite() {
  app.innerHTML = `
    <section class="karte sperre">
      <div class="schloss" aria-hidden="true">🔒</div>
      <h1>Technik 7 – Übungsportal</h1>
      <p>Bitte gib das Passwort ein, das du von deiner Lehrkraft bekommen hast.</p>
      <form class="sperre-form">
        <input type="password" autocomplete="current-password" aria-label="Passwort" placeholder="Passwort">
        <button class="knopf haupt">Los geht's</button>
      </form>
      <div class="feedback" role="status" aria-live="polite"></div>
    </section>`;
  const form = app.querySelector('form'), input = form.querySelector('input');
  input.focus();
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fb = app.querySelector('.feedback');
    let hash = '';
    try { hash = await sha256(input.value.trim()); } catch { /* sehr alter Browser */ }
    if (hash === PASSWORT_HASH) {
      try { localStorage.setItem(ZUGANG, hash); } catch { /* privates Fenster: nur für diesen Besuch */ }
      sitzungFrei = true;
      route();
    } else {
      fb.className = 'feedback nok';
      fb.innerHTML = '<strong>✘ Das Passwort stimmt leider nicht.</strong> Achte auf die genaue Schreibweise.';
      input.select();
    }
  };
}

let sitzungFrei = false;

function route() {
  const teile = location.hash.replace(/^#\/?/, '').split('/');
  // Impressum und Datenschutz müssen immer ohne Passwort erreichbar sein
  if (teile[0] !== 'impressum' && !sitzungFrei && !freigeschaltet()) { passwortseite(); window.scrollTo(0, 0); return; }
  if (teile[0] === 'zeichnen' || teile[0] === 'bohren') bereichsseite(teile[0]);
  else if (teile[0] === 'uebung' && teile[1]) uebungsseite(teile[1]);
  else if (teile[0] === 'impressum') impressum();
  else startseite();
  window.scrollTo(0, 0);
}

// ---------- Impressum & Datenschutz ----------

function impressum() {
  const A = ANBIETER;
  const anschrift = `${A.name}<br>${A.strasse}<br>${A.ort}`;
  app.innerHTML = `
    <a class="zurueck" href="#/">← Übersicht</a>
    <div class="rechtliches">
      <article class="karte">
        <h1>Impressum</h1>
        <h2>Angaben gemäß § 18 Abs. 1 Medienstaatsvertrag (MStV)</h2>
        <p>${anschrift}</p>
        ${A.email ? `<h2>Kontakt</h2><p>E-Mail: <a href="mailto:${A.email}">${A.email}</a></p>` : ''}
        <h2>Verantwortlich für den Inhalt</h2>
        <p>${anschrift}</p>
        <h2>Haftung für Inhalte</h2>
        <p>Die Inhalte dieser Seite wurden mit größter Sorgfalt für den Technikunterricht erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Sollten dir Fehler auffallen, freue ich mich über einen Hinweis.</p>
        <h2>Urheberrecht</h2>
        <p>Die Texte, Aufgaben und Zeichnungen auf dieser Seite unterliegen dem deutschen Urheberrecht. Die Nutzung für den eigenen Unterricht und zum Üben ist ausdrücklich erwünscht.</p>
      </article>

      <article class="karte">
        <h1>Datenschutzerklärung</h1>

        <h2>1. Verantwortlicher</h2>
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO) ist:</p>
        <p>${anschrift}${A.email ? `<br>E-Mail: <a href="mailto:${A.email}">${A.email}</a>` : ''}</p>

        <h2>2. Das Wichtigste in Kürze</h2>
        <ul>
          <li>Auf dieser Seite musst du dich <strong>nicht anmelden</strong> und gibst <strong>keine persönlichen Daten</strong> ein.</li>
          <li>Es gibt <strong>keine Cookies zu Werbe- oder Analysezwecken</strong>, kein Tracking und keine Einbindung von Diensten Dritter (z. B. keine Google Fonts, keine Videos, keine Social-Media-Knöpfe).</li>
          <li>Deine Ergebnisse (Sterne) werden <strong>nur auf deinem eigenen Gerät</strong> gespeichert und nie an einen Server übertragen.</li>
        </ul>

        <h2>3. Hosting durch GitHub Pages</h2>
        <p>Diese Website wird bei GitHub Pages gehostet. Anbieter ist die GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der Seite verarbeitet GitHub technisch notwendige Daten, insbesondere deine <strong>IP-Adresse</strong>, Datum und Uhrzeit des Zugriffs sowie Informationen über Browser und Betriebssystem. Diese Daten werden benötigt, um die Seite auszuliefern und die Sicherheit und Stabilität des Dienstes zu gewährleisten.</p>
        <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Das berechtigte Interesse liegt in einer sicheren und zuverlässigen Bereitstellung dieses Übungsangebots. Dabei können Daten in die USA übermittelt werden. GitHub gibt an, sich am EU-US Data Privacy Framework zu beteiligen. Auf die Verarbeitung durch GitHub habe ich keinen Einfluss. Weitere Informationen findest du in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener" target="_blank">Datenschutzerklärung von GitHub</a>.</p>

        <h2>4. Speicherung auf deinem Gerät (Local Storage)</h2>
        <p>Damit du siehst, welche Übungen du schon geschafft hast, speichert die Seite deine besten Ergebnisse im sogenannten <em>Local Storage</em> deines Browsers (Eintrag „technik7-fortschritt“). Gespeichert werden nur Übungsnamen und Prozentwerte – <strong>keine Namen und keine sonstigen persönlichen Angaben</strong>. Außerdem wird nach der richtigen Passworteingabe vermerkt, dass die Seite auf diesem Gerät freigeschaltet ist (Eintrag „technik7-zugang“), damit du das Passwort nicht jedes Mal neu eingeben musst. Diese Daten verlassen dein Gerät nicht und sind für mich nicht einsehbar.</p>
        <p>Die Speicherung ist für die von dir gewünschte Fortschrittsanzeige erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Du kannst die Daten jederzeit über den Link „Fortschritt zurücksetzen“ unten auf jeder Seite oder über die Einstellungen deines Browsers löschen.</p>

        <h2>5. Deine Rechte</h2>
        <p>Du hast im Rahmen der DSGVO das Recht auf Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Widerspruch (Art. 21). Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW), Kavalleriestraße 2–4, 40213 Düsseldorf.</p>

        <p class="stand">Stand: ${A.stand}</p>
      </article>
    </div>`;
}

// ---------- Ergebnisanzeige ----------

function ergebnis(box, ex, punkte, max, extra = '') {
  speichere(ex.id, punkte, max);
  const prozent = Math.round((punkte / max) * 100);
  const lob = prozent === 100 ? 'Perfekt! Du bist ein echter Profi.'
    : prozent >= 80 ? 'Super – fast alles richtig!'
    : prozent >= 50 ? 'Gut! Schau dir deine Fehler noch einmal an.'
    : 'Lies dir die Lernkarten noch einmal durch und versuch es dann nochmal.';
  const ziel = ex.bereich === 'test' ? '#/' : `#/${ex.bereich}`;
  box.innerHTML = `
    <div class="karte ergebnis">
      ${sterneHTML(prozent, true)}
      <h2>${punkte} von ${max} richtig</h2>
      <p class="lob">${lob}</p>
      ${extra}
      <div class="knopfreihe">
        <button class="knopf haupt" data-nochmal>↻ Nochmal üben</button>
        <a class="knopf" href="${ziel}">Zur Übersicht</a>
      </div>
    </div>`;
  box.querySelector('[data-nochmal]').onclick = () => { ex.start(box, ex); box.scrollIntoView({ block: 'start' }); };
}

// ---------- Übungsart: Quiz (Multiple Choice, Richtig/Falsch, Zahl) ----------

function mcFragen(liste) {
  return liste.map(f => ({ q: f.q, svg: f.svg, ex: f.ex, thema: f.thema, optionen: mischen(f.a), richtig: f.a[0] }));
}

function tfFragen(liste, labels) {
  return liste.map(f => ({ q: f.s, svg: f.svg, ex: f.ex, thema: f.thema, optionen: labels, richtig: f.ok ? labels[0] : labels[1], zwei: true }));
}

function quiz(box, ex, fragen) {
  let i = 0, punkte = 0;
  const fehler = [];

  function zeige() {
    const f = fragen[i];
    box.innerHTML = `
      <div class="karte quiz">
        <div class="q-kopf"><span>Frage ${i + 1} von ${fragen.length}</span><span class="q-punkte">✔ ${punkte}</span></div>
        <div class="balken"><i style="width:${(i / fragen.length) * 100}%"></i></div>
        <h2 class="q-text">${f.q}</h2>
        ${f.svg ? `<figure class="q-bild">${f.svg()}</figure>` : ''}
        <div class="q-antwort"></div>
        <div class="feedback" role="status" aria-live="polite"></div>
      </div>`;
    const feld = box.querySelector('.q-antwort');

    if (f.typ === 'bild') {
      feld.innerHTML = `<p class="hinweis">Tippe im Bild auf die passende Nummer.</p><figure class="bauteil-bild quizbild">${bohrmaschinenBild(true)}</figure>`;
      feld.querySelectorAll('.ziel').forEach(c => {
        c.onclick = () => {
          if (feld.dataset.fertig) return;
          feld.dataset.fertig = '1';
          const ok = +c.dataset.nr === f.richtig;
          if (!ok) c.classList.add('nok');
          feld.querySelector(`.ziel[data-nr="${f.richtig}"]`).classList.add('ok');
          auswerten(ok, f, f.loesungText);
        };
      });
      return;
    }

    if (f.typ === 'zahl') {
      feld.innerHTML = `<form class="zahl-form"><label>Antwort: <input type="text" inputmode="decimal" autocomplete="off" aria-label="Deine Antwort in mm"> mm</label><button class="knopf haupt">Prüfen</button></form>`;
      const form = feld.querySelector('form'), input = form.querySelector('input');
      input.focus({ preventScroll: true });
      form.onsubmit = (e) => {
        e.preventDefault();
        const wert = parseFloat(input.value.replace(',', '.').replace(/mm/i, ''));
        if (Number.isNaN(wert)) { input.focus(); return; }
        input.disabled = true; form.querySelector('button').remove();
        const ok = wert === f.loesung;
        input.classList.add(ok ? 'ok' : 'nok');
        auswerten(ok, f, `${f.loesung} mm`);
      };
      return;
    }

    feld.innerHTML = `<div class="optionen${f.zwei ? ' zwei' : ''}">${f.optionen.map(o => `<button class="option">${o}</button>`).join('')}</div>`;
    feld.querySelectorAll('.option').forEach(btn => {
      btn.onclick = () => {
        feld.querySelectorAll('.option').forEach(b => {
          b.disabled = true;
          if (b.textContent === f.richtig) b.classList.add('ok');
        });
        const ok = btn.textContent === f.richtig;
        if (!ok) btn.classList.add('nok');
        auswerten(ok, f, f.richtig);
      };
    });
  }

  function auswerten(ok, f, richtigText) {
    if (ok) punkte++;
    else fehler.push({ q: f.q, richtig: richtigText, svg: f.svg, thema: f.thema });
    box.querySelector('.q-punkte').textContent = `✔ ${punkte}`;
    const fb = box.querySelector('.feedback');
    fb.className = 'feedback ' + (ok ? 'ok' : 'nok');
    fb.innerHTML = `<strong>${ok ? '✔ Richtig!' : '✘ Leider nicht.'}</strong> ` +
      (ok || f.zwei ? '' : `Richtig ist: <em>${richtigText}</em>. `) + (f.ex || '') +
      `<button class="knopf haupt weiter">${i + 1 < fragen.length ? 'Weiter →' : 'Zum Ergebnis'}</button>`;
    const weiter = fb.querySelector('.weiter');
    weiter.focus({ preventScroll: true });
    fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    weiter.onclick = () => { i++; i < fragen.length ? zeige() : ende(); };
  }

  function ende() {
    let extra = '';
    if (fehler.length) {
      extra = `<details class="fehlerliste"><summary>Deine Fehler ansehen (${fehler.length})</summary><ul>${fehler.map(e => `<li>${e.q}${e.svg ? `<div class="mini">${e.svg()}</div>` : ''}<span>Richtig: <strong>${e.richtig}</strong></span></li>`).join('')}</ul></details>`;
      const themen = [...new Set(fehler.map(e => e.thema).filter(Boolean))];
      if (themen.length) {
        extra += `<p class="nochmal-ueben">Übe am besten nochmal: ${themen.map(t => { const u = findeUebung(t); return `<a href="#/uebung/${t}">${u.titel}</a>`; }).join(' · ')}</p>`;
      }
    }
    ergebnis(box, ex, punkte, fragen.length, extra);
  }

  zeige();
}

// ---------- Übungsart: Zuordnen ----------

function zuordnen(box, ex, paare, optionen, bild) {
  const opts = mischen(optionen);
  // Nummerierte Zeilen bleiben in ihrer Reihenfolge, sonst wird gemischt
  const reihen = paare.map((p, i) => ({ ...p, i }));
  if (!paare[0].nr) mischen(reihen).forEach((r, i) => { reihen[i] = r; });
  box.innerHTML = `
    <div class="karte ${bild ? 'mit-bild' : ''}">
      ${bild ? `<figure class="zu-bild">${bild}</figure>` : ''}
      <div class="zuordnung">
        ${reihen.map(r => `
          <label class="z-zeile" data-i="${r.i}">
            <span class="z-links">${r.links}</span>
            <select><option value="">– bitte wählen –</option>${opts.map(o => `<option>${o}</option>`).join('')}</select>
          </label>`).join('')}
        <div class="knopfreihe"><button class="knopf haupt" data-pruefen>Prüfen</button></div>
        <div class="feedback" role="status" aria-live="polite"></div>
      </div>
    </div>`;
  box.querySelector('[data-pruefen]').onclick = () => {
    let richtig = 0;
    box.querySelectorAll('.z-zeile').forEach(z => {
      const ok = z.querySelector('select').value === paare[z.dataset.i].richtig;
      if (ok) richtig++;
      z.classList.toggle('ok', ok);
      z.classList.toggle('nok', !ok);
    });
    const fb = box.querySelector('.feedback');
    if (richtig === paare.length) {
      speichere(ex.id, richtig, paare.length);
      fb.className = 'feedback ok';
      fb.innerHTML = `<strong>✔ Alles richtig – super!</strong> <a class="knopf" href="#/${ex.bereich}">Zur Übersicht</a>`;
    } else {
      speichere(ex.id, richtig, paare.length);
      fb.className = 'feedback nok';
      fb.innerHTML = `<strong>${richtig} von ${paare.length} richtig.</strong> Ändere die rot markierten Zeilen und prüfe noch einmal.`;
    }
  };
  return box;
}

// Bild der Tischbohrmaschine (ohne die Linien des Arbeitsblatts), optional mit antippbaren Nummern
function bohrmaschinenBild(mitZielen) {
  return `<svg class="bild-svg" viewBox="230 110 666 1090" role="img" aria-label="Tischbohrmaschine mit nummerierten Bauteilen">
      <image href="bilder/tischbohrmaschine.jpg" x="0" y="0" width="896" height="1200"/>
      <rect x="0" y="0" width="442" height="1003" fill="#fff"/><rect x="0" y="0" width="896" height="112" fill="#fff"/>
      ${mitZielen ? BAUTEILE.map(t => `<circle class="ziel" data-nr="${t.nr}" cx="${t.x}" cy="${t.y}" r="34" role="button" aria-label="Nummer ${t.nr}"/>`).join('') : ''}
    </svg>`;
}

// ---------- Übungsart: Lückentext ----------

function lueckentext(box, ex) {
  const woerter = [...LUECKENTEXT.woerter].sort((a, b) => a.localeCompare(b, 'de', { numeric: true }));
  const loesungen = [];
  const saetze = LUECKENTEXT.saetze.map(s => s.replace(/\[([^\]]+)\]/g, (_, w) => {
    loesungen.push(w);
    return `<select class="luecke" data-i="${loesungen.length - 1}" aria-label="Lücke"><option value="">…</option>${woerter.map(o => `<option>${o}</option>`).join('')}</select>`;
  }));
  box.innerHTML = `
    <div class="karte">
      <p class="wortbank"><strong>Diese Wörter kannst du benutzen:</strong> ${woerter.map(w => `<span>${w}</span>`).join('')}</p>
      <ol class="lueckentext">${saetze.map(s => `<li>${s}</li>`).join('')}</ol>
      <div class="knopfreihe"><button class="knopf haupt" data-pruefen>Prüfen</button></div>
      <div class="feedback" role="status" aria-live="polite"></div>
    </div>`;
  box.querySelector('[data-pruefen]').onclick = () => {
    let richtig = 0;
    box.querySelectorAll('.luecke').forEach(sel => {
      const ok = sel.value === loesungen[sel.dataset.i];
      if (ok) richtig++;
      sel.classList.toggle('ok', ok);
      sel.classList.toggle('nok', !ok);
    });
    speichere(ex.id, richtig, loesungen.length);
    const fb = box.querySelector('.feedback');
    fb.className = 'feedback ' + (richtig === loesungen.length ? 'ok' : 'nok');
    fb.innerHTML = richtig === loesungen.length
      ? `<strong>✔ Alle Lücken richtig!</strong> <a class="knopf" href="#/${ex.bereich}">Zur Übersicht</a>`
      : `<strong>${richtig} von ${loesungen.length} richtig.</strong> Verbessere die rot markierten Lücken.`;
  };
}

// ---------- Übungsart: Kreuzworträtsel ----------

function grossbuchstabe(c) {
  if (c === 'ß' || c === 'ẞ') return 'ß';
  return c.toLocaleUpperCase('de-DE');
}

function kreuzwort(box, ex) {
  const K = KREUZWORT;
  const breite = Math.max(...K.woerter.map(w => w.start + [...w.wort].length));
  const zeilen = K.woerter.map((w, r) => {
    const buchst = [...w.wort];
    let zellen = `<span class="k-nr">${r + 1}</span>`;
    for (let c = 0; c < breite; c++) {
      const idx = c - w.start;
      zellen += (idx >= 0 && idx < buchst.length)
        ? `<input class="k-feld${c === K.spalte ? ' k-loesung' : ''}" maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" data-r="${r}" data-k="${idx}" aria-label="Wort ${r + 1}, Buchstabe ${idx + 1}">`
        : '<span></span>';
    }
    return zellen;
  }).join('');
  box.innerHTML = `
    <div class="karte">
      <div class="kreuz" style="--spalten:${breite}">${zeilen}</div>
      <p class="hinweis">Tipp: Umlaute (Ä, Ö, Ü) und ß kommen jeweils in <strong>ein</strong> Kästchen.</p>
      <ol class="fragen">${K.woerter.map(w => `<li>${w.frage}</li>`).join('')}</ol>
      <div class="knopfreihe"><button class="knopf haupt" data-pruefen>Prüfen</button><button class="knopf" data-loesung>Lösung zeigen</button></div>
      <div class="feedback" role="status" aria-live="polite"></div>
    </div>`;
  const felder = [...box.querySelectorAll('.k-feld')];
  const nachbar = (feld, d) => felder.find(f => f.dataset.r === feld.dataset.r && +f.dataset.k === +feld.dataset.k + d);

  felder.forEach(feld => {
    feld.addEventListener('input', () => {
      const zeichen = [...feld.value].pop();
      feld.value = zeichen ? grossbuchstabe(zeichen) : '';
      feld.classList.remove('ok', 'nok');
      if (feld.value) nachbar(feld, 1)?.focus();
    });
    feld.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !feld.value) { nachbar(feld, -1)?.focus(); }
      if (e.key === 'ArrowRight') nachbar(feld, 1)?.focus();
      if (e.key === 'ArrowLeft') nachbar(feld, -1)?.focus();
    });
    feld.addEventListener('focus', () => feld.select());
  });

  const pruefe = (zeigen) => {
    let woerterRichtig = 0;
    K.woerter.forEach((w, r) => {
      const buchst = [...w.wort];
      let alle = true;
      felder.filter(f => +f.dataset.r === r).forEach(f => {
        const soll = buchst[f.dataset.k];
        if (zeigen) f.value = soll;
        const ok = f.value === soll;
        if (!ok) alle = false;
        f.classList.toggle('ok', ok && !zeigen);
        f.classList.toggle('nok', !ok && f.value !== '');
      });
      if (alle) woerterRichtig++;
    });
    return woerterRichtig;
  };

  box.querySelector('[data-pruefen]').onclick = () => {
    const n = pruefe(false);
    const fb = box.querySelector('.feedback');
    speichere(ex.id, n, K.woerter.length);
    if (n === K.woerter.length) {
      fb.className = 'feedback ok';
      fb.innerHTML = `<strong>✔ Geschafft!</strong> Das Lösungswort heißt: <span class="loesungswort">${K.loesung}</span>`;
    } else {
      fb.className = 'feedback nok';
      fb.innerHTML = `<strong>${n} von ${K.woerter.length} Wörtern richtig.</strong> Rot markierte Buchstaben stimmen noch nicht.`;
    }
  };
  box.querySelector('[data-loesung]').onclick = () => {
    pruefe(true);
    const fb = box.querySelector('.feedback');
    fb.className = 'feedback';
    fb.innerHTML = `Lösungswort: <span class="loesungswort">${K.loesung}</span> Versuch es beim nächsten Mal ohne Lösung!`;
  };
}

// ---------- Übungsart: Fehlersuche ----------

function fehlersuche(box, ex) {
  const F = FEHLERSUCHE;
  box.innerHTML = `
    <div class="karte">
      <p>Tippe auf die Stellen in der Zeichnung, an denen eine Bemaßungsregel verletzt wird.</p>
      <div class="fs-status"><span class="fs-zahl">0 von ${F.fehler.length} Fehlern gefunden</span><span class="fs-fehlklicks"></span></div>
      <figure class="fehlerbild">${F.svg()}</figure>
      <div class="feedback" role="status" aria-live="polite"></div>
      <ol class="gefunden"></ol>
      <div class="knopfreihe"><button class="knopf" data-aufgeben>Lösung zeigen</button></div>
    </div>`;
  const svg = box.querySelector('.fehlerbild svg');
  const ns = 'http://www.w3.org/2000/svg';
  let gefunden = 0, fehlklicks = 0, fertig = false;

  F.fehler.forEach((f, i) => {
    const r = document.createElementNS(ns, 'rect');
    Object.entries({ x: f.x, y: f.y, width: f.w, height: f.h, rx: 2, class: 'hot' }).forEach(([k, v]) => r.setAttribute(k, v));
    r.dataset.i = i;
    svg.appendChild(r);
  });

  const markiere = (r, nr, aufgedeckt) => {
    r.classList.add(aufgedeckt ? 'aufgedeckt' : 'treffer');
    const t = document.createElementNS(ns, 'text');
    const f = F.fehler[r.dataset.i];
    t.setAttribute('x', f.x + f.w - 1); t.setAttribute('y', f.y + 4.2);
    t.setAttribute('class', 'fs-nr' + (aufgedeckt ? ' auf' : '')); t.setAttribute('text-anchor', 'end');
    t.textContent = nr;
    svg.appendChild(t);
    box.querySelector('.gefunden').insertAdjacentHTML('beforeend', `<li class="${aufgedeckt ? 'aufgedeckt' : ''}">${f.text}</li>`);
  };

  const abschluss = (text) => {
    fertig = true;
    box.querySelector('[data-aufgeben]').remove();
    speichere(ex.id, Math.max(0, gefunden - Math.floor(fehlklicks / 3)), F.fehler.length);
    const fb = box.querySelector('.feedback');
    fb.className = 'feedback ' + (gefunden === F.fehler.length ? 'ok' : 'nok');
    fb.innerHTML = text + ` <button class="knopf" data-neu>↻ Nochmal</button>`;
    fb.querySelector('[data-neu]').onclick = () => fehlersuche(box, ex);
  };

  svg.addEventListener('click', (e) => {
    if (fertig) return;
    const r = e.target.closest('.hot');
    const fb = box.querySelector('.feedback');
    if (r && !r.classList.contains('treffer')) {
      gefunden++;
      markiere(r, gefunden, false);
      box.querySelector('.fs-zahl').textContent = `${gefunden} von ${F.fehler.length} Fehlern gefunden`;
      fb.className = 'feedback ok';
      fb.innerHTML = `<strong>✔ Gefunden!</strong> ${F.fehler[r.dataset.i].text}`;
      if (gefunden === F.fehler.length) {
        abschluss(`<strong>✔ Alle ${F.fehler.length} Fehler gefunden!</strong> ${fehlklicks ? `Du hast ${fehlklicks}× daneben getippt.` : 'Und kein einziges Mal daneben – stark!'}`);
      }
    } else if (!r) {
      fehlklicks++;
      box.querySelector('.fs-fehlklicks').textContent = `Daneben: ${fehlklicks}`;
      fb.className = 'feedback nok';
      fb.innerHTML = 'Hier ist alles in Ordnung. Such weiter!';
    }
  });

  box.querySelector('[data-aufgeben]').onclick = () => {
    let nr = gefunden;
    svg.querySelectorAll('.hot:not(.treffer)').forEach(r => markiere(r, ++nr, true));
    abschluss(`Du hast ${gefunden} von ${F.fehler.length} Fehlern selbst gefunden. Die übrigen sind jetzt orange markiert.`);
  };
}

// ---------- Übungsart: Reihenfolge ----------

function reihenfolge(box, ex) {
  let liste = mischen(ARBEITSSCHRITTE_UEBUNG.map((s, i) => ({ ...s, i })));
  if (liste.every((s, idx) => s.i === idx)) liste.reverse();

  function zeichne(markieren) {
    box.innerHTML = `
      <div class="karte">
        <p>Verschiebe die Schritte mit den Pfeilen, bis die Reihenfolge stimmt.</p>
        <ol class="reihe">${liste.map((s, idx) => `
          <li class="${markieren ? (s.i === idx ? 'ok' : 'nok') : ''}">
            <span class="r-nr">${idx + 1}</span>
            <span class="r-text"><strong>${s.t}</strong><span>${s.d}</span></span>
            <span class="r-knoepfe">
              <button aria-label="${s.t} nach oben" data-hoch="${idx}" ${idx === 0 ? 'disabled' : ''}>▲</button>
              <button aria-label="${s.t} nach unten" data-runter="${idx}" ${idx === liste.length - 1 ? 'disabled' : ''}>▼</button>
            </span>
          </li>`).join('')}</ol>
        <div class="knopfreihe"><button class="knopf haupt" data-pruefen>Prüfen</button></div>
        <div class="feedback" role="status" aria-live="polite"></div>
      </div>`;
    box.querySelectorAll('[data-hoch]').forEach(b => b.onclick = () => tausche(+b.dataset.hoch, -1));
    box.querySelectorAll('[data-runter]').forEach(b => b.onclick = () => tausche(+b.dataset.runter, 1));
    box.querySelector('[data-pruefen]').onclick = pruefe;
  }

  function tausche(idx, d) {
    [liste[idx], liste[idx + d]] = [liste[idx + d], liste[idx]];
    zeichne(false);
    box.querySelector(`[data-${d < 0 ? 'hoch' : 'runter'}="${idx + d}"]`)?.focus();
  }

  function pruefe() {
    const richtig = liste.filter((s, idx) => s.i === idx).length;
    zeichne(true);
    speichere(ex.id, richtig, liste.length);
    const fb = box.querySelector('.feedback');
    if (richtig === liste.length) {
      fb.className = 'feedback ok';
      fb.innerHTML = `<strong>✔ Perfekt!</strong> So gehst du beim Bohren vor. <a class="knopf" href="#/${ex.bereich}">Zur Übersicht</a>`;
    } else {
      fb.className = 'feedback nok';
      fb.innerHTML = `<strong>${richtig} von ${liste.length} Schritten stehen an der richtigen Stelle.</strong> Überlege: Was muss passieren, bevor der Bohrer das Holz berührt?`;
    }
  }

  zeichne(false);
}

// ---------- Abschlusstest ----------

function abschlusstest(box, ex) {
  const mit = (liste, thema) => liste.map(f => ({ ...f, thema }));
  const fragen = mischen([
    ...mcFragen(auswahl(mit(QUIZ_BEMASSUNG, 'z-quiz'), 4)),
    ...tfFragen(auswahl(mit(RICHTIG_BEMASST, 'z-check'), 2).map(r => ({ s: 'Ist diese Zeichnung richtig bemaßt?', svg: r.svg, ok: r.richtig, ex: r.ex, thema: r.thema })), ['✔ Richtig bemaßt', '✘ Fehler drin']),
    ...mcFragen(auswahl(mit(QUIZ_BOHRUNG, 'z-bohrung'), 1)),
    ...mcFragen(auswahl(mit(QUIZ_ZEICHNUNGSARTEN, 'z-arten'), 2)),
    ...mcFragen(auswahl(mit(QUIZ_SICHERHEIT, 'b-regeln'), 2)),
    ...tfFragen(auswahl(mit(SICHER_ODER_NICHT, 'b-sicher'), 1), ['✔ Sicher', '✘ Gefährlich']),
    ...mcFragen(auswahl(mit(WERKSTATTORDNUNG, 'b-ordnung'), 1)),
    ...mcFragen(auswahl(mit(QUIZ_BOHRLOCH, 'b-loecher'), 1)),
    ...mcFragen(auswahl(mit(QUIZ_BOHRER, 'b-bohrer'), 1)),
  ]);
  quiz(box, ex, fragen);
}

// ---------- Lernkarten ----------

function wissenZeichnen(box) {
  const farben = { ext: 'c-ext', line: 'c-line', num: 'c-num', arrow: 'c-arrow' };
  const teile = TZ.svg('-20 -26 106 58',
    TZ.body('M0,0 H45 V10 H65 V25 H0 Z', true) +
    TZ.dimH({ x1: 0, x2: 45, y1: 0, yd: -10, text: '45', farben }) +
    TZ.dimH({ x1: 0, x2: 65, y1: 0, y2: 10, yd: -18, text: '65', farben }) +
    TZ.dimV({ y1: 0, y2: 25, x1: 0, xd: -10, text: '25', farben }) +
    TZ.dimV({ y1: 10, y2: 25, x1: 65, xd: 75, text: '15', farben }), 'Werkstück mit farbig markierten Teilen der Bemaßung');

  const bohrungen = TZ.svg('-20 -22 120 52',
    TZ.body('M0,0 H40 V28 H0 Z') + '<circle class="k" cx="16" cy="15" r="6" fill="none"/>' + TZ.center(8, 15, 24, 15) + TZ.center(16, 7, 16, 23) +
    TZ.dimH({ x1: 0, x2: 16, y1: 0, y2: 9, yd: -10, text: '16' }) +
    TZ.dimV({ y1: 15, y2: 28, x1: 10, x2: 0, xd: -10, text: '13' }) +
    '<line class="t" x1="20.2" y1="10.8" x2="30" y2="1"/><line class="t" x1="30" y1="1" x2="40" y2="1"/><text class="num" x="31" y="0">Ø12</text>' +
    TZ.body('M60,0 H95 V28 H60 Z') + '<line class="verdeckt" x1="73" y1="0" x2="73" y2="16"/><line class="verdeckt" x1="81" y1="0" x2="81" y2="16"/>' +
    '<path class="verdeckt" d="M73,16 L77,18.4 L81,16" fill="none"/>' + TZ.center(77, -3, 77, 21) +
    '<line class="t" x1="77" y1="-3" x2="84" y2="-10"/><line class="t" x1="84" y1="-10" x2="104" y2="-10"/><text class="num" x="85" y="-11">Ø8, 16 tief</text>',
    'Bemaßung von Bohrungen: Lage, Durchmesser und Tiefe');

  box.innerHTML = `
    <div class="lernkarten">
      <article class="karte lern">
        <h2>Die Teile einer Bemaßung</h2>
        <figure>${teile}</figure>
        <ul class="legende">
          <li><i class="c-ext"></i><strong>Maßhilfslinie</strong> – verlängert die Körperkante</li>
          <li><i class="c-line"></i><strong>Maßlinie</strong> – liegt zwischen den Maßhilfslinien</li>
          <li><i class="c-arrow"></i><strong>Maßpfeil</strong> – an beiden Enden der Maßlinie</li>
          <li><i class="c-num"></i><strong>Maßzahl</strong> – das Maß in mm</li>
        </ul>
      </article>
      <article class="karte lern">
        <h2>Die Bemaßung</h2>
        <ul>
          <li>Eine Bemaßung muss <strong>eindeutig</strong> sein. Mit ihr soll man das Werkstück <strong>herstellen</strong> können.</li>
          <li>Jedes Maß wird nur <strong>einmal</strong> eingetragen – keine überflüssigen Maße.</li>
          <li>Plane die Lage der Maße vorher. Die Bemaßung soll übersichtlich und gut lesbar sein.</li>
          <li>Maße stehen in der Regel <strong>außerhalb</strong> des Werkstücks.</li>
          <li>Wir bemaßen mit einem <strong>spitzen Bleistift (2H)</strong>.</li>
        </ul>
      </article>
      <article class="karte lern">
        <h2>Maßlinien</h2>
        <ul>
          <li>Maßlinien sind <strong>schmale Volllinien</strong>.</li>
          <li>Sie verlaufen <strong>parallel</strong> zur bemaßten Körperkante.</li>
          <li>Die erste Maßlinie hat <strong>10 mm</strong> Abstand zur Körperkante, jede weitere <strong>mindestens 8 mm</strong> zur vorherigen.</li>
          <li>Maßlinien dürfen sich <strong>nicht schneiden</strong>. Kanten und Mittellinien sind keine Maßlinien.</li>
        </ul>
      </article>
      <article class="karte lern">
        <h2>Maßzahlen</h2>
        <ul>
          <li>Maßzahlen stehen mit kleinem Abstand <strong>mittig über</strong> der Maßlinie.</li>
          <li>Alle Maße sind in <strong>mm</strong> – die Einheit wird aber <strong>nicht</strong> dazugeschrieben.</li>
          <li>Waagerechte Maße liest man <strong>von unten</strong>, senkrechte <strong>von rechts</strong>.</li>
        </ul>
      </article>
      <article class="karte lern">
        <h2>Maßhilfslinien</h2>
        <ul>
          <li>Maßhilfslinien verlängern die Körperkanten nach außen.</li>
          <li>Sie stehen <strong>2 mm</strong> über die Maßlinie hinaus.</li>
          <li>Sie dürfen keine Maßlinien kreuzen. Deshalb gilt: <strong>kleine Maße innen, große Maße außen</strong>.</li>
        </ul>
      </article>
      <article class="karte lern">
        <h2>Maßpfeile</h2>
        <ul>
          <li>Maßpfeile sitzen an den Enden der Maßlinie. Die <strong>Spitze berührt die Maßhilfslinie</strong>.</li>
          <li>Sie sind <strong>spitz (15°)</strong>, etwa <strong>5 mm</strong> lang und <strong>voll ausgemalt</strong>.</li>
          <li>Ist der Platz zu knapp, dürfen die Pfeile von <strong>außen</strong> angesetzt werden.</li>
        </ul>
      </article>
      <article class="karte lern breit">
        <h2>Linienarten</h2>
        <table class="linientabelle">
          <thead><tr><th>Linie</th><th>Name</th><th>Wofür?</th></tr></thead>
          <tbody>${LINIENARTEN.map(l => `<tr><td>${TZ.linie(l.links)}</td><td>${l.name}</td><td>${l.rechts}</td></tr>`).join('')}</tbody>
        </table>
      </article>
      <article class="karte lern breit">
        <h2>Bohrungen bemaßen</h2>
        <figure>${bohrungen}</figure>
        <ul>
          <li><strong>Durchmesser:</strong> mit dem Zeichen <strong>Ø</strong>, z. B. Ø12.</li>
          <li><strong>Lage:</strong> Abstand des <strong>Mittelpunkts</strong> zu zwei Werkstückkanten (hier 16 und 13).</li>
          <li><strong>Tiefe:</strong> bei Sacklöchern, z. B. „Ø8, 16 tief“. Verdeckte Kanten sind Strichlinien.</li>
          <li>Mittellinien zeichnest du als <strong>schmale Strichpunktlinie</strong>.</li>
        </ul>
      </article>
      <article class="karte lern breit">
        <h2>Skizze, technische Zeichnung, Explosionszeichnung</h2>
        <div class="drei">
          <div><h3>Skizze</h3><p>Schnell und <strong>freihand</strong> gezeichnet, um eine Idee festzuhalten. Nicht genau, nicht maßstäblich.</p></div>
          <div><h3>Technische Zeichnung</h3><p>Genau, mit Lineal und nach <strong>Normen</strong>. Mit Bemaßung, damit man das Werkstück <strong>herstellen</strong> kann.</p></div>
          <div><h3>Explosionszeichnung</h3><p>Alle Einzelteile <strong>auseinandergezogen</strong> und nummeriert. Zeigt, wie etwas <strong>zusammengebaut</strong> wird.</p></div>
        </div>
      </article>
    </div>
    <div class="weiter-lernen"><a class="knopf haupt" href="#/uebung/z-quiz">Weiter zum Quiz →</a></div>`;
}

function wissenBohren(box) {
  const loch = (typ, name, text) => `<div><figure>${zeichnungBohrloch(typ)}</figure><h3>${name}</h3><p>${text}</p></div>`;
  const bohrer = (typ, name, text) => `<div class="bohrer-karte"><figure>${zeichnungBohrer(typ)}</figure><h3>${name}</h3><p>${text}</p></div>`;
  box.innerHTML = `
    <div class="lernkarten">
      <article class="karte lern breit warnung">
        <h2>⚠ Sicherheit an der Bohrmaschine</h2>
        <p class="merke">Ohne Freigabe durch die Lehrkraft wird an der Bohrmaschine nicht gearbeitet!</p>
        <ol class="regeln">
          <li><strong>Schutzbrille tragen</strong><span>Späne fliegen beim Bohren – die Augen müssen immer geschützt sein.</span></li>
          <li><strong>Werkstück fest einspannen</strong><span>Nie von Hand halten: Der Bohrer kann das Werkstück mitreißen.</span></li>
          <li><strong>Keine losen Ärmel, keine Handschuhe</strong><span>Kleidung und Handschuhe können sich im Bohrer verfangen.</span></li>
          <li><strong>Lange Haare zusammenbinden</strong><span>Offene Haare dürfen nicht in die Nähe des drehenden Bohrers kommen.</span></li>
          <li><strong>Bohrfutterschlüssel abziehen</strong><span>Vor dem Einschalten immer entfernen – sonst wird er weggeschleudert.</span></li>
          <li><strong>Passende Drehzahl wählen</strong><span>Werkstoff und Bohrerdurchmesser bestimmen die richtige Einstellung.</span></li>
        </ol>
        <p>Im Notfall: <strong>roten Not-Aus-Schalter drücken</strong> und die Lehrkraft holen.</p>
      </article>
      <article class="karte lern breit">
        <h2>Aufbau der Tischbohrmaschine</h2>
        <div class="aufbau">
          <figure class="bauteil-bild">${bohrmaschinenBild(false)}</figure>
          <ol class="teileliste">${BAUTEILE.map(t => `<li>${t.name}</li>`).join('')}</ol>
        </div>
      </article>
      <article class="karte lern breit">
        <h2>Bohrer</h2>
        <div class="drei">
          ${bohrer('holz', 'Holzbohrer', 'Mit <strong>Zentrierspitze</strong> in der Mitte und zwei <strong>Vorschneidern</strong> am Rand. Für saubere Löcher in Holz.')}
          ${bohrer('stahl', 'Stahlbohrer (Spiralbohrer)', 'Mit <strong>kegelförmiger Spitze (118°)</strong>. Für Metall und Kunststoff.')}
          ${bohrer('senker', 'Kegelsenker', 'Mit <strong>kegelförmigem Kopf</strong>. Zum Senken für Senkkopfschrauben und zum Entgraten.')}
        </div>
      </article>
      <article class="karte lern breit">
        <h2>Die drei Lochtypen</h2>
        <div class="drei">
          ${loch('durchgang', 'Durchgangsloch', 'Geht <strong>ganz durch</strong> das Werkstück. Beispiel: Schraube mit Mutter. Ein <strong>Opferbrett</strong> darunter verhindert das Ausreißen.')}
          ${loch('sack', 'Sackloch', 'Endet <strong>blind</strong> in einer bestimmten Tiefe – Einstellung am <strong>Tiefenanschlag</strong>. Beispiel: Dübelloch.')}
          ${loch('senk', 'Senkloch', 'Loch mit <strong>kegelförmiger Erweiterung</strong>. Der Kopf einer Senkkopfschraube liegt danach <strong>bündig</strong>.')}
        </div>
      </article>
      <article class="karte lern breit">
        <h2>So gehst du beim Bohren vor</h2>
        <ol class="regeln schritte">${ARBEITSSCHRITTE.map(s => `<li><strong>${s.t}</strong><span>${s.d}</span></li>`).join('')}</ol>
      </article>
      <article class="karte lern breit">
        <h2>Die Werkstattordnung – das Wichtigste</h2>
        <ul class="zweispaltig">
          <li>Werkstatt nur mit der Lehrkraft betreten.</li>
          <li>Nicht unnötig herumlaufen.</li>
          <li>Arbeitskleidung, Uhr und Schmuck ablegen.</li>
          <li>Lange Haare zusammenbinden.</li>
          <li>Nicht essen und nicht trinken.</li>
          <li>Werkzeug prüfen, Schäden melden.</li>
          <li>Werkzeug sicher und geordnet ablegen.</li>
          <li>Maschinen nur mit Erlaubnis und Einweisung.</li>
          <li>Sicherheitskennzeichen beachten.</li>
          <li>Verbandskasten und Not-Aus kennen.</li>
          <li>Jede Verletzung sofort melden.</li>
          <li>Arbeitsplatz aufräumen, Müll trennen.</li>
        </ul>
      </article>
    </div>
    <div class="weiter-lernen"><a class="knopf haupt" href="#/uebung/b-teile">Weiter zu den Übungen →</a></div>`;
}

// ---------- Start ----------

document.getElementById('zuruecksetzen').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('Möchtest du deinen ganzen Fortschritt (alle Sterne) auf diesem Gerät löschen?')) {
    try { localStorage.removeItem(SPEICHER); } catch { /* nichts */ }
    route();
  }
});

window.addEventListener('hashchange', route);
route();
