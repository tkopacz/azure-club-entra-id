# TK301-SPA-OBO

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
To demo pokazuje przepływ On-Behalf-Of (OBO): aplikacja SPA (TypeScript) uwierzytelnia użytkownika, wywołuje API .NET, a API pobiera dane z Microsoft Graph `/me` na podstawie tokenu użytkownika.

## Struktura rozwiązania
- `api` – API ASP.NET Core zabezpieczone przez Entra ID, korzystające z OBO.
- `spa` – SPA TypeScript z MSAL.js.
- `README.md` – szczegółowy opis w języku angielskim.

## Wymagania
- .NET 8 SDK.
- Node.js 18+ i npm.
- Tenant Microsoft Entra ID z możliwością tworzenia rejestracji aplikacji.

## Konfiguracja
1. Zarejestruj aplikację API i ustaw Application ID URI w formie `api://<api-client-id>`.
2. Dodaj delegowane uprawnienie Graph `User.Read` i wystaw scope `access_as_user`.
3. Utwórz sekret klienta dla API.
4. Zarejestruj aplikację SPA i dodaj redirect URI `https://localhost:5173`.
5. Dodaj uprawnienie do scope API `api://<api-client-id>/access_as_user`.
6. Uzupełnij `api/appsettings.json` i `spa/src/authConfig.ts`.

## Uruchomienie lokalne
```bash
cd api
dotnet restore
dotnet run
```

W drugim terminalu:
```bash
cd spa
npm install
npm run dev
```

Otwórz `https://localhost:5173` i wykonaj logowanie, aby wywołać API.
