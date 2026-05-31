import { cookies } from "next/headers";
import { siteConfig } from "@/lib/seo";

export const ADMIN_COOKIE = "pouma_admin";

function sessionToken() {
  return process.env.ADMIN_SESSION_SECRET ?? "pouma-admin-authenticated-v1";
}

export function validateAdminCredentials(email: string, password: string) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    if (process.env.NODE_ENV === "production") return false;
    return (
      email.trim().toLowerCase() === siteConfig.email.toLowerCase() &&
      password === "dev-only-change-me"
    );
  }
  return (
    email.trim().toLowerCase() === siteConfig.email.toLowerCase() &&
    password === expectedPassword
  );
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === sessionToken();
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  };
}

export function getAdminSessionValue() {
  return sessionToken();
}
