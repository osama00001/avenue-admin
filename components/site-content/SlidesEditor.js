import React from "react";
import ImageUploadField from "./ImageUploadField";
import HrefSelect from "./HrefSelect";

function emptySlide() {
  return {
    title: "",
    subtitle: "",
    href: "",
    alt: "",
    order: 0,
    image: null,
    imageId: null,
  };
}

export default function SlidesEditor({
  slides = [],
  onChange,
  single = false,
  sectionLabel = "Slide",
}) {
  const visibleSlides = single
    ? [slides[0] || emptySlide()]
    : slides.length
      ? slides
      : [emptySlide()];

  const updateSlide = (index, patch) => {
    if (single) {
      onChange([{ ...visibleSlides[0], ...patch, order: 0 }]);
      return;
    }

    onChange(
      visibleSlides.map((slide, i) =>
        i === index ? { ...slide, ...patch } : slide
      )
    );
  };

  const addSlide = () => {
    onChange([...visibleSlides, { ...emptySlide(), order: visibleSlides.length }]);
  };

  const removeSlide = (index) => {
    if (single || visibleSlides.length <= 1) return;
    onChange(visibleSlides.filter((_, i) => i !== index));
  };

  return (
    <div className="d-flex flex-column gap-4">
      {visibleSlides.map((slide, index) => (
        <div key={index} className="border rounded p-3 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="mb-0">
              {single ? sectionLabel : `${sectionLabel} ${index + 1}`}
            </h6>
            {!single && visibleSlides.length > 1 ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => removeSlide(index)}
              >
                Remove
              </button>
            ) : null}
          </div>
          {single ? (
            <p className="text-muted small mb-3">
              One {sectionLabel.toLowerCase()} is managed here at a time.
            </p>
          ) : null}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control"
                value={slide.title || ""}
                onChange={(e) => updateSlide(index, { title: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Subtitle</label>
              <input
                className="form-control"
                value={slide.subtitle || ""}
                onChange={(e) => updateSlide(index, { subtitle: e.target.value })}
              />
            </div>
            <div className="col-md-6">
              <HrefSelect
                value={slide.href || ""}
                onChange={(href) => updateSlide(index, { href })}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Alt text</label>
              <input
                className="form-control"
                value={slide.alt || ""}
                onChange={(e) => updateSlide(index, { alt: e.target.value })}
              />
            </div>
            {!single ? (
              <div className="col-md-12">
                <label className="form-label">Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={slide.order ?? 0}
                  onChange={(e) =>
                    updateSlide(index, { order: Number(e.target.value) || 0 })
                  }
                />
              </div>
            ) : null}
            <div className="col-12">
              <ImageUploadField
                label="Image"
                value={slide.image}
                onChange={(image) =>
                  updateSlide(index, {
                    image,
                    imageId: image?.id ?? null,
                  })
                }
              />
            </div>
          </div>
        </div>
      ))}
      {!single ? (
        <button type="button" className="btn btn-outline-primary" onClick={addSlide}>
          Add slide
        </button>
      ) : null}
    </div>
  );
}
