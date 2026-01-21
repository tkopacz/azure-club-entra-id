# Azure Club Entra ID — demo

[![Licencja: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](README.md) | [Polski](readme-pl.md)

## Opis

Repozytorium zawiera krótkie, edukacyjne demonstracje zaprezentowane podczas wydarzenia Azure Club 16 października 2025. Przykłady pokazują uwierzytelnianie Microsoft Entra ID w aplikacjach typu SPA (TypeScript) oraz w aplikacjach .NET. Materiały są uproszczone i nie stanowią referencyjnych implementacji produkcyjnych.

## Dema

| Folder | Opis | Technologie |
| --- | --- | --- |
| `TK101-VSCodeDemo` | Surowy przepływ OAuth 2.0/PKCE wykonywany przez zapytania HTTP. | Entra ID, Microsoft Graph |
| `TK102-SPA-TS` | Podstawowe logowanie SPA z MSAL.js. | TypeScript, Vite |
| `TK201-NET-API` | Minimalne API ASP.NET Core zabezpieczone przez Entra ID. | .NET |
| `TK202-SPA-TS-CALL-NET` | SPA wywołujące zabezpieczone API .NET. | TypeScript, Vite, .NET |
| `TK203-WebAppMVC` | Aplikacja MVC z logowaniem Entra ID. | ASP.NET Core MVC |
| `TK301-SPA-OBO` | SPA + API z przepływem On-Behalf-Of ([README](TK301-SPA-OBO/README.md)). | TypeScript, .NET |

## Wymagania

- Node.js 18+ i npm (dla demo TypeScript)
- .NET 8 SDK (dla demo .NET)
- Tenant Microsoft Entra ID z możliwością tworzenia rejestracji aplikacji

## Szybki start

1. Sklonuj repozytorium.
2. Wybierz katalog z demo.
3. Postępuj zgodnie z instrukcjami lokalnymi (pliki `r.cmd` lub README w danym katalogu).
4. Uzupełnij wartości konfiguracji Entra ID (identyfikatory aplikacji, tenant, sekrety).

## Wskazówki konfiguracyjne

- Konfiguracja SPA TypeScript znajduje się w `src/authconfig.ts`.
- Konfiguracja .NET znajduje się w `appsettings.json`.

## Współpraca

Zgłoszenia i usprawnienia są mile widziane. Jeśli masz poprawki, prześlij pull request.

## Licencja

Projekt udostępniany jest na licencji [MIT](LICENSE).
