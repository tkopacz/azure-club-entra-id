# TK203-WebAppMVC

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

## Overview
ASP.NET Core MVC web app that signs users in with Microsoft Entra ID and protects pages with app roles. It demonstrates interactive sign-in and role-based access control in a server-rendered UI.

## What's inside
- `Program.cs` – Microsoft Identity Web configuration and role-based policies.
- `Controllers/HomeController.cs` – actions for the home page and role-protected pages.
- `Views/Home/Role1Page.cshtml` – UI shown to users with the `role1` role.
- `Views/Home/Role2Page.cshtml` – UI shown to users with the `role2` role.
- `appsettings.json` – Entra ID placeholders for tenant and client identifiers.

## Prerequisites
- .NET 8 SDK.
- A Microsoft Entra ID tenant.
- An app registration with app roles (`role1`, `role2`) assigned to users.

## Setup
1. Register a web app in Entra ID and add a redirect URI like `http://localhost:5092/signin-oidc`.
2. Define app roles (`role1`, `role2`) and assign them to users or groups.
3. Update `appsettings.json` with your tenant and client IDs.

## Run locally
```bash
dotnet restore
dotnet run
```

The app listens on `http://localhost:5092` (see `Properties/launchSettings.json`).

## Usage
- Browse to `/` for the landing page.
- `/Home/Role1Page` and `/Home/Role2Page` require the matching roles.
