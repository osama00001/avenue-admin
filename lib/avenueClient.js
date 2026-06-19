/**
 * Client-side API helper — calls avenue-admin BFF proxy (same origin).
 */
export async function avenueFetch(path, options = {}) {
  const url = path.startsWith("/") ? path : `/${path}`;
  const proxyUrl = url.startsWith("/api/proxy/")
    ? url
    : `/api/proxy${url.replace(/^\/api/, "")}`;

  const res = await fetch(proxyUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.message || data.error || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export async function fetchAdminUsers({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return avenueFetch(`/api/proxy/admin/users?${params}`);
}

export async function fetchAdminProducts({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return avenueFetch(`/api/proxy/admin/products?${params}`);
}

export async function fetchAdminOrders({ page = 1, limit = 10, search = "" } = {}) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search) params.set("search", search);
  return avenueFetch(`/api/proxy/admin/orders?${params}`);
}

export async function fetchAdminDashboard({ days = 7 } = {}) {
  const params = new URLSearchParams({ days: String(days) });
  return avenueFetch(`/api/proxy/admin/dashboard?${params}`);
}

export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB");
}

export function formatMoney(amount, currency = "GBP") {
  if (amount == null || Number.isNaN(Number(amount))) return "—";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "GBP",
    }).format(Number(amount));
  } catch {
    return `£${Number(amount).toFixed(2)}`;
  }
}

export function getBookTitle(book) {
  const titles = book?.descriptiveDetail?.titles;
  if (Array.isArray(titles) && titles.length > 0) {
    return titles[0]?.text || "Untitled";
  }
  return "Untitled";
}

export function getBookSku(book) {
  if (book?.recordReference) return book.recordReference;
  const ids = book?.productIdentifiers;
  if (Array.isArray(ids) && ids.length > 0) {
    return ids[0]?.value || "—";
  }
  return "—";
}

export function getBookPrice(book) {
  const prices = book?.productSupply?.prices;
  if (!Array.isArray(prices) || prices.length === 0) return "—";
  const p = prices[0];
  return formatMoney(p.amount, p.currency || "GBP");
}

export function getCustomerName(user) {
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  return name || user?.email || "—";
}

export function getOrderCustomerName(order) {
  const user = order?.user;
  if (!user) return "—";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return name || user.email || "—";
}

export function getOrderProductsSummary(order) {
  const items = order?.items;
  if (!Array.isArray(items) || items.length === 0) return "—";
  if (items.length === 1) return items[0]?.title || "1 item";
  return `${items.length} items`;
}

export function getOrderStatusBadge(status) {
  const map = {
    placed: "bg-warning",
    processing: "bg-info",
    shipped: "bg-primary",
    delivered: "bg-success",
    cancelled: "bg-danger",
  };
  return map[status] || "bg-secondary";
}

export function getPaymentStatusBadge(status) {
  const map = {
    paid: "bg-success",
    pending: "bg-warning",
    failed: "bg-danger",
    refunded: "bg-secondary",
  };
  return map[status] || "bg-secondary";
}

export function getPaymentMethodLabel(method) {
  if (!method) return "—";
  const labels = {
    COD: "Cash",
    ONLINE: "Online",
    PAYPAL: "PayPal",
    STRIPE: "Card",
  };
  return labels[method] || method;
}
