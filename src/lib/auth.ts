export const AUTH_COOKIE_NAME = "redreeduc_access_token";

export async function getExpectedToken(): Promise<string> {
  const password = process.env.APP_PASSWORD || "RedaKine2025!";
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_salt_redreeduc");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(inputPassword: string): Promise<boolean> {
  const expectedPassword = process.env.APP_PASSWORD || "RedaKine2025!";
  return inputPassword.trim() === expectedPassword.trim();
}
