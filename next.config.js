/** @type {import('next').NextConfig} */
const avenueOrigin =
  process.env.AVENUE_API_URL ||
  process.env.NEXT_PUBLIC_AVENUE_SITE_URL ||
  "http://127.0.0.1:3000";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${avenueOrigin.replace(/\/$/, "")}/uploads/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
