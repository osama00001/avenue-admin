import dynamic from "next/dynamic";
import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { toast } from "react-toastify";
import { uploadSiteContentImage } from "../../lib/siteContentClient";

const CkEditor = dynamic(() => import("../ck-editor/CkEditor"), { ssr: false });

function insertImageHtml(editor, url, alt = "") {
  const safeAlt = String(alt || "").replace(/"/g, "&quot;");
  const html = `<figure class="image"><img src="${url}" alt="${safeAlt}"></figure>`;
  const viewFragment = editor.data.processor.toView(html);
  const modelFragment = editor.data.toModel(viewFragment);
  editor.model.insertContent(modelFragment);
}

const RichTextEditor = forwardRef(function RichTextEditor(
  { defaultValue = "", onChange, label = "Content", editorKey = "default" },
  ref
) {
  const editorRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    getContent() {
      return editorRef.current?.getData?.() ?? "";
    },
  }));

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const uploaded = await uploadSiteContentImage(file);
      if (!uploaded?.url) throw new Error("No image URL returned");

      if (editorRef.current) {
        insertImageHtml(editorRef.current, uploaded.url, file.name);
        onChange?.(editorRef.current.getData());
      }
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label ? <label className="form-label">{label}</label> : null}
      <p className="text-muted small mb-2">
        Format text like Word — bold, headings, lists, links, and images.
      </p>
      <div className="border rounded bg-white p-2">
        <CkEditor
          key={editorKey}
          initialData={defaultValue}
          onDataChanged={onChange}
          onEditorReady={(editor) => {
            editorRef.current = editor;
          }}
        />
      </div>
      <div className="mt-2">
        <label className="btn btn-sm btn-outline-secondary mb-0">
          {uploading ? "Uploading…" : "Upload image"}
          <input
            type="file"
            accept="image/*"
            className="d-none"
            disabled={uploading}
            onChange={handleImageUpload}
          />
        </label>
        <span className="text-muted small ms-2">
          Or use the image toolbar button after picking a file here.
        </span>
      </div>
    </div>
  );
});

export default RichTextEditor;
