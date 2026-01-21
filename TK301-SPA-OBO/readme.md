# Microsoft Entra ID On-Behalf-Of Demo

[English](readme.md) | [Polski](readme-pl.md)
[Back to repository overview](../README.md)

This sample shows how to combine a single-page application written in TypeScript with an ASP.NET Core Web API that calls the Microsoft Graph `/me` endpoint by using the [On-Behalf-Of (OBO) flow](https://learn.microsoft.com/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow).

The solution contains two independent projects:

- `api` – an ASP.NET Core Web API secured by Microsoft Entra ID and configured to acquire tokens for Microsoft Graph using Microsoft.Identity.Web.
- `spa` – a dependency-free TypeScript SPA that uses **MSAL.js** to sign users in and obtain an access token for the Web API.

## Architecture

1. The SPA authenticates a user with Microsoft Entra ID using MSAL.js and receives an ID token and an access token scoped for the Web API (`access_as_user`).
2. The SPA calls the secured Web API and passes the API access token in the `Authorization` header.
3. The Web API validates the token, exchanges it for a Microsoft Graph token via OBO, and queries the `/me` endpoint.
4. The Web API returns the Graph profile payload back to the SPA.

## Prerequisites

- .NET 8 SDK
- Node.js 18+ and npm
- An Azure AD (Microsoft Entra ID) tenant with the ability to create app registrations

## Azure app registration

1. **Register the Web API**
   - Set the **Application ID URI** to something like `api://<api-client-id>`.
   - Add the delegated permission `User.Read` under **Microsoft Graph**.
   - Expose a delegated scope named `access_as_user`.
   - Create a client secret and store it securely.

2. **Register the SPA**
   - Configure the redirect URI `https://localhost:5173`.
   - Enable implicit grant is not necessary because the SPA uses the authorization code flow with PKCE.
   - Grant delegated permission to the Web API scope `api://<api-client-id>/access_as_user`.

3. **Grant admin consent** for the SPA application.

## Configuration

### Web API

Update `api/appsettings.json` with your tenant information:

```json
"AzureAd": {
  "TenantId": "<tenant-id>",
  "ClientId": "<web-api-client-id>",
  "ClientSecret": "<web-api-client-secret>",
  "Audience": "api://<web-api-client-id>"
},
"DownstreamApi": {
  "BaseUrl": "https://graph.microsoft.com/v1.0/",
  "Scopes": "User.Read"
}
```

Set the `Spa:Origins` array to the URL that serves the TypeScript SPA.

### SPA

Update `spa/src/authConfig.ts`:

```ts
export const msalConfig = {
  auth: {
    clientId: "<spa-client-id>",
    authority: "https://login.microsoftonline.com/<tenant-id>",
    redirectUri: "https://localhost:5173"
  }
};

export const apiConfig = {
  scopes: ["api://<web-api-client-id>/access_as_user"],
  uri: "https://localhost:5001/api/me"
};
```

## Running the solution

### Start the API

```bash
cd api
dotnet restore
dotnet run
```

### Start the SPA

```bash
cd spa
npm install
npm run dev
```

Open `https://localhost:5173` in the browser, sign in, and call the API to see the `/me` payload.

## Project structure

```
21-TS-SPA-OBO/
├── api
│   ├── Controllers
│   │   └── MeController.cs
│   ├── appsettings.json
│   ├── OboDemo.Api.csproj
│   ├── Program.cs
│   └── Properties
│       └── launchSettings.json
├── spa
│   ├── package.json
│   ├── public
│   │   ├── index.html
│   │   └── styles.css
│   ├── src
│   │   ├── app.ts
│   │   └── authConfig.ts
│   └── tsconfig.json
└── README.md
```

Both projects are intentionally minimal to focus on the OBO scenario.
