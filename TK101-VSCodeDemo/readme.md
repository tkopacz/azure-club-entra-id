# TK101-VSCodeDemo

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

## Overview
This demo walks through the raw OAuth 2.0 authorization code flow with PKCE using plain HTTP requests. It is designed to be executed from VS Code (REST Client extension) or any HTTP client so you can see every step in the authentication exchange.

## What's inside
- `demo.http` – step-by-step authorize, token, and Microsoft Graph calls.
- `test.http` – scratch file for experimenting with additional requests.

## Prerequisites
- A Microsoft Entra ID tenant where you can register an application.
- An app registration for a public client (SPA or native).
- VS Code with the REST Client extension (recommended) or another HTTP client.

## Setup
1. Register a public client app in Entra ID.
2. Add the redirect URI `http://localhost/tk101-vscodedemo` (matches the URL in `demo.http`).
3. Copy the **Application (client) ID**.
4. Open `demo.http` and replace the placeholder values (`client_id`, `redirect_uri`, `code_challenge`, `code_verifier`).

## Usage
1. Open `demo.http` in VS Code.
2. Copy the authorization URL and open it in a browser (incognito is recommended).
3. After sign-in, copy the `code` query parameter from the redirect URL.
4. Paste the code into the token request and send it.
5. Use the returned `access_token` for the Microsoft Graph requests in the same file.
