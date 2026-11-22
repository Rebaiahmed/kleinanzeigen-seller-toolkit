import './style.css';
import { checklist, replies } from './data';
import { estimatePrice, PRICE_RULES, type Condition } from './price';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('App container missing');

app.innerHTML = `
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="wrap header-inner">
      <a class="brand" href="#top" aria-label="Seller Toolkit – Startseite"><span class="brand-mark">K</span><span>Seller Toolkit</span></a>
      <nav aria-label="Hauptnavigation"><a href="#preisrechner">Preisrechner</a><a href="#antwortvorlagen">Antwortvorlagen</a><a href="#checkliste">Checkliste</a></nav>
      <a class="github-link" href="https://github.com/Rebaiahmed/kleinanzeigen-seller-toolkit">GitHub ↗</a>
    </div>
  </header>
  <main id="main">
    <section class="hero wrap" id="top" aria-labelledby="hero-title">
      <div class="eyebrow">KOSTENLOS · OHNE ANMELDUNG · OHNE TRACKING</div>
      <h1 id="hero-title">Besser verkaufen beginnt mit <em>klaren Entscheidungen.</em></h1>
      <p>Drei einfache Werkzeuge für deine Kleinanzeigen: Preis grob einschätzen, freundlich antworten und vor dem Veröffentlichen nichts vergessen.</p>
      <div class="hero-actions"><a class="button primary" href="#preisrechner">Preis einschätzen <span aria-hidden="true">↗</span></a><a class="button secondary" href="#checkliste">Anzeige prüfen</a></div>
      <p class="independent-note">Unabhängiges Community-Projekt. Keine Verbindung zur Kleinanzeigen GmbH.</p>
    </section>

    <section class="section wrap" id="preisrechner" aria-labelledby="price-title">
      <div class="section-head"><span class="section-number">01 / PREIS</span><h2 id="price-title">Kleinanzeigen Preisrechner</h2><p>Ein grober Startpunkt aus Kaufpreis, Zustand und Alter. Für den echten Marktpreis vergleiche selbst ähnliche Angebote.</p></div>
      <div class="panel price-layout">
        <form id="price-form" class="form-stack" novalidate>
          <div class="field"><label for="purchase-price">Ursprünglicher Kaufpreis <span aria-hidden="true">*</span></label><div class="input-wrap"><input id="purchase-price" name="purchasePrice" type="number" min="0.01" max="1000000" step="0.01" inputmode="decimal" required placeholder="z. B. 500" /><span aria-hidden="true">€</span></div></div>
          <div class="field"><label for="condition">Zustand <span aria-hidden="true">*</span></label><select id="condition" name="condition"><option value="neu">Neu / unbenutzt</option><option value="sehrGut">Sehr gut</option><option value="gut" selected>Gut</option><option value="akzeptabel">Akzeptabel</option><option value="defekt">Defekt</option></select></div>
          <div class="field"><label for="age-years">Alter in Jahren <span aria-hidden="true">*</span></label><div class="input-wrap"><input id="age-years" name="ageYears" type="number" min="0" max="50" step="0.5" inputmode="decimal" required placeholder="z. B. 2" /><span aria-hidden="true">Jahre</span></div></div>
          <div class="field"><label for="target-price">Dein Wunschpreis <span class="optional">optional</span></label><div class="input-wrap"><input id="target-price" name="targetPrice" type="number" min="0" max="1000000" step="0.01" inputmode="decimal" placeholder="z. B. 280" /><span aria-hidden="true">€</span></div></div>
          <button class="button primary wide" type="submit">Schätzbereich berechnen <span aria-hidden="true">→</span></button>
          <p class="form-error" id="price-error" role="alert" hidden></p>
        </form>
        <div class="result-panel" id="price-result" aria-live="polite">
          <div class="result-kicker">DEINE ORIENTIERUNG</div>
          <div class="result-empty" id="result-empty"><span aria-hidden="true">€</span><p>Gib links die Eckdaten deines Artikels ein.</p></div>
          <div id="result-content" hidden>
            <p class="range" id="price-range"></p>
            <p class="result-subtitle">Illustrativer Schätzbereich</p>
            <p class="target-note" id="target-note" hidden></p>
            <div class="calculation" id="calculation"></div>
          </div>
          <p class="disclaimer"><strong>Wichtig:</strong> Keine Marktanalyse, keine live geprüften Vergleichsangebote und keine Verkaufsgarantie. Marken, Zubehör, Nachfrage und lokale Preise können stark abweichen.</p>
        </div>
      </div>
      <details class="method"><summary>Wie wird der Bereich berechnet?</summary><p>Kaufpreis × Zustandsfaktor × Altersfaktor. Der Altersfaktor beträgt ${PRICE_RULES.yearlyRetention} pro Jahr und fällt nie unter ${PRICE_RULES.minimumAgeFactor}. Um den Mittelwert legen wir ±${Math.round(PRICE_RULES.rangeWidth * 100)} % als grobe Spanne. Die Faktoren sind bewusst einfache Annahmen und stehen in <a href="https://github.com/Rebaiahmed/kleinanzeigen-seller-toolkit/blob/main/src/price.ts">src/price.ts</a>. Sie berücksichtigen weder Produktkategorie noch echte Verkaufspreise.</p></details>
    </section>

    <section class="section wrap" id="antwortvorlagen" aria-labelledby="replies-title">
      <div class="section-head"><span class="section-number">02 / NACHRICHTEN</span><h2 id="replies-title">Kleinanzeigen Antwortvorlagen</h2><p>Höfliche Entwürfe für typische Fragen. Passe eckige Platzhalter und Aussagen über Versand oder Reservierung vor dem Senden an.</p></div>
      <div class="reply-grid" id="reply-grid"></div>
      <p class="small-note">Die Vorlagen werden nur in deinem Browser angezeigt. Dieses Toolkit sendet keine Nachrichten.</p>
    </section>

    <section class="section wrap" id="checkliste" aria-labelledby="checklist-title">
      <div class="section-head"><span class="section-number">03 / ANZEIGE</span><h2 id="checklist-title">Kleinanzeigen Anzeige optimieren</h2><p>Sechs Punkte, die du vor dem Veröffentlichen kurz prüfen kannst.</p></div>
      <div class="panel checklist-layout">
        <div><div class="progress-top"><strong>Dein Fortschritt</strong><span id="progress-label" aria-live="polite">0 von 6 erledigt</span></div><progress id="progress" max="6" value="0" aria-label="Fortschritt der Anzeigen-Checkliste"></progress><div id="checklist-items" class="checklist-items"></div></div>
        <aside class="checklist-aside"><div class="aside-icon" aria-hidden="true">✓</div><h3>Kleine Details machen die Anzeige klarer.</h3><p>Eine ehrliche Beschreibung beantwortet Fragen, bevor sie im Chat entstehen. Prüfe besonders Zustand, Lieferumfang und Übergabe.</p><button type="button" class="text-button" id="reset-checklist">Checkliste zurücksetzen ↗</button></aside>
      </div>
      <p class="small-note">Dein Fortschritt bleibt nur auf diesem Gerät gespeichert. Du kannst ihn jederzeit zurücksetzen.</p>
    </section>

    <section class="boost-section"><div class="wrap boost-inner"><div><span class="section-number">MEHR MÖGLICHKEITEN</span><h2>Wenn aus einem Artikel viele werden.</h2><p>Du möchtest Konkurrenzpreise vergleichen, Anzeigen optimieren oder Reposts planen? Entdecke AnzeigenBoost.</p><p class="small-note">AnzeigenBoost ist ein separates Produkt des Toolkit-Erstellers. Manche Funktionen verwenden Credits und benötigen ein Konto.</p></div><div class="boost-actions"><a class="button dark" href="https://anzeigenboost.de/" rel="noopener noreferrer">AnzeigenBoost ansehen ↗</a><a class="boost-store" href="https://chromewebstore.google.com/detail/noagiapohlenpolcbeghlmngalapbobe" rel="noopener noreferrer">Chrome-Erweiterung ansehen →</a></div></div></section>
  </main>
  <footer class="footer wrap"><p>© <span id="year"></span> Kleinanzeigen Seller Toolkit · Ein unabhängiges Community-Projekt.</p><div><a href="https://github.com/Rebaiahmed/kleinanzeigen-seller-toolkit">Quellcode</a><a href="https://github.com/Rebaiahmed/kleinanzeigen-seller-toolkit/blob/main/LICENSE">MIT-Lizenz</a><a href="https://anzeigenboost.de/">Über AnzeigenBoost</a></div></footer>
`;

