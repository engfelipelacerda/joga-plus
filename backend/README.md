# Joga Plus BACKEND

## Prerequisites

Before running the project, make sure you have installed:

- Git
- Node.js
- Docker

## Backend Setup

1. Clone the repository:

```bash
git clone <https://github.com/engfelipelacerda/joga-plus.git>
cd joga-plus/backend
```

2. Install the project dependencies:

```bash
npm install
```

3. ## Backend Setup

1. Clone the repository:

```bash
git clone https://github.com/engfelipelacerda/joga-plus.git
cd joga-plus/backend
```

2. Install the project dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

If your operating system does not support this command, create a `.env` file manually and copy the contents from `.env.example`.

Review the variables and update them according to your local environment, especially the database credentials and `DATABASE_URL`.

4. Start the MySQL container:

```bash
docker compose up -d
```

The MySQL image will be downloaded automatically if it is not already available.

5. Generate the Prisma Client:

```bash
npx prisma generate
```

6. Create/update the database schema:

```bash
npx prisma db push
```

This command creates the database tables based on the Prisma schema.

7. Start the backend server:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3333
```

## Stopping the database

To stop the MySQL container:

```bash
docker compose down
```

To remove the database volume and start with a clean database:

```bash
docker compose down -v
```
