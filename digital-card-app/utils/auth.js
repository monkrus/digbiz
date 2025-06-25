const FIREBASE_API_KEY = "AIzaSyArK5M_7Eg_k5oPIAFnLDv_nczqtS_GwXw";

export async function loginWithEmailPassword(email, password) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'Login failed');
  }

  return data;
}
