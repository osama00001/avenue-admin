import { getAvenueApiUrl } from "@/lib/serverAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const started = Date.now();
  const avenueUrl = getAvenueApiUrl();
  let avenueStatus = "unknown";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const upstream = await fetch(`${avenueUrl}/api/health`, {
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
    avenueStatus = upstream.ok ? "up" : "down";
  } catch {
    avenueStatus = "down";
  }

  const ok = avenueStatus === "up";

  return res.status(ok ? 200 : 503).json({
    status: ok ? "ok" : "degraded",
    service: "avenue-admin",
    checks: {
      avenueBackend: avenueStatus,
    },
    uptimeSec: Math.floor(process.uptime()),
    responseMs: Date.now() - started,
  });
}
