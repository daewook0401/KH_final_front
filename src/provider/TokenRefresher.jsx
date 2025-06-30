import { useEffect, useContext } from "react";
import useApi from "../hooks/useApi";
import AuthContext from "./AuthContext";
import Cookies from "js-cookie";

function TokenRefresher() {
  const { login, logout, setAuth } = useContext(AuthContext);
  const refreshToken = Cookies.get("Refresh-Token");
  if (!refreshToken) return null;
  // useApi 셋업: 즉시 호출하지 않도록 immediate = false
  const {
    header: tokenHeader,
    body: tokenBody,
    error,
    loading,
    refetch: refresh,
  } = useApi("/api/auth/refresh", { method: "post", headers: { Authorization: `Bearer ${refreshToken}`} }, false);

  // 1) 컴포넌트 마운트 시 자동으로 토큰 갱신 시도
  useEffect(() => {
    refresh();
  }, [refresh]);

  // 2) refresh() 호출 후 결과 처리
  useEffect(() => {
    console.log("토큰리프레셔");
    if (loading){
      return;
    }
    if (error) {
      // 네트워크 에러나 예외 발생
      console.error(error);
      logout();                   // 안전하게 로그아웃 처리
      return;
    }
    console.log(tokenBody);
    if(tokenHeader === null){
      return;
    }
    if(!loading){
      if (tokenHeader && tokenHeader.code[0]===("S")) {
        login(tokenBody.items.loginInfo, tokenBody.items.tokens, false, true);
      } else {
        logout();
      }
    }
  }, [loading, tokenBody, tokenBody, error, logout]);

  return null; // 이 컴포넌트는 화면 렌더링 UI가 없고, 사이드이펙트만 수행
}

export default TokenRefresher;
