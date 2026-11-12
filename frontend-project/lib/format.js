// The backend stores UTC timestamps without a timezone suffix.
export const parseUtc = (iso) =>
  iso ? new Date(/Z$|[+-]\d\d:\d\d$/.test(iso) ? iso : `${iso}Z`) : null;

export const formatDate = (date) =>
  date?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) ?? "";

export const formatClock = (date) =>
  date?.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) ?? "";

export const timeAgo = (date) => {
  if (!date) return "";
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 7 * 86400) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(date);
};

// Uploaded images are served by the backend at /uploads/...
export const backendAsset = (path) =>
  path ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${path}` : null;

export const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("") || "?";

export async function fetchJson(path, options) {
  const response = await fetch(`${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || data?.message || "Request failed");
  }

  return data;
}
