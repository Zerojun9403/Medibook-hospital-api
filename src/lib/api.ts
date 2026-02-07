const API_BASE = "http://localhost:8080/api";

export const tokenManager = {
  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("accessToken");
  },
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refreshToken");
  },
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  },
  clear: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },
  getUser: () => {
    if (typeof window === "undefined") return null;
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },
  setUser: (user: { name: string; role: string; email?: string }) => {
    localStorage.setItem("user", JSON.stringify(user));
  },
};

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = tokenManager.getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "서버 오류가 발생했습니다");
  return data;
}

// ===== Auth API =====
export const authAPI = {
  login: async (email: string, password: string) => {
    const res = await fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res.success && res.data) {
      tokenManager.setTokens(res.data.accessToken, res.data.refreshToken);
      tokenManager.setUser({ name: res.data.name, role: res.data.role, email });
    }
    return res;
  },
  register: async (data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    birthdate?: string;
    userType: string;
  }) => {
    return fetchAPI("/auth/register", { method: "POST", body: JSON.stringify(data) });
  },
  logout: () => {
    tokenManager.clear();
    window.location.href = "/login";
  },
};

// ===== Other APIs (for future use) =====
export const departmentAPI = { getAll: () => fetchAPI("/departments") };
export const doctorAPI = {
  getAll: () => fetchAPI("/doctors"),
  getById: (id: number) => fetchAPI(`/doctors/${id}`),
  getByDepartment: (departmentId: number) => fetchAPI(`/doctors?departmentId=${departmentId}`),
};
export const reservationAPI = {
  create: (data: { doctorId: number; reservationDate: string; reservationTime: string; symptom?: string }) =>
    fetchAPI("/reservations", { method: "POST", body: JSON.stringify(data) }),
  getMyReservations: () => fetchAPI("/reservations/my"),
  cancel: (id: number) => fetchAPI(`/reservations/${id}/cancel`, { method: "PATCH" }),
  getAvailableSlots: (doctorId: number, date: string) =>
    fetchAPI(`/reservations/available-slots?doctorId=${doctorId}&date=${date}`),
};
export const notificationAPI = {
  getAll: () => fetchAPI("/notifications"),
  markAsRead: (id: number) => fetchAPI(`/notifications/${id}/read`, { method: "PATCH" }),
};
// ===== User API =====
export const userAPI = {
  getProfile: () => fetchAPI("/users/me"),
  getStats: () => fetchAPI("/users/me/stats"),
};