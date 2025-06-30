import { useState, useEffect, createContext, Children } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import TokenRefresher from "./TokenRefresher";
import axios from "../api/AxiosInterCeptor"
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: null,
    tokens: null,
    isAuthenticated: false,
    socialLoginState: false,
    longTimeAuth: false,
  });
  useEffect(() => {
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"));
    const tokens = sessionStorage.getItem("refreshToken");
    const hasCookie = !!cookies.get("Refresh-Token");
    if (hasCookie && !sessionStorage.getItem("refreshToken")){
      return;
    } else if (loginInfo && tokens && auth.longTimeAuth){
      setAuth({
        loginInfo,
        tokens,
        isAuthenticated: true,
        socialLoginState: false,
        longTimeAuth: true,
      });
    } else if (loginInfo && tokens && auth.socialLoginState) {
      setAuth({
        loginInfo,
        tokens,
        isAuthenticated: true,
        socialLoginState: true,
        longTimeAuth: true,
      });
    } else if (loginInfo && tokens) {
      setAuth({
        loginInfo,
        tokens,
        isAuthenticated: true,
        socialLoginState: false,
        longTimeAuth: false,
      });
    }
  }, []);

  const login = (loginInfo, tokens, socialLogin = false, longTimeAuth = false) => {
    setAuth({
      loginInfo,
      tokens,
      isAuthenticated: true,
      socialLoginState: socialLogin, 
      longTimeAuth: longTimeAuth
    });
    sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    sessionStorage.setItem("refreshToken", tokens.refreshToken);
    sessionStorage.setItem("accessToken", tokens.accessToken);
    sessionStorage.setItem("socialLoginState", JSON.stringify(socialLogin));
    if (longTimeAuth){
      cookies.set("Refresh-Token", tokens.refreshToken, {expires:30})
    }
  };

  const logout = () => {
    axios.delete("/api/auth/logout", { headers: { Authorization: `Bearer ${sessionStorage.getItem("accessToken")}` }
    }).then(( wrap ) => {
      console.log(wrap);
      const header = wrap.data.header;
      if (header.code[0] === 'S'){
        alert("로그아웃에 되었습니다.")
      } else {
        alert("로그아웃 실패")
      }
    }).catch(err =>{
      alert(err);
    })
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
    cookies.remove('Refresh-Token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!!cookies.get("Refresh-Token") && !sessionStorage.getItem("refreshToken") && <TokenRefresher />}
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
