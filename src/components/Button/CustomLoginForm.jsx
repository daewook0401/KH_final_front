import React, { useState, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { GoogleSignInButton, KakaoSignInButton } from './SocialButton'; // 앞서 만든 Tailwind 버튼
import { AuthContext } from "../../provider/AuthContext";
import useApi from '../../hooks/useApi';
import { useNavigate } from 'react-router-dom';

export function CustomGoogleLoginForm() {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login: AuthLogin } = useContext(AuthContext);
  const { header: googleHeader, body: googleBody, error: googleError, loading: googleLoading, refetch: GoogleApi } = useApi('/api/auth/google-login', { method: 'post' }, false);
  // useGoogleLogin 훅으로 로그인 함수 생성
  const login = useGoogleLogin({
    onSuccess: CredentialResponse => {
      console.log('구글 로그인 성공 시 정보:', CredentialResponse);
      GoogleApi( {
        data: { code: CredentialResponse.code },
      }).then((res) => {
        console.log(res);
        const { header:hd , body:bd } = res
        if (hd.code[0] === 'S'){
          if (bd.items.loginInfo.isActive === 'N'){
            alert("비활성화된 계정이거나 정지된 계정입니다.");
            return;
          }
          AuthLogin(bd.items.loginInfo, bd.items.tokens, true, false);
        } else {
          alert(`로그인 실패: ErrorCode ${header.code}`);
        }
        navigate(-1);
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
      {msg && <p className="text-red-500">{msg}</p>}
    </div>
  );
}