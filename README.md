# Local Setup

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
PORT=3000

DATABASE_URL=postgres://postgres:postgres@localhost:5434/glomopay_assignment
```

---

## Install Dependencies

```bash
npm install
```

---

## Run Development Server

```bash
npm run dev
```

---

## Test Login API

```bash
curl --request POST \
  --url http://localhost:3200/auth/login \
  --header 'Content-Type: application/json' \
  --data '{
    "email": "alice@example.com",
    "pin": "1234"
  }'
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
