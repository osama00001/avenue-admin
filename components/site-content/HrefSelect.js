import React, { useMemo } from "react";
import { getHomeHrefOptions } from "../../lib/homeLinkOptions";

export default function HrefSelect({
  label = "Link destination",
  value = "",
  onChange,
  helpText = "Choose where this image should link on the storefront.",
}) {
  const options = useMemo(() => getHomeHrefOptions(value), [value]);
  const selectedValue = useMemo(() => {
    const current = String(value || "").trim();
    if (current && options.some((option) => option.href === current)) {
      return current;
    }
    return "";
  }, [options, value]);

  return (
    <div>
      <label className="form-label">{label}</label>
      <select
        className="form-select"
        value={selectedValue}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>
          Select destination
        </option>
        {options.map((option) => (
          <option key={option.href} value={option.href}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedValue ? (
        <div className="form-text text-muted">
          Selected: <code>{selectedValue}</code>
        </div>
      ) : null}
      {helpText ? <div className="form-text">{helpText}</div> : null}
    </div>
  );
}
