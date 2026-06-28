import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SiteContentPanel from "../../components/site-content/SiteContentPanel";
import SiteContentNav from "../../components/site-content/SiteContentNav";
import {
  fetchSiteContentSocialLinks,
  saveSiteContentSocialLinks,
} from "../../lib/siteContentClient";

function emptyLink(order = 0) {
  return {
    label: "",
    url: "",
    icon: "",
    order,
    enabled: true,
  };
}

export default function SiteContentSocialPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSiteContentSocialLinks();
      setLinks(data.length ? data : [emptyLink()]);
    } catch (err) {
      setError(err.message || "Failed to load social links");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateLink = (index, patch) => {
    setLinks((prev) =>
      prev.map((link, i) => (i === index ? { ...link, ...patch } : link))
    );
  };

  const save = async () => {
    setSaving(true);
    try {
      const saved = await saveSiteContentSocialLinks(links);
      setLinks(saved.length ? saved : [emptyLink()]);
      toast.success("Social links saved");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SiteContentPanel
      title="Social Links"
      description="Manage social media links for the storefront"
      loading={loading}
      saving={saving}
      onSave={save}
    >
      <SiteContentNav />
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading ? (
        <div className="d-flex flex-column gap-3">
          {links.map((link, index) => (
            <div key={link.id || index} className="border rounded p-3 bg-light">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Link {index + 1}</h6>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => setLinks(links.filter((_, i) => i !== index))}
                >
                  Remove
                </button>
              </div>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label">Label</label>
                  <input
                    className="form-control"
                    value={link.label || ""}
                    onChange={(e) => updateLink(index, { label: e.target.value })}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">URL</label>
                  <input
                    className="form-control"
                    value={link.url || ""}
                    onChange={(e) => updateLink(index, { url: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Icon class</label>
                  <input
                    className="form-control"
                    value={link.icon || ""}
                    onChange={(e) => updateLink(index, { icon: e.target.value })}
                    placeholder="faSquareFacebook"
                  />
                </div>
                <div className="col-md-1">
                  <label className="form-label">Order</label>
                  <input
                    type="number"
                    className="form-control"
                    value={link.order ?? 0}
                    onChange={(e) =>
                      updateLink(index, { order: Number(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="col-md-1 d-flex align-items-end">
                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={link.enabled !== false}
                      onChange={(e) =>
                        updateLink(index, { enabled: e.target.checked })
                      }
                      id={`social-enabled-${index}`}
                    />
                    <label className="form-check-label" htmlFor={`social-enabled-${index}`}>
                      On
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary align-self-start"
            onClick={() => setLinks([...links, emptyLink(links.length)])}
          >
            Add social link
          </button>
        </div>
      ) : null}
    </SiteContentPanel>
  );
}
