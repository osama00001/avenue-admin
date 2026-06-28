import React, { useCallback, useEffect, useRef, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { toast } from "react-toastify";
import Footer from "../../../components/footer/Footer";
import SiteContentNav from "../../../components/site-content/SiteContentNav";
import {
  createSiteContentPage,
  deleteSiteContentPage,
  fetchSiteContentPages,
} from "../../../lib/siteContentClient";
import RichTextEditor from "../../../components/site-content/RichTextEditor";
import { slugify } from "../../../lib/slugify";

export default function SiteContentPagesPage() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });
  const editorRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSiteContentPages();
      setPages(data);
    } catch (err) {
      setError(err.message || "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const slug = slugify(form.slug || form.title);
    if (!slug) {
      toast.error("Enter a valid slug (letters, numbers, and hyphens only)");
      return;
    }

    setCreating(true);
    try {
      const content = editorRef.current?.getContent?.() ?? "";
      const created = await createSiteContentPage({ ...form, slug, content });
      toast.success("Page created — you can edit it anytime from the list");
      setForm({ title: "", slug: "", content: "" });
      setSlugTouched(false);
      await load();
      if (created?.id) {
        window.location.href = `/site-content/pages/${created.id}`;
      }
    } catch (err) {
      toast.error(err.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (page) => {
    if (!window.confirm(`Delete "${page.title}"?`)) return;
    try {
      await deleteSiteContentPage(page.id);
      toast.success("Page deleted");
      await load();
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <>
      <Head>
        <title>CMS Pages — Avenue Admin</title>
      </Head>
      <div className="main-content">
        <div className="row g-4">
          <div className="col-12">
            <div className="panel">
              <div className="panel-header">
                <h5 className="mb-1">CMS Pages</h5>
                <p className="text-muted mb-0 small">
                  Create legal and info pages, then link them in the{" "}
                  <Link href="/site-content/footer">Footer</Link>
                </p>
              </div>
              <div className="panel-body">
                <SiteContentNav />
                <div className="alert alert-info small">
                  <strong>Workflow:</strong> Create the page here (title + slug + content) →
                  go to <Link href="/site-content/footer">Footer</Link> → add or pick a
                  column → link to this page from the dropdown.
                </div>
                {error ? <div className="alert alert-danger">{error}</div> : null}

                <form className="border rounded p-3 mb-4 bg-light" onSubmit={handleCreate}>
                  <h6 className="mb-3">Create new page</h6>
                  <div className="row g-3">
                    <div className="col-md-5">
                      <label className="form-label">Title</label>
                      <input
                        className="form-control"
                        value={form.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setForm((prev) => ({
                            ...prev,
                            title,
                            slug: slugTouched ? prev.slug : slugify(title),
                          }));
                        }}
                        required
                      />
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Slug</label>
                      <input
                        className="form-control"
                        value={form.slug}
                        onChange={(e) => {
                          setSlugTouched(true);
                          setForm({ ...form, slug: slugify(e.target.value) });
                        }}
                        placeholder="my-new-page"
                        required
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={creating}
                      >
                        {creating ? "Creating..." : "Create"}
                      </button>
                    </div>
                    <div className="col-12">
                      <RichTextEditor
                        ref={editorRef}
                        editorKey="create-page"
                        label="Page content"
                        defaultValue={form.content}
                      />
                    </div>
                  </div>
                </form>

                {loading ? (
                  <p className="text-muted">Loading pages...</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-dashed table-hover">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Slug</th>
                          <th className="text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pages.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="text-muted">
                              No pages yet
                            </td>
                          </tr>
                        ) : (
                          pages.map((page) => (
                            <tr key={page.id}>
                              <td>{page.title}</td>
                              <td>
                                <code>{page.slug}</code>
                              </td>
                              <td className="text-end">
                                <Link
                                  href={`/site-content/pages/${page.id}`}
                                  className="btn btn-sm btn-light border me-2"
                                >
                                  Edit
                                </Link>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(page)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
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
