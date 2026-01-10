# PayMint Service

A comprehensive Fintech application featuring a modern React frontend and a secure Node.js/Express backend. Users can manage finances, transfer money securely, and track transaction history.

## 🏗 Architecture

The project is divided into two main components:
1.  **Frontend (`PayMint_frontend_new`)**: A Vite + React application.
2.  **Backend (`PayMint_backend/server`)**: A Node.js + Express server with PostgreSQL.

![Architecture Diagram](PayMint_frontend_new/public/images/backend_architecture.png)

---

## 🖥️ Frontend Documentation

### Features
- **Dashboard**: Real-time balance and activity overview.
- **Transfers**: Secure peer-to-peer money transfers.
- **Response Design**: Fully responsive UI built with Tailwind CSS.

### Tech Stack
- **Framework**: React 18, Vite
- **State**: Context API (`AuthContext`, `WalletContext`)
- **Styling**: Tailwind CSS
- **Testing**: Vitest

### Setup & Run
1.  Navigate to the directory:
    ```bash
    cd PayMint_frontend_new
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```
    Access at `http://localhost:8080`.

---

## ⚙️ Backend Documentation

### Features
- **ACID Transactions**: Prisma-managed transactions ensuring data integrity.
- **Security**: JWT Authentication and bcrypt password hashing.
- **API**: RESTful endpoints for user management and transaction processing.

### Tech Stack
- **Runtime**: Node.js, Express.js
- **Database**: PostgreSQL (Prisma ORM)
- **Auth**: JWT, bcrypt

### Setup & Run
1.  Navigate to the server directory:
    ```bash
    cd PayMint_backend/server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment (`.env`):
    ```env
    DATABASE_URL="postgresql://user:pass@localhost:5432/paymint"
    JWT_SECRET="secret"
    PORT=3000
    ```
4.  Run Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start Server:
    ```bash
    npm run dev
    ```

### API Endpoints
- **Users**: `/api/users/login`, `/api/users/signup`, `/api/users/:id/balance`
- **Transactions**: `/api/transactions/transfer`, `/api/transactions/addMoney`

---

### Deployments
- **Frontend**: `https://paymint-frontend.vercel.app`
- **Backend**: `https://paymint-1.onrender.com`

