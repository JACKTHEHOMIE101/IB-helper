# Superday Prep

Investment banking interview prep for students recruiting from non-target schools: a spaced-repetition technicals drill (396 questions), AI mock interviews and full superday simulations, a resume story builder, a networking tracker with firm prep, a recruiting timeline, peer mocks and a finance club leaderboard. A free readiness quiz at `/quiz` works as the public landing page.

## How it's built

- **Server:** Node 20 + Express (`server.js`). Serves the app and a small JSON API.
- **Sign-in and database:** [Supabase](https://supabase.com). Email magic links (and Google, if you turn it on), plus Postgres.
- **AI:** the Anthropic API, called only from the server so your key stays private. Each call counts against the user's plan limit.
- **Payments:** Stripe Checkout for the Pro subscription, the Stripe customer portal for cancellations, and a webhook that sets each user's plan.
- **Frontend:** `public/index.html` (page and styles), `public/app.js` (the app), `public/bootstrap.js` (sign-in, account bar, upgrade dialog, and the connection between the app and the API).

### Plans

| | Free | Pro |
|---|---|---|
| Questions | 156-question core set | All 396 |
| Superday simulations | – | Yes |
| AI (grading, call prep, story drafts) | 15 calls per week | 150 calls per day (fair use) |
| Readiness, timeline, networking, firm prep, peer mocks, club leaderboard | Yes | Yes |

Change the limits with `FREE_AI_PER_WEEK` and `PRO_AI_PER_DAY`. The full question bank ships in `app.js` for everyone and the Pro features are gated in the app, so a determined user could read the extra questions in the page source. AI limits are enforced on the server.

## Run it locally (no accounts needed)

```bash
npm install
npm run dev
```

Open http://localhost:3000 and use **Local development sign-in**. This mode uses an in-memory database (cleared on restart) and a stand-in AI that returns fixed answers, so nothing costs money. It's refused when `NODE_ENV=production`.

```bash
npm test
```

## Set up for real

1. **Supabase.** Create a project. Under Authentication > URL Configuration, set the Site URL to your app's URL (for example `https://superdayprep.com`) and add it to Redirect URLs. Optionally enable Google under Authentication > Providers. Copy the project URL, anon key and the database connection string (Session pooler) into `.env`. The server creates its tables on startup.
2. **Anthropic.** Create an API key at console.anthropic.com and set `ANTHROPIC_API_KEY`. Set a monthly spend limit in the console.
3. **Stripe.** Create a product "Superday Prep Pro" with a recurring price and copy its Price ID to `STRIPE_PRICE_ID`. Add a webhook endpoint at `https://YOUR_DOMAIN/api/stripe/webhook` listening for `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`, and copy its signing secret to `STRIPE_WEBHOOK_SECRET`. Turn on the customer portal (Settings > Billing > Customer portal). Use test mode keys until you're ready.
4. **Deploy.** Any Node host works (Render, Railway, Fly.io). Build command `npm install`, start command `npm start`, and set the variables from `.env.example`, with `NODE_ENV=production` and `APP_URL` set to your public URL.

## AI cost

Grading and drafts use `claude-opus-5-5` ($4 per million input tokens, $20 per million output) and follow-up questions use `claude-haiku-5-5`. Expect roughly 2–5 cents per graded answer and roughly 50 cents to $1 per full superday simulation (about 17 calls), depending on answer length and how much the model reasons. These are estimates: measure real usage before setting prices. Set `AI_MODEL=claude-sonnet-5-5` to roughly halve the cost of the main calls. Check real usage in the Anthropic console after your first users.

## API

All `/api` routes except the Stripe webhook need `Authorization: Bearer <Supabase access token>`.

| Route | What it does |
|---|---|
| `GET /api/me`, `PATCH /api/me` | Account, plan and AI credits; change display name |
| `GET/PUT /api/docs/:doc` | Private saved progress (`prep`, `network`) |
| `GET /api/board?club=CODE`, `PUT /api/board`, `DELETE /api/board/:id` | Club leaderboard. You write only your own row; the club's creator or an admin can remove rows |
| `POST /api/profiles` | Display names of people on leaderboards |
| `POST /api/ai` | One AI call, limited by plan |
| `POST /api/billing/checkout`, `POST /api/billing/portal` | Stripe Checkout and customer portal links |
| `POST /api/stripe/webhook` | Stripe events that set the plan |

## Before launch

- Have people who recruited in the last cycle check the recruiting timeline and the question bank.
- Add a privacy policy and terms (you store resumes, networking notes and emails), and a support email.
- Turn on Supabase's email rate limits and confirm the sign-in email lands in school inboxes.
