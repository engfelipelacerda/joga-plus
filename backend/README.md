## Backend Setup

## Prerequisites

Before running the project, make sure you have the following installed on your machine:

- **Git** – https://git-scm.com/downloads
- **Node.js** (LTS version recommended) – https://nodejs.org/
- **Docker Desktop** (includes Docker Compose) – https://www.docker.com/products/docker-desktop/

You can verify the installation by running:

```bash
git --version
node --version
docker --version
docker compose version
```

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

Example configuration:

```env
# Database configuration
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=db_jogaplus
MYSQL_USER=user
MYSQL_PASSWORD=user123

# Prisma connection string
DATABASE_URL="mysql://user:user123@localhost:3306/db_jogaplus"

# Authentication
JWT_SECRET=your_jwt_secret
```

4. Start the Docker containers:

```bash
docker compose up -d
```

This command starts both the **MySQL** database and **Adminer**. If the images are not already available, Docker will download them automatically.

- **MySQL** runs on port **3306**.
- **Adminer** is available at:

```text
http://localhost:8080
```

Adminer provides a web interface for viewing and managing the database.

Use the same database credentials defined in your `.env` file to log in. With the example configuration above:

| Field    | Value       |
| -------- | ----------- |
| System   | MySQL       |
| Server   | mysql       |
| Username | user        |
| Password | user123     |
| Database | db_jogaplus |

> **Note:** When accessing Adminer from the Docker Compose network, the **Server** must be `mysql`, which is the name of the MySQL service, not `localhost`.

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

To stop the MySQL and Adminer containers:

```bash
docker compose down
```

To remove the database volume and start with a clean database:

```bash
docker compose down -v
```
