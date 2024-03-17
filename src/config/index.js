// 基础接口
export const baseUrl =
  process.env.NODE_ENV === "production" ? window.SERVER_IP : "/api";
