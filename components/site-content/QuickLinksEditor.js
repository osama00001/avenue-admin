import React from "react";
import ImageUploadField from "./ImageUploadField";
import HrefSelect from "./HrefSelect";

function emptyItem() {
  return {
    label: "",
    href: "",
    alt: "",
    order: 0,
    image: null,
    imageId: null,
  };
}

export default function QuickLinksEditor({ items = [], onChange }) {
  const item = items[0] || emptyItem();

  const updateItem = (patch) => {
    onChange([{ ...item, ...patch, order: 0 }]);
  };

  return (
    <div className="border rounded p-3 bg-light">
      <h6 className="mb-3">Quick link</h6>
      <p className="text-muted small mb-3">
        One quick link is shown on the homepage at a time. Update the image and
        where it should point.
      </p>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Label</label>
          <input
            className="form-control"
            value={item.label || ""}
            onChange={(e) => updateItem({ label: e.target.value })}
            placeholder="e.g. Language"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Alt text</label>
          <input
            className="form-control"
            value={item.alt || ""}
            onChange={(e) => updateItem({ alt: e.target.value })}
            placeholder="Image description"
          />
        </div>
        <div className="col-12">
          <HrefSelect
            value={item.href || ""}
            onChange={(href) => updateItem({ href })}
          />
        </div>
        <div className="col-12">
          <ImageUploadField
            label="Icon image"
            value={item.image}
            onChange={(image) =>
              updateItem({
                image,
                imageId: image?.id ?? null,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
