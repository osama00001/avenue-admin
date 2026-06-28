/** Preview uploads stored on the Avenue app (port 3000) while admin runs on 3001. */
export function resolveAdminMediaUrl(url) {
  if (!url) return "";
  const value = String(url).trim();
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//")) {
    return value;
  }
  const base =
    process.env.NEXT_PUBLIC_AVENUE_SITE_URL ||
    process.env.NEXT_PUBLIC_AVENUE_API_URL ||
    "http://127.0.0.1:3000";
  const path = value.startsWith("/") ? value : `/${value}`;
  return `${base.replace(/\/$/, "")}${path}`;
}
