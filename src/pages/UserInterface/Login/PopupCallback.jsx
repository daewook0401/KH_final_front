// src/pages/PopupCallback.jsx
import React, { useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../../../provider/AuthContext';
export default function PopupCallback() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  useEffect(() => {
    const url = new URL(location.href);
    const refreshToken = url.searchParams.get('refreshToken')
    sessionStorage.setItem('refreshToken', refreshToken);
    login(null, null, true, true, false);
    navigate("/kakao-info");
  }, [search]);

  return <p>로그인 처리 중...</p>;
}