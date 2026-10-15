# CV sobivuse kontroll: frontend

Next.js rakendus. Kasutaja kleebib töökuulutuse ja oma CV ning näeb sobivusskoori, puudusi, CV parandusi, puuduvaid märksõnu ja valmis kaaskirja.

## Käivitamine

```bash
npm install
npm run dev
```

Ava [http://localhost:3000](http://localhost:3000).

## Keskkonnamuutujad

Kopeeri `.env.example` failiks `.env.local` ja täida väärtused.

| Muutuja | Kus | Milleks |
|---|---|---|
| `NEXT_PUBLIC_MOCK_API=1` | brauser | Kogu UI töötab võltsandmetega, backendi ega Supabase'i pole vaja. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | brauser | Tagasiside ja ootenimekirja kirjutamine. Avalikud, RLS lubab ainult `insert`. |
| `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `IP_HASH_SALT` | server | `app/api/analyze` route: limiit ja tulemuse salvestamine. |
| `LLM_API_KEY` | server | AI kutse. Tühjana töötab backend demorežiimis. |

Serveri muutujatele ei tohi kunagi `NEXT_PUBLIC_` eesliidet panna, muidu jõuavad need brauserisse.

Frontend eeldab:

| Mida | Kuidas |
|---|---|
| `POST /api/analyze` | Päring `{ job_text, cv_text }`, vastus vastavalt lepingule (`lib/types.ts`). Vead: `400`, `429`, `500`. |
| Tabel `feedback` | `anon` võib teha ainult `insert`: `analysis_id`, `helpful`, `comment` |
| Tabel `waitlist` | `anon` võib teha ainult `insert`: `email` (unikaalne, korduv e-post annab `409`) |

## Veaolekute eelvaade

Võltsrežiimis saab iga veaolekut vaadata URL-i parameetriga: `?mock_error=400`, `429`, `500` või `network`.

## Struktuur

```
app/              leht, layout ja disainimuutujad (globals.css)
components/       vorm, laadimisolek, veateade
components/results/  tulemuse vaade ja selle osad
lib/              API klient, Supabase'i insertid, tüübid, võltsandmed
app/api/analyze/  backend: AI analüüs (backendi inimese kood)
```

## Tootmisversioon kohalikus arvutis

```bash
npm run build
npm start
```

`NEXT_PUBLIC_` väärtused loetakse buildi ajal, seega pärast `.env.local` muutmist tuleb uuesti `npm run build` teha.
