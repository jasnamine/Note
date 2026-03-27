import axios from "axios";
import { jwtDecode } from "jwt-decode";

const axiosWrapper = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8888",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

let onTokenRefreshed = null;

export const setOnTokenRefreshed = (callback) => {
  onTokenRefreshed = callback;
};

const refreshAccessToken = async () => {
  try {
    const res = await axios.post(
      `${
        import.meta.env.VITE_API_URL || "http://localhost:8888"
      }/api/v1/auth/refresh-token`,
      {},
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    const newToken = res.data.DT.accessToken;
    setAccessToken(newToken);
    if (onTokenRefreshed) {
      onTokenRefreshed(newToken);
    }
    return newToken;
  } catch (err) {
    localStorage.clear();
    window.location.href = "/login";
    console.error("refresh token failed:", err);
  }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};
// Request Interceptor
axiosWrapper.interceptors.request.use(
  async (config) => {
    const skipAuthRoutes = [
      "/auth/login",
      "/auth/register",
      "/auth/refresh-token",
      "/auth/forgot-password",
      "/auth/reset-password",
    ];

    const isPublic = skipAuthRoutes.some((route) => config.url.includes(route));
    if (isPublic) return config;

    if (!accessToken) return config;

    const decodedToken = jwtDecode(accessToken);

    if (decodedToken.exp * 1000 < Date.now()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshAccessToken();
          setAccessToken(newToken);
          processQueue(null, newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (err) {
          processQueue(err, null);
          throw err;
        } finally {
          isRefreshing = false;
        }
      } else {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { axiosWrapper };
