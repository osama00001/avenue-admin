import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { uploadSiteContentImage } from "../../lib/siteContentClient";
import { resolveAdminMediaUrl } from "../../lib/mediaUrl";

export default function ImageUploadField({
  label,
  value,
  onChange,
  helpText,
  onUploadingChange,
}) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    onUploadingChange?.(true);
    setError("");
    try {
      const uploaded = await uploadSiteContentImage(file);
      onChange(uploaded);
      toast.success("Image uploaded — click Save to apply");
    } catch (err) {
      setError(err.message || "Upload failed");
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
      onUploadingChange?.(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="mb-3">
      {label ? <label className="form-label">{label}</label> : null}
      <div className="d-flex flex-wrap align-items-start gap-3">
        {value?.url ? (
          <div
            className="border rounded overflow-hidden bg-light"
            style={{ width: 140, height: 90 }}
          >
            <img
              src={resolveAdminMediaUrl(value.url)}
              alt={value.name || "Preview"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        ) : (
          <div
            className="border rounded d-flex align-items-center justify-content-center text-muted small bg-light"
            style={{ width: 140, height: 90 }}
          >
            No image
          </div>
        )}
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="form-control form-control-sm"
            onChange={handleFile}
            disabled={uploading}
          />
          {value?.id ? (
            <button
              type="button"
              className="btn btn-link btn-sm text-danger px-0 mt-1"
              onClick={() => onChange(null)}
            >
              Remove image
            </button>
          ) : null}
          {uploading ? (
            <div className="small text-muted mt-1">Uploading...</div>
          ) : null}
          {error ? <div className="small text-danger mt-1">{error}</div> : null}
          {helpText ? <div className="small text-muted mt-1">{helpText}</div> : null}
        </div>
      </div>
    </div>
  );
}
