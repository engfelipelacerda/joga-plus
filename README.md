# Joga Plus

Your personal hub for organizing and tracking video game collections.

## Prerequisites

Before running the project, make sure you have installed:

- Git
- Node.js
- Docker
- Docker Compose

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

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

If your operating system does not support this command, create a `.env` file manually and copy the contents from `.env.example`.

4. Start the MySQL container:

```bash
docker compose up -d
```

The MySQL image will be downloaded automatically if it is not already available.

5. Start the backend server:

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

## API Testing

The API can be tested using tools such as:

- Insomnia

### Create User

**POST** `/users`

Request body:

```json
{
  "username": "player1",
  "email": "player1@example.com",
  "birth_date": "2000-01-01",
  "password": "password123"
}
```

### Update User

**PUT** `/users/:id`

Request body:

```json
{
  "username": "player2",
  "email": "player2@example.com",
  "birth_date": "2000-01-01",
  "password": "newpassword123"
}
```

### List Users

**GET** `/users`

### Delete User

**DELETE** `/users/:id`
