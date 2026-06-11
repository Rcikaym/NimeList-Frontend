// ============================================================
// Mock API Interceptor for NimeList Frontend
// Routes all API calls to mock data when NEXT_PUBLIC_USE_MOCK_DATA=true
// ============================================================

import {
  mockAnimeList,
  mockGenres,
  mockReviews,
  mockTopics,
  mockDashboardStats,
  mockIncomeData,
  mockTop10Anime,
  mockAdminAnime,
  mockAdminUsers,
  mockUserDetail,
  mockAdminTopics,
  mockAdminTransactions,
  mockTransactionDetail,
  mockAdminPremium,
  mockPublicPremium,
  mockUserFavorites,
  getMockAnimeDetail,
} from "./mockData";
import { mockLogin, mockRefreshToken } from "./mockAuth";

// ---------- Helpers ----------

/** Check if mock mode is enabled */
export function isMockMode(): boolean {
  return process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
}

/**
 * Resolve image URL — if the path is already an absolute URL (mock mode),
 * return it directly. Otherwise, prepend the API URL.
 */
export function resolveImageUrl(
  apiUrl: string | undefined,
  path: string | null | undefined
): string {
  if (!path) return "https://picsum.photos/seed/placeholder/220/300";
  
  // Replace backslashes with forward slashes (fixes Windows path issues from backend)
  const normalizedPath = path.replace(/\\/g, "/");
  
  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return normalizedPath;
  }
  
  // Ensure we don't end up with double slashes (e.g. http://localhost:4321//images)
  const base = apiUrl ? apiUrl.replace(/\/+$/, "") : "";
  const sub = normalizedPath.replace(/^\/+/, "");
  
  return `${base}/${sub}`;
}

/** Simulate network delay */
function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Extract path from a full URL */
function extractPath(url: string): string {
  try {
    const u = new URL(url);
    return u.pathname + u.search;
  } catch {
    // If it's already a path
    return url;
  }
}

/** Parse query params from a URL string */
function getQueryParams(url: string): URLSearchParams {
  try {
    const u = new URL(url);
    return u.searchParams;
  } catch {
    const qIdx = url.indexOf("?");
    if (qIdx === -1) return new URLSearchParams();
    return new URLSearchParams(url.slice(qIdx + 1));
  }
}

/** Paginate an array */
function paginate<T>(arr: T[], page: number, limit: number): T[] {
  const start = (page - 1) * limit;
  return arr.slice(start, start + limit);
}

// ---------- Route Matcher ----------

/**
 * Given a URL path, return the appropriate mock data.
 * Supports GET, POST, PUT, DELETE methods.
 */
