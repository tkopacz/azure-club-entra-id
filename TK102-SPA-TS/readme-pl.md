# TK102-SPA-TS

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
Minimalna aplikacja SPA (TypeScript) logująca się do Microsoft Entra ID za pomocą MSAL.js. Po zalogowaniu może pobrać listę użytkowników z Microsoft Graph.

## Zawartość
- `src/authconfig.ts` – miejsca na identyfikatory i zakresy Graph.
- `src/main.ts` – inicjalizacja MSAL, logowanie i wywołanie Graph.
- `index.html` – proste UI z przyciskami logowania i listowania użytkowników.

## Wymagania
- Node.js 18+ i npm.
- Tenant Microsoft Entra ID z możliwością rejestracji aplikacji.
- Rejestracja SPA z delegowanym uprawnieniem Microsoft Graph (np. `User.ReadBasic.All`).

## Konfiguracja
1. Zarejestruj aplikację SPA w Entra ID.
2. Dodaj redirect URI `http://localhost:5173`.
3. Dodaj delegowane uprawnienie Graph zgodne z `graphScopes` (może wymagać zgody administratora).
4. Uzupełnij `src/authconfig.ts` wartościami `clientId`, `tenantId` i zakresami.

## Uruchomienie lokalne
```bash
npm install
npm run dev
```

Otwórz `http://localhost:5173` i użyj **Sign in** oraz **List users**.
