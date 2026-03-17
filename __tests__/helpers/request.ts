import { NextRequest } from "next/server";

/**
 * Helper to create NextRequest objects for testing API route handlers.
 */
export function createTestRequest(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    searchParams?: Record<string, string>;
  },
): NextRequest {
  const url = new URL(path, "http://localhost:3002");

  if (options?.searchParams) {
    Object.entries(options.searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const init: {
    method: string;
    body?: string;
    headers?: Record<string, string>;
  } = {
    method: options?.method || "GET",
  };

  if (options?.body) {
    init.body = JSON.stringify(options.body);
    init.headers = { "Content-Type": "application/json" };
  }

  return new NextRequest(url, init);
}

/**
 * Helper to parse JSON response from NextResponse.
 */
export async function parseResponse<T = unknown>(
  response: Response,
): Promise<{ status: number; data: T }> {
  const data = (await response.json()) as T;
  return { status: response.status, data };
}
