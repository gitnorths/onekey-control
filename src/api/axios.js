import axios from "axios";
import { baseUrl } from "@/config/";
import { ElLoading, ElMessage } from "element-plus";

const instance = axios.create({
  baseURL: baseUrl, // 接口统一域名
  timeout: 6000, // 设置超时
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    // "Access-Control-Allow-Origin": "*",
  },
});

let loading;
let requestCount = 0;

const showLoading = () => {
  if (requestCount === 0 && !loading) {
    loading = ElLoading.service({
      text: "Loading ",
      background: "rgba(0,0,0,0.7)",
      spinner: "el-icon-loading",
    });
  }
  requestCount++;
};

const hideLoading = () => {
  requestCount--;
  if (requestCount == 0) {
    loading.close();
  }
};

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    hideLoading();
    return response.data;
  },
  (error) => {
    // 响应报错
    if (error.response && error.response.status) {
      const status = error.response.status;
      let message = "";
      switch (status) {
        case 400:
          message = "请求报错";
          break;
        case 401:
          message = "请求报错";
          break;
        case 404:
          message = "请求地址出错";
          break;
        case 408:
          message = "请求超时";
          break;
        case 500:
          message = "服务器内部错误!";
          break;
        case 501:
          message = "服务未实现!";
          break;
        case 502:
          message = "网关错误!";
          break;
        case 503:
          message = "服务不可用!";
          break;
        case 504:
          message = "网关超时!";
          break;
        case 505:
          message = "HTTP版本不受支持";
          break;

        default:
          message = "请求失败";
          break;
      }

      ElMessage.error(message);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default instance;
