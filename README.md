# LTU Tabs Component Generator

This is a Next.js web application built for the **CSE3CWA / CSE5006** course at La Trobe University.  
It allows users to dynamically create and configure Tabs components and generate self-contained HTML + JavaScript code.

---

## 📘 Assignment 1 & 2 Submission

**Student Name:** Alya Nursalma Ridwan  
**Student Number:** 22586609  

---

## ✨ Features (Assignment 1)

- **Dynamic Tab Management** – Add, edit, remove, and customize tab headers and content.
- **Live Code Generation** – Produces clean HTML5 + inline CSS + JS for user-created tabs.
- **Persistent State** – Saves user data automatically using `localStorage`.
- **Active Link Highlighting** – Tracks last visited page using cookies.
- **Responsive UI** – Works smoothly on mobile screens with a collapsible menu.
- **Dark/Light Mode** – Theme toggle using `next-themes`.
- **Animated Mobile Menu** – Smooth CSS transform animation.

---

# 🚀 Assignment 2 Enhancements

Assignment 2 significantly expands the application through cloud deployment, CI/CD, testing, telemetry, and performance evaluation.

---

## 🗄️ 1. Cloud Database Integration (Azure PostgreSQL)

The app now uses:

- **Azure Database for PostgreSQL – Flexible Server**
- Prisma ORM for migrations + database client

**New Features:**
- Server-side saving of user tab sets  
- Editing existing saved tab sets  
- Deleting saved tab sets  
- Secure CRUD API endpoints (`/api/tabs`)  

Status: **Fully functional and deployed.**

---

## 🐳 2. Dockerization

The app is containerized using:

- Multi-stage Dockerfile (`node:18-alpine`)
- Production-optimized build
- Health checks for Azure Web App compatibility

Docker image examples:

```
cwa-assignment-app:latest
cwa-assignment-image:latest
```

---

## 📦 3. Deployment to Azure  
### (Azure Container Registry → Azure Web App for Containers)

Deployment pipeline:

1. Build production Docker image
2. Push image to **Azure Container Registry (ACR)**
3. Deploy container to **Azure Web App**
4. Configure environment variables:

```
DATABASE_URL="postgresql://...azure.com:5432/cwa?sslmode=require"
APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..."
OTEL_SERVICE_NAME="cwa-assignment"
```

**Status:** Live cloud deployment working correctly.

---

## 📊 4. Monitoring & Telemetry (Azure Monitor + Application Insights)

Instrumentation enabled using:

- `@azure/monitor-opentelemetry`
- `instrumentation.ts` auto-initialization

Telemetry features:

- API call tracing  
- Dependency tracking (PostgreSQL queries)  
- Request performance metrics  
- Server logs  
- Exception tracking  

**Status:** Telemetry successfully connected to Azure Monitoring.

---

## 🧪 5. Playwright End-to-End Testing

Automated E2E tests include:

- Page navigation
- Tab creation workflow
- Content editing
- Saving tab sets to database
- Editing & deleting saved sets
- API integration verification

Run locally:

```
npx playwright test
```

**Result:** All tests passed.

---

## ⚡ 6. Azure Function (HTTP Trigger)

A serverless function was created as part of the assignment requirement.

### Function Behavior:
Accepts JSON payload:

```json
{
  "tabs": [
    { "title": "Step 1", "content": "Hello" },
    { "title": "Step 2", "content": "World" }
  ]
}
```

Returns computed metadata:

```json
{
  "tabsCount": 2,
  "totalCharacters": 11,
  "generatedAt": "2025-12-05T00:22:11.123Z",
  "message": "Azure Function processed your tab set successfully!"
}
```

Purpose: Demonstrate ability to integrate cloud functions — not required to integrate into main app.

---

## 📈 7. JMeter Load Testing

Load test of **250 requests** against the deployed cloud app.

### **Summary Results**

| Metric | Value |
|--------|-------|
| Samples | 250 |
| Average Response Time | **1829 ms** |
| Minimum | 58 ms |
| Maximum | 6395 ms |
| Error Rate | **0%** |
| Throughput | 15 requests/sec |

### JMeter Graphs Included:
- Results Table  
- Summary Report  
- Response Time Graph  

**Status:** App remained stable under load, with zero errors.

---

# 🧰 Tech Stack Overview

### **Frontend**
- Next.js 14 (App Router)
- TypeScript  
- CSS Modules  

### **Backend**
- Next.js Server Actions
- API Routes  
- Prisma ORM  
- Azure PostgreSQL  

### **Cloud + DevOps**
- Docker  
- Azure Container Registry (ACR)  
- Azure Web App for Containers  
- Azure Monitor  
- Azure Application Insights  
- Azure Function  
- JMeter  
- Playwright  

---

# 🛠️ Running the Project Locally

### 1. Clone the repo
```bash
git clone <repo-url>
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file

```
DATABASE_URL="postgresql://<user>:<pass>@<server>.postgres.database.azure.com:5432/cwa?sslmode=require"

APPLICATIONINSIGHTS_CONNECTION_STRING="InstrumentationKey=..."

OTEL_SERVICE_NAME="cwa-assignment"
```

### 4. Apply Prisma migrations
```bash
npx prisma migrate deploy
```

### 5. Start development server
```bash
npm run dev
```

Open **http://localhost:3000**

---

# 🤖 AI Usage Declaration

AI tools (Google Gemini & ChatGPT) were used responsibly for:

- Generating code snippets  
- Debugging issues  
- Deployment guidance  
- Documentation formatting  

All implementation and architectural decisions were performed by the student.

---

