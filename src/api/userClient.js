import axios from "axios";
import { getAccessToken, getRefreshToken, setAccessToken } from "./auth";

// 创建一个Axios实例
const userClient = axios.create({
  // baseURL: "http://127.0.0.1:4523/m1/3020684-0-default",
  baseURL: "http://192.168.83.3:8082",
  // baseURL: "http://192.168.39.54:8080",


});

const postUsersAccessToken = () => {
  return myPost(
    "/users/access_token",
    { refresh_token: getRefreshToken() },
    false
  );
};

userClient.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      //刷新访问令牌后重试一次
      return handleTokenRefresh(response.config);
    }
    return response;
  }
);

// 处理Token刷新逻辑
async function handleTokenRefresh(config) {
  // console.log("here12312",getRefreshToken());
  if (getRefreshToken() == undefined) {
    throw new Error("AUTHENTICATION_FAILED");
  } else {
    const response = await postUsersAccessToken();
    if (response != null && response.data.code === 200) {
      const access_token = response.data.data.access_token;
      setAccessToken(access_token);
      config.headers.Authorization = `${access_token}`;
      return userClient(config);
    } else {
      //这里刷新令牌的API对应的code为400/其他,说明刷新令牌也失效了，跳出循环了，不会一直循环重试，这个错误需要在vue组件调用api时捕获
      throw new Error("AUTHENTICATION_FAILED");
    }
  }

}

// 给请求头添加 access_token
const setHeaderToken = (isNeedToken) => {
  const accessToken = isNeedToken ? getAccessToken() : null;
  if (isNeedToken) {
    userClient.defaults.headers.common.Authorization = `${accessToken}`;
  }
};

export const myGet = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken);
  return userClient({
    method: "get",
    url,
    params,
  });
};

export const myPost = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken);
  return userClient({
    method: "post",
    url,
    data: params,
  });
};

// 封装delete请求
export const myDelete = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken);
  return userClient({
    method: "delete",
    url,
    params,
  });
};

// 封装put请求
export const myPut = (url, params = {}, isNeedToken = false) => {
  setHeaderToken(isNeedToken);
  return userClient({
    method: "put",
    url,
    data: params,
  });
};
