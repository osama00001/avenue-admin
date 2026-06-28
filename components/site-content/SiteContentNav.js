import React from "react";
import Link from "next/link";

export default function SiteContentNav() {
  const links = [
    { href: "/site-content", label: "Overview" },
    { href: "/site-content/home", label: "Homepage" },
    { href: "/site-content/footer", label: "Footer" },
    { href: "/site-content/pages", label: "CMS Pages" },
    { href: "/site-content/social", label: "Social Links" },
  ];

  return (
    <div className="d-flex flex-wrap gap-2 mb-4">
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="btn btn-sm btn-light border">
          {link.label}
        </Link>
      ))}
    </div>
  );
}
