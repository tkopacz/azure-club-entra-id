# TK202-SPA-TS-CALL-NET

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

## Overview
TypeScript SPA that signs in with Microsoft Entra ID, calls Microsoft Graph, and optionally calls a protected .NET API. It demonstrates incremental consent and role-based access.

## What's inside
- `src/authconfig.ts` – Entra ID placeholders for SPA + API scopes.
- `src/main.ts` – MSAL logic, Graph calls, and API calls with role checks.
- `index.html` – UI buttons for sign-in, Graph, and API actions.

## Prerequisites
- Node.js 18+ and npm.
- A Microsoft Entra ID tenant.
- An API app registration with exposed scopes and app roles.

## Setup
1. Register a SPA app and add `http://localhost:5173` as redirect URI.
2. Grant Graph permission used in `graphScopes`.
3. Register an API app, expose scopes (e.g. `Calculator.Add`), and create roles (`role2`, `role3`).
4. Assign the required roles to test role-gated endpoints.
5. Update `src/authconfig.ts` with SPA client ID, tenant ID, and API identifiers.

## Run locally
```bash
npm install
npm run dev
```

Open `http://localhost:5173` and use the buttons to call Graph and the API.
