function cmsPageSlug(value) {
  let slug = String(value || "").trim();
  if (!slug) return "";
  if (slug.startsWith("/cms/")) slug = slug.slice(5);
  else if (slug === "/cms") slug = "";
  else if (slug.startsWith("/")) slug = slug.slice(1);
  slug = slug.split("/").filter(Boolean)[0] || "";
  if (slug === "cms") return "";
  return slug;
}

/** Bare slug → stored in footer link */
export function cmsPageHref(slug) {
  return cmsPageSlug(slug);
}

/** Value for dropdown select */
export function toFooterLinkValue(href) {
  const value = String(href || "").trim();
  if (!value || value === "/cms") return "";
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return `external:${value}`;
  }
  if (value.startsWith("/cms/")) {
    return `cms:${cmsPageHref(value)}`;
  }
  if (value.startsWith("/")) {
    return `internal:${value}`;
  }
  return `cms:${cmsPageHref(value)}`;
}

export function fromFooterLinkValue(selectValue) {
  const value = String(selectValue || "").trim();
  if (!value) return "";
  if (value.startsWith("cms:")) return cmsPageHref(value.slice(4));
  if (value.startsWith("internal:")) return value.slice(9);
  if (value.startsWith("external:")) return value.slice(9);
  return value;
}

export function buildFooterLinkOptions(cmsPages = []) {
  const cmsOptions = cmsPages.map((page) => ({
    group: "CMS Pages",
    label: page.title || page.slug,
    value: `cms:${page.slug}`,
    href: cmsPageHref(page.slug),
    pageTitle: page.title,
  }));

  const custom = {
    group: "Other",
    label: "Custom URL (type below)",
    value: "custom:",
    href: "",
  };

  return [...cmsOptions, custom];
}

export function findFooterLinkOption(options, href) {
  const target = toFooterLinkValue(href);
  return options.find((option) => option.value === target) || null;
}

export function normalizeLinkLabel(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Match footer link label or stored url to a CMS page */
export function findCmsPageForLink(link, cmsPages = []) {
  const stored = cmsPageHref(link?.href || link?.url || "");
  if (stored) {
    const bySlug = cmsPages.find((page) => cmsPageHref(page.slug) === stored);
    if (bySlug) return bySlug;
  }

  const label = normalizeLinkLabel(link?.label);
  if (!label) return null;

  return (
    cmsPages.find((page) => {
      const title = normalizeLinkLabel(page.title);
      const slugWords = normalizeLinkLabel(String(page.slug || "").replace(/-/g, " "));
      return (
        title === label ||
        slugWords === label ||
        title.startsWith(label) ||
        label.startsWith(title) ||
        title.includes(label) ||
        label.includes(slugWords)
      );
    }) || null
  );
}

export function resolveFooterLinkHref(link, cmsPages = []) {
  const stored = String(link?.href || link?.url || "").trim();
  const slug = cmsPageSlug(stored);
  if (slug) return slug;
  if (
    stored.startsWith("http://") ||
    stored.startsWith("https://") ||
    (stored.startsWith("/") && stored !== "/cms")
  ) {
    return stored;
  }
  const match = findCmsPageForLink(link, cmsPages);
  return match?.slug || "";
}
