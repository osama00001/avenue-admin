import { setAdminSessionCookie } from "@/lib/sessionCookie";
import { getAvenueApiUrl, getAdminApiToken } from "@/lib/serverAuth";
import { createAdminSessionToken } from "@/lib/adminSession";
import { checkRateLimit } from "@/lib/rateLimit";

async function parseJsonResponse(res) {
  const raw = await res.text();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const rate = checkRateLimit(req);
  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSec));
    return res.status(429).json({ message: "Too many login attempts. Try again later." });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  const avenueUrl = getAvenueApiUrl();
  const internalToken = getAdminApiToken();

  const verifyHeaders = { "Content-Type": "application/json" };
  if (internalToken) {
    verifyHeaders.Authorization = `Bearer ${internalToken}`;
  }

  try {
    const verifyRes = await fetch(`${avenueUrl}/api/admin/auth/verify`, {
      method: "POST",
      headers: verifyHeaders,
      body: JSON.stringify({ email, password }),
    });

    const data = await parseJsonResponse(verifyRes);

    if (data === null) {
      if (verifyRes.status === 404) {
        return res.status(502).json({
          message: "Avenue API not found. Check AVENUE_API_URL and backend status.",
        });
      }

      return res.status(502).json({
        message: `Avenue backend returned an invalid response (${verifyRes.status})`,
      });
    }

    if (!verifyRes.ok || !data.success) {
      return res.status(verifyRes.status === 401 ? 401 : 502).json({
        message: data.message || "Invalid credentials",
      });
    }

    const sessionToken = createAdminSessionToken(data.admin.id);
    setAdminSessionCookie(res, sessionToken);

    return res.status(200).json({ success: true, admin: data.admin });
  } catch (err) {
    console.error("[auth/login] error:", err);
    return res.status(502).json({
      message: "Cannot connect to Avenue backend. Check AVENUE_API_URL.",
    });
  }
}
