# Auth App 🚀

This project is an authentication application that includes features such as login/signup, forgot password, email verification, and session management. It uses Nest.js as the backend framework and Next.js as the frontend framework.

## Features ✨

- **Login/Signup**: User authentication and new user registration with email and password.
- **Forgot Password**: Password recovery via email.
- **Email Verification**: Verification of user email addresses.
- **Session Management**: Handling user sessions securely.

## Technologies Used 🛠️

- **Backend Framework**: Nest.js
- **Frontend Framework**: Next.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Tailwind CSS
- **State Management**: Zustand

## Installation 📥

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd auth-app-nest-next
   ```
3. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
4. Install frontend dependencies:
   ```bash
   cd client
   npm install
   ```

## Usage 🚀

1. Start the backend server:
   ```bash
   cd server
   npm run start:dev
   ```
2. Start the frontend server:
   ```bash
   cd client
   npm run dev
   ```

## Session Management Details 🔐

The session management in this application is implemented using JWT (JSON Web Tokens) for access and refresh tokens, which are stored in cookies. Additionally, users have the ability to view and manage the devices that are currently logged into their account.

- **JWT Access & Refresh Tokens**: Securely manage user sessions by issuing access tokens for authentication and refresh tokens for obtaining new access tokens without re-authentication.
- **Device Management**: Users can see a list of devices that are currently logged into their account and manage these sessions by logging out from specific devices if needed.
