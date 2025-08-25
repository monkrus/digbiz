// lib/google.ts
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { makeRedirectUri } from "expo-auth-session";
import { auth } from "./firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

// Ensures web auth session completes properly
WebBrowser.maybeCompleteAuthSession();

type GoogleExtra = {
  clientId: string; // Google OAuth 2.0 Web client ID (…apps.googleusercontent.com)
};

const googleExtra =
  (Constants.expoConfig?.extra?.google as GoogleExtra) ??
  (Constants.manifest2?.extra?.google as GoogleExtra);

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

// Simple nonce
function randomNonce(len = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

/**
 * Launches Google sign-in (OIDC implicit flow with id_token) and signs into Firebase.
 * Requires extra.google.clientId and extra.authRedirectScheme in app.config.ts.
 */
/** 
export async function signInWithGoogle(): Promise<void> {
  const clientId = googleExtra?.clientId;
  if (!clientId) {
    throw new Error("Missing Google clientId in app.config.ts -> extra.google.clientId");
  }

  const redirectUri = makeRedirectUri({
    scheme: (Constants.expoConfig?.extra as any)?.authRedirectScheme ?? "digbizapp",
    preferLocalhost: true,
  });

  const scopes = ["openid", "profile", "email"];
  const nonce = randomNonce();

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "id_token",
    scope: scopes.join(" "),
    nonce,
    prompt: "select_account",
  });

  const authUrl = `${discovery.authorizationEndpoint}?${params.toString()}`;

  const result = await AuthSession.openSessionAsync(authUrl, redirectUri);

  if (result.type !== "success") {
    throw new Error("Google sign-in was cancelled or failed.");
  }

  const idToken = (result.params as any)["id_token"];
  if (!idToken) {
    throw new Error("Google did not return an ID token.");
  }

  const cred = GoogleAuthProvider.credential(idToken);
  await signInWithCredential(auth, cred);
}
*/