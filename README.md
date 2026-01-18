# 🦆 Duck Drive (Google Drive Clone)

A proof of concept file management system designed to replicate core Google Drive functionality. The application features drag and drop uploads, real time fuzzy search, and a custom lightweight backend.

## 📋 Table of Contents

* [Technology Stack](#technology-stack)
* [Key Features](#key-features)
* [Technical Highlights](#technical-highlights)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [API Overview](#api-overview)
* [License](#license)
* [Authors](#authors)



## Technology Stack

| Frontend                        | Backend                        | Shared                 |
| ------------------------------- | ------------------------------ | ---------------------- |
| **Framework:** Angular v21      | **Runtime:** Node.js           | **Validation:** Zod    |
| **Language:** TypeScript 5.9    | **Framework:** Express.js      | **Types:** Shared DTOs |
| **Styling:** SCSS    | **Search:** Fuzzysort          |                        |
| **State:** Services and Signals | **Middleware:** Multer, Helmet |                        |



## Key Features

### File Management

* **Smart Upload:** Single file uploads via drag and drop with automatic metadata tracking such as owner, size, and timestamps.
* **Secure Retrieval:** Dedicated API endpoints for secure file downloads and permanent deletion.
* **Fuzzy Search:** Integrated `fuzzysort` for real time, error tolerant file discovery.

### UI and UX

* **Modern Interface:** Clean layout inspired by Google Drive with a responsive sidebar and header.
* **Interactive Feedback:** Toast notification system for success and error states.
* **Modular Layout:** Flexible components that adapt to different screen sizes.



## Technical Highlights

* **Custom DB Service:** A `DbService` class abstracts file I/O and allows a `db.json` file to function as a persistent, zero configuration document store.
* **Type Safety:** Shared Data Transfer Objects ensure strict type synchronization between the Angular client and the Express server.
* **Security:** Uses Helmet for HTTP header protection and Zod for schema validation on all incoming requests.
* **Modular Architecture:** Feature specific components such as `mainview` and `sidebar`, paired with logic isolated services.



## Getting Started

### Prerequisites

* Node.js (latest LTS)
* npm

### Installation and Setup

1. **Clone the repository**

```bash
git clone https://github.com/Christian-Gennari/google-drive-clone.git
cd google-drive-clone
```

2. **Install dependencies**

```bash
# Client
cd client
npm install

# Server
cd ../server
npm install
```

### Running the App

**Development mode**

* Start server: `cd server && npm run dev` (port 4000)
* Start client: `cd client && ng serve` (port 4200)

**Production mode**

* Run `npm start` inside the `server` directory. This builds the frontend and serves it through the backend on port 4000.



## Project Structure

```text
google-drive-clone/
├── client/                 # Angular frontend
│   ├── src/app/
│   │   ├── components/     # UI components: Toasts, Icons
│   │   ├── directives/     # Drag and drop logic
│   │   └── mainview/       # Primary file grid
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── db.service.ts   # JSON database adapter
│   │   └── file.routes.ts  # API endpoints
│   ├── uploads/            # Local file storage
│   └── db.json             # Persistence store
└── shared/                 # Shared TypeScript DTOs
```



## API Overview

| Method     | Endpoint           | Description               |
| ---------- | ------------------ | ------------------------- |
| **GET**    | `/api/files`       | List all files            |
| **GET**    | `/api/files/:name` | Download a specific file  |
| **POST**   | `/api/files`       | Upload a file (multipart) |
| **DELETE** | `/api/files/:name` | Delete a file             |
| **GET**    | `/api/search?q=`   | Fuzzy search by name      |

## License

This project is licensed under the **ISC License**.

## Authors

**Astrid Skoglund**
- LinkedIn: [https://www.linkedin.com/in/astrid-skoglund-193841383/](https://www.linkedin.com/in/astrid-skoglund-193841383/)
- GitHub: [@skogsfrans](https://github.com/skogsfrans)

**Viktor Johansson**
- LinkedIn: [linkedin.com/in/viktorjohansson96](https://www.linkedin.com/in/viktorjohansson96/)
- GitHub: [@discovicke](https://github.com/discovicke)

**Christian Gennari**
- LinkedIn: [linkedin.com/in/christiangennari](https://linkedin.com/in/christiangennari)
- GitHub: [@Christian-Gennari](https://github.com/Christian-Gennari)
