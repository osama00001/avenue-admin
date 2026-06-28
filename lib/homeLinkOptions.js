/** Keep in sync with avenue/src/lib/catalogCategories.js */
export const HOME_LINK_OPTIONS = [
  { label: "Bestsellers", href: "/category/bestsellers" },
  { label: "New Books", href: "/category/popular" },
  { label: "Highlights", href: "/category/recently_reviewed" },
  { label: "Fiction", href: "/category/fiction" },
  { label: "Non-Fiction", href: "/category/non_fiction" },
  { label: "Children's", href: "/category/children_books" },
  { label: "Language", href: "/category/adult_books" },
  { label: "Games", href: "/category/gift_books" },
  { label: "E-Books", href: "/category/ebooks" },
  { label: "Highlights page", href: "/highlights" },
  { label: "Blog", href: "/blog" },
  { label: "Homepage", href: "/" },
];

export function normalizeHomeHref(href, fallback = "/category/bestsellers") {
  const value = String(href || "").trim();
  if (!value) return fallback;
  if (HOME_LINK_OPTIONS.some((option) => option.href === value)) return value;
  return value;
}

export function getHomeHrefOptions(currentHref = "") {
  const value = String(currentHref || "").trim();
  if (!value || HOME_LINK_OPTIONS.some((option) => option.href === value)) {
    return HOME_LINK_OPTIONS;
  }
  return [
    ...HOME_LINK_OPTIONS,
    { label: `Saved link (${value})`, href: value },
  ];
}
