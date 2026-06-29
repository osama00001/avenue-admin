import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SiteContentPanel from "../../components/site-content/SiteContentPanel";
import SiteContentNav from "../../components/site-content/SiteContentNav";
import SlidesEditor from "../../components/site-content/SlidesEditor";
import BannerEditor from "../../components/site-content/BannerEditor";
import QuickLinksEditor from "../../components/site-content/QuickLinksEditor";
import {
  fetchSiteContentSingle,
  mergeHomeSectionState,
  saveSiteContentSingle,
} from "../../lib/siteContentClient";

const HOME_SECTIONS = [
  {
    key: "home-banner",
    label: "Hero Slider",
    type: "slides",
    single: true,
    sectionLabel: "Hero banner",
  },
  {
    key: "home-promo",
    label: "Promo Slider",
    type: "slides",
    single: true,
    sectionLabel: "Promo banner",
  },
  {
    key: "home-strip",
    label: "Coming Soon Strip",
    type: "banner",
    showSubtitle: true,
  },
  {
    key: "home-main-banner",
    label: "Non-Fiction Banner",
    type: "banner",
  },
  {
    key: "home-middle-banner",
    label: "Children's Banner",
    type: "banner",
  },
  {
    key: "home-bottom-banner",
    label: "Bottom Banner",
    type: "banner",
  },
  {
    key: "home-quick-links",
    label: "Quick Link",
    type: "quick-links",
  },
];

export default function SiteContentHomePage() {
  const [activeKey, setActiveKey] = useState(HOME_SECTIONS[0].key);
  const [sections, setSections] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const entries = await Promise.all(
        HOME_SECTIONS.map(async (section) => {
          const data = await fetchSiteContentSingle(section.key);
          return [section.key, data || {}];
        })
      );
      setSections(Object.fromEntries(entries));
    } catch (err) {
      setError(err.message || "Failed to load homepage content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const activeSection = HOME_SECTIONS.find((s) => s.key === activeKey);
  const activeData = sections[activeKey] || {};

  const updateActive = (patch) => {
    setSections((prev) => ({
      ...prev,
      [activeKey]: {
        ...(prev[activeKey] || {}),
        ...patch,
      },
    }));
  };

  const saveActive = async () => {
    if (!activeSection) return;
    setSaving(true);
    const snapshot = sections[activeKey] || {};
    try {
      const saved = await saveSiteContentSingle(activeKey, snapshot);
      setSections((prev) => ({
        ...prev,
        [activeKey]: mergeHomeSectionState(snapshot, saved || {}),
      }));
      toast.success(`${activeSection.label} saved`);
    } catch (err) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SiteContentPanel
      title="Homepage Content"
      description="Manage all homepage banners, sliders, and quick links"
      loading={loading}
      saving={saving}
      saveDisabled={imageUploading}
      onSave={saveActive}
      saveLabel={`Save ${activeSection?.label || "section"}`}
    >
      <SiteContentNav />
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading ? (
        <>
          <ul className="nav nav-tabs mb-4 flex-wrap">
            {HOME_SECTIONS.map((section) => (
              <li className="nav-item" key={section.key}>
                <button
                  type="button"
                  className={`nav-link ${activeKey === section.key ? "active" : ""}`}
                  onClick={() => setActiveKey(section.key)}
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
          {activeSection?.type === "slides" ? (
            <SlidesEditor
              slides={activeData.slides || []}
              onChange={(slides) => updateActive({ slides })}
              onUploadingChange={setImageUploading}
              single={Boolean(activeSection.single)}
              sectionLabel={activeSection.sectionLabel || "Slide"}
            />
          ) : null}
          {activeSection?.type === "banner" ? (
            <BannerEditor
              value={activeData}
              showSubtitle={activeSection.showSubtitle}
              onChange={(value) => updateActive(value)}
              onUploadingChange={setImageUploading}
            />
          ) : null}
          {activeSection?.type === "quick-links" ? (
            <QuickLinksEditor
              items={(activeData.items || []).slice(0, 1)}
              onChange={(items) => updateActive({ items })}
              onUploadingChange={setImageUploading}
            />
          ) : null}
        </>
      ) : null}
    </SiteContentPanel>
  );
}
