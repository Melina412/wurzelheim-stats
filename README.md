# Wurzelheim Stats 📊

Eine kleine, statische Seite, die **Statistiken der Pokémon-GO-Community-Gruppe
„Wurzelheim Alexanderplatz"** (Berlin) visualisiert — Wachstum, größte Events,
Event-Typen und das aktive Herz der Community.

_(English version below — [jump to English](#english).)_

Anlass des ersten Releases war unser **5000-Mitglieder-Jubiläum** 🎉. Die Seite
ist aber bewusst allgemein gehalten: Die Zahlen lassen sich jederzeit neu
aggregieren, sodass „Wurzelheim Stats" auch über das Jubiläum hinaus aktuelle
Community-Statistiken zeigen kann.

> **Hinweis zur Mitgliederzahl:** Die echte Mitgliederzahl (5000) stammt direkt aus
> der Campfire-App und ist **nicht** Teil dieser Daten. Die ausgewerteten Daten sind
> _event-basiert_ (RSVPs/Check-ins pro Event) — Kennzahlen wie „einzigartige
> Teilnehmer" zählen, wer je bei einem Event eingecheckt hat, und sind unabhängig
> von der Campfire-Mitgliederzahl.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (CSS-first config in `src/index.css`)
- **recharts** (Charts), **framer-motion** (Animationen), **lucide-react** (Icons)
- Dark/Light Theme über `src/hooks/useTheme.ts` (`.dark` Klasse auf `<html>`)
- Kein Backend — alle Zahlen werden einmalig aus statischen Rohdaten aggregiert.

## Datenfluss

```
data/events_raw.json   (Roh-Dump der Campfire-Events, ~290 Events)
        │  node scripts/aggregate.mjs
        ▼
src/data/stats.json    (schlanke, fertige Kennzahlen fürs Frontend)
```

Die Rohdaten enthalten Usernames (PII) und liegen daher in `.gitignore` — sie werden
**nicht** ins Repo committet. `src/data/stats.json` ist anonymisiert.

### Daten neu aggregieren / aktualisieren

```bash
# aktuelle Rohdaten ziehen (Club-ID = unsere Gruppe)
curl -s "https://cmpf-tools.de/api/clubs/d9db54b6-fa9a-446e-9852-b7aa6a2714c1/events" -o data/events_raw.json
node scripts/aggregate.mjs   # schreibt src/data/stats.json
```

## Entwicklung

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Produktion -> dist/
```

## Deployment

Statischer Build (`dist/`) — kostenlos auf Vercel/Netlify deploybar.

## Credits

Die Roh-Eventdaten beziehen wir über **[cmpf-tools.de](https://cmpf-tools.de/)** von
**topi314** ([campfire-tools](https://github.com/topi314/campfire-tools), Apache-2.0).
Vielen Dank für das großartige Tool! 🙏 Die Pokémon-GO- und Campfire-Daten selbst
gehören Niantic, Inc.

## Lizenz

Siehe [`LICENSE`](LICENSE).

---

<a id="english"></a>

# Wurzelheim Stats 📊

A small, static site that visualizes **statistics of the Pokémon GO community group
"Wurzelheim Alexanderplatz"** (Berlin) — growth, biggest events, event types and the
active heart of the community.

The first release was made for our **5000-member milestone** 🎉. The site is kept
deliberately generic, though: the numbers can be re-aggregated at any time, so
"Wurzelheim Stats" can keep showing up-to-date community statistics beyond the
milestone.

> **Note on the member count:** The real member count (5000) comes directly from the
> Campfire app and is **not** part of this data. The analyzed data is _event-based_
> (RSVPs/check-ins per event) — metrics like "unique participants" count everyone who
> ever checked in to an event and are independent of the Campfire member count.

## Stack

- **Vite + React + TypeScript**
- **Tailwind CSS v4** (CSS-first config in `src/index.css`)
- **recharts** (charts), **framer-motion** (animations), **lucide-react** (icons)
- Dark/Light theme via `src/hooks/useTheme.ts` (`.dark` class on `<html>`)
- No backend — all numbers are aggregated once from static raw data.

## Data flow

```
data/events_raw.json   (raw dump of Campfire events, ~290 events)
        │  node scripts/aggregate.mjs
        ▼
src/data/stats.json    (lean, ready-to-use metrics for the frontend)
```

The raw data contains usernames (PII) and is therefore in `.gitignore` — it is **not**
committed to the repo. `src/data/stats.json` is anonymized.

### Re-aggregate / update the data

```bash
# fetch the current raw data (club ID = our group)
curl -s "https://cmpf-tools.de/api/clubs/d9db54b6-fa9a-446e-9852-b7aa6a2714c1/events" -o data/events_raw.json
node scripts/aggregate.mjs   # writes src/data/stats.json
```

## Development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production -> dist/
```

## Deployment

Static build (`dist/`) — deployable for free on Vercel/Netlify.

## Credits

The raw event data is obtained via **[cmpf-tools.de](https://cmpf-tools.de/)** by
**topi314** ([campfire-tools](https://github.com/topi314/campfire-tools), Apache-2.0).
Huge thanks for the great tool! 🙏 The Pokémon GO and Campfire data itself belongs to
Niantic, Inc.

## License

See [`LICENSE`](LICENSE).
