import { ADMIN_SESSION_COOKIE } from "@/lib/authConstants";
import { verifyAdminSessionToken } from "@/lib/adminSession";

function parseCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (key) acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

export function getAdminSession(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const token = cookies[ADMIN_SESSION_COOKIE];
  if (!token) return null;

  const payload = verifyAdminSessionToken(token);
  if (!payload) return null;

  return { adminId: payload.sub };
}

export function hasAdminSession(req) {
  return Boolean(getAdminSession(req));
}

export function getAvenueApiUrl() {
  return process.env.AVENUE_API_URL || "http://127.0.0.1:3000";
}

export function getAdminApiToken() {
  return process.env.ADMIN_API_TOKEN || "";
}
