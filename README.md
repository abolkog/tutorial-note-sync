# NoteSync

serverless notes application built with TypeScript and AWS.

## Features

- User authentication with Clerk
- Create, edit, delete, and view notes
- Share notes via links
- Serverless architecture using AWS Lambda and DynamoDB

## Tech Stack

### Frontend

- React
- TypeScript
- Vite

### Backend

- AWS Lambda
- API Gateway
- DynamoDB
- Clerk

### Infrastructure

- AWS CDK
- GitHub Actions for CI/CD

## Project Structure

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

## Getting Started

TODO: Add setup instructions
