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

5. Generate prisma client

```bash
npx prisma generate
```

6. Start the backend server:

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

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

### Login

**POST** `/login`

Request body:

```json
{
  "username": "player1",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Password Security

Passwords are hashed using bcrypt before being stored in the database.

As a result, passwords are never stored in plain text.

### Environment Variable

The JWT secret key must be configured in the `.env` file:

```env
JWT_SECRET=your_jwt_secret
```

This key is used to generate and validate authentication tokens.

## Authentication and Protected Routes

The API uses JSON Web Tokens (JWT) for authentication.

### Public Routes

The following routes can be accessed without authentication:

| Method | Route    |
| ------ | -------- |
| POST   | `/users` |
| POST   | `/login` |

### Protected Routes

The following routes require a valid JWT token:

| Method | Route        |
| ------ | ------------ |
| GET    | `/users`     |
| PUT    | `/users/:id` |
| DELETE | `/users/:id` |

### Login

To obtain a JWT token, send a request to:

**POST** `/login`

Request body:

```json
{
  "username": "player1",
  "password": "password123"
}
```

Successful response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Using the Token in Insomnia

After a successful login, copy the returned token.

#### Bearer Token Authentication

1. Open the request you want to send.
2. Select the **Auth** tab.
3. Choose **Bearer Token** as the authentication type.
4. Paste the JWT token into the **Token** field.

### Authentication Errors

If no token is provided when accessing a protected route:

```json
{
  "error": true,
  "message": "Token não informado."
}
```

If the token is invalid or expired:

```json
{
  "error": true,
  "message": "Token inválido."
}
```
