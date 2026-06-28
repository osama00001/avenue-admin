import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Footer from "../../components/footer/Footer";
import SiteContentNav from "../../components/site-content/SiteContentNav";
import { fetchSiteContentManifest } from "../../lib/siteContentClient";

export default function SiteContentIndexPage() {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSiteContentManifest()
      .then(setManifest)
      .catch((err) => setError(err.message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const sectionLinks = {
    footer: "/site-content/footer",
    "home-banner": "/site-content/home",
    "home-promo": "/site-content/home",
    "home-strip": "/site-content/home",
    "home-main-banner": "/site-content/home",
    "home-middle-banner": "/site-content/home",
    "home-bottom-banner": "/site-content/home",
    "home-quick-links": "/site-content/home",
    pages: "/site-content/pages",
    "social-links": "/site-content/social",
  };

  return (
    <>
      <Head>
        <title>Site Content — Avenue Admin</title>
      </Head>
      <div className="main-content">
        <div className="row g-4">
          <div className="col-12">
            <div className="panel">
              <div className="panel-header">
                <h5 className="mb-1">Site Content</h5>
                <p className="text-muted mb-0 small">
                  Manage homepage banners, footer, CMS pages, and more.
                </p>
              </div>
              <div className="panel-body">
                <SiteContentNav />
                {loading ? <p className="text-muted">Loading...</p> : null}
                {error ? <div className="alert alert-danger">{error}</div> : null}
                {manifest ? (
                  <div className="row g-3">
                    <div className="col-md-6">
                      <h6 className="mb-3">Layout &amp; homepage</h6>
                      <div className="list-group">
                        <Link href="/site-content/home" className="list-group-item list-group-item-action">
                          Homepage banners &amp; quick links
                        </Link>
                        <Link href="/site-content/footer" className="list-group-item list-group-item-action">
                          Footer columns
                        </Link>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <h6 className="mb-3">Content</h6>
                      <div className="list-group">
                        <Link href="/site-content/pages" className="list-group-item list-group-item-action">
                          CMS pages
                        </Link>
                        <Link href="/site-content/social" className="list-group-item list-group-item-action">
                          Social links
                        </Link>
                      </div>
                        <h6 className="mb-3 mt-4">All sections</h6>
                      <ul className="list-unstyled small text-muted mb-0">
                        {manifest.sections?.map((section) => (
                          <li key={section.key} className="mb-1">
                            <Link href={sectionLinks[section.key] || "/site-content"}>
                              {section.title}
                            </Link>
                            {section.description ? ` — ${section.description}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
