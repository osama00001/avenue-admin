import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { uploadSiteContentImage } from "../../lib/siteContentClient";

class SiteContentUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then((file) =>
      uploadSiteContentImage(file).then((data) => {
        if (!data?.url) throw new Error("Image upload failed");
        return { default: data.url };
      })
    );
  }

  abort() {
    // no-op
  }
}

function wireUploadAdapter(editor) {
  try {
    const repo = editor.plugins.get("FileRepository");
    repo.createUploadAdapter = (loader) => new SiteContentUploadAdapter(loader);
  } catch {
    // Prebuilt editor may not expose file upload — use the Upload image button instead.
  }
}

/** Uncontrolled editor — do not pass live `data` or typing resets on each keystroke. */
const CkEditor = ({ initialData = "", onDataChanged, onEditorReady }) => {
  return (
    <div className="editor">
      <CKEditor
        editor={ClassicEditor}
        onReady={(editor) => {
          editor.setData(initialData || "");
          wireUploadAdapter(editor);
          onEditorReady?.(editor);
        }}
        onChange={(event, editor) => {
          onDataChanged?.(editor.getData());
        }}
      />
    </div>
  );
};

export default CkEditor;
