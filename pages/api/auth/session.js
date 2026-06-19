import { getAdminSession } from "@/lib/serverAuth";

export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = getAdminSession(req);

  return res.status(200).json({
    authenticated: Boolean(session),
    adminId: session?.adminId || null,
  });
}
