// --- Replace these:
export const clientId = "<client id, appid>";     // App registration (SPA)
export const tenantId = "<tenant guid>";     // e.g., contoso.onmicrosoft.com or GUID 
export const redirectUri = "http://localhost:5173";                 // must be in SPA app’s redirect URIs - no port required
// If calling Microsoft Graph:
// Graph: delegated permission to read users (often needs admin consent)
export const graphScopes = ["User.ReadBasic.All"]; // or ["User.Read.All"] if you need full profiles
export const graphUsersEndpoint = "https://graph.microsoft.com/v1.0/users?$top=5";

export const authority = "https://login.microsoftonline.com/${tenantId}"; // who send the user to authenticate
//export const authority = "https://login.microsoftonline.com/common"; // for multi-tenant apps

// If calling your own protected API (example):
//   1) Expose an API scope in your API app registration (e.g. "api://<api-app-id>/access_as_user")
//   2) Add that scope to your SPA’s "API permissions" and grant admin consent (if needed)
// Your protected API (optional, dynamic consent)
export const apiScope = "api://<web api ClientId>/Calculator.Add";
export const apiUrl   = "http://localhost:5058/api/Calculator/add?a=1&b=2";

// Using .default for same resource to get roles-based token without defining a second custom scope
export const apiDefaultScope = "api://<web api ClientId>/.default";

export const apiApiRole2 = "role2";
export const apiApiRole2Url   = "http://localhost:5058/api/RoleData/role2";

export const apiApiRole3 = "role3";
export const apiApiRole3Url   = "http://localhost:5058/api/RoleData/role3";

