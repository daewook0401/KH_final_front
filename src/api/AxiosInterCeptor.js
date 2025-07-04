import axios from "axios";

const API_URL = window.ENV?.API_URL;
axios.defaults.baseURL = API_URL;
axios.defaults.withCredentials = true;
axios.interceptors.request.use(config => {
  if (config.url?.includes("/api/auth/refresh")){
    return config;
  }
  const accessToken = sessionStorage.getItem('accessToken');
  if (accessToken){
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

axios.interceptors.response.use(
  
  response => response,
  async error => {
    console.log(error.response);
    const originalReq = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalReq._retry && !originalReq.url?.includes("/api/auth/refresh")
    ) {
      originalReq._retry = true;
      try {
        const wrap = await axios.post(
          "/api/auth/refresh",
          {},
          {
            headers: { Authorization: `Bearer ${sessionStorage.getItem('refreshToken')}` },
            withCredentials: true
          }
        );
        if (wrap.data.header.code[0] !== 'S' ){
          const msg = wrap.data.header.message || "토큰 갱신 실패";
          return Promise.reject(new Error(msg));
        }
        const newTokens = wrap.data.body.items.tokens;
        sessionStorage.setItem("refreshToken", newTokens.refreshToken);
        sessionStorage.setItem("accessToken", newTokens.accessToken);
        sessionStorage.setItem("loginInfo", JSON.stringify(wrap.data.body.items.loginInfo));
        originalReq.headers.Authorization = `Bearer ${newTokens.accessToken}`;
        console.log(wrap);
        return axios(originalReq);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    } 
    return Promise.reject(error);
  }
)

export default axios;