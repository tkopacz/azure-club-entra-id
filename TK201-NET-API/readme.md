# TK201-NET-API

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

## Overview
Minimal ASP.NET Core API secured with Microsoft Entra ID. The API exposes calculator endpoints protected by OAuth scopes and role-protected endpoints used in later SPA demos.

## What's inside
- `Program.cs` – authentication/authorization setup, CORS, and Swagger configuration.
- `Controllers/CalculatorController.cs` – scope-protected calculator endpoints.
- `Controllers/RoleDataController.cs` – role-protected endpoints.
- `appsettings.json` – placeholders for Entra ID configuration.
- `net-api.http` – basic REST calls for the open `/todos` endpoints.

## Prerequisites
- .NET 8 SDK.
- A Microsoft Entra ID tenant with an API app registration.
- Optional: an additional app registration for Swagger UI (if you want OAuth in Swagger).

## Setup
1. Register an API app in Entra ID and expose scopes like `Calculator.Add`.
2. Create app roles (`role1`, `role2`, `role3`) if you want to use role-based endpoints.
3. Update `appsettings.json` with `TenantId`, `ClientId`, `Audience`, and optional `ClientSecret`.
4. If using Swagger OAuth, fill out the `Swagger` section.

## Run locally
```bash
dotnet restore
dotnet run
```

The API listens on `http://localhost:5058` (see `Properties/launchSettings.json`).

## Test endpoints
- Open `net-api.http` to call `/todos` without authentication.
- Use a bearer token with the required scopes to call `/api/calculator/*`.
- Use a bearer token containing `roles` to call `/api/RoleData/role*`.
