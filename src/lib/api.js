import { toast } from "sonner";
import { clearJwtCookie, resetStoredAuth } from "@/lib/auth-session";

const API_BASE = "/api/backend";

export class ApiError extends Error {
  constructor(message, response) {
    super(message);
    this.name = "ApiError";
    this.response = response;
  }
}

function appendParams(path, params) {
  if (!params) return path;

  const [pathname, existingSearch = ""] = path.split("?", 2);
  const search = new URLSearchParams(existingSearch);
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) value.forEach((item) => search.append(key, String(item)));
    else search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${pathname}?${query}` : pathname;
}

async function request(method, path, data, config = {}) {
  const url = appendParams(`${API_BASE}${path.startsWith("/") ? path : `/${path}`}`, config.params);
  const headers = new Headers(config.headers);
  headers.set("Accept", "application/json");

  let body;
  if (data !== undefined && data !== null) {
    if (typeof FormData !== "undefined" && data instanceof FormData) {
      body = data;
    } else {
      headers.set("Content-Type", "application/json");
      body = JSON.stringify(data);
    }
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body,
      credentials: "same-origin",
      cache: "no-store",
      signal: config.signal,
    });
  } catch (error) {
    throw new ApiError(error?.message || "Network request failed.", {
      status: 0,
      data: null,
      headers: null,
    });
  }

  const text = await response.text();
  let responseData = null;
  if (text) {
    try {
      responseData = JSON.parse(text);
    } catch {
      responseData = text;
    }
  }

  const result = {
    data: responseData,
    status: response.status,
    headers: response.headers,
  };

  if (!response.ok) {
    if (response.status === 401) handleUnauthorized();
    const message = responseData?.message || responseData?.error || response.statusText;
    throw new ApiError(message || "Request failed.", result);
  }

  return result;
}

function handleUnauthorized() {
  if (typeof window === "undefined") return;
  resetStoredAuth();
  void clearJwtCookie();
  window.dispatchEvent(new Event("sebak:auth-expired"));
  if (!window.location.pathname.startsWith("/login")) {
    toast.error("Your session has expired. Please log in again.");
  }
}

export const api = {
  get(path, config) {
    return request("GET", path, undefined, config);
  },
  post(path, data, config) {
    return request("POST", path, data, config);
  },
  patch(path, data, config) {
    return request("PATCH", path, data, config);
  },
  put(path, data, config) {
    return request("PUT", path, data, config);
  },
  delete(path, config) {
    return request("DELETE", path, undefined, config);
  },
};
