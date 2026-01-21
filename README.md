# Azure Club Entra ID demos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](README.md) | [Polski](readme-pl.md)

## Overview

This repository contains small, focused demos that were presented at the Azure Club event on October 16, 2025. The samples cover Microsoft Entra ID authentication with TypeScript single-page apps and .NET applications. These demos are intentionally simplified for learning purposes and are not reference implementations.

## Demos

| Folder | Description | Tech |
| --- | --- | --- |
| `TK101-VSCodeDemo` | Raw OAuth 2.0/PKCE flow executed via HTTP requests ([README](TK101-VSCodeDemo/readme.md)). | Entra ID, Microsoft Graph |
| `TK102-SPA-TS` | Basic SPA sign-in with MSAL.js ([README](TK102-SPA-TS/readme.md)). | TypeScript, Vite |
| `TK201-NET-API` | Minimal ASP.NET Core API secured by Entra ID ([README](TK201-NET-API/readme.md)). | .NET |
| `TK202-SPA-TS-CALL-NET` | SPA calling a protected .NET API ([README](TK202-SPA-TS-CALL-NET/readme.md)). | TypeScript, Vite, .NET |
| `TK203-WebAppMVC` | MVC web app with Entra ID sign-in ([README](TK203-WebAppMVC/readme.md)). | ASP.NET Core MVC |
| `TK301-SPA-OBO` | SPA + API demo with the On-Behalf-Of flow ([README](TK301-SPA-OBO/readme.md)). | TypeScript, .NET |

## Prerequisites

- Node.js 18+ and npm (for TypeScript demos)
- .NET 8 SDK (for .NET demos)
- A Microsoft Entra ID tenant with permissions to create app registrations

## Getting started

1. Clone the repository.
2. Pick a demo folder.
3. Follow the local instructions (look for `r.cmd` or a README in that folder).
4. Update Entra ID configuration values (client IDs, tenant IDs, secrets) in the demo config files.

## Configuration tips

- TypeScript SPA demos store Entra ID settings in `src/authconfig.ts`.
- .NET demos store Entra ID settings in `appsettings.json`.

## Contributing

Issues and improvements are welcome. If you want to share fixes or improvements, please open a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
