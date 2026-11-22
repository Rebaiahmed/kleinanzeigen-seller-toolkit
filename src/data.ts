export const replies = [
  { id: 'last-price', title: '„Was letzte Preis?“', text: 'Hallo! Danke für dein Interesse. Mein Preis steht in der Anzeige. Wenn du einen konkreten Vorschlag hast, schaue ich ihn mir gern an.' },
  { id: 'low-offer', title: 'Sehr niedriges Angebot', text: 'Danke für dein Angebot. Für diesen Betrag möchte ich den Artikel nicht abgeben. Wenn du etwas näher an meinem Preis liegst, können wir gern sprechen.' },
  { id: 'fixed', title: 'Festpreis', text: 'Hallo! Der angegebene Preis ist für mich ein Festpreis. Wenn das für dich passt, können wir gern die Übergabe besprechen.' },
  { id: 'counter', title: 'Gegenangebot', text: 'Danke für deinen Vorschlag. Ich hatte mir etwas mehr vorgestellt. Wäre [DEIN GEGENANGEBOT] € für dich in Ordnung?' },
  { id: 'shipping', title: 'Versand', text: 'Hallo! Versand ist [MÖGLICH / LEIDER NICHT MÖGLICH]. Falls wir versenden, klären wir Versandart, Kosten und Zahlung bitte vorab gemeinsam.' },
  { id: 'pickup', title: 'Abholung', text: 'Hallo! Eine Abholung wäre am [TAG] um [UHRZEIT] möglich. Passt dir das? Den genauen Treffpunkt schicke ich dir nach deiner Bestätigung.' },
  { id: 'reservation', title: 'Reservierung', text: 'Hallo! Ich kann den Artikel bis [TAG/UHRZEIT] für dich reservieren. Gib mir bitte kurz Bescheid, ob du ihn bis dahin abholen kannst.' },
  { id: 'no-show', title: 'Nicht erschienen', text: 'Hallo! Wir hatten uns für [UHRZEIT] verabredet, aber ich habe dich nicht gesehen. Möchtest du einen neuen Termin vorschlagen? Sonst gebe ich den Artikel wieder frei.' },
] as const;

export const checklist = [
  { id: 'title', title: 'Klarer Titel', detail: 'Artikel, Modell und wichtige Eigenschaft nennen.' },
  { id: 'photos', title: 'Gute Fotos', detail: 'Tageslicht, mehrere Ansichten und sichtbare Mängel.' },
  { id: 'condition', title: 'Ehrliche Zustandsbeschreibung', detail: 'Gebrauchsspuren und Defekte konkret angeben.' },
  { id: 'price', title: 'Plausibler Preis', detail: 'Ähnliche Angebote selbst vergleichen; Zustand und Zubehör beachten.' },
  { id: 'category', title: 'Kategorie & Suchbegriffe', detail: 'Passende Kategorie wählen und natürliche Begriffe verwenden.' },
  { id: 'handover', title: 'Abholung & Versand', detail: 'Klar sagen, was du tatsächlich anbietest.' },
] as const;
