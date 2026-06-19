import { ADMIN_SESSION_COOKIE } from "@/lib/authConstants";

function buildSessionCookie(value, maxAge) {
  const parts = [
    `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (typeof maxAge === "number") {
    parts.push(`Max-Age=${maxAge}`);
  }

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function setAdminSessionCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    buildSessionCookie(token, 60 * 60 * 24 * 7)
  );
}

export function clearAdminSessionCookie(res) {
  res.setHeader("Set-Cookie", buildSessionCookie("", 0));
}
