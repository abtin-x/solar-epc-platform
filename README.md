# Solar EPC Platform

**Status:** Under active development / MVP stage

Solar EPC Platform is an AI-assisted full-stack solar EPC and lead-management platform. It combines a React/Vite client, Express/MongoDB backend, secure admin authentication, file upload handling, and an Electron desktop demo workflow for packaging the client experience.

## Tech Stack

- React
- Vite
- Express
- MongoDB with Mongoose
- Electron
- JWT authentication with httpOnly cookies
- OpenAI Codex-assisted development workflow

## Key Features

- Public lead capture flow for solar EPC inquiries
- Admin login and protected dashboard routes
- Lead-management backend API
- File upload support with configurable upload limits
- Internationalized client foundation
- Electron desktop demo packaging for Windows
- Separate client and server workspaces for full-stack development

## Security and Auth Highlights

- JWT-based admin sessions stored in httpOnly cookies
- Password hashing support through bcrypt
- Helmet security headers on the Express server
- CORS configuration through environment variables
- Rate limiting support for backend routes
- Sensitive configuration loaded from environment variables, not committed source

## Electron Desktop Demo

The project includes an Electron desktop demo path for packaging the client as a Windows desktop application. Generated Electron outputs such as `client/release`, `release`, `out`, `dist-electron`, `.exe`, and `.zip` files are intentionally excluded from Git because they can be large and are build artifacts rather than source code.

## Local Setup

### Prerequisites

- Node.js and npm
- MongoDB running locally or a hosted MongoDB connection string

### Install Dependencies

From the repository root:

```powershell
npm install
```

Install the client dependencies:

```powershell
cd client
npm install
```

Install the server dependencies:

```powershell
cd ../server
npm install
```

### Configure Environment Variables

Create a local server environment file from the example:

```powershell
Copy-Item server/.env.example server/.env
```

Then update `server/.env` with real local values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/solar-platform
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1d
AUTH_COOKIE_NAME=admin_token
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=$2b$12$replace_with_a_real_bcrypt_hash
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
MAX_FILE_COUNT=5
ENABLE_PUBLIC_UPLOADS=true
```

Use a strong `JWT_SECRET` and replace `ADMIN_PASSWORD` with a real bcrypt hash before using admin authentication outside a local throwaway setup.

### Run the App Locally

Start the backend:

```powershell
cd server
npm run dev
```

In a second terminal, start the client:

```powershell
cd client
npm run dev
```

The client defaults to `http://localhost:5173`, and the backend defaults to `http://localhost:5000`.

### Electron Development and Packaging

Run the Electron client demo:

```powershell
cd client
npm run electron:dev
```

Build a packaged Windows desktop demo:

```powershell
cd client
npm run electron:dist
```

Packaged output is generated under ignored build directories such as `client/release`.

## Repository Hygiene

Sensitive environment files and generated build artifacts are intentionally excluded from version control. This includes local `.env` files, dependency folders, upload output, Electron release folders, executable builds, and zip archives.

Use `server/.env.example` as the committed template for required backend configuration.

## Future Roadmap

- Expand lead pipeline and status management
- Add richer admin analytics and reporting
- Improve validation, audit logging, and operational monitoring
- Add production deployment documentation
- Add automated test coverage for API and client workflows
- Refine Electron packaging and release distribution process
- Integrate AI-assisted workflows for proposal, sizing, and customer follow-up tasks
