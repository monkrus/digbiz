// lib/google.ts
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebase";

WebBrowser.maybeCompleteAuthSession();

export type ClientIds = {
  /** Optional generic client id; useful on web */
  clientId?: string;
  iosClientId?: string;
  androidClientId?: string;
  webClientId?: string;
};

/**
 * Usage in a component:
 * const signInWithGoogle = useGoogleSignIn({
 *   iosClientId: "<IOS_CLIENT_ID>",
 *   androidClientId: "<ANDROID_CLIENT_ID>",
 *   webClientId: "<WEB_CLIENT_ID>",
 *   // clientId: "<GENERIC_CLIENT_ID>" // optional
 * });
 * await signInWithGoogle();
 */
export function useGoogleSignIn(ids: ClientIds) {
  // useIdTokenAuthRequest ensures we get an ID token back
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: ids.clientId,
    iosClientId: ids.iosClientId,
    androidClientId: ids.androidClientId,
    webClientId: ids.webClientId,
    scopes: ["openid", "profile", "email"],
  });

  return async function signInWithGoogle(): Promise<void> {
    const res = await promptAsync();

    if (res.type !== "success") {
      throw new Error(res.type === "dismiss" ? "Google sign-in canceled" : "Google sign-in failed");
    }

    // ID token location can vary by SDK/version
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const idToken: string | undefined =
      (res as any)?.params?.id_token ??
     
      (res as any)?.authentication?.idToken;

    if (!idToken) {
      throw new Error("Missing id_token from Google response");
    }

    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
  };
}
