import { PublicClientApplication, InteractionRequiredAuthError } from "@azure/msal-browser";
import type { AccountInfo } from "@azure/msal-browser";
import {
  clientId, redirectUri,
  graphScopes, graphUsersEndpoint,
} from "./authconfig";

const msal = new PublicClientApplication({
  auth: { clientId, redirectUri },
  cache: { cacheLocation: "sessionStorage" }
});

const $  = (id: string) => document.getElementById(id)!;
const out = (msg: unknown) => { $("out").textContent =
  typeof msg === "string" ? msg : JSON.stringify(msg, null, 2); };

let account: AccountInfo | null = null;
let cachedApiToken: string | null = null; // token for apiScope
let cachedApiDefaultToken: string | null = null; // token for .default (roles-based)

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

  ($("logout")    as HTMLButtonElement).disabled = !account;
  ($("listUsers") as HTMLButtonElement).disabled = !account;
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
  cachedApiDefaultToken = null;
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

// ---- Call Graph (uses mandatory scope obtained at login) ----
async function listUsers() {
  const token = await acquireToken(graphScopes);
  if (!token) return; // redirect happened

  const res = await fetch(graphUsersEndpoint, 
    { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  out({ status: res.status, users: data.value });
}

// Disable buttons until init completes
($("login") as HTMLButtonElement).disabled = true;
($("listUsers") as HTMLButtonElement).disabled = true;
($("logout") as HTMLButtonElement).disabled = true;

$("login").addEventListener("click", signIn);
$("listUsers").addEventListener("click", listUsers);
$("logout").addEventListener("click", signOut);

init();
