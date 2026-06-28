import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { toast } from "react-toastify";
import SiteContentPanel from "../../../components/site-content/SiteContentPanel";
import SiteContentNav from "../../../components/site-content/SiteContentNav";
import {
  fetchSiteContentPage,
  updateSiteContentPage,
} from "../../../lib/siteContentClient";
import RichTextEditor from "../../../components/site-content/RichTextEditor";
import { slugify } from "../../../lib/slugify";

export default function SiteContentPageEditorPage() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const editorRef = useRef(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError("");
    try {
      const page = await fetchSiteContentPage(id);
      setForm({
        title: page.title || "",
        slug: page.slug || "",
        content: page.content || "",
      });
    } catch (err) {
      setError(err.message || "Failed to load page");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    if (!id) return;
    const slug = slugify(form.slug || form.title);
    if (!slug) {
      toast.error("Enter a valid slug (letters, numbers, and hyphens only)");
      return;
    }

    setSaving(true);
    try {
      const content = editorRef.current?.getContent?.() ?? "";
      const saved = await updateSiteContentPage(id, { ...form, slug, content });
      setForm({
        title: saved?.title || form.title,
        slug: saved?.slug || slug,
        content: saved?.content ?? content,
      });
      toast.success("Page saved");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SiteContentPanel
      title="Edit CMS Page"
      description="Write page content — appears at /cms/your-slug on the storefront"
      loading={loading}
      saving={saving}
      onSave={save}
    >
      <SiteContentNav />
      <div className="mb-3">
        <Link href="/site-content/pages" className="btn btn-sm btn-light border">
          Back to pages
        </Link>
      </div>
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading ? (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <input
              className="form-control"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Slug</label>
            <input
              className="form-control"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            />
          </div>
          <div className="col-12">
            <RichTextEditor
              ref={editorRef}
              editorKey={id ? `page-${id}` : "edit-page"}
              label="Page content"
              defaultValue={form.content}
            />
          </div>
        </div>
      ) : null}
    </SiteContentPanel>
  );
}
