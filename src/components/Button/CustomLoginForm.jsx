import React, { useState, useContext, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleSignInButton, KakaoSignInButton } from './SocialButton'; // 앞서 만든 Tailwind 버튼
import { AuthContext } from "../../provider/AuthContext";
import useApi from '../../hooks/useApi';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/AxiosInterCeptor';

export function CustomGoogleLoginForm() {
  const { header: googleHeader, body: googleBody, error: googleError, loading: googleLoading, refetch: GoogleApi } = useApi('/api/oauth2/google-login', { method: 'post' }, false);
  
  const navigate = useNavigate();
  const { login: AuthLogin } = useContext(AuthContext);
  
  // useGoogleLogin 훅으로 로그인 함수 생성
  const login = useGoogleLogin({
    onSuccess: CredentialResponse => {
      GoogleApi( {
        data: { code: CredentialResponse.code },
      }).then((res) => {
        const { header:hd , body:bd } = res
        if (hd.code[0] === 'S'){
          if (bd.items.loginInfo.isActive === 'N'){
            alert("비활성화된 계정이거나 정지된 계정입니다.");
            return;
          }
          AuthLogin(bd.items.loginInfo, bd.items.tokens, true, false);
          if(bd.items.loginInfo.isModify === 'N'){
            navigate("/social-info");
          } else {
            navigate("/");
          }
        } else {
          alert(`로그인 실패: ErrorCode ${header.code}`);
        }
      }).catch(err =>{
        alert(err);
      })
    },
    flow: 'auth-code', // 또는 'auth-code'
    // 필요한 scope가 있으면 scope 옵션 추가
  });

  return (
    <div className="space-y-4">
      {/* 카카오 버튼 등 다른 요소 위에 */}
      <GoogleSignInButton onClick={() => login()} />
    </div>
  );
}








export const getKakaoLoginURL = async () => {
  const res = await axios.get('/api/oauth2/kakao-url');
  return res.data.body.items.loginUrl;
}
export function CustomKakaoLoginForm() {
  const [loading, setLoading] = useState(false);
  const handleKakaoLogin = async () => {
    try {
      setLoading(true);
      const url = await getKakaoLoginURL();
      window.location.href = url;
    } catch (e) {
      console.error(e);
      setLoading(false);
    } 
  };

  return (
    <div className="space-y-4">
      <KakaoSignInButton onClick={handleKakaoLogin} disabled={loading} />
    </div>
  );
}