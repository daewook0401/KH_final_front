import { useState, useEffect, createContext, Children } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import TokenRefresher from "./TokenRefresher";
import axios from "../api/AxiosInterCeptor"
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(true);
  const [auth, setAuth] = useState({
    loginInfo: null,
    tokens: null,
    isAuthenticated: false,
    socialLoginState: false,
    longTimeAuth: false,
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
      axios.post("/api/auth/refresh", {}, { headers: { Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}` },
            withCredentials: true })
        .then(res => {
          if (res.data.header.code[0] === 'S'){
            login(res.data.body.items.loginInfo, res.data.body.items.tokens, false, true);
          }})
        .catch(err => {
          if (err.response?.status === 401) {
            setAuth();
          }
        }).finally(()=>{
          setReady(true);
        })
      }, []);


  const login = (loginInfo, tokens, socialLogin = false, longTimeAuth = false) => {
    console.log("login");
    setLoggingOut(false);
    setAuth({
      loginInfo: loginInfo,
      tokens: tokens,
      isAuthenticated: true,
      socialLoginState: socialLogin, 
      longTimeAuth: longTimeAuth
    });
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    sessionStorage.setItem("refreshToken", tokens.refreshToken);
    sessionStorage.setItem("accessToken", tokens.accessToken);
    sessionStorage.setItem("socialLoginState", JSON.stringify(socialLogin));
  };

  const logout = () => {
    setLoggingOut(true);
    axios.delete("/api/auth/logout", { headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`}, withCredentials: true
    }).then(( wrap ) => {
      const header = wrap.data.header;
      if (header.code[0] === 'S'){
        alert("로그아웃에 되었습니다.")
      } else {
        alert("로그아웃 실패")
      }
    }).catch(err =>{
      alert(err);
    }).finally(() =>{
      sessionStorage.clear();
      setAuth({
        loginInfo: null,
        tokens: null,
        isAuthenticated: false,
        socialLoginState: false,
        longTimeAuth: false,
      });
      sessionStorage.removeItem("loginInfo");
      sessionStorage.removeItem("refreshToken");
      sessionStorage.removeItem("accessToken");
      sessionStorage.removeItem("socialLoginState");
      setLoggingOut(false);
    })
  };
  if (!ready){
    return <div>로딩 중</div>
  }
  return (
    <AuthContext.Provider value={{loggingOut, auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
