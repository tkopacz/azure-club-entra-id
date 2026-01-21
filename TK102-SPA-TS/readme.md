# TK102-SPA-TS

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

## Overview
This demo is a minimal TypeScript single-page application (SPA) that signs in with Microsoft Entra ID using MSAL.js. After sign-in, it can call Microsoft Graph to list users.

## What's inside
- `src/authconfig.ts` – placeholders for client/tenant IDs and Graph scopes.
- `src/main.ts` – MSAL initialization, sign-in/out, and Graph request logic.
- `index.html` – simple UI with sign-in and list users buttons.

## Prerequisites
- Node.js 18+ and npm.
- A Microsoft Entra ID tenant with app registration permissions.
- A SPA app registration with delegated Microsoft Graph permissions (e.g. `User.ReadBasic.All`).

## Setup
1. Register a SPA in Entra ID.
2. Add `http://localhost:5173` as a redirect URI.
3. Grant the Graph delegated permission used in `graphScopes` (admin consent may be required).
4. Update `src/authconfig.ts` with your `clientId`, `tenantId`, and scopes.

## Run locally
```bash
npm install
npm run dev
```

Open `http://localhost:5173` and use **Sign in** then **List users**.
