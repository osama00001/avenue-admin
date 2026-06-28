/** Root-absolute path for files in public/assets (works on nested routes). */
export function asset(path) {
  const normalized = String(path || "").replace(/^\/+/, "");
  return `/${normalized}`;
}
