// ============================================================
// Mock Authentication for NimeList Frontend
// Creates a fake JWT token so all authenticated pages work
// ============================================================

import { setAccessToken } from "@/utils/auth";

// A base64-encoded fake JWT. The payload contains demo user info.
// Structure: header.payload.signature (signature is fake)
function createFakeJWT(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));

  const payload = btoa(
    JSON.stringify({
      username: "demo_user",
      email: "demo@nimelist.com",
      name: "Demo User",
      role: "admin",
      // Set expiry far in the future (year 2030)
      exp: Math.floor(new Date("2030-01-01").getTime() / 1000),
      iat: Math.floor(Date.now() / 1000),
    })
  );

  const signature = btoa("mock_signature_nimelist");

  return `${header}.${payload}.${signature}`;
}

/**
 * Performs a mock login — sets a fake JWT in localStorage.
 * Returns the same shape as the real /auth/login response.
 */
export function mockLogin(): { access_token: string } {
  const token = createFakeJWT();
  const exp = Math.floor(new Date("2030-01-01").getTime() / 1000);
  setAccessToken(token, exp);
  localStorage.setItem("is_mock_auth", "true");
  return { access_token: token };
}

/**
 * Returns a fake refresh token response.
 */
export function mockRefreshToken(): { access_token: string } {
  return { access_token: createFakeJWT() };
}

/**
 * Sets up mock auth on app load (if no token exists yet).
 * Call this from providers to auto-login in mock mode.
 */
export function setupMockAuth(): void {
  const existing = localStorage.getItem("access_token");
  if (!existing) {
    mockLogin();
  } else {
    localStorage.setItem("is_mock_auth", "true");
  }
}
