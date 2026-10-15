# CV sobivuse kontroll: frontend

Next.js rakendus. Kasutaja kleebib töökuulutuse ja oma CV ning näeb sobivusskoori, puudusi, CV parandusi, puuduvaid märksõnu ja valmis kaaskirja.

## Käivitamine

```bash
npm install
npm run dev
```

Ava [http://localhost:3000](http://localhost:3000).

## Supabase'i ühendamine

Ilma keskkonnamuutujateta töötab rakendus **võltsandmetega**, nii et kasutajaliidest saab arendada ka ilma backendita. Päris API kasutamiseks kopeeri `.env.example` failiks `.env.local` ja täida väärtused:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<projekt>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon võti>
```

Mõlemad väärtused on avalikud: andmeid kaitsevad RLS ja Edge Function. `LLM_API_KEY` ja `service_role` võti ei tohi kunagi siia sattuda.

Frontend eeldab Supabase'ilt järgmist:

| Mida | Kuidas |
|---|---|
| `POST /functions/v1/analyze` | Päring `{ job_text, cv_text }`, vastus vastavalt lepingule (`lib/types.ts`). Vead: `400`, `429`, `500`. |
| Tabel `feedback` | `anon` võib teha ainult `insert`: `analysis_id`, `helpful`, `comment` |
| Tabel `waitlist` | `anon` võib teha ainult `insert`: `email` (unikaalne, korduv e-post annab `409`) |
| CORS | Edge Function lubab ainult ühe päritolu (secret `ALLOWED_ORIGIN`). Lokaalseks testimiseks päris API vastu peab see olema `http://localhost:3000`, tootmises Verceli domeen. |

## Veaolekute eelvaade

Võltsrežiimis saab iga veaolekut vaadata URL-i parameetriga: `?mock_error=400`, `429`, `500` või `network`.

## Struktuur

```
app/              leht, layout ja disainimuutujad (globals.css)
components/       vorm, laadimisolek, veateade
components/results/  tulemuse vaade ja selle osad
lib/              API klient, Supabase'i insertid, tüübid, võltsandmed
```

## Deploy

Vercelis tuleb **Root Directory** väärtuseks panna `cv-check` ja keskkonnamuutujatesse lisada kaks ülaltoodud `NEXT_PUBLIC_` väärtust.
