const rawBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:1330";
const baseUrl = rawBaseUrl.replace(/\/$/, "");
const apiRoot = `${baseUrl}/api`;

async function request(path, options = {}) {
  const response = await fetch(`${apiRoot}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.message || errorMessage;
      const error = new Error(errorMessage);
      error.details = errorBody;
      throw error;
    } catch (parseError) {
      if (parseError instanceof Error) {
        throw parseError;
      }
      throw new Error(errorMessage);
    }
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export { apiRoot, request };
