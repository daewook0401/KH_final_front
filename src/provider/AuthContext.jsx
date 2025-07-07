import { useState, useEffect, createContext, Children } from "react";
import { useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import axios from "../api/AxiosInterCeptor";
import { GoogleOAuthProvider } from "@react-oauth/google";

export const AuthContext = createContext();
const GOOGLE_CLIENT = window.ENV?.GOOGLE_CLIENT;
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({
    loginInfo: null,
    tokens: null,
    isAuthenticated: false,
    socialLoginState: false,
    longTimeAuth: false,
  });
  const [ready, setReady] = useState(false);
  useEffect(
    () => {
      axios
        .post(
          "/api/auth/refresh",
          {},
          {
            headers: {
              Authorization: `Bearer ${sessionStorage.getItem("refreshToken")}`,
            },
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.header.code[0] === "S") {
            login(
              res.data.body.items.loginInfo,
              res.data.body.items.tokens,
              sessionStorage.getItem("socialLoginState"),
              sessionStorage.getItem("longTimeAuth")
            );
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          setReady(true);
        });
    },
    [],
    [auth]
  );
  useEffect(() => {
    const loginInfo = JSON.parse(sessionStorage.getItem("loginInfo"))
    if (loginInfo !== null && loginInfo.isActive === "N"){
      alert("비활성 사용자입니다. 로그아웃 됩니다.");
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
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("socialLoginState");
      sessionStorage.removeItem("longTimeAuth");
      navigate("/");
    }
    if (sessionStorage.getItem("socialLoginState") ==="true" && auth.loginInfo?.isModify === "N") {
      navigate("/social-info", { replace: true });
    }
  }, [auth, ready, navigate]);

  const login = (
    loginInfo,
    tokens,
    socialLogin = false,
    longTimeAuth = false
  ) => {
    setAuth({
      loginInfo: loginInfo,
      tokens: tokens,
      isAuthenticated: true,
      socialLoginState: socialLogin,
      longTimeAuth: longTimeAuth,
    });
    if (loginInfo !== null) {
      sessionStorage.setItem("loginInfo", JSON.stringify(loginInfo));
    }
    if (tokens !== null) {
      sessionStorage.setItem("refreshToken", tokens.refreshToken);
      sessionStorage.setItem("accessToken", tokens.accessToken);
    }
    sessionStorage.setItem("isAuthenticated", true);
    sessionStorage.setItem("socialLoginState", socialLogin);
    sessionStorage.setItem("longTimeAuth", longTimeAuth);
  };

  const logout = () => {
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
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("socialLoginState");
      sessionStorage.removeItem("longTimeAuth");
      navigate("/");
    })
  };
  if (!ready) {
    return <div>로딩 중</div>;
  }
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT}>
      <AuthContext.Provider value={{ auth, login, logout }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};
export default AuthContext;
