// lib/api/base.ts
export const apiBase =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

export async function handle(res: Response) {
  if (!res.ok) {
    // Provide more detailed error information
    const errorMessage = `API error ${res.status}: ${res.statusText}`;
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<any> {
  const defaultOptions: RequestInit = {
    cache: "no-store",
    credentials: "omit", // Changed from "include" to "omit" for mock server
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const response = await fetch(url, mergedOptions);
    return handle(response);
  } catch (error) {
    // Provide more context about network errors
    if (error instanceof TypeError && error.message === 'fetch failed') {
      throw new Error(`Network error: Unable to connect to ${url}`);
    }
    throw error;
  }
}