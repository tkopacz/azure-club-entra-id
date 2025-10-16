import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";
import {
  clientId, redirectUri,
  graphScopes, graphUsersEndpoint,

  apiScope, apiUrl,

  apiDefaultScope,

  apiApiRole2, apiApiRole2Url,

  apiApiRole3, apiApiRole3Url
} from "./authconfig";

const msal = new PublicClientApplication({
  auth: { clientId, redirectUri },
  cache: { cacheLocation: "sessionStorage" }
});

const $ = (id: string) => document.getElementById(id)!;
const out = (msg: unknown) => {
  $("out").textContent =
  typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
};

const stat = (msg: unknown) => {
  $("stat").textContent =
  typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
}

let account: AccountInfo | null = null;
let cachedApiToken: string | null = null; // token for apiScope

async function init() {
  await msal.initialize(); // MSAL v3 requirement

  try {
    // Handle redirect result first (login/consent)
    const result = await msal.handleRedirectPromise();
    if (result?.account) {
      account = result.account;
      msal.setActiveAccount(account);
    } else {
      account = msal.getActiveAccount() ?? msal.getAllAccounts()[0] ?? null;
      if (account) msal.setActiveAccount(account);
    }

    ($("logout") as HTMLButtonElement).disabled = !account;
    ($("listUsers") as HTMLButtonElement).disabled = !account;
    ($("callApi") as HTMLButtonElement).disabled = !account;
    ($("callApiRole2") as HTMLButtonElement).disabled = !account;
    ($("callApiRole3") as HTMLButtonElement).disabled = !account;

    out(account ? `Signed in as ${account.username}` : "Not signed in");
  } catch (e) {
    out(e);
  } finally {
    ($("login") as HTMLButtonElement).disabled = false;
    if (!account) {
      ($("logout") as HTMLButtonElement).disabled = true;
    }
  }
}

// ---- Sign-in requests MANDATORY Graph scope ----
async function signIn() {
  await msal.initialize();
  await msal.loginRedirect({ scopes: graphScopes });
}

// ---- Sign out ----
async function signOut() {
  const active = msal.getActiveAccount();
  cachedApiToken = null;
  if (active) {
    await msal.logoutRedirect({ account: active, postLogoutRedirectUri: redirectUri });
  } else {
    await msal.logoutRedirect({ postLogoutRedirectUri: redirectUri });
  }
  account = null;
  ($("login") as HTMLButtonElement).disabled = false;
  ($("logout") as HTMLButtonElement).disabled = true;
  ($("listUsers") as HTMLButtonElement).disabled = true;
  out("Signed out");
}

