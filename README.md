
# Project Title

A brief description of what this project does and who it's for

# beresin-express-backend-app

## Backend of BeresIn

This is an [Express.js](https://expressjs.com) project with a [PostgreSQL](https://www.postgresql.org) database using [Knex.js](https://knexjs.org) for query building.
## Authors

- [@teamberesin](https://github.com/teamberesin)
- [@beresindev](https://github.com/beresindev)
## Tech Stack

- **Programming Language / Superset:** [Typescript](https://www.typescriptlang.org)
- **Runtime Environment:** [Node.js](https://nodejs.org)
- **Framework:** [Express](https://expressjs.com)
- **Query Builder:** [Knex](https://knexjs.org)
- **RDBMS:** [PostgreSQL](https://www.postgresql.org)
- [JWT](https://jwt.io/) Authentication / Authorization

### Installation Guide for `beresindev-beresin-express-backend-app`

#### **Step 1: Clone the Project**

```bash
# Clone the repository from GitHub
git clone https://github.com/beresindev/beresindev-beresin-express-backend-app.git

# Change into the project directory
cd beresindev-beresin-express-backend-app
```

---

#### **Step 2: Install Dependencies**

```bash
# Install all required npm packages
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

---

#### **Step 3: Configure Environment Variables**

1. Copy the example environment file to create a local environment file:
    ```bash
    cp .env.local.example .env.local
    ```

2. Update the `.env.local` file with your specific configuration:

```env
DB_NAME=TOBEMODIFIED
DB_HOST=TOBEMODIFIED
DB_PORT=TOBEMODIFIED
DB_USER=TOBEMODIFIED
DB_PASSWORD=TOBEMODIFIED
PORT=TOBEMODIFIED

JWT_SECRET=TOBEMODIFIED
```

---

#### **Step 4: Knex Migrations**

**Rollback Migrations** (Optional if you need to reset):

```bash
npx knex migrate:rollback --specific 20241101145250_create_category_services_table.ts
npx knex migrate:rollback --specific 20241101145251_create_service_table.ts
```

**Run Migrations**:

```bash
npx knex migrate:up 20241101074044_create_users_table.ts --knexfile knexfile.ts
npx knex migrate:up 20241101145250_create_category_services_table.ts --knexfile knexfile.ts
npx knex migrate:up 20241101145223_create_service_table.ts --knexfile knexfile.ts
npx knex migrate:up 20241101145304_create_sub_category_table.ts --knexfile knexfile.ts
```

---

#### **Step 5: Seed Database**

```bash
# Populate the database with an admin user
npx knex seed:run --specific=create_admin_user.ts
```

---

#### **Step 6: Start the Application**

```bash
# Start the Express server
npm start
# Access the API at http://localhost:3000
```

---

This guide provides full setup instructions for the backend application using **Express**, **JWT** for authentication, **Knex** for database migrations, and **PostgreSQL** as the database. Ensure **PostgreSQL** is configured and running.
## API Reference

#### Get 
### 1. Authentication

#### **Endpoint: POST /auth/login**

| Parameter      | Type     | Description                    |
| -------------- | -------- | ------------------------------ |
| `email`        | `string` | **Required**. User's email     |
| `password`     | `string` | **Required**. User's password  |

#### **Example Request Body**:
```json
{
  "email": "firstadmin@mail.com",
  "password": "Admin123,"
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "message": "Login successful",
  "token": "your_jwt_token",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "firstadmin@mail.com",
    "role": "admin"
  }
}
```

---

#### **Endpoint: POST /auth/register**

| Parameter        | Type     | Description                    |
| ---------------- | -------- | ------------------------------ |
| `username`       | `string` | **Required**. User's username  |
| `name`           | `string` | **Required**. User's full name |
| `email`          | `string` | **Required**. User's email     |
| `phone`          | `string` | **Required**. User's phone     |
| `password`       | `string` | **Required**. User's password  |

#### **Example Request Body**:
```json
{
  "username": "testuser2",
  "name": "Test User 2",
  "email": "testuser2@example.com",
  "phone": "123456789",
  "password": "testpassword"
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "message": "User registered successfully",
  "token": "your_jwt_token",
  "user": {
    "id": 3,
    "username": "testuser2",
    "name": "Test User 2",
    "email": "testuser2@example.com",
    "phone": "123456789",
    "role": "User",
    "created_at": "2024-11-02T18:49:15.231Z",
    "updated_at": "2024-11-02T18:49:15.231Z"
  }
}
```

### 2. Admin

#### **Endpoint: GET /admin/services**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. Admin API key   |

#### **Example Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": 1,
      "created_at": "2024-11-01T18:36:42.777Z",
      "updated_at": "2024-11-01T18:36:42.777Z",
      "user_id": 2,
      "isSubscription": true,
      "name_of_service": "Jasa Design",
      "category_id": 1,
      "description": "Jasa design web dan aplikasi",
      "status": "decline"
    },
    {
      "id": 2,
      "created_at": "2024-11-02T19:19:18.752Z",
      "updated_at": "2024-11-02T19:19:18.752Z",
      "user_id": 3,
      "isSubscription": true,
      "name_of_service": "Jasa Laundry",
      "category_id": 2,
      "description": "Laundry Baju, Kemeja kecuali CD",
      "status": "pending"
    }
  ]
}
```

---

#### **Endpoint: PATCH /admin/services/:id/status**

| Parameter    | Type     | Description                          |
| ------------ | -------- | ------------------------------------ |
| `api_key`    | `string` | **Required**. Admin API key          |
| `status`     | `string` | **Required**. Status: accept, decline, or pending |

#### **Example Request Body**:
```json
{
  "status": "accept"
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "service": {
    "id": 1,
    "created_at": "2024-11-01T18:36:42.777Z",
    "updated_at": "2024-11-01T18:36:42.777Z",
    "user_id": 2,
    "isSubscription": true,
    "name_of_service": "Jasa Design",
    "category_id": 1,
    "description": "Jasa design web dan aplikasi",
    "status": "accept"
  }
}
```

---

#### **Endpoint: DELETE /admin/services/:id**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. Admin API key   |

#### **Example Response**:
```json
{
  "status": "success",
  "message": "Service deleted successfully"
}
```

---

#### **Endpoint: GET /admin/category**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. Admin API key   |

#### **Example Response**:
```json
{
  "status": "success",
  "category": [
    {
      "id": 1,
      "name_of_category": "Technology"
    },
    {
      "id": 2,
      "name_of_category": "Household"
    },
    {
      "id": 3,
      "name_of_category": "Uncategories"
    }
  ]
}
```

---

#### **Endpoint: POST /admin/category**

| Parameter            | Type     | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `api_key`            | `string` | **Required**. Admin API key        |
| `name_of_category`   | `string` | **Required**. Category name        |

#### **Example Request Body**:
```json
{
  "name_of_category": "Technology"
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "category": {
    "id": 1,
    "name_of_category": "Technology"
  }
}
```

---

#### **Endpoint: PUT /admin/category/:id**

| Parameter            | Type     | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `api_key`            | `string` | **Required**. Admin API key        |
| `name_of_category`   | `string` | **Required**. New category name    |

#### **Example Request Body**:
```json
{
  "name_of_category": "Uncategories"
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "category": {
    "id": 3,
    "name_of_category": "Uncategories"
  }
}
```

---

#### **Endpoint: DELETE /admin/category/:id**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. Admin API key   |

#### **Example Response**:
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

### 3. User

#### **Endpoint: GET /user/services**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. User API key    |

#### **Example Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": 2,
      "created_at": "2024-11-02T19:19:18.752Z",
      "updated_at": "2024-11-02T19:19:18.752Z",
      "user_id": 3,
      "isSubscription": true,
      "name_of_service": "Jasa Laundry",
      "category_id": 2,
      "description": "Laundry Baju, Kemeja kecuali CD",
      "status": "pending"
    }
  ]
}
```

---

#### **Endpoint: POST /user/services**

| Parameter            | Type     | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `api_key`            | `string` | **Required**. User API key         |
| `name_of_service`    | `string` | **Required**. Name of the service  |
| `category_id`        | `integer`| **Required**. ID of the category   |
| `description`        | `string` | **Required**. Description of service |
| `isSubscription`     | `boolean`| **Required**. Subscription status  |

#### **Example Request Body**:
```json
{
  "name_of_service": "Jasa Perbaikan Laptop/PC/HP",
  "category_id": 1,
  "description": "Jasa perbaikan laptop, pc, dan hp dengan harga murah",
  "isSubscription": true
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "service": {
    "id": 2,
    "created_at": "2024-11-02T19:19:18.752Z",
    "updated_at": "2024-11-02T19:19:18.752Z",
    "user_id": 3,
    "isSubscription": true,
    "name_of_service": "Jasa Perbaikan Laptop/PC/HP",
    "category_id": 1,
    "description": "Jasa perbaikan laptop, pc, dan hp dengan harga murah",
    "status": "pending"
  }
}
```

---

#### **Endpoint: PUT /user/services/:id**

| Parameter            | Type     | Description                        |
| -------------------- | -------- | ---------------------------------- |
| `api_key`            | `string` | **Required**. User API key         |
| `name_of_service`    | `string` | **Required**. Name of the service  |
| `category_id`        | `integer`| **Required**. ID of the category   |
| `description`        | `string` | **Required**. Description of service |
| `isSubscription`     | `boolean`| **Required**. Subscription status  |

#### **Example Request Body**:
```json
{
  "name_of_service": "Jasa Perbaikan",
  "category_id": 1,
  "description": "Perbaikan Laptop, Hp, dan Komputer",
  "isSubscription": true
}
```

#### **Example Response**:
```json
{
  "status": "success",
  "service": {
    "id": 2,
    "created_at": "2024-11-02T19:19:18.752Z",
    "updated_at": "2024-11-02T19:19:18.752Z",
    "user_id": 3,
    "isSubscription": true,
    "name_of_service": "Jasa Perbaikan",
    "category_id": 1,
    "description": "Perbaikan Laptop, Hp, dan Komputer",
    "status": "accept"
  }
}
```

---

#### **Endpoint: DELETE /user/services/:id**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. User API key    |

#### **Example Response**:
```json
{
  "status": "success",
  "message": "Service deleted successfully"
}
```

---

#### **Endpoint: GET /user/category**

| Parameter  | Type     | Description                   |
| ---------- | -------- | ----------------------------- |
| `api_key`  | `string` | **Required**. User API key    |

#### **Example Response**:
```json
{
  "status": "success",
  "category": [
    {
      "id": 1,
      "name_of_category": "Technology"
    },
    {
      "id": 2,
      "name_of_category": "Household"
    },
    {
      "id": 3,
      "name_of_category": "Uncategories"
    }
  ]
}
```

---

### 4. Public

#### **Endpoint: GET /services/all**

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| None      | -        | No parameters required    |

#### **Example Response**:
```json
{
  "status": "success",
  "services": [
    {
      "id": 2,
      "created_at": "2024-11-02T19:19:18.752Z",
      "updated_at": "2024-11-02T19:19:18.752Z",
      "user_id": 3,
      "isSubscription": true,
      "name_of_service": "Jasa Laundry",
      "category_id": 2,
      "description": "Laundry Baju, Kemeja kecuali CD",
      "status": "accept"
    },
    {
      "id": 1,
      "created_at": "2024-11-01T18:36:42.777Z",
      "updated_at": "2024-11-01T18:36:42.777Z",
      "user_id": 2,
      "isSubscription": true,
      "name_of_service": "Jasa Design",
      "category_id": 1,
      "description": "Jasa design web dan aplikasi",
      "status": "accept"
    }
  ]
}
```

---

#### **Endpoint: GET /category**

| Parameter | Type     | Description               |
| --------- | -------- | ------------------------- |
| None      | -        | No parameters required    |

#### **Example Response**:
```json
{
  "status": "success",
  "category": [
    {
      "id": 1,
      "name_of_category": "Technology"
    },
    {
      "id": 2,
      "name_of_category": "Household"
    },
    {
      "id": 3,
      "name_of_category": "Uncategories"
    }
  ]
}
```
## Used By

This project is used by the following companies:

- [Agile Teknik](https://agileteknik.com)
- [PENS](https://pens.id)

## Support

For support, email teambersine@gmail.com.

