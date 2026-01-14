Här är den uppdaterade dokumentationen där jag lagt till den viktiga detaljen om att starta backend separat i utvecklingsläget.

---

# **API & System Documentation: File Management System**

**Base URL:** `http://localhost:4000/api`

---

## **1. System Architecture & Serving Strategy**

This project supports two distinct modes of operation: **Development** and **Production**.

### **A. Development Mode (`ng serve`)**

In this mode, the frontend and backend run as separate processes on different ports. **You must run them in separate terminals.**

1. **Start Backend:** Open a terminal in the `server` folder and run `npm run dev`.
* Runs on: `http://localhost:4000` (via Node/Express/Nodemon).


2. **Start Frontend:** Open a new terminal in the `client` folder and run `ng serve`.
* Runs on: `http://localhost:4200` (via Angular CLI).



* **Communication:**
* Angular uses a **Proxy Configuration** (`client/proxy.conf.json`).
* Any request to `/api` made by the frontend is automatically forwarded by the Angular Dev Server to `http://localhost:4000`.
* **Why?** This prevents CORS errors and makes the frontend code simpler (relative paths like `/api/files` work seamlessly).



### **B. Production Mode (`npm start`)**

In this mode, the entire application (Frontend + Backend) is served by a single Node.js process.

* **Command:** Running `npm start` in the `server` folder triggers:
1. `prestart`: Automatically builds the Backend (`tsc`) AND the Frontend (`ng build`).
2. `start`: Launches the Express server.


* **Serving:**
* The Express server handles API requests at `/api/...`.
* The Express server **also** serves the compiled Angular static files (HTML, JS, CSS) from `client/dist/client/browser`.
* **Fallback:** Any request that does not match an API route or a static file is redirected to `index.html` (supporting Angular's Single Page Application routing).


* **Benefits:** No CORS configuration is required because the API and Frontend share the same origin (`http://localhost:4000`).

---

## **2. Server Configuration**

The server uses a centralized configuration file located at `server/src/config.ts`. This ensures paths are calculated correctly regardless of the operating system.

* **Port:** 4000 (default)
* **Uploads Directory:** `server/uploads/`
* **Angular Build Path:** Resolves dynamically to `../client/dist/client/browser`

---

## **3. Data Transfer Object (DTO)**

**Type:** `FileDto`
The JSON structure used for file sending.

| Field | Type | Required? | Description |
| --- | --- | --- | --- |
| `fileName` | `string` | **Ignored in Input** | On upload, this is overwritten by the URL parameter to ensure safety. |
| `ownerName` | `string` | **Yes** | Name of the user uploading the file. |
| `fileBody` | `string` | **Yes** | The file content encoded as a **Base64 string**. |
| `uploadedAt` | `string` | No | ISO Date string. If omitted, server sets current time. |
| `editedAt` | `string` | No | ISO Date string. Server always updates this on save. |
| `sizeInBytes` | `number` | No | Server calculates this automatically from the file buffer. |

> **Note:** The server accepts JSON payloads up to **1000MB** to support large file uploads.

---

## **4. Endpoints**

### **A. Upload or Update File (PUT)**

Primary endpoint for saving files. Handles both creation and updates.

* **Endpoint:** `/files/:filename`
* **Method:** `PUT`
* **URL Parameter:** `:filename` (e.g., `vacation.jpg`). **This is the Master Filename.**
* **Request Body:** `FileDto` (JSON)

**Behavior:**

1. **Inheritance:** Uses `:filename` from the URL.
2. **Override:** Forces the `fileName` property in the JSON body to match the URL.
3. **Decode:** Converts `fileBody` (Base64) to Binary.
4. **Save:**
* **Disk:** Saves binary to `uploads/vacation.jpg`.
* **DB:** Saves file to `db.json`.



**Example Request:**
`PUT http://localhost:4000/api/files/duck.png`

```json
{
  "ownerName": "Alice",
  "fileBody": "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAA..."
}

```

### **B. List All Files (GET)**

Retrieves metadata + file in base64 for all stored files.

* **Endpoint:** `/files`
* **Method:** `GET`
* **Response:** `200 OK` with an array of `FileDto` objects.

**Example Response:**

```json
[
    {
        "fileName": "duck.png",
        "ownerName": "Alice",
        "uploadedAt": "2026-01-13T10:00:00.000Z",
        "sizeInBytes": 1024,
        "fileBody": "iVBOR..."
    }
]

```

### **C. Search Files (GET)**

Performs a fuzzy search on filenames.

* **Endpoint:** `/search`
* **Method:** `GET`
* **Query Parameter:** `q` (The search term)
* **Response:** `200 OK` with an array of `FileDto` objects that match the query.

**Example Request:**
`GET http://localhost:4000/api/search?q=duck`

**Behavior:**

* Returns an empty array if query is empty.
* Uses `fuzzysort` to find partial matches.

### **D. Delete File (DELETE)**

Removes a file from both the database and the file system.

* **Endpoint:** `/files/:filename`
* **Method:** `DELETE`
* **URL Parameter:** `:filename` (The name of the file to delete).
* **Response:** `200 OK` with the updated list of files.

---

## **5. Typical Data Flow (Frontend Logic)**

When a user uploads a file in the Angular app:

1. **Read File:** The browser reads the selected file.
2. **Convert:** File is converted to a **Base64 string**.
3. **Prepare Object:**
```typescript
const payload = {
  ownerName: "CurrentUser",
  fileBody: base64String
};

```


4. **Send:** API call uses the filename in the URL:
```typescript
http.put(`/api/files/${actualFileName}`, payload)

```


5. **Result:** The server ensures `FileName` is used for both storage and metadata.