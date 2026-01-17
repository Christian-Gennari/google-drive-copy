# 📂 Google Drive Clone

A modern file management system designed to replicate core Google Drive functionalities. This application features a seamless drag-and-drop interface, real-time file searching, and a custom lightweight backend for efficient file handling.

> **Note:** This project is a full-stack implementation featuring an Angular frontend and a Node.js/Express backend.



## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [Technology Stack](#technology-stack)
3. [UI/UX Features](#uiux-features)
4. [Technical Highlights](#technical-highlights)
5. [Getting Started](#getting-started)
6. [Project Structure](#project-structure)
7. [📡 API Overview](#-api-overview)
8. [License](#license)
9. [Authors](#authors)




## Features Overview

### 📁 File Management

* **Upload System**: Support for single file uploads with metadata handling (Owner Name, Size, Date).
* **Download**: Secure file retrieval and download capabilities via dedicated API endpoints.
* **Deletion**: Permanent removal of files from both the disk and the database.
* **Metadata Tracking**: Automatic tracking of file size, upload timestamps, and edit timestamps.

### 🔍 Search & Discovery

* **Fuzzy Search**: integrated `fuzzysort` algorithm allows users to find files even with partial or slightly misspelled queries.
* **Real-time Results**: Instant search feedback as the user types.

### ⚙️ Backend Administration

* **JSON Database**: A custom, lightweight file-based database implementation (`db.json`) for zero-configuration persistence.
* **Validation**: Robust request validation using `Zod` to ensure data integrity before processing.
* **Security**: Implementation of `helmet` for setting various HTTP headers to secure the application.


## Technology Stack

### Frontend (Client)

* **Framework**: Angular v21
* **Language**: TypeScript ~5.9
* **Styling**: SCSS (Sass) for modular component styling

### Backend (Server)

* **Runtime**: Node.js
* **Framework**: Express.js
* **Language**: TypeScript
* **Validation**: Zod
* **Search**: Fuzzysort
* **File Handling**: Multer



## UI/UX Features

* **Drag & Drop Interface**: Intuitive file uploading using a custom directive (`appDragAndDrop`) that handles drag events and file drops seamlessly.
* **Toast Notifications**: integrated feedback system to alert users of successful uploads or errors.
* **Responsive Layout**: Flexible sidebar, header, and main view components designed to adapt to different screen sizes.
* **Modern Design**: Clean aesthetic inspired by Google Drive, utilizing custom icons and layouts.


## Technical Highlights

* **Custom DB Service**: The backend utilizes a `DbService` class that abstracts file I/O operations, making the JSON-based database act like a persistent store with `getAllFiles`, `upsertFile`, and `delete` methods.
* **Robust Error Handling**: The API includes comprehensive error checks for invalid filenames, missing files, and validation failures, returning appropriate HTTP 400/404/500 status codes.
* **Modular Architecture**: The Angular frontend is strictly typed and organized into feature-specific components (`sidebar`, `mainview`, `header`) and shared services (`file-api`, `file-handling`).
* **Type Safety**: Shared Data Transfer Objects (DTOs) like `FileDto` ensure consistency between the client and server data structures.


## Getting Started

### Prerequisites

* **Node.js** (Latest LTS recommended)
* **npm** (Node Package Manager)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/google-drive-clone.git
cd google-drive-clone

```


2. **Install Client Dependencies**
```bash
cd client
npm install

```


3. **Install Server Dependencies**
```bash
cd ../server
npm install

```



### Running the Application (Development Mode)

**1. Start the Backend Server**
The server will start on the configured port (default is 4000) and create an `uploads/` directory if it doesn't exist.

```bash
cd server
npm run dev

```

**2. Start the Frontend Client**
The Angular development server will start, typically on port 4200.

```bash
cd client
ng serve

```

**3. Access the App**
Open your browser and navigate to: `http://localhost:4200/`

### Running the Application (Production Mode)
The application is setup to automatically build and serve the frontend through the backend,
simply writing npm start will do all the steps automatically and ultimately start it on `http://localhost:4000/`.

```bash
cd server
npm start

```

## Project Structure

```text
google-drive-clone/
├── client/                 # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Reusable UI components (Toast, Icons, etc.)
│   │   │   ├── directives/ # Custom directives (Drag & Drop)
│   │   │   ├── services/   # API and State management
│   │   │   ├── aside/      # Secondary sidebar view
│   │   │   ├── header/     # App navigation header
│   │   │   ├── mainview/   # Primary file grid view
│   │   │   └── sidebar/    # Primary navigation sidebar
│   │   └── assets/         # Static images and fonts
│   └── package.json
│
├── server/                 # Node.js/Express Backend
│   ├── src/
│   │   ├── index.ts        # Entry point
│   │   ├── file.routes.ts  # API Route definitions
│   │   ├── db.service.ts   # JSON Database adapter
│   │   └── config.ts       # Configuration constants
│   ├── uploads/            # Directory for stored files
│   ├── db.json             # Persistent data storage
│   └── package.json
│
└── shared/                 # Shared Types
    └── file.dto.ts         # TypeScript interfaces shared by both apps

```



## 📡 API Overview

The backend exposes a RESTful API for file operations.

### Files

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/files` | Retrieve a list of all files. |
| **GET** | `/api/files/:filename` | Download a specific file. |
| **POST** | `/api/files` | Upload a new file (Multipart/Form-Data). Requires `ownerName`. |
| **DELETE** | `/api/files/:filename` | Delete a specific file. |

### Search

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/search?q=query` | Fuzzy search files by name. |

### System

| Method | Endpoint | Description |
| --- | --- | --- |
| **GET** | `/api/health` | Check API status and environment mode. |



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
