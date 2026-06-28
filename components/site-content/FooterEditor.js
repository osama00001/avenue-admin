import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import FooterLinkSelect from "./FooterLinkSelect";
import { fetchSiteContentPages } from "../../lib/siteContentClient";
import { resolveFooterLinkHref } from "../../lib/footerLinkOptions";

function emptyLink() {
  return { label: "", href: "" };
}

function emptyColumn() {
  return { title: "", links: [emptyLink()] };
}

export default function FooterEditor({ columns = [], onChange }) {
  const [cmsPages, setCmsPages] = useState([]);
  const [pagesLoading, setPagesLoading] = useState(true);
  const hydratedRef = useRef(false);

  useEffect(() => {
    fetchSiteContentPages()
      .then((pages) => setCmsPages(pages || []))
      .catch(() => setCmsPages([]))
      .finally(() => setPagesLoading(false));
  }, []);

  useEffect(() => {
    if (pagesLoading || !cmsPages.length || hydratedRef.current) return;

    let changed = false;
    const nextColumns = columns.map((col) => ({
      ...col,
      links: (col.links || []).map((link) => {
        const resolved = resolveFooterLinkHref(link, cmsPages);
        const stored = String(link.href || link.url || "").trim();
        if (resolved && resolved !== stored) {
          changed = true;
          return { ...link, href: resolved };
        }
        if (!link.href && (link.url || resolved)) {
          changed = true;
          return { ...link, href: resolved || link.url };
        }
        return link;
      }),
    }));

    hydratedRef.current = true;
    if (changed) onChange(nextColumns);
  }, [cmsPages, pagesLoading, columns, onChange]);

  const updateColumn = (index, patch) => {
    onChange(columns.map((col, i) => (i === index ? { ...col, ...patch } : col)));
  };

  const updateLink = (colIndex, linkIndex, patch) => {
    const next = columns.map((col, i) => {
      if (i !== colIndex) return col;
      return {
        ...col,
        links: col.links.map((link, j) =>
          j === linkIndex ? { ...link, ...patch } : link
        ),
      };
    });
    onChange(next);
  };

  return (
    <div className="d-flex flex-column gap-4">
      <div className="alert alert-info small mb-0">
        <strong>How footer + CMS pages work:</strong>
        <ol className="mb-0 mt-2 ps-3">
          <li>
            First create content in{" "}
            <Link href="/site-content/pages">CMS Pages</Link> (Privacy Policy,
            Terms, etc.)
          </li>
          <li>Then come here and add a footer link — pick that page from the dropdown</li>
          <li>Label is what shoppers see; the page opens at <code>/cms/your-slug</code></li>
        </ol>
      </div>

      {pagesLoading ? (
        <p className="text-muted small mb-0">Loading CMS pages...</p>
      ) : cmsPages.length === 0 ? (
        <p className="text-warning small mb-0">
          No CMS pages yet.{" "}
          <Link href="/site-content/pages">Create a page first</Link> before linking
          it in the footer.
        </p>
      ) : null}

      {columns.map((column, colIndex) => (
        <div key={colIndex} className="border rounded p-3 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">Column {colIndex + 1}</h6>
            <button
              type="button"
              className="btn btn-sm btn-outline-danger"
              onClick={() => onChange(columns.filter((_, i) => i !== colIndex))}
            >
              Remove column
            </button>
          </div>
          <div className="mb-3">
            <label className="form-label">Column title</label>
            <input
              className="form-control"
              value={column.title || ""}
              onChange={(e) => updateColumn(colIndex, { title: e.target.value })}
              placeholder="e.g. LEGAL"
            />
          </div>
          <div className="d-flex flex-column gap-3">
            {(column.links || []).map((link, linkIndex) => (
              <div key={linkIndex} className="border rounded p-3 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-medium small">Link {linkIndex + 1}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    onClick={() =>
                      updateColumn(colIndex, {
                        links: column.links.filter((_, i) => i !== linkIndex),
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="row g-3">
                  <div className="col-md-5">
                    <label className="form-label">Label (footer text)</label>
                    <input
                      className="form-control"
                      value={link.label || ""}
                      onChange={(e) =>
                        updateLink(colIndex, linkIndex, { label: e.target.value })
                      }
                      placeholder="Privacy Policy"
                    />
                  </div>
                  <div className="col-md-7">
                    <FooterLinkSelect
                      cmsPages={cmsPages}
                      pagesLoading={pagesLoading}
                      label={link.label || ""}
                      value={link.href || link.url || ""}
                      onChange={(href) =>
                        updateLink(colIndex, linkIndex, { href, url: href })
                      }
                      onPagePick={(pageTitle, href) => {
                        if (!link.label?.trim()) {
                          updateLink(colIndex, linkIndex, {
                            label: pageTitle,
                            href,
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm align-self-start"
              onClick={() =>
                updateColumn(colIndex, {
                  links: [...(column.links || []), emptyLink()],
                })
              }
            >
              Add link
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => onChange([...columns, emptyColumn()])}
      >
        Add column
      </button>
    </div>
  );
}
