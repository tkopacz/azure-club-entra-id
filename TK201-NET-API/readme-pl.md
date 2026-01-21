# TK201-NET-API

[English](readme.md) | [Polski](readme-pl.md)
[Powrót do opisu repozytorium](../README.md)

## Opis
Minimalne API ASP.NET Core zabezpieczone przez Microsoft Entra ID. Udostępnia endpointy kalkulatora chronione zakresem (scope) oraz endpointy zależne od ról, wykorzystywane w kolejnych demo SPA.

## Zawartość
- `Program.cs` – konfiguracja uwierzytelniania, autoryzacji, CORS i Swaggera.
- `Controllers/CalculatorController.cs` – endpointy kalkulatora chronione scope.
- `Controllers/RoleDataController.cs` – endpointy chronione rolami.
- `appsettings.json` – konfiguracja Entra ID z placeholderami.
- `net-api.http` – podstawowe zapytania do otwartych endpointów `/todos`.

## Wymagania
- .NET 8 SDK.
- Tenant Microsoft Entra ID z rejestracją aplikacji API.
- Opcjonalnie osobna rejestracja dla Swagger UI (jeśli chcesz logowanie w Swaggerze).

## Konfiguracja
1. Zarejestruj aplikację API w Entra ID i wystaw scope np. `Calculator.Add`.
2. Zdefiniuj role aplikacji (`role1`, `role2`, `role3`), jeśli chcesz testować endpointy rolowe.
3. Uzupełnij `appsettings.json` o `TenantId`, `ClientId`, `Audience` i opcjonalny `ClientSecret`.
4. Jeśli używasz OAuth w Swaggerze, uzupełnij sekcję `Swagger`.

## Uruchomienie lokalne
```bash
dotnet restore
dotnet run
```

API domyślnie działa pod `http://localhost:5058` (patrz `Properties/launchSettings.json`).

## Testowanie endpointów
- Skorzystaj z `net-api.http`, aby wywołać `/todos` bez autoryzacji.
- Do `/api/calculator/*` potrzebujesz tokenu z odpowiednimi scope.
- Do `/api/RoleData/role*` potrzebujesz tokenu z odpowiednią rolą.
