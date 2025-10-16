export const msalConfig = {
    auth: {
        clientId: "<client id>",
        authority: "https://login.microsoftonline.com/<tenant id - tak tez mozna konfigurowac>",
        redirectUri: "http://localhost:5173",
        postLogoutRedirectUri: "http://localhost:5173"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false
    }
};

// Configuration for accessing a protected web API - where we NEED to request consent to use User.Read
// Or - set it in Entra ID as Admin (more practical for production but - less practical for demo)
// The same Redirect URI should be set in the web API app registration
export const msalWebApiConfig = {
    auth: {
        clientId: "<drugi client id - ten dla web api>",
        authority: "https://login.microsoftonline.com/<tenant id>",
        redirectUri: "http://localhost:5173",
        postLogoutRedirectUri: "http://localhost:5173"
    },
    cache: {
        cacheLocation: "localStorage",
        storeAuthStateInCookie: false
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const apiConfig = {
    scopes: ["api://<clientid for web api>/access_as_user"],
    uri: "http://localhost:5000/api/me"
};
