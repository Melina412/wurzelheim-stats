# Wurzelheim Stats 📊

> _English version below — [jump to English](#english)._

Ursprünglich eine kleine, statische Seite, die **Statistiken der
Pokémon-GO-Community „Wurzelheim Alexanderplatz"** (Berlin) visualisiert —
Wachstum, größte Events, Event-Typen und das aktive Herz der Community. Erster
Anlass war unser **5000-Mitglieder-Jubiläum** 🎉.

## Vom Jubiläum zum Generator

Auf Nachfrage aus der Community wurde aus der einen Seite ein **Generator**: Jede
Community kann sich ihre eigene, teilbaren Stats erstellen — in eigener Farbe und
unter einer eigenem Link (`/club/<id>`).

➡️ [Hier kannst du deine Stats generieren](https://stats.wurzelheim.de/generate) ✨

<a id="warum-keine-stats"></a>

## Voraussetzungen & Regeln

- **Nur Ambassador-Communities** können den Generator nutzen. Die Eventdaten kommen aus
  [cmpf-tools.de](https://cmpf-tools.de/), das (nach aktuellem Stand) nur Events
  von Communities mit **Ambassador-Status** erfasst. Für andere Gruppen liefert
  die Datenquelle keine Events — dann lässt sich keine Statistik erstellen.
- Du brauchst das **Master-Passwort.** Das bekommst du in der Ambassador-Community,
  z.B. auf Discord oder auf <a  href="mailto:melina.webdev@gmail.com"> Nachfrage per Email</a>.
- Der Generator hat einen **Cooldown von einer Woche.** Ein Club kann also höchstens einmal pro Woche
  neu generiert werden. Bedenke diese Einschränkung bevor du Stats für deine Gruppe generierst.

## Credits

Die Roh-Eventdaten beziehen wir über **[cmpf-tools.de](https://cmpf-tools.de/)**
von **topi314** ([campfire-tools](https://github.com/topi314/campfire-tools),
Apache-2.0). Vielen Dank für das großartige Tool! 🙏 Die Pokémon-GO- und
Campfire-Daten selbst gehören Niantic, Inc.

## Lizenz

Siehe [`LICENSE`](LICENSE).

---

<a id="english"></a>

# Wurzelheim Stats 📊

Originally a small, static site visualizing **statistics of the Pokémon GO
community "Wurzelheim Alexanderplatz"** (Berlin) — growth, biggest events, event
types and the active heart of the community. The first occasion was our
**5000-member milestone** 🎉.

## From milestone to generator

By popular demand from the community, the single page became a **generator**: any
community can create its own shareable stats page — in its own color and under its
own address (`/club/<id>`).

➡️ [You can generate your stats here](https://stats.wurzelheim.de/generate) ✨

## Requirements & rules

- **Only ambassador communities** can use the generator. The event data comes from
  [cmpf-tools.de](https://cmpf-tools.de/), which (as of now) only indexes events
  from communities with **ambassador status**. For other groups the data source
  returns no events — so no stats can be generated.
- You need the **master password.** You can get it within the ambassador community,
  e.g. on Discord or <a href="mailto:melina.webdev@gmail.com">by email request</a>.
- The generator has a **one-week cooldown.** So a club can be regenerated at most
  once per week. Keep this limit in mind before generating stats for your group.

## Credits

The raw event data is obtained via **[cmpf-tools.de](https://cmpf-tools.de/)** by
**topi314** ([campfire-tools](https://github.com/topi314/campfire-tools),
Apache-2.0). Huge thanks for the great tool! 🙏 The Pokémon GO and Campfire data
itself belongs to Niantic, Inc.

## License

See [`LICENSE`](LICENSE).

---

## Development

Requires **Node 22+** and the [Vercel CLI](https://vercel.com/docs/cli). The app's
serverless API (`/api/*`) needs the Vercel runtime, which plain Vite doesn't provide —
so use `vercel dev`, not `npm run dev`, for the full app.

```bash
npm install
npm i -g vercel        # if not installed
vercel link            # link to the Vercel project (one-time)
vercel dev             # http://localhost:3000 — frontend (HMR) + API
```

Secrets are read from a `.env.local` in the project root (also pullable with
`vercel env pull`):

```
UPSTASH_REDIS_REST_URL=…
UPSTASH_REDIS_REST_TOKEN=…
MASTER_PW=…
```

`npm run dev` (Vite only, port 5173) is fine for pure frontend work, but the `/api/*`
routes 404 without `vercel dev`.

### Scripts

- `npm run build` — production build
- `npm run stats` — list stored clubs with view + generation counts
- `npm run reset:club -- <id | link>` — clear a club's generate cooldown (keeps views)
