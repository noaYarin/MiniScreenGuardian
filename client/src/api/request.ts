import { API_BASE_URL } from "../config/env";
import {
  getParentToken,
  getChildToken,
  removeParentToken,
  removeChildToken,
} from "../services/authStorage";

type RequestOptions = {
  requireAuth?: boolean;
  role?: "PARENT" | "CHILD";
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.requireAuth) {
    const parentData = await getParentToken();
    const childData = await getChildToken();

    const token =
      options.role === "CHILD" ? childData?.childToken : parentData?.token;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  if (response.status === 401) {
    if (options.requireAuth) {
      await removeParentToken();
      await removeChildToken();
      throw new Error("Session expired. Please log in again.");
    }

    const errorMessage =
      result?.error?.message ||
      result?.message ||
      "Unauthorized request.";

    throw new Error(errorMessage);
  }

  if (!response.ok) {
    const errorMessage =
      result?.error?.message ||
      result?.message ||
      "Something went wrong. Please try again.";

    throw new Error(errorMessage);
  }

  return result?.data as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("POST", path, body, options),

  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PUT", path, body, options),

  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>("PATCH", path, body, options),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>("DELETE", path, undefined, options),
};