# TK202-SPA-TS-CALL-NET

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
Aplikacja SPA (TypeScript), która loguje się do Microsoft Entra ID, wywołuje Microsoft Graph oraz (opcjonalnie) chronione API .NET. Demo pokazuje zgodę przyrostową oraz autoryzację opartą o role.

## Zawartość
- `src/authconfig.ts` – konfiguracja Entra ID dla SPA i API.
- `src/main.ts` – logika MSAL, wywołania Graph i API z kontrolą ról.
- `index.html` – UI z przyciskami do logowania i wywołań API.

## Wymagania
- Node.js 18+ i npm.
- Tenant Microsoft Entra ID.
- Rejestracja API z wystawionymi scope i rolami aplikacji.

## Konfiguracja
1. Zarejestruj SPA i dodaj redirect URI `http://localhost:5173`.
2. Dodaj uprawnienie Graph używane w `graphScopes`.
3. Zarejestruj API, wystaw scope (np. `Calculator.Add`) i zdefiniuj role (`role2`, `role3`).
4. Przypisz role użytkownikom, aby przetestować endpointy rolowe.
5. Uzupełnij `src/authconfig.ts` o identyfikatory SPA, tenant i dane API.

## Uruchomienie lokalne
```bash
npm install
npm run dev
```

Otwórz `http://localhost:5173` i korzystaj z przycisków do wywołań Graph i API.
