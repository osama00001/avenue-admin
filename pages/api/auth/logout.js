import { clearAdminSessionCookie } from "@/lib/sessionCookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  clearAdminSessionCookie(res);

  return res.status(200).json({ success: true });
}
