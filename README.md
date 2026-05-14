# Local Setup

---

## Assumptions

- Money is stored internally as INR minor units (paise) to avoid floating-point precision issues.
- Deposit amounts use string input (e.g. `"42.50"`) instead of JSON numbers for deterministic parsing.
- Authentication tokens do not expire for assignment simplicity.
- Deposits execute inside a database transaction with pessimistic row locking to avoid lost updates during concurrent balance modifications.

---

## Requirements

* Node.js 20+
* Docker

---

## Start PostgreSQL

Run a local PostgreSQL container for the assignment:

```bash
docker run --name glomopay-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=glomopay_assignment \
  -p 5434:5432 \
  -d postgres:15
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3200
DATABASE_URL=postgres://postgres:postgres@localhost:5434/glomopay_assignment
```

---

## Install Dependencies

```bash
npm install
```

---

## Seed Users (Alice & Bob)

Run once (or after resetting the database):

```bash
npm run seed
```

---

## Run Development Server

```bash
npm run dev
```

The server listens on `PORT` from `.env` (default **3200**).

---

## Test APIs (`curl`)

**Login**

```bash
curl -sS -X POST "http://localhost:3200/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","pin":"1234"}'
```

Copy `token` from the response.

**Balance** (Bearer token from login)

```bash
TOKEN="<paste-token-here>"

curl -sS "http://localhost:3200/balance" \
  -H "Authorization: Bearer $TOKEN"
```

Expect `{"balance":"1000.00"}` for Alice after a fresh seed.

**Deposit** — add ₹42.50

```bash
curl -sS -X POST "http://localhost:3200/deposit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"42.50"}'
```

**Invalid deposit** (wrong type, too many decimals, zero, or not positive)

```bash
curl -sS -w "\nHTTP:%{http_code}\n" -X POST "http://localhost:3200/deposit" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":"0"}'
```

---

## Docker Cleanup

Stop container:

```bash
docker stop glomopay-postgres
```

Start existing container again:

```bash
docker start glomopay-postgres
```

Remove container completely:

```bash
docker rm -f glomopay-postgres
```
