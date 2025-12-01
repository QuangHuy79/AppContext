// src/services/apiService.js

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.example.com";

async function request(endpoint, options = {}) {
  const { method = "GET", headers = {}, body } = options;

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error("[apiService] Error:", error);
    throw error;
  }
}

export const apiService = {
  get: (endpoint, headers) => request(endpoint, { method: "GET", headers }),
  post: (endpoint, body, headers) =>
    request(endpoint, { method: "POST", body, headers }),
  put: (endpoint, body, headers) =>
    request(endpoint, { method: "PUT", body, headers }),
  delete: (endpoint, headers) =>
    request(endpoint, { method: "DELETE", headers }),
};
