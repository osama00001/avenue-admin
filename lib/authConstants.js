export const ADMIN_SESSION_COOKIE = "admin_session";

export const PUBLIC_PATHS = [
  "/login",
  "/login2",
  "/login3",
  "/loginStatus",
  "/registration",
  "/registration2",
  "/resetPassword",
  "/updatePassword",
  "/comingSoon",
  "/comingSoon2",
  "/error400",
  "/error403",
  "/error404",
  "/error408",
  "/error500",
  "/error503",
  "/error504",
  "/underConstruction",
  "/pricingTable",
  "/pricingTable2",
];

export function isPublicPath(pathname) {
  return PUBLIC_PATHS.includes(pathname);
}
