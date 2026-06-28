import React from "react";
import Head from "next/head";
import Footer from "../footer/Footer";

export default function SiteContentPanel({
  title,
  description,
  children,
  onSave,
  saving = false,
  loading = false,
  saveLabel = "Save Changes",
}) {
  return (
    <>
      <Head>
        <title>{title} — Avenue Admin</title>
        <meta name="description" content={description || title} />
      </Head>
      <div className="main-content">
        <div className="row g-4">
          <div className="col-12">
            <div className="panel">
              <div className="panel-header">
                <div>
                  <h5 className="mb-1">{title}</h5>
                  {description ? (
                    <p className="text-muted mb-0 small">{description}</p>
                  ) : null}
                </div>
              </div>
              <div className="panel-body">
                {loading ? (
                  <div className="text-muted py-4">Loading...</div>
                ) : (
                  <>
                    {children}
                    {onSave ? (
                      <div className="d-flex justify-content-end mt-4 pt-3 border-top">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={onSave}
                          disabled={saving || loading}
                        >
                          {saving ? "Saving..." : saveLabel}
                        </button>
                      </div>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
