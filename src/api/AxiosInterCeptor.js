import axios from "axios";
import cookies from "js-cookie";

const API_URL = window.ENV?.API_URL;
axios.defaults.baseURL = API_URL;

axios.interceptors.request.use(config => {
  if (config.url?.includes("/api/auth/refresh")){
    console.log("ASDFASDFASDFASF");
    return config;
  }
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  console.log(accessToken);
  return config;
});

axios.interceptors.response.use(
  
  response => response,
  async error => {
    const originalReq = error.config;
    let refreshToken = null;
    if (
      error.response?.status === 401 &&
      !originalReq._retry &&
      !originalReq.url.includes("/api/auth/refresh")
    ) {
      originalReq._retry = true;
      try {
        if (cookies.get("Refresh-Token")){
          refreshToken = cookies.get("Refresh-Token");
        } else {
          refreshToken = sessionStorage.getItem("refreshToken");
        }
        const wrap = await axios.post(
          "/api/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );
        if (wrap.data.header.code[0] !== 'S' ){
          const msg = header.message || "토큰 갱신 실패";
          return Promise.reject(new Error(msg));
        }
        const newTokens = wrap.data.body.items.tokens;
        sessionStorage.setItem("refreshToken", newTokens.refreshToken);
        sessionStorage.setItem("accessToken", newTokens.accessToken);
        originalReq.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        return axios(originalReq);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } 
    return Promise.reject(error);
  }
)

export default axios;