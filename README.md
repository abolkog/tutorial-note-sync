# 📝 NoteSync: Seamless Serverless Notes

**NoteSync** is a modern, fast, and reliable note-taking application built using **TypeScript** and the **AWS serverless ecosystem**. The goal of this project is to provide a highly scalable way to manage your notes and instantly synchronize changes across all devices using WebSockets, without the complexity of managing traditional servers.

> **Tutorial Project:** This application was developed as part of the YouTube tutorial series: **["AWS Projects 2025: Build NotSync – Real-Time Notes App with AWS"](https://www.youtube.com/playlist?list=PL_aOZuct6oArCbyuEZwu_2_hBfBt9wRea)**.

## ✨ Key Features

| Feature                   | Description                                                                                               |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- |
| **Secure Authentication** | Built-in user authentication powered by **Clerk** ensures your notes are safe and accessible only to you. |
| **Full CRUD Operations**  | **create, edit, delete, and view** your notes.                                                            |
| **⚡ Real-Time Sync**     | Instantly sync note changes across all connected devices using **WebSockets**.                            |
| **Serverless Design**     | A cost-effective and highly scalable architecture using **AWS Lambda** and **DynamoDB**.                  |

## 🚀 The Tech Stack: Built for Performance

NoteSync uses a straightforward, modern stack to ensure performance and maintainability.

### 🖥️ Frontend

- **React:** Used to build the user interface.
- **TypeScript:** Adds structure and type safety to the JavaScript code.
- **Vite:** A fast tool for bundling and running the application during development.

### ⚙️ Backend (The Cloud Services)

- **AWS Lambda:** Runs the backend code only when a user action requires it (e.g., saving a note).
- **Amazon API Gateway:** The entry point for all requests, handling both standard data requests (HTTP) and the **WebSocket** connections for real-time updates.
- **Amazon DynamoDB:** Stores all the note data in a scalable, high-speed NoSQL database.
- **Clerk:** Manages all user accounts and login/logout processes.

### 🏗️ Deployment Tools

- **AWS Cloud Development Kit (CDK):** We define and deploy all the required AWS infrastructure (Lambda, API Gateway, DynamoDB) using TypeScript code.
- **GitHub Actions:** Automates the deployment process for Continuous Integration/Continuous Deployment (CI/CD).

## 🧭 Project Structure

The project is structured into three clear folders for the client-side, the server-side code, and the infrastructure setup.

```
tutorial-note-sync/
├─ frontend/                  # React
│  ├─ src/
│  ├─ package.json
│  └─ tsconfig.json
├─ backend/                   # Lambda functions
│  ├─ functions/
│  │  └─ createNote.ts
│  ├─ package.json
│  └─ tsconfig.json
├─ infra/                     # CDK app
│  ├─ bin/
│  │  └─ cdk.ts
│  ├─ lib/
│  │  └─ note-sync-stack.ts
│  ├─ package.json
│  └─ tsconfig.json
├─ .github/workflows/ci-cd.yml
└─ README.md
```

## ▶️ Getting Started

To get started, please follow the steps detailed in the accompanying YouTube tutorial.

**TODO:** Add comprehensive setup instructions for local development and deployment. This will include steps for:

1. Setting up AWS credentials.
2. Configuring your Clerk API keys.
3. Deploying the **infra** stack using AWS CDK.
4. Running the **frontend** locally and connecting to the deployed WebSocket endpoint.