const euro = (value: number) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const priceForm = document.querySelector<HTMLFormElement>('#price-form')!;
priceForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const error = document.querySelector<HTMLElement>('#price-error')!;
  error.hidden = true;
  const data = new FormData(priceForm);
  const purchasePrice = Number(data.get('purchasePrice'));
  const ageYears = Number(data.get('ageYears'));
  const targetRaw = String(data.get('targetPrice') ?? '').trim();
  if (String(data.get('purchasePrice') ?? '').trim() === '' || String(data.get('ageYears') ?? '').trim() === '') {
    error.textContent = 'Bitte Kaufpreis und Alter eingeben.';
    error.hidden = false;
    return;
  }
  try {
    const result = estimatePrice({ purchasePrice, ageYears, condition: String(data.get('condition')) as Condition, ...(targetRaw ? { targetPrice: Number(targetRaw) } : {}) });
    document.querySelector<HTMLElement>('#result-empty')!.hidden = true;
    document.querySelector<HTMLElement>('#result-content')!.hidden = false;
    document.querySelector<HTMLElement>('#price-range')!.textContent = `${euro(result.low)} – ${euro(result.high)}`;
    document.querySelector<HTMLElement>('#calculation')!.textContent = `Rechnung: ${euro(purchasePrice)} × ${Math.round(result.conditionFactor * 100)} % Zustand × ${Math.round(result.ageFactor * 100)} % Alter ≈ ${euro(result.midpoint)}; Bereich ±${Math.round(PRICE_RULES.rangeWidth * 100)} %.`;
    const target = document.querySelector<HTMLElement>('#target-note')!;
    target.hidden = result.targetPosition === undefined;
    if (result.targetPosition) target.textContent = result.targetPosition === 'within' ? 'Dein Wunschpreis liegt innerhalb dieser groben Spanne.' : result.targetPosition === 'below' ? 'Dein Wunschpreis liegt unter dieser groben Spanne.' : 'Dein Wunschpreis liegt über dieser groben Spanne.';
  } catch (cause) {
    error.textContent = cause instanceof Error ? cause.message : 'Bitte prüfe deine Eingaben.';
    error.hidden = false;
  }
});

