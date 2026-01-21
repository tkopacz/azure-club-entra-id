# TK203-WebAppMVC

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
Aplikacja webowa ASP.NET Core MVC logująca użytkowników przez Microsoft Entra ID i chroniąca strony za pomocą ról aplikacji. Demo pokazuje logowanie interaktywne i dostęp oparty o role w aplikacji renderowanej po stronie serwera.

## Zawartość
- `Program.cs` – konfiguracja Microsoft Identity Web i polityk ról.
- `Controllers/HomeController.cs` – akcje dla strony głównej i stron chronionych rolami.
- `Views/Home/Role1Page.cshtml` – UI dla użytkowników z rolą `role1`.
- `Views/Home/Role2Page.cshtml` – UI dla użytkowników z rolą `role2`.
- `appsettings.json` – placeholdery Entra ID (tenant i client).

## Wymagania
- .NET 8 SDK.
- Tenant Microsoft Entra ID.
- Rejestracja aplikacji webowej z rolami `role1`, `role2` przypisanymi użytkownikom.

## Konfiguracja
1. Zarejestruj aplikację webową w Entra ID i dodaj redirect URI `http://localhost:5092/signin-oidc`.
2. Zdefiniuj role aplikacji (`role1`, `role2`) i przypisz je użytkownikom lub grupom.
3. Uzupełnij `appsettings.json` o tenant i client ID.

## Uruchomienie lokalne
```bash
dotnet restore
dotnet run
```

Aplikacja działa pod `http://localhost:5092` (patrz `Properties/launchSettings.json`).

## Użycie
- Strona główna dostępna jest pod `/`.
- `/Home/Role1Page` oraz `/Home/Role2Page` wymagają odpowiednich ról.
