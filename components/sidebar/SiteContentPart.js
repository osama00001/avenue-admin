import React, { useState } from "react";
import NavLink from "../router/NavLink";

const SiteContentPart = () => {
  const [open, setOpen] = useState(true);

  return (
    <li className="sidebar-item open">
      <a
        role="button"
        className={`sidebar-link-group-title has-sub ${open ? "show" : ""}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        Site Content
      </a>
      <ul className={`sidebar-link-group ${open ? "" : "d-none"}`}>
        <li className="sidebar-dropdown-item">
          <NavLink href="/site-content" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-layer-group"></i>
            </span>{" "}
            <span className="sidebar-txt">Overview</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/site-content/home" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-house"></i>
            </span>{" "}
            <span className="sidebar-txt">Homepage</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/site-content/footer" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-shoe-prints"></i>
            </span>{" "}
            <span className="sidebar-txt">Footer</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/site-content/pages" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-file-lines"></i>
            </span>{" "}
            <span className="sidebar-txt">CMS Pages</span>
          </NavLink>
        </li>
        <li className="sidebar-dropdown-item">
          <NavLink href="/site-content/social" className="sidebar-link">
            <span className="nav-icon">
              <i className="fa-light fa-share-nodes"></i>
            </span>{" "}
            <span className="sidebar-txt">Social Links</span>
          </NavLink>
        </li>
      </ul>
    </li>
  );
};

export default SiteContentPart;
