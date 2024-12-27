import Cookies from 'js-cookie'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
export const getAccessToken = () => Cookies.get(ACCESS_TOKEN_KEY);
// export const getAccessToken = () => 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJQYXlsb2FkIjp7ImlkIjozLCJyb2xlIjowfSwiaWF0IjoxNzM0NDM2OTIzMDEzLCJleHAiOjE3MzQ0NDA1MjMwMTN9.Q8oUPuOucquNT0wpeF8riVsK-aP5tFG3JhzqHJxjMRw';

export const setAccessToken = (token) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    sameSite: 'Lax', // 设置SameSite属性为Lax，允许在相同站点的请求中发送cookie
  });
};

export const getRefreshToken = () => Cookies.get(REFRESH_TOKEN_KEY);

export const setRefreshToken = (token) => {
  Cookies.set(REFRESH_TOKEN_KEY, token, {
    sameSite: 'Lax', // 设置SameSite属性为Lax
  });
};
