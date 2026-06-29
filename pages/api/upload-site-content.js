import {
  getAdminApiToken,
  getAvenueApiUrl,
  hasAdminSession,
} from "@/lib/serverAuth";

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: "12mb",
  },
};

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

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

  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("multipart/form-data")) {
    return res.status(400).json({ message: "Expected multipart/form-data upload" });
  }

  try {
    const body = await readRequestBody(req);
    const targetUrl = `${getAvenueApiUrl().replace(/\/$/, "")}/api/admin/site-content/upload`;

    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": contentType,
        "Content-Length": String(body.length),
      },
      body,
    });

    const text = await upstream.text();
    let payload = text;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { message: text || upstream.statusText };
    }

    return res.status(upstream.status).json(payload);
  } catch (err) {
    console.error("[upload-site-content] error:", err);
    return res.status(502).json({ message: "Failed to upload image" });
  }
}
