import React from 'react';
import { SiKakaotalk } from 'react-icons/si';
import { GoogleLogin } from '@react-oauth/google';

export function GoogleSignInButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative select-none appearance-none
        bg-white border border-gray-400
        rounded-md overflow-hidden
        cursor-pointer outline-none whitespace-nowrap
        h-10 px-4 w-full
        font-medium text-gray-900 text-sm
        transition-colors duration-200
        group hover:shadow-md
        flex items-center justify-center
      "
    >
      {/* 눌렀을 때 / 포커스될 때 어둡게 보여주는 오버레이 */}
      <div className="
        absolute inset-0
        bg-black opacity-0
        group-hover:opacity-10
        group-active:opacity-20
        transition-opacity duration-200
        pointer-events-none
      " />

      {/* 아이콘 + 텍스트 래퍼 */}
      <div className="relative flex items-center justify-start h-full space-x-2">
        {/* 구글 로고 SVG */}
        <div className="flex items-center justify-center w-5 h-5 mr-2 flex-shrink-0">
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-full h-full"
          >
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
        </div>
        
        {/* 버튼 텍스트 */}
        <span className="flex-1 text-center">
          Sign in with Google
        </span>
      </div>
    </button>
  );
};

export function KakaoSignInButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative select-none appearance-none
        bg-[#FEE500] text-[#3C1E1E]
        border-none rounded-md overflow-hidden
        cursor-pointer outline-none whitespace-nowrap
        h-10 px-4 w-full
        font-medium text-sm
        transition-colors duration-200
        hover:bg-[#fddc00] active:bg-[#e6c500]
        flex items-center justify-center
      "
    >
      {/* 눌렀을 때 / 포커스될 때 어둡게 */}
      <div className="
        absolute inset-0 bg-black opacity-0
        hover:opacity-5 active:opacity-10
        transition-opacity duration-200
        pointer-events-none
      "/>

      {/* 아이콘 + 텍스트 */}
      <SiKakaotalk size={20} className="relative z-10 mr-2 flex-shrink-0" />
      <span className="relative z-10">Login with Kakao</span>
    </button>
  );
}