function routeMockRequest(
  url: string,
  method: string = "GET",
  _body?: any
): any {
  const path = extractPath(url);
  const params = getQueryParams(url);
  const m = method.toUpperCase();

  // ---- Anime Endpoints ----
  if (path.includes("/anime/get-newest")) {
    const limit = parseInt(params.get("limit") || "21");
    const data = mockAnimeList.slice(0, limit);
    return { data };
  }

  if (path.includes("/anime/get-most-popular")) {
    const page = parseInt(params.get("_page") || "1");
    const limit = parseInt(params.get("_limit") || "25");
    return {
      data: paginate(mockAnimeList, page, limit),
      total: mockAnimeList.length,
      __headers: { "X-Total-Count": String(mockAnimeList.length) },
    };
  }

  if (path.includes("/anime/recommended")) {
    return mockAnimeList.slice(0, 14);
  }

  if (path.match(/\/anime\/get\/by-genre\//)) {
    const genreName = decodeURIComponent(path.split("/anime/get/by-genre/")[1]?.split("?")[0] || "");
    return mockAnimeList.filter((a) =>
      a.genres.some((g) => g.toLowerCase() === genreName.toLowerCase())
    );
  }

  if (path.match(/\/anime\/get\//)) {
    // Match /anime/get/:slug (but not /anime/get-newest or /anime/get-admin or /anime/get/by-genre)
    const parts = path.split("/anime/get/");
    if (parts[1] && !parts[1].includes("by-genre")) {
      const slug = parts[1].split("?")[0];
      return getMockAnimeDetail(slug);
    }
  }

  if (path.includes("/anime/get-admin")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const search = params.get("search") || "";
    const filtered = search
      ? mockAdminAnime.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      : mockAdminAnime;
    return {
      data: paginate(filtered, page, limit),
      total: filtered.length,
    };
  }

  if (path.match(/\/anime\/delete\//)) {
    return { message: "Anime deleted successfully!" };
  }

  // ---- Genre Endpoints ----
  if (path.includes("/genre/get")) {
    return mockGenres;
  }

  // ---- Review Endpoints ----
  if (path.includes("/review/get/by-anime/")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "5");
    const paginatedReviews = paginate(mockReviews, page, limit);
    return {
      data: paginatedReviews,
      total: mockReviews.length,
    };
  }

  if (path.includes("/review/user-rating")) {
    return 9; // The demo user's rating
  }

  if (path.includes("/review/post")) {
    return { message: "Review submitted successfully!" };
  }

  if (path.match(/\/review\/delete\//)) {
    return { message: "Review deleted successfully!" };
  }

  // ---- Favorite Endpoints ----
  if (path.includes("/favorite-anime/user-favorites")) {
    return mockUserFavorites;
  }

  if (path.includes("/favorite-anime/is-favorite")) {
    const id_anime = params.get("id_anime") || "";
    return mockUserFavorites.includes(id_anime);
  }

  if (path.includes("/favorite-anime/post")) {
    return { message: "Added to favorites!" };
  }

  if (path.includes("/favorite-anime/delete")) {
    return { message: "Removed from favorites!" };
  }

  // ---- Auth Endpoints ----
  if (path.includes("/auth/login")) {
    return mockLogin();
  }

  if (path.includes("/auth/refresh-token")) {
    return mockRefreshToken();
  }

  // ---- User Endpoints ----
  if (path.includes("/photo-profile/get")) {
    return "https://i.pravatar.cc/150?img=33";
  }

  if (path.includes("/user/check-premium")) {
    return true;
  }

  if (path.includes("/user/get-admin")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const search = params.get("search") || "";
    const status = params.get("status") || "all";
    let filtered = mockAdminUsers;
    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.username.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status !== "all" && status) {
      filtered = filtered.filter((u) => u.status_premium === status);
    }
    return {
      data: paginate(filtered, page, limit),
      total: filtered.length,
    };
  }

  if (path.includes("/user/detail/")) {
    return mockUserDetail;
  }

  if (path.includes("/user/refresh-users")) {
    return { message: "Users refreshed successfully!" };
  }

  // ---- Topic Endpoints ----
  if (path.includes("/topic/get-all")) {
    return mockTopics;
  }

  if (path.includes("/topic/get-admin")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const search = params.get("search") || "";
    const filtered = search
      ? mockAdminTopics.filter(
          (t) =>
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.user.toLowerCase().includes(search.toLowerCase())
        )
      : mockAdminTopics;
    return {
      data: paginate(filtered, page, limit),
      total: filtered.length,
    };
  }

  if (path.match(/\/topic\/delete\//)) {
    return { message: "Topic deleted successfully!" };
  }

  if (path.match(/\/topic\/get\//)) {
    const parts = path.split("/topic/get/");
    const slug = parts[1]?.split("?")[0];
    const found = mockTopics.find((t: any) => t.slug === slug) || mockTopics[0];
    return found;
  }

  // ---- Comment Endpoints ----
  if (path.match(/\/comment\/get\/by-topic\//)) {
    const commentsList = [
      {
        id: "c1",
        username: "otaku_king",
        name: "Luffy Fan",
        comment: "This is an amazing topic! I totally agree with the points.",
        created_at: "2024-06-11T12:00:00Z",
        updated_at: "2024-06-11T12:00:00Z",
        total_likes: 12,
        user_photo: "images/boy.png",
      },
      {
        id: "c2",
        username: "admin",
        name: "Admin User",
        comment: "Thanks for starting this discussion. Let's keep it friendly!",
        created_at: "2024-06-11T12:05:00Z",
        updated_at: "2024-06-11T12:05:00Z",
        total_likes: 3,
        user_photo: "images/boy.png",
      },
    ];
    return {
      data: commentsList,
      total: commentsList.length,
    };
  }

  if (path.includes("/comment/post")) {
    return { message: "Comment added successfully!" };
  }

  if (path.match(/\/comment\/delete\//)) {
    return { message: "Comment deleted successfully!" };
  }

  // ---- Like/Dislike Endpoints ----
  if (path.includes("/like-topic/")) {
    return {};
  }

  if (path.includes("/dislike-topic/")) {
    return {};
  }

  if (path.includes("/like-comment/")) {
    return {};
  }

  // ---- Dashboard Endpoints ----
  if (path.includes("/dashboard/total-topic")) {
    return mockDashboardStats.totalTopic;
  }

  if (path.includes("/dashboard/total-premium")) {
    return mockDashboardStats.totalPremium;
  }

  if (path.includes("/dashboard/total-transaction")) {
    return mockDashboardStats.totalTransaction;
  }

  if (path.includes("/dashboard/total-income")) {
    return mockDashboardStats.totalIncome;
  }

  if (path.includes("/dashboard/income-data")) {
    return mockIncomeData;
  }

  if (path.includes("/dashboard/top-10-anime")) {
    return mockTop10Anime;
  }

  // ---- Transaction Endpoints ----
  if (path.includes("/transactions/get-admin")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const search = params.get("search") || "";
    const filtered = search
      ? mockAdminTransactions.filter(
          (t) =>
            t.username.toLowerCase().includes(search.toLowerCase()) ||
            t.order_id.toLowerCase().includes(search.toLowerCase())
        )
      : mockAdminTransactions;
    return {
      data: paginate(filtered, page, limit),
      total: filtered.length,
    };
  }

  if (path.match(/\/transactions\/get\//)) {
    return mockTransactionDetail;
  }

  if (path.includes("/transactions/post")) {
    return { token: "mock-midtrans-token" };
  }

  // ---- Premium Endpoints ----
  if (path.includes("/premium/get-all")) {
    return mockPublicPremium;
  }

  if (path.includes("/premium/get-admin")) {
    const page = parseInt(params.get("page") || "1");
    const limit = parseInt(params.get("limit") || "10");
    const search = params.get("search") || "";
    const filtered = search
      ? mockAdminPremium.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      : mockAdminPremium;
    return {
      data: paginate(filtered, page, limit),
      total: filtered.length,
    };
  }

  if (path.includes("/premium/post")) {
    return { message: "Premium plan created successfully!" };
  }

  if (path.match(/\/premium\/update\//)) {
    return { message: "Premium plan updated successfully!" };
  }

  if (path.match(/\/premium\/delete\//)) {
    return { message: "Premium plan deleted successfully!" };
  }

  // ---- Fallback ----
  console.warn(`[MockAPI] No mock handler for: ${m} ${path}`);
  return { message: "Mock endpoint not found" };
}

// ---------- Public API ----------

/**
 * Mock replacement for window.fetch — returns a Response-like object.
 * Drop-in replacement: `const response = await mockFetch(url, options);`
 */
export async function mockFetch(
  url: string | URL | Request,
  options?: RequestInit
): Promise<Response> {
  await delay();

  const urlStr = typeof url === "string" ? url : url instanceof URL ? url.toString() : url.url;
  const method = options?.method || "GET";
  let body: any;
  try {
    body = options?.body ? JSON.parse(options.body as string) : undefined;
  } catch {
    body = undefined;
  }

  const result = routeMockRequest(urlStr, method, body);

  // Handle the special case where routeMockRequest returns { data, __headers }
  const headers: Record<string, string> = {};
  if (result?.__headers) {
    Object.assign(headers, result.__headers);
    delete result.__headers;
  }

  // For /anime/get-most-popular without pagination, return the data array directly
  // (MostPopularComponents expects an array, not { data, total })
  const path = extractPath(urlStr);
  let responseBody = result;
  if (
    path.includes("/anime/get-most-popular") &&
    !path.includes("_page")
  ) {
    responseBody = result.data || result;
    headers["X-Total-Count"] = String(mockAnimeList.length);
  }

  return new Response(JSON.stringify(responseBody), {
    status: 200,
    statusText: "OK",
    headers: new Headers(headers),
  });
}

/**
 * Handle a mock axios request. Returns a resolved axios-like response.
 * Used by the axios interceptor in api.ts.
 */
export async function handleMockAxiosRequest(config: any): Promise<any> {
  await delay();

  const baseURL = config.baseURL || "";
  const url = config.url?.startsWith("http")
    ? config.url
    : `${baseURL}${config.url}`;

  // Append query params from config.params
  let fullUrl = url;
  if (config.params) {
    const searchParams = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const paramStr = searchParams.toString();
    if (paramStr) {
      fullUrl += (fullUrl.includes("?") ? "&" : "?") + paramStr;
    }
  }

  const method = config.method || "GET";
  const body = config.data;
  const result = routeMockRequest(fullUrl, method, body);

  return {
    data: result,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
}

/**
 * Override the global window.fetch to intercept API calls in mock mode.
 * Call this once in your app's client-side entry point.
 */
export function installMockFetchOverride(): void {
  if (typeof window === "undefined") return;
  if (!isMockMode()) return;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4321";
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
        ? input.toString()
        : input.url;

    // Only intercept calls to our API
    if (url.includes(apiUrl) || url.includes("localhost:4321")) {
      return mockFetch(url, init);
    }

    // Pass through everything else (CDNs, images, etc.)
    return originalFetch(input, init);
  };

  console.log(
    "%c[NimeList] 🎭 Mock mode enabled — using static data",
    "color: #05E1C6; font-weight: bold; font-size: 14px;"
  );
}
