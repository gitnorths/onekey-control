import axios from "./axios";

export const mokeGet = (url, data) => {
  return axios({
    url: `/${url}`,
    method: "get",
    params: data,
  });
};

export const mokePost = (url, data) => {
  return axios({
    url: `/${url}`,
    method: "post",
    data,
  });
};
