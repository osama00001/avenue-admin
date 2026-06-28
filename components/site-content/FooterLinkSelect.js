import React, { useMemo } from "react";
import {
  buildFooterLinkOptions,
  findCmsPageForLink,
  fromFooterLinkValue,
  resolveFooterLinkHref,
  toFooterLinkValue,
} from "../../lib/footerLinkOptions";

export default function FooterLinkSelect({
  cmsPages = [],
  pagesLoading = false,
  value = "",
  label = "",
  onChange,
  onPagePick,
}) {
  const options = useMemo(() => buildFooterLinkOptions(cmsPages), [cmsPages]);

  const effectiveHref = useMemo(
    () => resolveFooterLinkHref({ href: value, label }, cmsPages),
    [value, label, cmsPages]
  );

  const matchedByLabel = useMemo(() => {
    if (value?.trim()) return null;
    return findCmsPageForLink({ label }, cmsPages);
  }, [value, label, cmsPages]);

  const selectValue = toFooterLinkValue(effectiveHref);
  const isCustom =
    selectValue === "custom:" ||
    (selectValue && !options.some((option) => option.value === selectValue));

  const grouped = useMemo(() => {
    const map = new Map();
    for (const option of options) {
      if (!map.has(option.group)) map.set(option.group, []);
      map.get(option.group).push(option);
    }
    return [...map.entries()];
  }, [options]);

  const handleSelect = (nextValue) => {
    if (nextValue === "custom:") {
      onChange(value || "");
      return;
    }
    const href = fromFooterLinkValue(nextValue);
    onChange(href);
    const picked = options.find((option) => option.value === nextValue);
    if (picked?.pageTitle && onPagePick) {
      onPagePick(picked.pageTitle, href);
    }
  };

  return (
    <div>
      <label className="form-label">Link to</label>
      <select
        className="form-select"
        value={isCustom ? "custom:" : selectValue || ""}
        onChange={(e) => handleSelect(e.target.value)}
        disabled={pagesLoading}
      >
        <option value="" disabled>
          {pagesLoading ? "Loading pages…" : "Select a page or destination"}
        </option>
        {grouped.map(([group, items]) => (
          <optgroup key={group} label={group}>
            {items.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      {isCustom ? (
        <input
          className="form-control mt-2"
          placeholder="https://... or /category/bestsellers"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}
      {effectiveHref ? (
        <div className="form-text">
          {matchedByLabel && !value?.trim() ? (
            <span className="text-success d-block mb-1">
              Matched CMS page &quot;{matchedByLabel.title}&quot; from label.
              Save footer to store this link.
            </span>
          ) : null}
          Saves as: <code>{effectiveHref}</code> → storefront{" "}
          <code>
            {effectiveHref.startsWith("http") || effectiveHref.startsWith("/")
              ? effectiveHref.startsWith("/cms/")
                ? effectiveHref
                : effectiveHref.startsWith("/")
                  ? effectiveHref
                  : `/cms/${effectiveHref}`
              : `/cms/${effectiveHref}`}
          </code>
        </div>
      ) : (
        <div className="form-text text-warning">
          Pick a CMS page created under Site Content → CMS Pages.
        </div>
      )}
    </div>
  );
}
