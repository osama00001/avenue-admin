import crypto from "crypto";

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_API_TOKEN ||
    ""
  );
}

function sign(data) {
  return crypto.createHmac("sha256", getSecret()).update(data).digest("hex");
}

export function createAdminSessionToken(adminId, ttlSec = DEFAULT_TTL_SEC) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET or ADMIN_API_TOKEN is required");
  }

  const payload = {
    sub: adminId,
    exp: Date.now() + ttlSec * 1000,
  };

  const data = JSON.stringify(payload);
  const signature = sign(data);

  return Buffer.from(JSON.stringify({ data, signature })).toString("base64url");
}

export function verifyAdminSessionToken(token) {
  const secret = getSecret();
  if (!secret || !token) return null;

  try {
    const { data, signature } = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    );

    const expected = sign(data);
    if (
      signature.length !== expected.length ||
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return null;
    }

    const payload = JSON.parse(data);
    if (!payload.exp || payload.exp < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}
