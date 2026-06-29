import {
  getAdminApiToken,
  getAvenueApiUrl,
  hasAdminSession,
} from "@/lib/serverAuth";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "12mb",
    },
  },
};

export default async function handler(req, res) {
  if (!hasAdminSession(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = getAdminApiToken();
  if (!token) {
    const message =
      process.env.NODE_ENV === "production"
        ? "Service misconfigured"
        : "ADMIN_API_TOKEN is not configured";
    return res.status(500).json({ message });
  }

  const { path = [] } = req.query;
  const apiPath = Array.isArray(path) ? path.join("/") : path;
  const queryIndex = req.url.indexOf("?");
  const queryString = queryIndex >= 0 ? req.url.slice(queryIndex) : "";

  const targetUrl = `${getAvenueApiUrl()}/api/${apiPath}${queryString}`;

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const init = {
      method: req.method,
      headers,
    };

    if (req.method !== "GET" && req.method !== "HEAD") {
      const hasBody =
        req.body !== undefined &&
        req.body !== null &&
        (typeof req.body === "string"
          ? req.body.length > 0
          : Object.keys(req.body).length > 0);

      if (hasBody) {
        init.body =
          typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        headers["Content-Type"] = "application/json";
      }
    }

    const upstream = await fetch(targetUrl, init);
    const text = await upstream.text();

    let payload = text;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { message: text || upstream.statusText };
    }

    return res.status(upstream.status).json(payload);
  } catch (err) {
    console.error("[proxy] error:", err);
    return res.status(502).json({ message: "Failed to reach Avenue API" });
  }
}
