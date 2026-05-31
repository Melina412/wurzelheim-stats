# Wurzelheim Stats 📊

Eine kleine, statische Seite, die **Statistiken der Pokémon-GO-Community-Gruppe
„Wurzelheim Alexanderplatz"** (Berlin) im modernen GO-Look zeigt — Wachstum,
größte Events, Event-Typen und das aktive Herz der Community.

Anlass des ersten Releases war unser **5000-Mitglieder-Jubiläum** 🎉. Die Seite
ist aber bewusst allgemein gehalten: Die Zahlen lassen sich jederzeit neu
aggregieren, sodass „Wurzelheim Stats" auch über das Jubiläum hinaus aktuelle
Community-Statistiken zeigen kann.

> **Hinweis zur Mitgliederzahl:** Die echte Mitgliederzahl (5000) stammt direkt aus
> der Campfire-App und ist **nicht** Teil dieser Daten. Die ausgewerteten Daten sind
> *event-basiert* (RSVPs/Check-ins pro Event) — Kennzahlen wie „einzigartige
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
