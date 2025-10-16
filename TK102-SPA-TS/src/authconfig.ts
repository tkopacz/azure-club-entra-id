// --- Replace these:
export const clientId = "Wlasny klient ID ClientId AppId";     // App registration (SPA)
export const tenantId = "tenant GUID (ID)";     // e.g., contoso.onmicrosoft.com or GUID 
export const redirectUri = "http://localhost:5173";                 // must be in SPA app’s redirect URIs - no port required
// If calling Microsoft Graph:
// Graph: delegated permission to read users (often needs admin consent)
export const graphScopes = ["User.ReadBasic.All"]; // or ["User.Read.All"] if you need full profiles
export const graphUsersEndpoint = "https://graph.microsoft.com/v1.0/users?$top=5";

export const authority = "https://login.microsoftonline.com/${tenantId}"; // who send the user to authenticate
//export const authority = "https://login.microsoftonline.com/common"; // for multi-tenant apps
