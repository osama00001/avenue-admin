import React from "react";
import ImageUploadField from "./ImageUploadField";
import HrefSelect from "./HrefSelect";

export default function BannerEditor({ value = {}, onChange, showSubtitle = false }) {
  const update = (patch) => onChange({ ...value, ...patch });

  return (
    <div className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Title</label>
        <input
          className="form-control"
          value={value.title || ""}
          onChange={(e) => update({ title: e.target.value })}
        />
      </div>
      {showSubtitle ? (
        <div className="col-md-6">
          <label className="form-label">Subtitle</label>
          <input
            className="form-control"
            value={value.subtitle || ""}
            onChange={(e) => update({ subtitle: e.target.value })}
          />
        </div>
      ) : null}
      <div className="col-md-6">
        <HrefSelect
          value={value.href || ""}
          onChange={(href) => update({ href })}
        />
      </div>
      <div className="col-md-6">
        <label className="form-label">Alt text</label>
        <input
          className="form-control"
          value={value.alt || ""}
          onChange={(e) => update({ alt: e.target.value })}
        />
      </div>
      <div className="col-12">
        <ImageUploadField
          label="Banner image"
          value={value.image}
          onChange={(image) =>
            update({
              image,
              imageId: image?.id ?? null,
            })
          }
        />
      </div>
    </div>
  );
}
