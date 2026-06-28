import { avenueFetch } from "./avenueClient";

export async function fetchSiteContentManifest() {
  const res = await avenueFetch("/api/proxy/admin/site-content");
  return res.data;
}

export async function fetchSiteContentSingle(key) {
  const res = await avenueFetch(`/api/proxy/admin/site-content/singles/${key}`);
  return res.data;
}

export async function saveSiteContentSingle(key, body) {
  const res = await avenueFetch(`/api/proxy/admin/site-content/singles/${key}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.data;
}

export function mergeHomeSectionState(sent = {}, received = {}) {
  const merged = { ...received };

  if (Array.isArray(sent.items)) {
    const receivedItems = Array.isArray(received.items) ? received.items : [];
    const sourceItems = receivedItems.length ? receivedItems : sent.items;

    merged.items = sourceItems.map((item, index) => ({
      ...sent.items[index],
      ...item,
      href: item?.href || sent.items[index]?.href || "",
      label: item?.label ?? sent.items[index]?.label ?? "",
      alt: item?.alt ?? sent.items[index]?.alt ?? "",
      image: item?.image?.url ? item.image : sent.items[index]?.image || item?.image,
      imageId:
        item?.imageId ??
        item?.image?.id ??
        sent.items[index]?.imageId ??
        sent.items[index]?.image?.id ??
        null,
      id: item?.id ?? sent.items[index]?.id ?? null,
    }));

    if (!merged.items.length) {
      merged.items = sent.items;
    }
  }

  if (Array.isArray(sent.slides)) {
    const receivedSlides = Array.isArray(received.slides) ? received.slides : [];
    const sourceSlides = receivedSlides.length ? receivedSlides : sent.slides;

    merged.slides = sourceSlides.map((slide, index) => ({
      ...sent.slides[index],
      ...slide,
      href: slide?.href || sent.slides[index]?.href || "",
      title: slide?.title ?? sent.slides[index]?.title ?? "",
      subtitle: slide?.subtitle ?? sent.slides[index]?.subtitle ?? "",
      alt: slide?.alt ?? sent.slides[index]?.alt ?? "",
      image: slide?.image?.url ? slide.image : sent.slides[index]?.image || slide?.image,
      imageId:
        slide?.imageId ??
        slide?.image?.id ??
        sent.slides[index]?.imageId ??
        sent.slides[index]?.image?.id ??
        null,
      id: slide?.id ?? sent.slides[index]?.id ?? null,
    }));

    if (!merged.slides.length) {
      merged.slides = sent.slides;
    }
  }

  merged.href = received.href || sent.href || "";
  merged.title = received.title ?? sent.title ?? "";
  merged.subtitle = received.subtitle ?? sent.subtitle ?? "";
  merged.alt = received.alt ?? sent.alt ?? "";
  merged.image =
    received.image?.url ? received.image : sent.image || received.image || null;
  merged.imageId =
    received.imageId ??
    received.image?.id ??
    sent.imageId ??
    sent.image?.id ??
    null;

  if (Array.isArray(sent.columns)) {
    const receivedColumns = Array.isArray(received.columns) ? received.columns : [];
    const sourceColumns = receivedColumns.length ? receivedColumns : sent.columns;

    merged.columns = sourceColumns.map((col, colIndex) => {
      const sentCol = sent.columns[colIndex] || {};
      const sentLinks = Array.isArray(sentCol.links) ? sentCol.links : [];
      const colLinks = Array.isArray(col.links) ? col.links : sentLinks;

      return {
        ...sentCol,
        ...col,
        title: col?.title ?? sentCol.title ?? "",
        links: colLinks.map((link, linkIndex) => ({
          ...sentLinks[linkIndex],
          ...link,
          label: link?.label ?? sentLinks[linkIndex]?.label ?? "",
          href: link?.href || link?.url || sentLinks[linkIndex]?.href || sentLinks[linkIndex]?.url || "",
          url: link?.url || link?.href || sentLinks[linkIndex]?.url || sentLinks[linkIndex]?.href || "",
        })),
      };
    });

    if (!merged.columns.length) {
      merged.columns = sent.columns;
    }
  }

  return merged;
}

export async function fetchSiteContentPages() {
  const res = await avenueFetch("/api/proxy/admin/site-content/pages");
  return res.data || [];
}

export async function fetchSiteContentPage(id) {
  const res = await avenueFetch(`/api/proxy/admin/site-content/pages/${id}`);
  return res.data;
}

export async function createSiteContentPage(body) {
  const res = await avenueFetch("/api/proxy/admin/site-content/pages", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function updateSiteContentPage(id, body) {
  const res = await avenueFetch(`/api/proxy/admin/site-content/pages/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.data;
}

export async function deleteSiteContentPage(id) {
  await avenueFetch(`/api/proxy/admin/site-content/pages/${id}`, {
    method: "DELETE",
  });
}

export async function fetchSiteContentSocialLinks() {
  const res = await avenueFetch("/api/proxy/admin/site-content/social-links");
  return res.data || [];
}

export async function saveSiteContentSocialLinks(links) {
  const res = await avenueFetch("/api/proxy/admin/site-content/social-links", {
    method: "PUT",
    body: JSON.stringify({ links }),
  });
  return res.data;
}

export async function uploadSiteContentImage(file) {
  const base64 = await fileToBase64(file);
  const res = await avenueFetch("/api/proxy/admin/site-content/upload", {
    method: "POST",
    body: JSON.stringify({
      base64,
      filename: file.name,
      mimeType: file.type || "image/jpeg",
    }),
  });
  return res.data;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || "";
      const base64 = String(result).split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const SITE_CONTENT_LINKS = [
  { href: "/site-content", label: "Overview", icon: "fa-layer-group" },
  { href: "/site-content/home", label: "Homepage", icon: "fa-house" },
  { href: "/site-content/footer", label: "Footer", icon: "fa-shoe-prints" },
  { href: "/site-content/pages", label: "CMS Pages", icon: "fa-file-lines" },
  { href: "/site-content/social", label: "Social Links", icon: "fa-share-nodes" },
];