const replyGrid = document.querySelector<HTMLElement>('#reply-grid')!;
for (const [index, reply] of replies.entries()) {
  const card = document.createElement('article');
  card.className = 'reply-card';
  const label = document.createElement('div');
  label.className = 'reply-index';
  label.textContent = String(index + 1).padStart(2, '0');
  const heading = document.createElement('h3');
  heading.textContent = reply.title;
  const area = document.createElement('textarea');
  area.value = reply.text;
  area.rows = 4;
  area.setAttribute('aria-label', `${reply.title} – Antwort bearbeiten`);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'copy-button';
  button.textContent = 'Text kopieren ↗';
  const status = document.createElement('span');
  status.className = 'copy-status';
  status.setAttribute('role', 'status');
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent = 'Kopiert';
    } catch {
      area.focus();
      area.select();
      status.textContent = 'Kopieren nicht möglich – Text ist markiert.';
    }
  });
  card.append(label, heading, area, button, status);
  replyGrid.append(card);
}

const storageKey = 'kleinanzeigen-seller-toolkit-checklist-v1';
let checked: string[] = [];
try {
  const saved = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
  if (Array.isArray(saved)) checked = saved.filter((id): id is string => typeof id === 'string' && checklist.some((item) => item.id === id));
} catch { /* Checklist still works without storage. */ }

const checklistItems = document.querySelector<HTMLElement>('#checklist-items')!;
const updateProgress = () => {
  const count = checked.length;
  document.querySelector<HTMLProgressElement>('#progress')!.value = count;
  document.querySelector<HTMLElement>('#progress-label')!.textContent = `${count} von ${checklist.length} erledigt`;
  try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch { /* Storage can be disabled. */ }
};
for (const item of checklist) {
  const label = document.createElement('label');
  label.className = 'checklist-item';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.value = item.id;
  input.checked = checked.includes(item.id);
  const text = document.createElement('span');
  const title = document.createElement('strong');
  title.textContent = item.title;
  const detail = document.createElement('small');
  detail.textContent = item.detail;
  text.append(title, detail);
  label.append(input, text);
  input.addEventListener('change', () => {
    checked = input.checked ? [...checked, item.id] : checked.filter((id) => id !== item.id);
    updateProgress();
  });
  checklistItems.append(label);
}
document.querySelector<HTMLButtonElement>('#reset-checklist')!.addEventListener('click', () => {
  checked = [];
  checklistItems.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach((input) => { input.checked = false; });
  updateProgress();
});
updateProgress();
document.querySelector<HTMLElement>('#year')!.textContent = String(new Date().getFullYear());