// ---- Call Graph (uses mandatory scope obtained at login) ----
async function listUsers() {
  const token = await acquireToken(graphScopes);
  if (!token) return; // redirect happened

  const res = await fetch(graphUsersEndpoint, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  stat({ status: res.status, users: data.value });
}

// ---- Call your API (OPTIONAL scope: prompts for consent on first use) ----
async function callApi() {
  const token = cachedApiToken ||= await acquireToken([apiScope]); // dynamic consent if needed
  if (!token) return;

  const res = await fetch(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
  const data = await (async () => { try { return await res.json(); } catch { return await res.text(); } })();
  stat({ status: res.status, data });
}

// ---- Call your API2 (requires app role; uses .default scope) ----
async function callApiRole2() {

  /**
   * A roles claim appears in an access token ONLY if:
The target resource (the API whose aud = …) defines at least one app role, AND
The signed-in user (or a group they’re in) is assigned at least one of those app roles (Enterprise App assignment), AND
You requested a token for that resource (its Application ID URI / client ID) — not some proxy/mistaken resource.
   * 
   */
  // Client-side role validation before requesting token / calling API2
  const active = msal.getActiveAccount();
  if (!active) { out("No active account"); return; }
  let token = await acquireToken([apiDefaultScope]);
  if (!token) return;

  let decoded = decodeJwt(token);
  if (!decoded?.roles) {
    token = await acquireToken([apiDefaultScope], { forceRefresh: true });
    if (!token) return;
    decoded = decodeJwt(token);
  }
  if (!Array.isArray(decoded?.roles) || !decoded.roles.includes(apiApiRole2)) { //Well - client side, not secure at ALL! - but demo here - API need to validate it!
    stat({ error: "Missing role", required: apiApiRole2, existing: decoded?.roles });
    return; //IF we don't have Role2 in token then FOR SURE API call will fail
  }

  const res = await fetch(apiApiRole2Url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await parseResponse(res, "error callApiRole2");
  stat({ status: res.status, message: data });

}

// ---- Call your API2 (requires app role; uses .default scope) ----
async function callApiRole3() {
  // Client-side role validation before requesting token / calling API2
  const active = msal.getActiveAccount();
  if (!active) { out("No active account"); return; }
  let token = await acquireToken([apiDefaultScope]);
  if (!token) return;

  let decoded = decodeJwt(token);
  if (!decoded?.roles) {
    token = await acquireToken([apiDefaultScope], { forceRefresh: true });
    if (!token) return;
    decoded = decodeJwt(token);
  }
  if (!Array.isArray(decoded?.roles) || !decoded.roles.includes(apiApiRole3)) { //Well - client side, not secure at ALL! - but demo here - API need to validate it!
    stat({ error: "Missing role", required: apiApiRole3, existing: decoded?.roles });
    // return; - demo purposes, call the API anyway, only there we can really validate the role
  }

  const res = await fetch(apiApiRole3Url, { headers: { Authorization: `Bearer ${token}` } });
  const data = await parseResponse(res, "error callApiRole3");
  stat({ status: res.status, message: data });

}



// -- Utils
// Helper for simplified error handling when parsing fetch responses
// Helper to parse fetch responses with fallback error message
async function parseResponse(res: Response, fallback: string) {
  try {
    return await res.json();
  } catch {
    try {
      return await res.text();
    } catch {
      return fallback;
    }
  }
}

// ---- Token helpers ----
async function acquireToken(scopes: string[], opts: { forceRefresh?: boolean } = {}) {
  await msal.initialize();
  const active = msal.getActiveAccount();
  if (!active) throw new Error("No active account");

  try {
    const silentReq: any = { scopes, account: active };
    if (typeof opts.forceRefresh === "boolean") silentReq.forceRefresh = opts.forceRefresh;
    const { accessToken } = await msal.acquireTokenSilent(silentReq);
    return accessToken;
  } catch (err) {
    if (err instanceof InteractionRequiredAuthError) {
      // This triggers dynamic/incremental consent when scopes weren’t granted yet
      await msal.acquireTokenRedirect({ scopes });
      return ""; // flow continues after redirect
    }
    throw err;
  }
}

// Minimal JWT decode (no signature validation; debug only)
function decodeJwt(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const [, rawPayload] = parts;
    if (!rawPayload) return null;
    const payload = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(atob(payload).split("").map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(""));
    return JSON.parse(json);
  } catch {
    return null;
  }
}


// -- End ---

// Disable buttons until init completes
($("login") as HTMLButtonElement).disabled = true;
($("listUsers") as HTMLButtonElement).disabled = true;
($("logout") as HTMLButtonElement).disabled = true;

($("callApi") as HTMLButtonElement).disabled = true;
($("callApiRole2") as HTMLButtonElement).disabled = true;
($("callApiRole3") as HTMLButtonElement).disabled = true;

$("login").addEventListener("click", signIn);
$("listUsers").addEventListener("click", listUsers);

$("callApi").addEventListener("click", callApi);
$("callApiRole2").addEventListener("click", callApiRole2);
$("callApiRole3").addEventListener("click", callApiRole3);

$("logout").addEventListener("click", signOut);



init();
