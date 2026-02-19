import { getClientUserId } from "../utils/clientIdentity";

const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:1330";
const baseUrl = rawBaseUrl.replace(/\/$/, "");
const apiRoot = `${baseUrl}/api`;

let requestHandlers = {
  onUnauthorized: null,
  onForbidden: null,
};

const setRequestHandlers = (handlers = {}) => {
  requestHandlers = {
    ...requestHandlers,
    ...handlers,
  };
};

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, options = {}) {
  const clientUserId = getClientUserId();
  const headers = {
    "Content-Type": "application/json",
    ...(clientUserId ? { "X-User-Id": clientUserId } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${apiRoot}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorBody = null;
    let errorMessage = `Request failed (${response.status})`;

    try {
      errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
    } catch {
      // Response body is not JSON.
    }

    const error = new ApiError(errorMessage, response.status, errorBody);

    if (response.status === 401 && typeof requestHandlers.onUnauthorized === "function") {
      requestHandlers.onUnauthorized(error);
    }

    if (response.status === 403 && typeof requestHandlers.onForbidden === "function") {
      requestHandlers.onForbidden(error);
    }

    throw error;
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export { apiRoot, ApiError, request, setRequestHandlers };
