import {
  PublicClientApplication,
  InteractionRequiredAuthError,
  AccountInfo,
  AuthenticationResult
} from "@azure/msal-browser";
import { apiConfig, loginRequest, msalConfig, msalWebApiConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

const msalWebApiInstance = new PublicClientApplication(msalWebApiConfig);

let activeAccount: AccountInfo | null = null;

async function initializeMsal() {
  //For SPA
  await msalInstance.initialize();
  
  //For Web API consent only!
  await msalWebApiInstance.initialize();

  const authResult = await msalInstance.handleRedirectPromise();

  if (authResult) {
    setActiveAccount(authResult);
  } else {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      activeAccount = accounts[0];
    }
  }

  updateUi();
}

function setActiveAccount(result: AuthenticationResult) {
  activeAccount = result.account;
  if (activeAccount) {
    msalInstance.setActiveAccount(activeAccount);
  }
}

function updateUi() {
  const status = document.getElementById("status");
  const profile = document.getElementById("profile");

  if (!status || !profile) {
    return;
  }

  if (activeAccount) {
    status.textContent = `Signed in as ${activeAccount.username}`;
  } else {
    status.textContent = "Not signed in";
    profile.textContent = "";
  }
}

async function signIn() {
  try {
    const result = await msalInstance.loginPopup(loginRequest);
    setActiveAccount(result);
    updateUi();
  } catch (error) {
    displayError(error);
  }
}

async function signOut() {
  if (!activeAccount) {
    return;
  }

  try {
    await msalInstance.logoutPopup({ account: activeAccount });
    activeAccount = null;
    updateUi();
  } catch (error) {
    displayError(error);
  }
}

async function acquireTokenForApi() {
  if (!activeAccount) {
    throw new Error("You must sign in first.");
  }

  try {
    // Request both API and Graph scopes for OBO
    const allScopes = [
      "api://6eb7bcbc-9d70-4338-a561-6e511381b0dd/access_as_user"
      //"User.Read" // But this is NOT requested for WebAPI - only for SPA!!!!!!
    ];
    const result = await msalInstance.acquireTokenSilent({
      ...loginRequest,
      scopes: allScopes,
      account: activeAccount
    });

    return result.accessToken;
  } catch (error) {
    if (error instanceof InteractionRequiredAuthError) {
      displayError("You will be redirected to grant required permissions for SPA (API and Microsoft Graph). After consenting, you will be returned to the app.");
      msalInstance.acquireTokenRedirect({
        ...loginRequest,
        scopes: [
          "api://6eb7bcbc-9d70-4338-a561-6e511381b0dd/access_as_user"
          // "User.Read" // But this is NOT requested for WebAPI - only for SPA!!!!!!
        ]
      });
      return ""; // No token yet, flow will continue after redirect
    }

    throw error;
  }
}

async function callApi() {
  try {
    const token = await acquireTokenForApi();
    const response = await fetch(apiConfig.uri, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.status === 403) {
      // API indicates consent required, prompt user for specific permission
      displayError(
        "Web API requires additional consent - so let's login using another instance to set it up (you will be redirected)"
      );
      //Only login - to set consent on Entra ID side 
      msalWebApiInstance.loginRedirect ({
        scopes: [
          "User.Read" // Requesting Graph permission to set up consent for Web API!! But of course - I can't take token for calling Graph API FROM Web API here!!!!
        ],
        loginHint: activeAccount?.username
      });

      //------------------------------------------------------------------------------------------------------------------------------------
      // Remark: I could potentially request a Bearer (Access Token) for Graph API here and pass it to the Web API as an argument to be used there.
      // BUT THIS IS NOT RECOMMENDED, since it breaks the purpose of the OBO flow—where the Web API should get its own token using its own identity
      // It is like saving a bearer token in the browser and passing it around—which is not good for security. Or saving it to a database and passing it around.
      //------------------------------------------------------------------------------------------------------------------------------------
      return;
    }

    if (!response.ok) {
      throw new Error(`API call failed with status ${response.status}`);
    }

    const payload = await response.json();
    const profile = document.getElementById("profile");
    if (profile) {
      profile.textContent = JSON.stringify(payload, null, 2);
    }
  } catch (error) {
    displayError(error);
  }
}

function displayError(error: unknown) {
  const details = document.getElementById("errors");
  if (details) {
    details.textContent = error instanceof Error ? error.message : String(error);
  }
}

function wireEvents() {
  const loginButton = document.getElementById("login");
  const logoutButton = document.getElementById("logout");
  const callApiButton = document.getElementById("call-api");

  loginButton?.addEventListener("click", () => void signIn());
  logoutButton?.addEventListener("click", () => void signOut());
  callApiButton?.addEventListener("click", () => void callApi());
}

wireEvents();
initializeMsal().catch(displayError);
