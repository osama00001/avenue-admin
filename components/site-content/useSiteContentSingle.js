import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SiteContentPanel from "../../components/site-content/SiteContentPanel";
import SiteContentNav from "../../components/site-content/SiteContentNav";
import {
  fetchSiteContentSingle,
  mergeHomeSectionState,
  saveSiteContentSingle,
} from "../../lib/siteContentClient";

function useSiteContentSingle(key) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchSiteContentSingle(key);
      setData(result || {});
    } catch (err) {
      setError(err.message || "Failed to load");
      setData({});
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async () => {
    setSaving(true);
    const snapshot = data || {};
    try {
      const result = await saveSiteContentSingle(key, snapshot);
      setData(mergeHomeSectionState(snapshot, result || {}));
      toast.success("Saved successfully");
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return { data, setData, loading, saving, error, save, reload: load };
}

export { useSiteContentSingle };

export default function SiteContentSinglePage({
  contentKey,
  title,
  description,
  children,
}) {
  const { data, setData, loading, saving, error, save } =
    useSiteContentSingle(contentKey);

  return (
    <SiteContentPanel
      title={title}
      description={description}
      loading={loading}
      saving={saving}
      onSave={save}
    >
      <SiteContentNav />
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading ? children(data, setData) : null}
    </SiteContentPanel>
  );
}
